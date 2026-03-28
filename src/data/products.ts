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

// When true, catalog.json is ignored — all products come from Supabase only.
// Set VITE_SUPABASE_ONLY=true after running the migration script.
const SUPABASE_ONLY = import.meta.env.VITE_SUPABASE_ONLY === 'true';

if (typeof window !== 'undefined') {
    if (SUPABASE_ONLY) {
        console.log('🗄️ Product Source Mode: Supabase Only (catalog.json ignored)');
    } else {
        const logValue = IMAGE_BASE_URL === '/external-images'
            ? 'Using Nginx Reverse Proxy (/external-images)'
            : (IMAGE_BASE_URL || 'Using local public folder');
        console.log('🖼️ Image Source Mode:', logValue);
    }

    if (IMAGE_BASE_URL && IMAGE_BASE_URL.startsWith('http://') && window.location.protocol === 'https:') {
        console.error('⚠️ ALERTA: Você está tentando carregar imagens via HTTP em um site HTTPS. Isso será bloqueado. Mude o VITE_IMAGE_BASE_URL para "/external-images" no Easypanel Build Args.');
    }
}

// ─── Lista de clubes e seleções para extração de nome ───────────────────────

const CLUBES_BR: Record<string, string> = {
    'flamengo': 'Flamengo', 'flamingo': 'Flamengo',
    'palmeiras': 'Palmeiras',
    'corinthians': 'Corinthians',
    'são paulo': 'São Paulo', 'sao paulo': 'São Paulo',
    'fluminense': 'Fluminense',
    'vasco': 'Vasco',
    'botafogo': 'Botafogo',
    'cruzeiro': 'Cruzeiro',
    'atlético mineiro': 'Atlético-MG', 'atletico mineiro': 'Atlético-MG', 'atletico-mg': 'Atlético-MG',
    'grêmio': 'Grêmio', 'gremio': 'Grêmio',
    'internacional': 'Internacional',
    'santos': 'Santos',
    'sport': 'Sport',
    'bahia': 'Bahia',
    'fortaleza': 'Fortaleza',
    'ceará': 'Ceará', 'ceara': 'Ceará',
    'paysandu': 'Paysandu',
    'cuiabá': 'Cuiabá', 'cuiaba': 'Cuiabá',
    'bragantino': 'Bragantino',
    'goiás': 'Goiás', 'goias': 'Goiás',
    'juventude': 'Juventude',
    'coritiba': 'Coritiba',
    'athletico': 'Athletico-PR',
    'avai': 'Avaí', 'avaí': 'Avaí',
    'recife': 'Sport Recife',
};

const CLUBES_EXT: Record<string, string> = {
    'real madrid': 'Real Madrid',
    'barcelona': 'Barcelona',
    'atletico madrid': 'Atlético Madrid', 'atlético madrid': 'Atlético Madrid',
    'sevilla': 'Sevilla',
    'valencia': 'Valencia',
    'manchester city': 'Manchester City', 'man city': 'Manchester City',
    'manchester united': 'Manchester United', 'man united': 'Manchester United',
    'liverpool': 'Liverpool',
    'arsenal': 'Arsenal',
    'chelsea': 'Chelsea',
    'tottenham': 'Tottenham',
    'juventus': 'Juventus',
    'milan': 'Milan',
    'inter milan': 'Inter Milan', 'internazionale': 'Inter Milan',
    'napoli': 'Napoli', 'naples': 'Napoli',
    'roma': 'Roma',
    'lazio': 'Lazio',
    'psg': 'PSG', 'paris saint-germain': 'PSG', 'paris saint germain': 'PSG',
    'lyon': 'Lyon',
    'marseille': 'Marseille',
    'ajax': 'Ajax',
    'porto': 'Porto',
    'benfica': 'Benfica',
    'sporting': 'Sporting CP',
    'dortmund': 'Borussia Dortmund', 'borussia dortmund': 'Borussia Dortmund',
    'bayern': 'Bayern Munich', 'bayern munich': 'Bayern Munich', 'bayern munchen': 'Bayern Munich',
    'bayer leverkusen': 'Bayer Leverkusen',
    'celtic': 'Celtic',
    'rangers': 'Rangers',
    'betis': 'Real Betis', 'real betis': 'Real Betis',
    'villarreal': 'Villarreal',
    'sociedad': 'Real Sociedad', 'real sociedad': 'Real Sociedad',
    'newcastle': 'Newcastle',
    'west ham': 'West Ham',
    'aston villa': 'Aston Villa',
    'leicester': 'Leicester',
    'fiorentina': 'Fiorentina',
    'galatasaray': 'Galatasaray',
    'fenerbahce': 'Fenerbahçe',
    'boca juniors': 'Boca Juniors',
    'river plate': 'River Plate',
    'university of chile': 'Universidad de Chile',
    'universidad de chile': 'Universidad de Chile',
    'colo colo': 'Colo-Colo',
    'club america': 'Club América', 'america': 'Club América',
    'chivas': 'Chivas',
    'tigres': 'Tigres',
    'guadalajara': 'Guadalajara',
};

const SELECOES: Record<string, string> = {
    'brazil': 'Brasil', 'brasil': 'Brasil',
    'argentina': 'Argentina',
    'portugal': 'Portugal',
    'germany': 'Alemanha', 'deutschland': 'Alemanha',
    'england': 'Inglaterra',
    'italy': 'Itália', 'italia': 'Itália',
    'spain': 'Espanha',
    'france': 'França',
    'netherlands': 'Holanda', 'holland': 'Holanda',
    'colombia': 'Colômbia',
    'mexico': 'México',
    'japan': 'Japão',
    'croatia': 'Croácia',
    'uruguay': 'Uruguai',
    'chile': 'Chile',
    'belgium': 'Bélgica',
    'denmark': 'Dinamarca',
    'sweden': 'Suécia',
    'poland': 'Polônia',
    'australia': 'Austrália',
    'nigeria': 'Nigéria',
    'senegal': 'Senegal',
    'morocco': 'Marrocos',
    'cameroon': 'Camarões',
    'korea': 'Coreia',
    'ecuador': 'Equador',
    'usa': 'EUA', 'united states': 'EUA',
    'scotland': 'Escócia',
    'wales': 'País de Gales',
    'switzerland': 'Suíça',
    'ghana': 'Gana',
    'mali': 'Mali',
    'costa rica': 'Costa Rica',
    'paraguay': 'Paraguai',
    'peru': 'Peru',
    'venezuela': 'Venezuela',
    'saudi': 'Arábia Saudita', 'saudi arabia': 'Arábia Saudita',
    'iran': 'Irã',
    'qatar': 'Qatar',
    'austria': 'Áustria',
    'serbia': 'Sérvia',
    'turkey': 'Turquia',
    'ukraine': 'Ucrânia',
    'czech': 'República Tcheca',
    'slovakia': 'Eslováquia',
    'hungary': 'Hungria',
    'romania': 'Romênia',
    'greece': 'Grécia',
    'norway': 'Noruega',
    'finland': 'Finlândia',
    'iceland': 'Islândia',
    'albania': 'Albânia',
    'ivory coast': 'Costa do Marfim', 'côte d\'ivoire': 'Costa do Marfim',
    'egypt': 'Egito',
    'south africa': 'África do Sul',
    'canada': 'Canadá',
    'jamaica': 'Jamaica',
    'panama': 'Panamá',
    'honduras': 'Honduras',
};

const NBA_TIMES: Record<string, string> = {
    'lakers': 'Lakers', 'los angeles lakers': 'Lakers',
    'celtics': 'Celtics', 'boston celtics': 'Celtics',
    'warriors': 'Warriors', 'golden state': 'Warriors',
    'bulls': 'Bulls', 'chicago bulls': 'Bulls',
    'heat': 'Heat', 'miami heat': 'Heat',
    'knicks': 'Knicks', 'new york knicks': 'Knicks',
    'nets': 'Nets', 'brooklyn nets': 'Nets',
    'clippers': 'Clippers',
    'suns': 'Suns', 'phoenix suns': 'Suns',
    'mavericks': 'Mavericks', 'dallas mavericks': 'Mavericks',
    'nuggets': 'Nuggets', 'denver nuggets': 'Nuggets',
    'bucks': 'Bucks', 'milwaukee bucks': 'Bucks',
    'sixers': '76ers', 'philadelphia 76ers': '76ers',
    'raptors': 'Raptors', 'toronto raptors': 'Raptors',
    'hawks': 'Hawks', 'atlanta hawks': 'Hawks',
    'jazz': 'Jazz', 'utah jazz': 'Jazz',
    'spurs': 'Spurs', 'san antonio spurs': 'Spurs',
    'thunder': 'Thunder', 'oklahoma city': 'Thunder',
    'blazers': 'Trail Blazers', 'portland trail blazers': 'Trail Blazers',
    'timberwolves': 'Timberwolves', 'minnesota': 'Timberwolves',
    'grizzlies': 'Grizzlies', 'memphis grizzlies': 'Grizzlies',
    'pelicans': 'Pelicans', 'new orleans pelicans': 'Pelicans',
    'pacers': 'Pacers', 'indiana pacers': 'Pacers',
    'magic': 'Magic', 'orlando magic': 'Magic',
    'cavaliers': 'Cavaliers', 'cleveland cavaliers': 'Cavaliers',
    'pistons': 'Pistons', 'detroit pistons': 'Pistons',
    'wizards': 'Wizards', 'washington wizards': 'Wizards',
    'kings': 'Kings', 'sacramento kings': 'Kings',
    'rockets': 'Rockets', 'houston rockets': 'Rockets',
    'hornets': 'Hornets', 'charlotte hornets': 'Hornets',
};

const F1_EQUIPES: Record<string, string> = {
    'ferrari': 'Ferrari', 'red bull': 'Red Bull', 'mercedes': 'Mercedes',
    'mclaren': 'McLaren', 'aston martin': 'Aston Martin', 'alpine': 'Alpine',
    'williams': 'Williams', 'haas': 'Haas', 'alfa romeo': 'Alfa Romeo',
    'alphatauri': 'AlphaTauri', 'sauber': 'Sauber', 'visa': 'Racing Bulls',
    'racing bulls': 'Racing Bulls', 'rb ': 'Racing Bulls',
};

// Palavras de seleções nacionais para excluir de clubes estrangeiros
const SELECAO_KEYWORDS = Object.keys(SELECOES);

// ─── Função principal de tradução ───────────────────────────────────────────

export const translateTitle = (rawTitle: string, category: string): string => {
    const t = rawTitle.toLowerCase();
    const cat = (category || '').toLowerCase();

    // ── 1. Detectar temporada ──────────────────────────────────────────────
    let temporada = '';
    // Padrão "2025 26" ou "2025/26" ou "2026 27"
    const twoYearMatch = t.match(/20(\d{2})[/ ](\d{2})/);
    if (twoYearMatch) {
        temporada = `${twoYearMatch[1]}/${twoYearMatch[2]}`;
    } else {
        // Padrão "2026" sozinho
        const oneYearMatch = t.match(/\b(20\d{2})\b/);
        if (oneYearMatch) {
            temporada = oneYearMatch[1].slice(2); // "2026" → "26"
        }
    }

    // ── 2. Detectar tipo de produto ───────────────────────────────────────
    let tipo = '';
    if (t.includes('polo')) {
        tipo = 'Polo';
    } else if (t.includes('corta-vento') || t.includes('corta vento') || t.includes('windbreaker') || t.includes('wind breaker') || (t.includes('vest') && !t.includes('harvest'))) {
        tipo = 'Agasalho';
    } else if (t.includes('agasalho')) {
        tipo = 'Agasalho';
    } else if (t.includes('goalkeeper') || t.includes('goleiro')) {
        tipo = 'Goleiro';
    } else if (t.includes('long-sleeved') || t.includes('long sleeve') || t.includes('manga longa')) {
        if (t.includes('women') || t.includes('woman') || t.includes('womens')) {
            tipo = 'Feminino Manga Longa';
        } else if (t.includes('kids') || t.includes('infantil') || t.includes('sizes 16')) {
            tipo = 'Infantil Manga Longa';
        } else {
            tipo = 'Manga Longa';
        }
    } else if (t.includes('women') || t.includes('woman') || t.includes('womens') || t.includes('feminino')) {
        tipo = 'Feminino';
    } else if (t.includes('kids') || t.includes('infantil') || t.includes('sizes 16') || cat === 'infantil') {
        tipo = 'Infantil';
    } else if (t.includes('short') && (t.includes('nba') || cat === 'nba')) {
        tipo = 'Shorts NBA';
    } else if (t.includes('short') || t.includes('pants')) {
        tipo = 'Shorts';
    } else if (t.includes('kit') && t.includes('short')) {
        tipo = 'Kit Shorts';
    } else if (t.includes('kit')) {
        tipo = 'Kit';
    } else if (t.includes('retro') || t.includes('retrô')) {
        tipo = 'Retrô';
    } else if (t.includes('player version') || t.includes('player edition') || t.includes('versão jogador')) {
        tipo = 'Jogador';
    } else if (t.includes('fan') || t.includes('torcedor')) {
        tipo = 'Torcedor';
    } else if (t.includes('training') || t.includes('treino')) {
        tipo = 'Treino';
    } else if (t.includes('meia') || t.includes('sock')) {
        tipo = 'Meia';
    } else if (t.includes('special edition') || t.includes('member') || t.includes('edição especial')) {
        tipo = 'Edição Especial';
    }

    // ── 3. Detectar F1 ───────────────────────────────────────────────────
    if (t.includes('f1') || t.includes('formula 1') || t.includes('formula one') || t.includes('fórmula 1')) {
        let equipe = 'F1';
        for (const [key, nome] of Object.entries(F1_EQUIPES)) {
            if (t.includes(key)) { equipe = nome; break; }
        }
        // evitar duplicar "F1 F1"
        return equipe === 'F1' ? `F1 ${temporada || ''}`.trim() : `${equipe} F1 ${temporada || ''}`.trim();
    }

    // ── 4. Detectar NBA ──────────────────────────────────────────────────
    if (cat === 'nba' || t.includes('nba') || t.includes('basquete') || t.includes('basketball')) {
        let time = 'NBA';
        for (const [key, nome] of Object.entries(NBA_TIMES)) {
            if (t.includes(key)) { time = nome; break; }
        }
        if (tipo === 'Shorts NBA') return `${time} Shorts`;
        return `${time} Basquete`;
    }

    // ── 5. Detectar clube/seleção ─────────────────────────────────────────
    let clube = '';

    // Tentar clubes BR primeiro
    for (const [key, nome] of Object.entries(CLUBES_BR)) {
        if (t.includes(key)) { clube = nome; break; }
    }

    // Tentar seleções
    if (!clube) {
        for (const [key, nome] of Object.entries(SELECOES)) {
            if (t.includes(key)) { clube = nome; break; }
        }
    }

    // Tentar clubes estrangeiros (só se não for seleção)
    if (!clube) {
        for (const [key, nome] of Object.entries(CLUBES_EXT)) {
            if (t.includes(key)) {
                // Verificar que não é uma seleção nacional
                const isSel = SELECAO_KEYWORDS.some(sk => t.includes(sk) && !t.includes('club') && !t.includes('fc'));
                if (!isSel) { clube = nome; break; }
            }
        }
    }

    // Se não detectou clube, usar o título original limpo
    if (!clube) {
        // Tentar extrair nome próprio do início do título
        const cleaned = rawTitle
            .replace(/\b(20\d{2}[/ ]\d{2}|20\d{2})\b/g, '')
            .replace(/\b(player version|player edition|fan version|women'?s?|womens|kids|retro|training|jersey|home|away|special edition|short|pants|polo|vest|windbreaker|goalkeeper|long-?sleeved?|S-X{0,4}L{1,2}|sizes? \d+-\d+|--+|-+)\b/gi, '')
            .replace(/\s+/g, ' ').trim();
        return cleaned || rawTitle;
    }

    // ── 6. Montar título final ────────────────────────────────────────────
    const partes: string[] = [clube];
    if (temporada) partes.push(temporada);
    if (tipo) partes.push(tipo);
    // Se não tem tipo, assume Torcedor para camisas comuns
    if (!tipo && !temporada) partes.push('Torcedor');
    if (!tipo && temporada) partes.push('Torcedor');

    return partes.join(' ');
};

// ─── Preço ───────────────────────────────────────────────────────────────────

const getPrice = (title: string, category: string): number => {
    const t = title.toLowerCase();
    const c = category.toLowerCase();

    if (t.includes('polo')) return 165;
    if (t.includes('meia') || t.includes('sock')) return 50;
    if (t.includes('corta vento') || t.includes('windbreaker') || t.includes('vest')) return 270;
    if (t.includes('retrô') || t.includes('retro')) return 190;
    if (t.includes('jogador') || t.includes('player')) return 190;
    if (t.includes('torcedor') || t.includes('fan')) return 150;
    if (t.includes('f1') || t.includes('formula 1') || t.includes('fórmula 1') || t.includes('formula one')) return 240;
    if (t.includes('nfl')) return 240;

    if (t.includes('kit')) {
        if (t.includes('calça') || t.includes('calca')) {
            if (t.includes('regata')) return 280;
            if (t.includes('camisa')) return 250;
        }
        if (t.includes('short') && t.includes('regata')) return 250;
    }

    if (t.includes('short') || t.includes('pants')) {
        if (c === 'nba' || t.includes('nba')) return 140;
        return 95;
    }

    if (c === 'nba' || t.includes('basquete') || t.includes('basketball')) return 240;
    if (c === 'infantil' || t.includes('kids') || t.includes('infantil')) return 180;

    return 150;
};

// ─── URL de imagem ───────────────────────────────────────────────────────────

export const formatImageUrl = (productId: string, index: number, ext: string = '.jpg'): string => {
    if (IMAGE_BASE_URL) {
        const prefix = IMAGE_PATH_PREFIX ? `${IMAGE_PATH_PREFIX}/` : '';
        return `${IMAGE_BASE_URL}/${prefix}${productId}/${index}${ext}`;
    }
    const localPrefix = IMAGE_PATH_PREFIX ? `${IMAGE_PATH_PREFIX}/` : '';
    return `/${localPrefix}${productId}/${index}${ext}`;
};

// ─── Produtos base ───────────────────────────────────────────────────────────

export const baseProducts: Product[] = (catalogData as any[])
    .filter((item: any) => item.images && item.images.length > 0)
    .map((item: any) => {
        let images: string[] = [];
        if (item.images && item.images.length > 0) {
            images = item.images.slice(0, 3).map((imgUrl: string, index: number) => {
                const lower = imgUrl.toLowerCase();
                const ext = lower.endsWith('.png') ? '.png' : lower.endsWith('.jpeg') ? '.jpeg' : '.jpg';
                return formatImageUrl(item.id, index + 1, ext);
            });
        }

        return {
            id: item.id,
            name: translateTitle(item.title, item.category || ''),
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

export const products: Product[] = baseProducts;

/** Maps a raw Supabase products_new row to the Product interface. */
const mapSupabaseRow = (o: any): Product => ({
    id: o.id,
    name: o.title || 'Produto sem nome',
    price: o.base_price ?? 0,
    category: o.category || 'Geral',
    image: o.images?.[0] || '/placeholder.jpg',
    images: o.images || [],
    description: o.description || o.title || '',
    stock_status: o.stock_status ?? 'in_stock',
    stock_quantity: o.stock_quantity ?? 0,
    is_visible: o.is_visible ?? true,
});

export const getProducts = async (includeHidden = false): Promise<Product[]> => {
    try {
        const { data: rows, error } = await supabase
            .from('products_new')
            .select('*');

        if (error) throw error;

        // ── Supabase Only mode (after migration) ──────────────────────────
        // All products come from Supabase — catalog.json is not used.
        if (SUPABASE_ONLY) {
            const all = (rows || []).map(mapSupabaseRow);
            return includeHidden ? all : all.filter(p => p.is_visible !== false);
        }

        // ── Hybrid mode (default) ─────────────────────────────────────────
        // Merge JSON base products with Supabase overrides, then append
        // any products that exist only in Supabase (admin-created).
        const merged = baseProducts.map((baseProduct) => {
            const override = rows?.find((o: any) => o.id === baseProduct.id);
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

        // Products created entirely by the admin (no JSON counterpart)
        const baseIds = new Set(baseProducts.map(p => p.id));
        const customProducts: Product[] = (rows || [])
            .filter((o: any) => !baseIds.has(o.id))
            .map(mapSupabaseRow);

        const all = [...merged, ...customProducts];
        return includeHidden ? all : all.filter(p => p.is_visible !== false);
    } catch (err) {
        console.error("Error fetching products from Supabase", err);
        return SUPABASE_ONLY ? [] : baseProducts.filter(p => p.is_visible !== false);
    }
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
    const allProducts = await getProducts(true);
    return allProducts.find(p => p.id === id);
};

export const getCategories = async (): Promise<string[]> => {
    const allProducts = await getProducts();
    return Array.from(new Set(allProducts.map(p => p.category))).sort();
};
