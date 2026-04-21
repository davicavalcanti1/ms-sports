import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProducts } from '../data/products';
import type { Product } from '../data/products';

export default function Home() {
    const [featuredProducts, setFeaturedProducts] = useState<{ type: string, product: Product | null }[]>([]);
    const [categoryImages, setCategoryImages] = useState({
        brazil: '',
        europe: '',
        nba: ''
    });

    useEffect(() => {
        loadFeatured();
    }, []);

    const loadFeatured = async () => {
        const allProducts = await getProducts();

        // Show exclusively Brazil items for the World Cup vibe
        const brazilProducts = allProducts.filter(p => {
            const t = p.name.toLowerCase();
            return t.includes('brasil') || t.includes('brazil');
        });

        const featured = brazilProducts.slice(0, 8).map(product => {
            return { type: '🇧🇷 Seleção Brasileira', product };
        });

        // Ensure we load at least something if Brazil is missing
        if (featured.length === 0) {
            setFeaturedProducts(allProducts.slice(0, 8).map(product => ({ type: 'Destaque', product })));
        } else {
            setFeaturedProducts(featured);
        }

        // Fetch one real product image for each category banner
        const flamengo = allProducts.find(p => p.name.toLowerCase().includes('flamengo'));
        const europe = allProducts.find(p => {
            const t = p.name.toLowerCase();
            return t.includes('real madrid') || t.includes('barcelona') || t.includes('psg') || t.includes('arsenal');
        });
        const nba = allProducts.find(p => p.category.toLowerCase() === 'nba' || p.name.toLowerCase().includes('lakers'));
        
        setCategoryImages({
            brazil: flamengo?.image || '',
            europe: europe?.image || '',
            nba: nba?.image || ''
        });
    };

    const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const number1 = "5583981109166"; // Rafael
        const number2 = "5583998168765"; // João Victor
        const selectedNumber = Math.random() > 0.5 ? number1 : number2;
        const message = encodeURIComponent("Olá! Vim pelo site da MS Sports e gostaria de tirar uma dúvida.");
        window.open(`https://wa.me/${selectedNumber}?text=${message}`, '_blank');
    };

    return (
        <div className="space-y-0 relative">
            {/* Particles for World Cup vibe */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
               {[...Array(120)].map((_, i) => {
                  const isFlag = i % 15 === 0; // Every 15th particle is a flag
                  return (
                      <div key={i} className="confetti flex items-center justify-center" style={{
                          backgroundColor: isFlag ? 'transparent' : (i % 2 === 0 ? 'rgba(0, 155, 58, 0.8)' : 'rgba(254, 223, 0, 0.8)'),
                          width: isFlag ? 'auto' : Math.random() * 8 + 4 + 'px',
                          height: isFlag ? 'auto' : Math.random() * 12 + 6 + 'px',
                          fontSize: isFlag ? (Math.random() * 10 + 15) + 'px' : '0',
                          left: Math.random() * 100 + 'vw',
                          top: '-10vh',
                          animationDuration: Math.random() * 6 + 3 + 's',
                          animationDelay: Math.random() * 6 + 's'
                      }}>
                          {isFlag && '🇧🇷'}
                      </div>
                  );
               })}
            </div>

            {/* Fixed Stadium Background */}
            <div className="fixed inset-0 -z-10">
                <img
                    alt="Stadium background"
                    className="w-full h-full object-cover"
                    src="/stadium.jpg"
                />
                <div className="absolute inset-0 bg-[#0a0a0a]/40"></div>
            </div>

            {/* Hero Section */}
            <section className="relative w-full h-[75vh] flex flex-col justify-end overflow-hidden -mx-4 -mt-8 px-8 pb-10">

                <div className="relative z-10 space-y-4 max-w-sm">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fedf00]/20 border border-[#fedf00]/30 text-[#fedf00] text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(254,223,0,0.3)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#fedf00] animate-pulse"></span>
                        Rumo ao Hexa 🇧🇷
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black leading-[0.9] tracking-tight uppercase" style={{ textShadow: '0 4px 20px rgba(0, 155, 58, 0.4)' }}>
                        VISTA O MANTO <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#009b3a] to-[#fedf00] italic">DA SELEÇÃO</span>
                    </h2>
                    <p className="text-gray-200 text-sm leading-relaxed max-w-[280px]">
                        A nova coleção da Seleção Brasileira e o melhor do esporte para vestir sua paixão.
                    </p>
                    <div className="pt-4">
                        <a
                            href="#"
                            onClick={handleWhatsAppClick}
                            className="inline-flex w-full bg-[#009b3a] text-white font-black px-8 py-4 rounded-lg items-center justify-center gap-2 hover:brightness-110 transition-all uppercase tracking-wider text-sm border border-[#fedf00]/30 brazil-glow"
                        >
                            GARANTIR A MINHA
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </section>

            {/* Search bar */}
            <div className="px-2 -mt-6 relative z-20 max-w-7xl mx-auto">
                <label className="flex items-center bg-white/[0.03] backdrop-blur-xl rounded-xl px-4 py-3 gap-3 border border-primary/20 shadow-2xl">
                    <span className="text-primary">🔍</span>
                    <input
                        className="bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder:text-gray-500 w-full text-sm"
                        placeholder="Buscar camisas de futebol, basquete..."
                        type="text"
                    />
                </label>
            </div>

            {/* Featured Jerseys */}
            <section className="mt-12 max-w-7xl mx-auto relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold tracking-tight uppercase">DESTAQUES</h3>
                        <p className="text-[10px] text-primary font-bold tracking-widest mt-1 uppercase">Coleção Completa</p>
                    </div>
                    <Link to="/catalog" className="text-primary text-xs font-bold tracking-widest uppercase hover:underline">Ver Todas</Link>
                </div>
                <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
                    {featuredProducts.length === 0 ? (
                        <div className="text-white">Carregando destaques...</div>
                    ) : (
                        featuredProducts.map(({ type, product }) => {
                            if (!product) return null;
                            return (
                                <Link key={product.id} to={`/product/${product.id}`} className={`min-w-[280px] bg-white/[0.03] backdrop-blur-xl rounded-2xl p-4 flex flex-col gap-4 group ${type.includes('Seleção Brasileira') ? 'brazil-glow border border-[#fedf00]/50 brazil-bg' : 'border border-primary/20'}`}>
                                    <div className="relative aspect-[3/4] rounded-xl bg-[#1a1d23] flex items-center justify-center overflow-hidden">
                                        <img alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={product.image} referrerPolicy="no-referrer" loading="lazy" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <button className={`absolute top-3 right-3 bg-white/[0.03] backdrop-blur-xl border p-2 rounded-full ${type.includes('Seleção Brasileira') ? 'border-[#fedf00]/50' : 'border-primary/20'}`}>
                                            <Star className={`w-3 h-3 ${type.includes('Seleção Brasileira') ? 'text-[#fedf00] fill-[#fedf00]' : 'text-primary fill-primary'}`} />
                                        </button>
                                        <div className="absolute bottom-3 left-3 flex gap-2">
                                            <span className={`text-black text-[9px] font-black px-2 py-0.5 rounded uppercase ${type.includes('Seleção Brasileira') ? 'bg-[#fedf00]' : 'bg-primary'}`}>{type}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest ${type.includes('Seleção Brasileira') ? 'text-[#009b3a]' : 'text-primary'}`}>{product.category}</p>
                                        <h4 className="text-base font-bold text-white truncate mt-1">{product.name}</h4>
                                        <p className="text-lg font-bold text-white mt-1">R$ {product.price.toFixed(2)}</p>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </section>

            {/* Category Sections */}
            <section className="mt-16 max-w-7xl mx-auto relative z-10 space-y-6">
                <h3 className="text-xl font-bold tracking-tight uppercase mb-2">CATEGORIAS</h3>

                {/* Times Brasileiros */}
                <Link to="/catalog" className="block relative w-full aspect-[21/9] rounded-2xl overflow-hidden group">
                    <img
                        alt="Times Brasileiros Background"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                        src="/stadium.jpg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-center">
                        <span className="text-primary font-black text-[10px] tracking-[0.3em] uppercase mb-1">🇧🇷 BRASIL</span>
                        <h4 className="text-2xl md:text-3xl font-black italic uppercase leading-none mb-1">TIMES<br />BRASILEIROS</h4>
                        <p className="text-xs text-gray-300 max-w-[200px]">Flamengo, São Paulo, Fluminense e mais.</p>
                    </div>
                    {categoryImages.brazil && (
                        <div className="absolute top-0 right-0 w-1/2 h-full flex items-center justify-end pr-4 md:pr-12 pointer-events-none opacity-90 pb-4 md:pb-0 mix-blend-screen overflow-hidden">
                            <img src={categoryImages.brazil} alt="Camisa Exemplo BR" className="h-[120%] rotate-12 scale-125 object-cover mask-image-fade" />
                        </div>
                    )}
                </Link>

                {/* Times Estrangeiros */}
                <Link to="/catalog" className="block relative w-full aspect-[21/9] rounded-2xl overflow-hidden group">
                    <img
                        alt="Times Estrangeiros Background"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                        src="/stadium.jpg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-center">
                        <span className="text-primary font-black text-[10px] tracking-[0.3em] uppercase mb-1">🌍 EUROPA & MAIS</span>
                        <h4 className="text-2xl md:text-3xl font-black italic uppercase leading-none mb-1">TIMES<br />ESTRANGEIROS</h4>
                        <p className="text-xs text-gray-300 max-w-[200px]">Real Madrid, Barcelona, PSG e mais.</p>
                    </div>
                    {categoryImages.europe && (
                        <div className="absolute top-0 right-0 w-1/2 h-full flex items-center justify-end pr-4 md:pr-12 pointer-events-none opacity-90 pb-4 md:pb-0 mix-blend-screen overflow-hidden">
                            <img src={categoryImages.europe} alt="Camisa Exemplo Europa" className="h-[120%] -rotate-12 scale-125 object-cover mask-image-fade" />
                        </div>
                    )}
                </Link>

                {/* Basketball */}
                <Link to="/catalog" className="block relative w-full aspect-[21/9] rounded-2xl overflow-hidden group mb-12">
                    <img
                        alt="Basketball Background"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                        src="/stadium.jpg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-center">
                        <span className="text-primary font-black text-[10px] tracking-[0.3em] uppercase mb-1">🏀 NBA</span>
                        <h4 className="text-2xl md:text-3xl font-black italic uppercase leading-none mb-1">BASKETBALL</h4>
                        <p className="text-xs text-gray-300 max-w-[200px]">Wizards, Lakers, Bulls e mais.</p>
                    </div>
                    {categoryImages.nba && (
                        <div className="absolute top-0 right-0 w-1/2 h-full flex items-center justify-end pr-4 md:pr-12 pointer-events-none opacity-90 pb-4 md:pb-0 mix-blend-screen overflow-hidden">
                            <img src={categoryImages.nba} alt="Regata Exemplo NBA" className="h-[120%] rotate-6 scale-125 object-cover mask-image-fade" />
                        </div>
                    )}
                </Link>
            </section>
        </div>
    );
}
