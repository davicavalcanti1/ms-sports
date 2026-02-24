import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatImageUrl } from '../data/products';

export default function Home() {
    return (
        <div className="space-y-0 relative">
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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                        Stadium Elite Edition
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold leading-[0.9] tracking-tight uppercase">
                        ELEVATE <br /> <span className="text-primary italic">YOUR GAME</span>
                    </h2>
                    <p className="text-gray-300 text-sm leading-relaxed max-w-[280px]">
                        Camisas Oficiais de Futebol & Basquete para o Atleta de Elite.
                    </p>
                    <div className="pt-4">
                        <Link
                            to="/catalog"
                            className="inline-flex w-full bg-primary text-black font-black px-8 py-4 rounded-lg items-center justify-center gap-2 hover:brightness-110 transition-all uppercase tracking-wider text-sm"
                            style={{ boxShadow: '0 0 20px rgba(212,175,55,0.3)' }}
                        >
                            FALAR COM VENDEDOR
                            <ArrowRight className="w-5 h-5" />
                        </Link>
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
                        <p className="text-[10px] text-primary font-bold tracking-widest mt-1 uppercase">Temporada 24/25</p>
                    </div>
                    <Link to="/catalog" className="text-primary text-xs font-bold tracking-widest uppercase hover:underline">Ver Todas</Link>
                </div>
                <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
                    {/* Flamengo */}
                    <Link to="/product/yupoo-1" className="min-w-[280px] bg-white/[0.03] backdrop-blur-xl border border-primary/20 rounded-2xl p-4 flex flex-col gap-4 group">
                        <div className="relative aspect-[3/4] rounded-xl bg-[#1a1d23] flex items-center justify-center overflow-hidden">
                            <img alt="Flamengo Home 24/25" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={formatImageUrl('yupoo-1', 1)} referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <button className="absolute top-3 right-3 bg-white/[0.03] backdrop-blur-xl border border-primary/20 p-2 rounded-full">
                                <Star className="w-3 h-3 text-primary fill-primary" />
                            </button>
                            <div className="absolute bottom-3 left-3 flex gap-2">
                                <span className="bg-primary text-black text-[9px] font-black px-2 py-0.5 rounded">OFICIAL</span>
                                <span className="bg-white/20 backdrop-blur-md text-white text-[9px] font-black px-2 py-0.5 rounded">NEW</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Soccer</p>
                            <h4 className="text-base font-bold text-white truncate mt-1">Flamengo Home 24/25</h4>
                            <p className="text-lg font-bold text-white mt-1">R$ 150,00</p>
                        </div>
                    </Link>

                    {/* São Paulo - Using generic ID yupoo-2 for now as placeholder or next available */}
                    <Link to="/product/yupoo-2" className="min-w-[280px] bg-white/[0.03] backdrop-blur-xl border border-primary/20 rounded-2xl p-4 flex flex-col gap-4 group">
                        <div className="relative aspect-[3/4] rounded-xl bg-[#1a1d23] flex items-center justify-center overflow-hidden">
                            <img alt="Palmeiras Special" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={formatImageUrl('yupoo-2', 1)} referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-3 left-3 flex gap-2">
                                <span className="bg-primary text-black text-[9px] font-black px-2 py-0.5 rounded">OFICIAL</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Soccer</p>
                            <h4 className="text-base font-bold text-white truncate mt-1">Palmeiras Special Edition</h4>
                            <p className="text-lg font-bold text-white mt-1">R$ 150,00</p>
                        </div>
                    </Link>

                    {/* Fluminense */}
                    <Link to="/product/yupoo-13" className="min-w-[280px] bg-white/[0.03] backdrop-blur-xl border border-primary/20 rounded-2xl p-4 flex flex-col gap-4 group">
                        <div className="relative aspect-[3/4] rounded-xl bg-[#1a1d23] flex items-center justify-center overflow-hidden">
                            <img alt="Fluminense Home 24/25" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={formatImageUrl('yupoo-13', 1)} referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>
                        <div>
                            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Soccer</p>
                            <h4 className="text-base font-bold text-white truncate mt-1">Fluminense Home 24/25</h4>
                            <p className="text-lg font-bold text-white mt-1">R$ 150,00</p>
                        </div>
                    </Link>

                    {/* Wizards - Example, using generic ID yupoo-4 */}
                    <Link to="/product/yupoo-4" className="min-w-[280px] bg-white/[0.03] backdrop-blur-xl border border-primary/20 rounded-2xl p-4 flex flex-col gap-4 group">
                        <div className="relative aspect-[3/4] rounded-xl bg-[#1a1d23] flex items-center justify-center overflow-hidden">
                            <img alt="Cruzeiro POLO" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={formatImageUrl('yupoo-4', 1)} referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-3 left-3 flex gap-2">
                                <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded">NBA</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Basketball</p>
                            <h4 className="text-base font-bold text-white truncate mt-1">Cruzeiro POLO</h4>
                            <p className="text-lg font-bold text-white mt-1">R$ 150,00</p>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Category Sections */}
            <section className="mt-16 max-w-7xl mx-auto relative z-10 space-y-6">
                <h3 className="text-xl font-bold tracking-tight uppercase mb-2">CATEGORIAS</h3>

                {/* Times Brasileiros */}
                <Link to="/catalog" className="block relative w-full aspect-[21/9] rounded-2xl overflow-hidden group">
                    <img
                        alt="Times Brasileiros"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                        src="/flamengo.jpg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-center">
                        <span className="text-primary font-black text-[10px] tracking-[0.3em] uppercase mb-1">🇧🇷 BRASIL</span>
                        <h4 className="text-2xl md:text-3xl font-black italic uppercase leading-none mb-1">TIMES<br />BRASILEIROS</h4>
                        <p className="text-xs text-gray-300 max-w-[200px]">Flamengo, São Paulo, Fluminense e mais.</p>
                    </div>
                </Link>

                {/* Times Estrangeiros */}
                <Link to="/catalog" className="block relative w-full aspect-[21/9] rounded-2xl overflow-hidden group">
                    <img
                        alt="Times Estrangeiros"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                        src="/saopaulo.jpg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-center">
                        <span className="text-primary font-black text-[10px] tracking-[0.3em] uppercase mb-1">🌍 EUROPA & MAIS</span>
                        <h4 className="text-2xl md:text-3xl font-black italic uppercase leading-none mb-1">TIMES<br />ESTRANGEIROS</h4>
                        <p className="text-xs text-gray-300 max-w-[200px]">Real Madrid, Barcelona, PSG e mais.</p>
                    </div>
                </Link>

                {/* Basketball */}
                <Link to="/catalog" className="block relative w-full aspect-[21/9] rounded-2xl overflow-hidden group mb-12">
                    <img
                        alt="Basketball"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                        src="/wizards.jpg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-center">
                        <span className="text-primary font-black text-[10px] tracking-[0.3em] uppercase mb-1">🏀 NBA</span>
                        <h4 className="text-2xl md:text-3xl font-black italic uppercase leading-none mb-1">BASKETBALL</h4>
                        <p className="text-xs text-gray-300 max-w-[200px]">Wizards, Lakers, Bulls e mais.</p>
                    </div>
                </Link>
            </section>
        </div>
    );
}
