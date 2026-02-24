import catalogData from './catalog.json';
import { supabase } from '../lib/supabase';

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

// Map the raw JSON to our base Product interface
export const baseProducts: Product[] = (catalogData as any[])
    .filter((item: any) => item.images && item.images.length > 0)
    .map((item: any) => {
        let images: string[] = [];
        if (item.images && item.images.length > 0) {
            images = item.images.slice(0, 3).map((imgUrl: string, index: number) => {
                const ext = imgUrl.toLowerCase().endsWith('.png') ? '.png' : '.jpg';
                return formatImageUrl(item.id, index + 1, ext);
            });
        }

        return {
            id: item.id,
            name: item.title,
            price: getPrice(item.title, item.category || ''),
            category: item.category,
            image: images.length > 0 ? images[0] : '/placeholder.jpg',
            images: images,
            description: item.description || item.title,
            stock_status: item.stock_status,
            stock_quantity: 0,
            original_url: item.original_url,
            is_visible: true
        };
    });

// Provide a backward-compatible mock array for initial quick-renders
export const products: Product[] = baseProducts;

export const getProducts = async (includeHidden = false): Promise<Product[]> => {
    try {
        const { data: overrides, error } = await supabase
            .from('products_new')
            .select('*');

        if (error) throw error;

        const merged = baseProducts.map((baseProduct) => {
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

        // Filter out hidden products unless explicitly requested (e.g. by Admin)
        return includeHidden ? merged : merged.filter(p => p.is_visible !== false);
    } catch (err) {
        console.error("Error fetching product overrides from Supabase", err);
        return baseProducts.filter(p => p.is_visible !== false);
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
