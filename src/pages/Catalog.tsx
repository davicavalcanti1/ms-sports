import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../data/products';
import type { Product } from '../data/products';
import { Star, Filter, Loader2, Search, ChevronDown, ChevronRight } from 'lucide-react';

type FilterGroup = "Todos" | "Camisas" | "Basquete" | "F1" | "Kits" | "Shorts" | "Feminino" | "Infantil" | "Acessórios" | "Polo";

const filterGroups: Record<Exclude<FilterGroup, "Todos">, string[]> = {
    "Camisas": ["Versão Jogador", "Versão Torcedor", "Retrô"],
    "Basquete": ["Camisa Basquete", "Short NBA"],
    "F1": ["Camisa de Formula 1"],
    "Kits": ["Kit Calça e Regata", "Kit Short e Regata", "Kit Calça e Camisa"],
    "Shorts": ["Short de Futebol", "Short NBA"],
    "Feminino": [],
    "Infantil": ["Conjunto Kids"],
    "Acessórios": ["Meia"],
    "Polo": []
};

export default function Catalog() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<FilterGroup>('Todos');
    const [selectedTeam, setSelectedTeam] = useState<string>('');

    // Pagination state
    const [displayCount, setDisplayCount] = useState(12);
    const PRODUCTS_PER_PAGE = 12;

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

    const handleLoadMore = () => {
        setDisplayCount(prev => prev + PRODUCTS_PER_PAGE);
    };

    const handleGroupClick = (group: FilterGroup) => {
        if (selectedGroup === group) {
            setSelectedGroup('Todos');
            setSelectedTeam('');
        } else {
            setSelectedGroup(group);
            setSelectedTeam('');
        }
        setDisplayCount(PRODUCTS_PER_PAGE);
    };

    const handleTeamClick = (team: string) => {
        if (selectedTeam === team) {
            setSelectedTeam('');
        } else {
            setSelectedTeam(team);
        }
        setDisplayCount(PRODUCTS_PER_PAGE);
    };

    // Filter logic
    const filteredProducts = products.filter(product => {
        const titleLower = product.name.toLowerCase();
        const catLower = product.category.toLowerCase();

        // 1. Text Search filtering
        if (searchQuery && !titleLower.includes(searchQuery.toLowerCase())) {
            return false;
        }

        // 2. Group/Team filtering
        if (selectedGroup !== 'Todos') {
            if (selectedTeam) {
                // If a specific sub-category is chosen
                if (selectedGroup === 'Camisas' && selectedTeam === 'Versão Torcedor') {
                    // Torcedor implicitly means it's not player version and not retro
                    if (titleLower.includes('jogador') || titleLower.includes('player') || titleLower.includes('retrô') || titleLower.includes('retro')) {
                        return false;
                    }
                    // Basic sanity check that it's a field shirt
                    if (titleLower.includes('f1') || titleLower.includes('goleiro')) {
                        // if you need to filter these out of "torcedor" you can, but primarily it's vs "jogador"
                    }
                } else if (selectedGroup === 'Camisas' && selectedTeam === 'Versão Jogador') {
                    if (!titleLower.includes('jogador') && !titleLower.includes('player')) return false;
                } else if (selectedGroup === 'Camisas' && selectedTeam === 'Retrô') {
                    if (!titleLower.includes('retrô') && !titleLower.includes('retro')) return false;
                } else {
                    if (!titleLower.includes(selectedTeam.toLowerCase())) {
                        return false;
                    }
                }
            } else {
                // Group level filtering
                if (selectedGroup === 'Feminino') {
                    if (!titleLower.includes('feminino') && !titleLower.includes('woman') && !titleLower.includes('women')) return false;
                } else if (selectedGroup === 'Infantil') {
                    if (!titleLower.includes('kid') && !titleLower.includes('infantil') && catLower !== 'infantil') return false;
                } else if (selectedGroup === 'Basquete') {
                    if (!titleLower.includes('basquete') && !titleLower.includes('basketball') && catLower !== 'nba') return false;
                } else if (selectedGroup === 'F1') {
                    if (!titleLower.includes('f1') && !titleLower.includes('formula 1') && !titleLower.includes('fórmula 1')) return false;
                } else if (selectedGroup === 'Kits') {
                    if (!titleLower.includes('kit')) return false;
                } else if (selectedGroup === 'Shorts') {
                    if (!titleLower.includes('short')) return false;
                } else if (selectedGroup === 'Acessórios') {
                    if (!titleLower.includes('meia')) return false;
                } else if (selectedGroup === 'Polo') {
                    if (!titleLower.includes('polo')) return false;
                } else if (selectedGroup === 'Camisas') {
                    // When just "Camisas" is clicked, exclude polo, f1, nba, kits, shorts, etc if we want a strict soccer shirt filter
                    // Or just keep the existing simple logic:
                    if (titleLower.includes('f1') || titleLower.includes('formula 1') || titleLower.includes('polo') || titleLower.includes('kit') || titleLower.includes('short') || titleLower.includes('meia') || catLower === 'nba') {
                        return false;
                    }
                }
            }
        }

        return true;
    });

    const visibleProducts = filteredProducts.slice(0, displayCount);
    const hasMore = visibleProducts.length < filteredProducts.length;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8 border-b border-white/10 pb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                    <h1 className="text-4xl font-bold tracking-tighter">Shop Collection</h1>

                    {/* Search Input */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Pesquisar por time, cor, etc..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setDisplayCount(PRODUCTS_PER_PAGE);
                            }}
                            className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary w-full transition-all"
                        />
                    </div>
                </div>

                {/* Main Filter Groups */}
                <div className="flex items-center gap-2 text-gray-400 whitespace-nowrap mb-4">
                    <Filter className="w-5 h-5" />
                    <span className="text-sm font-medium">Categorias:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {(['Todos', ...Object.keys(filterGroups)] as FilterGroup[]).map(group => (
                        <button
                            key={group}
                            onClick={() => handleGroupClick(group)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1 ${selectedGroup === group
                                ? 'bg-primary text-secondary scale-105 shadow-lg'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {group}
                            {group !== 'Todos' && group !== 'Feminino' && group !== 'Infantil' && group !== 'Polo' && (
                                selectedGroup === group ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 opacity-50" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Sub-teams for selected group */}
                {selectedGroup !== 'Todos' && selectedGroup !== 'Feminino' && selectedGroup !== 'Infantil' && selectedGroup !== 'Polo' && filterGroups[selectedGroup]?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        {filterGroups[selectedGroup].map(team => (
                            <button
                                key={team}
                                onClick={() => handleTeamClick(team)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedTeam === team
                                    ? 'bg-white text-secondary'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                    }`}
                            >
                                {team}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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

                            {/* Stock Status Badge */}
                            {product.stock_status && product.stock_status !== 'in_stock' && (
                                <div className={`absolute top-4 left-4 px-2 py-1 rounded text-xs font-bold uppercase ${product.stock_status === 'made_to_order' ? 'bg-blue-500/80 text-white' : 'bg-red-500/80 text-white'
                                    } backdrop-blur-sm`}>
                                    {product.stock_status === 'made_to_order' ? 'Sob Encomenda' : 'Sem Estoque'}
                                </div>
                            )}

                            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="w-full py-3 bg-white text-secondary font-bold rounded-lg shadow-lg hover:bg-primary transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                        <p className="text-gray-400 text-sm">{product.category}</p>
                        <p className="text-primary font-bold mt-1">
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
                        Load More
                    </button>
                </div>
            )}

            {!loading && visibleProducts.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    No products found matching your filters.
                </div>
            )}
        </div>
    );
}

