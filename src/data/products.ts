
import { supabase } from '../lib/supabase';
import { formatProductName } from '../utils/nameFormatter';

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    images?: string[];
    description: string;
    stock_status?: string;
    stock_quantity?: number;
    original_url?: string;
    is_visible?: boolean;
}

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
const IMAGE_PATH_PREFIX = import.meta.env.VITE_IMAGE_PATH_PREFIX ?? 'products';

if (typeof window !== 'undefined') {
    const logValue = IMAGE_BASE_URL === '/external-images'
        ? 'Using Nginx Reverse Proxy (/external-images)'
        : (IMAGE_BASE_URL || 'Using local public folder');
    console.log('🖼️ Image Source Mode:', logValue);

    if (IMAGE_BASE_URL && IMAGE_BASE_URL.startsWith('http://') && window.location.protocol === 'https:') {
        console.error('⚠️ ALERTA: Você está tentando carregar imagens via HTTP em um site HTTPS. Isso será bloqueado. Mude o VITE_IMAGE_BASE_URL para "/external-images" no Easypanel Build Args.');
    }
}

const getPrice = (title: string, category: string): number => {
    const t = title.toLowerCase();
    const c = category.toLowerCase();

    if (t.includes('f1') || t.includes('formula 1') || t.includes('fórmula 1')) return 240;
    if (t.includes('polo')) return 165;
    if (t.includes('meia')) return 50;
    if (t.includes('corta vento')) return 270;
    if (t.includes('retrô') || t.includes('retro')) return 190;
    if (t.includes('jogador') || t.includes('player')) return 190;
    if (t.includes('torcedor') || t.includes('fan')) return 150;

    if (t.includes('kit')) {
        if (t.includes('calça') || t.includes('calca')) {
            if (t.includes('regata')) return 280;
            if (t.includes('camisa')) return 250;
        }
        if (t.includes('short') && t.includes('regata')) return 250;
    }

    if (t.includes('short')) {
        if (c === 'nba' || t.includes('nba')) return 140;
        return 95; // Futebol short
    }

    if (c === 'nba' || t.includes('basquete') || t.includes('basketball')) return 240;
    if (c === 'infantil' || t.includes('kids') || t.includes('infantil')) return 180;

    return 150; // Versão torcedor default
};

export const formatImageUrl = (productId: string, index: number, ext: string = '.jpg'): string => {
    if (IMAGE_BASE_URL) {
        const prefix = IMAGE_PATH_PREFIX ? `${IMAGE_PATH_PREFIX}/` : '';
        return `${IMAGE_BASE_URL}/${prefix}${productId}/${index}${ext}`;
    }
    const localPrefix = IMAGE_PATH_PREFIX ? `${IMAGE_PATH_PREFIX}/` : '';
    return `/${localPrefix}${productId}/${index}${ext}`;
};

// We will fetch and cache baseProducts here
let cachedBaseProducts: Product[] | null = null;
let fetchPromise: Promise<Product[]> | null = null;

export const fetchBaseProducts = async (): Promise<Product[]> => {
    if (cachedBaseProducts) return cachedBaseProducts;
    if (fetchPromise) return fetchPromise;

    fetchPromise = fetch('/catalog.json')
        .then(res => {
            if (!res.ok) throw new Error("Failed to load catalog");
            return res.json();
        })
        .then((rawData: any[]) => {
            cachedBaseProducts = rawData
                .filter((item: any) => item.images && item.images.length > 0)
                .map((item: any) => {
                    let images: string[] = [];
                    if (item.images && item.images.length > 0) {
                        images = item.images.slice(0, 3).map((imgUrl: string, index: number) => {
                            const ext = imgUrl.toLowerCase().endsWith('.png') ? '.png' : '.jpg';
                            return formatImageUrl(item.id, index + 1, ext);
                        });
                    }

                    const cleanTitle = formatProductName(item.title);

                    return {
                        id: item.id,
                        name: cleanTitle,
                        price: getPrice(item.title, item.category || ''), // Keep original title for price checking to be safe
                        category: item.category,
                        image: images.length > 0 ? images[0] : '/placeholder.jpg',
                        images: images,
                        description: item.description ? formatProductName(item.description) : cleanTitle,
                        stock_status: item.stock_status,
                        stock_quantity: 0,
                        original_url: item.original_url,
                        is_visible: true
                    };
                });
            return cachedBaseProducts;
        })
        .catch(err => {
            console.error("Error fetching base catalog.json", err);
            return [];
        });

    return fetchPromise;
};

// Provide empty arrays for backward-compatibility of static imports (though components now fetch via getProducts)
export const baseProducts: Product[] = [];
export const products: Product[] = [];

export const getProducts = async (includeHidden = false): Promise<Product[]> => {
    try {
        const [baseList, { data: overrides, error }] = await Promise.all([
            fetchBaseProducts(),
            supabase.from('products_new').select('*')
        ]);

        if (error) {
            console.error("Supabase Error:", error);
        }

        const merged = baseList.map((baseProduct) => {
            const override = overrides?.find((o: any) => o.id === baseProduct.id);
            if (override) {
                return {
                    ...baseProduct,
                    name: override.title || baseProduct.name,
                    price: override.base_price ?? baseProduct.price,
                    description: override.description || baseProduct.description,
                    category: override.category || baseProduct.category,
                    is_visible: override.is_visible,
                    images: override.images?.length ? override.images : baseProduct.images,
                    image: override.images?.length ? override.images[0] : baseProduct.image,
                };
            }
            return baseProduct;
        });

        if (overrides) {
            overrides.forEach((o: any) => {
                if (!baseList.find(p => p.id === o.id)) {
                    merged.push({
                        id: o.id,
                        name: o.title || `Produto ${o.id}`,
                        price: o.base_price ?? 150,
                        category: o.category || 'Outros',
                        description: o.description || '',
                        image: o.images?.length ? o.images[0] : '/placeholder.jpg',
                        images: o.images || [],
                        is_visible: o.is_visible ?? true,
                    });
                }
            });
        }

        // Filter out hidden products unless explicitly requested (e.g. by Admin)
        return includeHidden ? merged : merged.filter(p => p.is_visible !== false);
    } catch (err) {
        console.error("Error fetching product overrides from Supabase", err);
        const baseList = await fetchBaseProducts(); // fallback if supabase fails
        return includeHidden ? baseList : baseList.filter(p => p.is_visible !== false);
    }
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
    const allProducts = await getProducts(true); // Include hidden in case admin is viewing
    return allProducts.find(p => p.id === id);
};

export const getCategories = async (): Promise<string[]> => {
    const allProducts = await getProducts();
    return Array.from(new Set(allProducts.map(p => p.category))).sort();
};
