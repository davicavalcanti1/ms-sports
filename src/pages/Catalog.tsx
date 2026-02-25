import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getProducts } from '../data/products';
import type { Product } from '../data/products';
import { buildWhatsappUrl } from '../lib/whatsapp';
import { Star, Filter, Loader2, Search, ChevronDown, ChevronRight, MessageCircle } from 'lucide-react';

type FilterGroup = "Todos" | "Camisas" | "Seleções" | "Basquete" | "F1" | "Kits" | "Shorts" | "Feminino" | "Infantil" | "Acessórios" | "Polo";

const SELECOES = [
    "Brasil", "Argentina", "Portugal", "Alemanha", "Inglaterra",
    "Itália", "Espanha", "França", "Holanda", "Colômbia",
    "México", "Japão", "Croácia", "Uruguai", "Chile",
    "Bélgica", "Dinamarca", "Suécia", "Polônia", "Austrália",
    "Nigéria", "Senegal", "Marrocos", "Camarões", "Coreia",
    "Equador", "EUA",
];

// Mapeia nome exibido → keywords para busca no título
const SELECOES_KEYWORDS: Record<string, string[]> = {
    "Brasil":     ["brasil", "brazil"],
    "Argentina":  ["argentina"],
    "Portugal":   ["portugal"],
    "Alemanha":   ["germany", "german", "deutschland"],
    "Inglaterra": ["england", "english"],
    "Itália":     ["italia", "italy", "italian"],
    "Espanha":    ["spain", "spanish", "espana"],
    "França":     ["france", "french"],
    "Holanda":    ["netherlands", "holland", "dutch"],
    "Colômbia":   ["colombia"],
    "México":     ["mexico"],
    "Japão":      ["japan", "japanese"],
    "Croácia":    ["croatia"],
    "Uruguai":    ["uruguay"],
    "Chile":      ["chile"],
    "Bélgica":    ["belgium"],
    "Dinamarca":  ["denmark"],
    "Suécia":     ["sweden"],
    "Polônia":    ["poland"],
    "Austrália":  ["australia"],
    "Nigéria":    ["nigeria"],
    "Senegal":    ["senegal"],
    "Marrocos":   ["morocco"],
    "Camarões":   ["cameroon"],
    "Coreia":     ["korea"],
    "Equador":    ["ecuador"],
    "EUA":        [" usa ", "united states", "u.s.a"],
};

const filterGroups: Record<Exclude<FilterGroup, "Todos" | "Seleções">, string[]> = {
    "Camisas":    ["Versão Jogador", "Versão Torcedor", "Retrô"],
    "Basquete":   ["Camisa Basquete", "Short NBA"],
    "F1":         ["Camisa de Formula 1"],
    "Kits":       ["Kit Calça e Regata", "Kit Short e Regata", "Kit Calça e Camisa"],
    "Shorts":     ["Short de Futebol", "Short NBA"],
    "Feminino":   [],
    "Infantil":   ["Conjunto Kids"],
    "Acessórios": ["Meia"],
    "Polo":       [],
};

export default function Catalog() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<FilterGroup>('Todos');
    const [selectedSub, setSelectedSub] = useState<string>('');
    const [displayCount, setDisplayCount] = useState(12);
    const PRODUCTS_PER_PAGE = 12;

    // Lê parâmetros da URL ao montar (ex: /catalog?group=Basquete ou ?group=Seleções&sub=Brasil)
    useEffect(() => {
        const group = searchParams.get('group') as FilterGroup | null;
        const sub = searchParams.get('sub') || '';
        if (group) {
            setSelectedGroup(group);
            setSelectedSub(sub);
        }
    }, [searchParams]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const allProducts = await getProducts();
            setProducts(allProducts);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBuyNow = (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        const message = `Olá! Tenho interesse em comprar:\n\n*${product.name}*\nPreço: R$ ${product.price.toFixed(2).replace('.', ',')}\n\nPoderia me ajudar?`;
        window.open(buildWhatsappUrl(message), '_blank');
    };

    const handleGroupClick = (group: FilterGroup) => {
        if (selectedGroup === group) {
            setSelectedGroup('Todos');
            setSelectedSub('');
        } else {
            setSelectedGroup(group);
            setSelectedSub('');
        }
        setDisplayCount(PRODUCTS_PER_PAGE);
    };

    const handleSubClick = (sub: string) => {
        setSelectedSub(prev => prev === sub ? '' : sub);
        setDisplayCount(PRODUCTS_PER_PAGE);
    };

    const handleLoadMore = () => setDisplayCount(prev => prev + PRODUCTS_PER_PAGE);

    // Lógica de filtro
    const filteredProducts = products.filter(product => {
        const titleLower = product.name.toLowerCase();
        const catLower = product.category.toLowerCase();

        if (searchQuery && !titleLower.includes(searchQuery.toLowerCase())) return false;

        if (selectedGroup === 'Todos') return true;

        if (selectedGroup === 'Seleções') {
            if (selectedSub) {
                const keywords = SELECOES_KEYWORDS[selectedSub] || [selectedSub.toLowerCase()];
                return keywords.some(k => titleLower.includes(k));
            }
            // Sem sub selecionado: mostra TODOS os produtos de seleção
            const allKeywords = Object.values(SELECOES_KEYWORDS).flat();
            return allKeywords.some(k => titleLower.includes(k)) || catLower === 'seleções';
        }

        if (selectedSub) {
            return titleLower.includes(selectedSub.toLowerCase());
        }

        if (selectedGroup === 'Feminino')   return titleLower.includes('feminino') || titleLower.includes('women') || titleLower.includes('woman');
        if (selectedGroup === 'Infantil')   return titleLower.includes('kid') || titleLower.includes('infantil') || catLower === 'infantil';
        if (selectedGroup === 'Basquete')   return titleLower.includes('basquete') || titleLower.includes('basketball') || catLower === 'nba';
        if (selectedGroup === 'F1')         return titleLower.includes('f1') || titleLower.includes('formula 1') || titleLower.includes('fórmula 1');
        if (selectedGroup === 'Kits')       return titleLower.includes('kit');
        if (selectedGroup === 'Shorts')     return titleLower.includes('short');
        if (selectedGroup === 'Acessórios') return titleLower.includes('meia');
        if (selectedGroup === 'Polo')       return titleLower.includes('polo');
        if (selectedGroup === 'Camisas')    return titleLower.includes('jogador') || titleLower.includes('player') ||
                                                   titleLower.includes('torcedor') || titleLower.includes('fan') ||
                                                   titleLower.includes('retrô') || titleLower.includes('retro');

        return true;
    });

    const visibleProducts = filteredProducts.slice(0, displayCount);
    const hasMore = visibleProducts.length < filteredProducts.length;

    const allGroups: FilterGroup[] = ['Todos', 'Camisas', 'Seleções', ...Object.keys(filterGroups) as Exclude<FilterGroup, "Todos" | "Seleções" | "Camisas">[]];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8 border-b border-white/10 pb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                    <h1 className="text-4xl font-bold tracking-tighter">Coleção</h1>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Pesquisar por time, cor, etc..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setDisplayCount(PRODUCTS_PER_PAGE); }}
                            className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary w-full transition-all"
                        />
                    </div>
                </div>

                {/* Grupos principais */}
                <div className="flex items-center gap-2 text-gray-400 whitespace-nowrap mb-4">
                    <Filter className="w-5 h-5" />
                    <span className="text-sm font-medium">Categorias:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {allGroups.map(group => (
                        <button
                            key={group}
                            onClick={() => handleGroupClick(group)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1 ${
                                selectedGroup === group
                                    ? 'bg-primary text-secondary scale-105 shadow-lg'
                                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            {group}
                            {group !== 'Todos' && group !== 'Feminino' && group !== 'Infantil' && group !== 'Polo' && (
                                selectedGroup === group
                                    ? <ChevronDown className="w-4 h-4" />
                                    : <ChevronRight className="w-4 h-4 opacity-50" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Sub-filtros: Seleções */}
                {selectedGroup === 'Seleções' && (
                    <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        {SELECOES.map(pais => (
                            <button
                                key={pais}
                                onClick={() => handleSubClick(pais)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                    selectedSub === pais
                                        ? 'bg-white text-secondary'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                }`}
                            >
                                {pais}
                            </button>
                        ))}
                    </div>
                )}

                {/* Sub-filtros: outros grupos */}
                {selectedGroup !== 'Todos' && selectedGroup !== 'Seleções' &&
                 selectedGroup !== 'Feminino' && selectedGroup !== 'Infantil' && selectedGroup !== 'Polo' &&
                 filterGroups[selectedGroup as keyof typeof filterGroups]?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        {filterGroups[selectedGroup as keyof typeof filterGroups].map(sub => (
                            <button
                                key={sub}
                                onClick={() => handleSubClick(sub)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                    selectedSub === sub
                                        ? 'bg-white text-secondary'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                }`}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Resultado */}
            {!loading && (
                <p className="text-xs text-gray-500 mb-4">
                    {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                    {selectedGroup !== 'Todos' && <span className="text-primary font-bold"> · {selectedGroup}{selectedSub ? ` › ${selectedSub}` : ''}</span>}
                </p>
            )}

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
                                <div className={`absolute top-4 left-4 px-2 py-1 rounded text-xs font-bold uppercase ${
                                    product.stock_status === 'made_to_order' ? 'bg-blue-500/80 text-white' : 'bg-red-500/80 text-white'
                                } backdrop-blur-sm`}>
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
                        <h3 className="text-sm sm:text-lg font-bold group-hover:text-primary transition-colors line-clamp-2 sm:line-clamp-1">{product.name}</h3>
                        <p className="text-gray-400 text-xs sm:text-sm">{product.category}</p>
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
                    <button
                        onClick={handleLoadMore}
                        className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg transition-colors border border-white/10"
                    >
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
