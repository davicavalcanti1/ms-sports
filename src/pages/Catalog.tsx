import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getProducts } from '../data/products';
import type { Product } from '../data/products';
import { buildWhatsappUrl } from '../lib/whatsapp';
import { Star, Filter, Loader2, Search, ChevronDown, ChevronRight, MessageCircle } from 'lucide-react';

// ─── Estrutura de filtros ────────────────────────────────────────────────────

type MainFilter =
    | 'Todos' | 'Clubes Brasileiros' | 'Clubes Estrangeiros' | 'Seleções'
    | 'NBA' | 'F1' | 'NFL' | 'Feminino' | 'Retrô' | 'Kids' | 'Shorts' | 'Agasalhos';

const CLUBES_BR_LISTA = [
    'Flamengo', 'Palmeiras', 'Corinthians', 'São Paulo', 'Fluminense',
    'Vasco', 'Botafogo', 'Cruzeiro', 'Atlético-MG', 'Grêmio',
    'Internacional', 'Santos', 'Bahia', 'Fortaleza', 'Ceará',
    'Paysandu', 'Bragantino', 'Athletico-PR', 'Juventude', 'Coritiba',
    'Cuiabá', 'Goiás',
];

const CLUBES_BR_KEYWORDS: Record<string, string[]> = {
    'Flamengo':      ['flamengo'],
    'Palmeiras':     ['palmeiras'],
    'Corinthians':   ['corinthians'],
    'São Paulo':     ['são paulo', 'sao paulo'],
    'Fluminense':    ['fluminense'],
    'Vasco':         ['vasco'],
    'Botafogo':      ['botafogo'],
    'Cruzeiro':      ['cruzeiro'],
    'Atlético-MG':   ['atlético-mg', 'atletico mineiro', 'atlético mineiro'],
    'Grêmio':        ['grêmio', 'gremio'],
    'Internacional': ['internacional'],
    'Santos':        ['santos'],
    'Bahia':         ['bahia'],
    'Fortaleza':     ['fortaleza'],
    'Ceará':         ['ceará', 'ceara'],
    'Paysandu':      ['paysandu'],
    'Bragantino':    ['bragantino'],
    'Athletico-PR':  ['athletico'],
    'Juventude':     ['juventude'],
    'Coritiba':      ['coritiba'],
    'Cuiabá':        ['cuiabá', 'cuiaba'],
    'Goiás':         ['goiás', 'goias'],
};

const PAISES_EXT_LISTA = [
    'Espanha', 'Inglaterra', 'Itália', 'França', 'Alemanha',
    'Portugal', 'Holanda', 'Argentina (Clubes)', 'Brasil (Clubes Ext.)',
    'Escócia', 'Turquia', 'Outros',
];

const PAISES_EXT_KEYWORDS: Record<string, string[]> = {
    'Espanha':             ['real madrid', 'barcelona', 'atletico madrid', 'sevilla', 'valencia', 'real betis', 'villarreal', 'real sociedad'],
    'Inglaterra':          ['manchester city', 'manchester united', 'liverpool', 'arsenal', 'chelsea', 'tottenham', 'newcastle', 'west ham', 'aston villa', 'leicester'],
    'Itália':              ['juventus', 'milan', 'inter milan', 'internazionale', 'napoli', 'naples', 'roma', 'lazio', 'fiorentina'],
    'França':              ['psg', 'paris saint', 'lyon', 'marseille'],
    'Alemanha':            ['dortmund', 'borussia dortmund', 'bayern', 'bayer leverkusen'],
    'Portugal':            ['porto', 'benfica', 'sporting'],
    'Holanda':             ['ajax'],
    'Argentina (Clubes)':  ['boca juniors', 'river plate'],
    'Brasil (Clubes Ext.)':['flamengo', 'palmeiras'], // não deve aparecer aqui, só safety
    'Escócia':             ['celtic', 'rangers'],
    'Turquia':             ['galatasaray', 'fenerbahce'],
    'Outros':              ['colo colo', 'universidad de chile', 'club america', 'chivas', 'tigres'],
};

// Palavras de SELEÇÕES nacionais — para excluir dos filtros de clubes estrangeiros
const SELECOES_EXCLUIR = [
    'england home', 'england away', 'england jersey',
    'spain home', 'spain away', 'spain jersey',
    'germany home', 'germany away', 'germany jersey',
    'italy home', 'italy away', 'italy jersey',
    'france home', 'france away', 'france jersey',
    'portugal home', 'portugal away', 'portugal jersey',
    'netherlands home', 'netherlands away',
];

const SELECOES_LISTA = [
    'Brasil', 'Argentina', 'Portugal', 'Alemanha', 'Inglaterra',
    'Itália', 'Espanha', 'França', 'Holanda', 'Colômbia',
    'México', 'Japão', 'Croácia', 'Uruguai', 'Chile',
    'Bélgica', 'Dinamarca', 'Suécia', 'Polônia', 'Austrália',
    'Nigéria', 'Senegal', 'Marrocos', 'Camarões', 'Coreia',
    'Equador', 'EUA', 'Escócia', 'País de Gales', 'Suíça',
    'Gana', 'Mali', 'Costa Rica', 'Paraguai', 'Peru',
];

const SELECOES_KEYWORDS: Record<string, string[]> = {
    'Brasil':         ['brasil', 'brazil'],
    'Argentina':      ['argentina'],
    'Portugal':       ['portugal'],
    'Alemanha':       ['germany', 'deutsch'],
    'Inglaterra':     ['england'],
    'Itália':         ['italy', 'italia'],
    'Espanha':        ['spain'],
    'França':         ['france'],
    'Holanda':        ['netherlands', 'holland'],
    'Colômbia':       ['colombia'],
    'México':         ['mexico'],
    'Japão':          ['japan'],
    'Croácia':        ['croatia'],
    'Uruguai':        ['uruguay'],
    'Chile':          ['chile'],
    'Bélgica':        ['belgium'],
    'Dinamarca':      ['denmark'],
    'Suécia':         ['sweden'],
    'Polônia':        ['poland'],
    'Austrália':      ['australia'],
    'Nigéria':        ['nigeria'],
    'Senegal':        ['senegal'],
    'Marrocos':       ['morocco'],
    'Camarões':       ['cameroon'],
    'Coreia':         ['korea'],
    'Equador':        ['ecuador'],
    'EUA':            ['usa', 'united states'],
    'Escócia':        ['scotland'],
    'País de Gales':  ['wales'],
    'Suíça':          ['switzerland', 'swiss'],
    'Gana':           ['ghana'],
    'Mali':           ['mali'],
    'Costa Rica':     ['costa rica'],
    'Paraguai':       ['paraguay'],
    'Peru':           ['peru'],
};

// Keywords de clubes BR para excluir de seleções
const CLUBES_BR_EXCLUIR = [
    'flamengo', 'palmeiras', 'corinthians', 'fluminense', 'vasco',
    'botafogo', 'cruzeiro', 'atletico mineiro', 'gremio', 'internacional',
    'paysandu', 'athletico', 'bragantino',
];

const TIPO_SUB = ['Torcedor', 'Jogador', 'Manga Longa'];

const MAIN_FILTERS: MainFilter[] = [
    'Todos', 'Clubes Brasileiros', 'Clubes Estrangeiros', 'Seleções',
    'NBA', 'F1', 'NFL', 'Feminino', 'Retrô', 'Kids', 'Shorts', 'Agasalhos',
];

// ─── Componente ──────────────────────────────────────────────────────────────

export default function Catalog() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [mainFilter, setMainFilter] = useState<MainFilter>('Todos');
    const [subFilter, setSubFilter] = useState('');   // clube, país, seleção ou tipo
    const [tipoFilter, setTipoFilter] = useState(''); // Torcedor / Jogador / Manga Longa
    const [displayCount, setDisplayCount] = useState(12);
    const PER_PAGE = 12;

    // Ler params da URL na montagem
    useEffect(() => {
        const group = searchParams.get('group') as MainFilter | null;
        const sub   = searchParams.get('sub') || '';
        const q     = searchParams.get('q') || '';
        if (group) { setMainFilter(group); setSubFilter(sub); }
        if (q) setSearchQuery(q);
    }, [searchParams]);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setProducts(await getProducts());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleBuyNow = (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        const msg = `Olá! Tenho interesse em:\n\n*${product.name}*\nPreço: R$ ${product.price.toFixed(2).replace('.', ',')}\n\nPoderia me ajudar?`;
        window.open(buildWhatsappUrl(msg), '_blank');
    };

    const selectMain = (f: MainFilter) => {
        setMainFilter(prev => prev === f ? 'Todos' : f);
        setSubFilter('');
        setTipoFilter('');
        setDisplayCount(PER_PAGE);
    };

    const selectSub = (s: string) => {
        setSubFilter(prev => prev === s ? '' : s);
        setTipoFilter('');
        setDisplayCount(PER_PAGE);
    };

    const selectTipo = (t: string) => {
        setTipoFilter(prev => prev === t ? '' : t);
        setDisplayCount(PER_PAGE);
    };

    // ─── Lógica de filtro ────────────────────────────────────────────────────
    const filteredProducts = products.filter(product => {
        const name = product.name.toLowerCase();
        const desc = (product.description || '').toLowerCase();
        const combined = name + ' ' + desc;
        const cat  = (product.category || '').toLowerCase();

        // busca textual
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            if (!name.includes(q) && !desc.includes(q) && !cat.includes(q)) return false;
        }

        if (mainFilter === 'Todos') return true;

        // ── tipo (sub-sub) se aplicável ──
        const matchesTipo = () => {
            if (!tipoFilter) return true;
            if (tipoFilter === 'Jogador')      return name.includes('jogador');
            if (tipoFilter === 'Torcedor')     return name.includes('torcedor');
            if (tipoFilter === 'Manga Longa')  return name.includes('manga longa');
            return true;
        };

        if (mainFilter === 'Clubes Brasileiros') {
            // excluir seleções
            const isSel = Object.values(SELECOES_KEYWORDS).flat().some(k =>
                combined.includes(k) && !CLUBES_BR_EXCLUIR.some(c => combined.includes(c))
            );
            if (isSel) return false;
            if (subFilter) {
                const kws = CLUBES_BR_KEYWORDS[subFilter] || [subFilter.toLowerCase()];
                if (!kws.some(k => combined.includes(k))) return false;
            } else {
                const anyBR = Object.values(CLUBES_BR_KEYWORDS).flat().some(k => combined.includes(k));
                if (!anyBR) return false;
            }
            return matchesTipo();
        }

        if (mainFilter === 'Clubes Estrangeiros') {
            // excluir seleções nacionais — detectar pelo nome traduzido
            const isSel = SELECOES_EXCLUIR.some(k => combined.includes(k));
            if (isSel) return false;
            // excluir clubes BR
            if (CLUBES_BR_EXCLUIR.some(k => combined.includes(k))) return false;
            if (subFilter) {
                const kws = PAISES_EXT_KEYWORDS[subFilter] || [subFilter.toLowerCase()];
                if (!kws.some(k => combined.includes(k))) return false;
            } else {
                const anyExt = Object.values(PAISES_EXT_KEYWORDS).flat().some(k => combined.includes(k));
                if (!anyExt) return false;
            }
            return matchesTipo();
        }

        if (mainFilter === 'Seleções') {
            // excluir clubes BR e estrangeiros conhecidos
            if (CLUBES_BR_EXCLUIR.some(k => combined.includes(k))) return false;
            const isClubExt = ['real madrid','barcelona','manchester','liverpool','arsenal','chelsea','tottenham',
                'juventus','milan','napoli','psg','dortmund','ajax','porto','benfica'].some(k => combined.includes(k));
            if (isClubExt) return false;
            if (subFilter) {
                const kws = SELECOES_KEYWORDS[subFilter] || [subFilter.toLowerCase()];
                return kws.some(k => combined.includes(k));
            }
            return Object.values(SELECOES_KEYWORDS).flat().some(k => combined.includes(k)) || cat === 'seleções';
        }

        if (mainFilter === 'NBA')      return cat === 'nba' || name.includes('basquete') || combined.includes('nba');
        if (mainFilter === 'F1')       return name.includes('f1') || combined.includes('formula 1') || combined.includes('formula one');
        if (mainFilter === 'NFL')      return combined.includes('nfl') || combined.includes('american football');
        if (mainFilter === 'Feminino') return name.includes('feminino');
        if (mainFilter === 'Retrô')    return name.includes('retrô');
        if (mainFilter === 'Kids')     return name.includes('infantil');
        if (mainFilter === 'Shorts')   return name.includes('shorts');
        if (mainFilter === 'Agasalhos') return name.includes('agasalho') || combined.includes('windbreaker') || combined.includes('vest');

        return true;
    });

    const visibleProducts = filteredProducts.slice(0, displayCount);
    const hasMore = filteredProducts.length > displayCount;

    // Decidir quais sub-filtros mostrar
    const showClubeBRSubs  = mainFilter === 'Clubes Brasileiros';
    const showPaisExtSubs  = mainFilter === 'Clubes Estrangeiros';
    const showSelecoesSubs = mainFilter === 'Seleções';
    const showTipoSubs     = (mainFilter === 'Clubes Brasileiros' || mainFilter === 'Clubes Estrangeiros' || mainFilter === 'Seleções');

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8 border-b border-white/10 pb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                    <h1 className="text-4xl font-bold tracking-tighter">Coleção</h1>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Pesquisar por time, cor, etc..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setDisplayCount(PER_PAGE); }}
                            className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary w-full transition-all"
                        />
                    </div>
                </div>

                {/* Filtros principais */}
                <div className="flex items-center gap-2 text-gray-400 mb-3">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">Categorias:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {MAIN_FILTERS.map(f => (
                        <button
                            key={f}
                            onClick={() => selectMain(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1 ${
                                mainFilter === f
                                    ? 'bg-primary text-secondary scale-105 shadow-lg'
                                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            {f}
                            {['Clubes Brasileiros','Clubes Estrangeiros','Seleções','NBA','Shorts'].includes(f) && (
                                mainFilter === f
                                    ? <ChevronDown className="w-3.5 h-3.5" />
                                    : <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Sub-filtros: Clubes Brasileiros */}
                {showClubeBRSubs && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Clube</p>
                        <div className="flex flex-wrap gap-2">
                            {CLUBES_BR_LISTA.map(clube => (
                                <button key={clube} onClick={() => selectSub(clube)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                        subFilter === clube ? 'bg-white text-secondary' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                    }`}>
                                    {clube}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sub-filtros: Clubes Estrangeiros */}
                {showPaisExtSubs && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">País</p>
                        <div className="flex flex-wrap gap-2">
                            {PAISES_EXT_LISTA.map(pais => (
                                <button key={pais} onClick={() => selectSub(pais)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                        subFilter === pais ? 'bg-white text-secondary' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                    }`}>
                                    {pais}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sub-filtros: Seleções */}
                {showSelecoesSubs && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Seleção</p>
                        <div className="flex flex-wrap gap-2">
                            {SELECOES_LISTA.map(s => (
                                <button key={s} onClick={() => selectSub(s)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                        subFilter === s ? 'bg-white text-secondary' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                    }`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sub-sub-filtro: Tipo (Torcedor / Jogador / Manga Longa) */}
                {showTipoSubs && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {TIPO_SUB.map(t => (
                            <button key={t} onClick={() => selectTipo(t)}
                                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                                    tipoFilter === t ? 'bg-primary text-secondary' : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300 border border-white/5'
                                }`}>
                                {t}
                            </button>
                        ))}
                    </div>
                )}

                {/* NBA sub-filtros */}
                {mainFilter === 'NBA' && (
                    <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                        {['Camisas', 'Shorts'].map(s => (
                            <button key={s} onClick={() => selectSub(s)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                    subFilter === s ? 'bg-white text-secondary' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                }`}>
                                {s}
                            </button>
                        ))}
                    </div>
                )}

                {/* Shorts sub-filtros */}
                {mainFilter === 'Shorts' && (
                    <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                        {['Futebol', 'NBA'].map(s => (
                            <button key={s} onClick={() => selectSub(s)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                    subFilter === s ? 'bg-white text-secondary' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                }`}>
                                {s}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Contagem */}
            {!loading && (
                <p className="text-xs text-gray-500 mb-4">
                    {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                    {mainFilter !== 'Todos' && (
                        <span className="text-primary font-bold"> · {mainFilter}{subFilter ? ` › ${subFilter}` : ''}{tipoFilter ? ` › ${tipoFilter}` : ''}</span>
                    )}
                </p>
            )}

            {/* Grid de produtos */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
                {visibleProducts.map((product) => (
                    <Link key={product.id} to={`/product/${product.id}`} className="group">
                        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-800 mb-4">
                            <img
                                src={product.image}
                                alt={product.name}
                                loading="lazy"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-4 right-4 bg-secondary/80 backdrop-blur-sm p-2 rounded-full">
                                <Star className="w-4 h-4 text-primary fill-primary" />
                            </div>

                            {product.stock_status && product.stock_status !== 'in_stock' && (
                                <div className={`absolute top-4 left-4 px-2 py-1 rounded text-xs font-bold uppercase backdrop-blur-sm ${
                                    product.stock_status === 'made_to_order' ? 'bg-blue-500/80 text-white' : 'bg-red-500/80 text-white'
                                }`}>
                                    {product.stock_status === 'made_to_order' ? 'Sob Encomenda' : 'Sem Estoque'}
                                </div>
                            )}

                            <div className="absolute bottom-2 left-2 right-2 flex flex-col gap-1 sm:opacity-0 sm:group-hover:opacity-100 sm:bottom-4 sm:left-4 sm:right-4 sm:gap-2 transition-opacity">
                                <button
                                    onClick={(e) => handleBuyNow(e, product)}
                                    className="w-full py-1.5 sm:py-2.5 bg-[#25D366] text-white font-bold rounded-md sm:rounded-lg shadow-lg hover:bg-green-500 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-[11px] sm:text-sm"
                                >
                                    <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Comprar
                                </button>
                                <button
                                    onClick={(e) => { e.preventDefault(); navigate(`/product/${product.id}`); }}
                                    className="w-full py-1.5 sm:py-2.5 bg-white/90 text-secondary font-bold rounded-md sm:rounded-lg shadow-lg hover:bg-primary transition-colors text-[11px] sm:text-sm"
                                >
                                    Ver Detalhes
                                </button>
                            </div>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold group-hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
                        <p className="text-gray-400 text-xs">{product.category}</p>
                        <p className="text-primary font-bold mt-1 text-sm sm:text-base">
                            {product.price > 0 ? `R$ ${product.price.toFixed(2)}` : 'Preço sob consulta'}
                        </p>
                    </Link>
                ))}
            </div>

            {loading && (
                <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            )}

            {!loading && hasMore && (
                <div className="flex justify-center mt-12">
                    <button onClick={() => setDisplayCount(c => c + PER_PAGE)}
                        className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg transition-colors border border-white/10">
                        Carregar mais
                    </button>
                </div>
            )}

            {!loading && visibleProducts.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    Nenhum produto encontrado para os filtros selecionados.
                </div>
            )}
        </div>
    );
}
