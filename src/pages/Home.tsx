import { ArrowRight, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { formatImageUrl } from '../data/products';

const FEATURED = [
    {
        id: 'yupoo-1',
        label: 'Torcedor',
        name: 'Flamengo Home 24/25',
        category: 'Soccer',
        badge: 'TORCEDOR',
        badgeColor: 'bg-primary text-black',
    },
    {
        id: 'yupoo-3144',
        label: 'Jogador',
        name: 'Portugal 2024 Player',
        category: 'Soccer',
        badge: 'JOGADOR',
        badgeColor: 'bg-blue-600 text-white',
    },
    {
        id: 'yupoo-1710',
        label: 'Fórmula 1',
        name: 'F1 Formula One 2025',
        category: 'F1',
        badge: 'F1',
        badgeColor: 'bg-red-600 text-white',
    },
    {
        id: 'yupoo-2039',
        label: 'Basquete',
        name: 'NBA Luka Doncic',
        category: 'Basketball',
        badge: 'NBA',
        badgeColor: 'bg-orange-600 text-white',
    },
    {
        id: 'yupoo-67',
        label: 'Feminino',
        name: 'Cruzeiro Feminino',
        category: 'Feminino',
        badge: 'FEMININO',
        badgeColor: 'bg-pink-600 text-white',
    },
    {
        id: 'yupoo-1011',
        label: 'Kids',
        name: 'Athletic Bilbao Kids',
        category: 'Infantil',
        badge: 'KIDS',
        badgeColor: 'bg-yellow-500 text-black',
    },
    {
        id: 'yupoo-1084',
        label: 'Shorts',
        name: 'Short Futebol 25/26',
        category: 'Futebol',
        badge: 'SHORTS',
        badgeColor: 'bg-gray-600 text-white',
    },
    {
        id: 'yupoo-210',
        label: 'Kits',
        name: 'Kit Brasil 2022',
        category: 'Kits',
        badge: 'KIT',
        badgeColor: 'bg-green-600 text-white',
    },
];

export default function Home() {
    const [showVendorModal, setShowVendorModal] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const val = (e.target as HTMLInputElement).value.trim();
            if (val) navigate(`/catalog?q=${encodeURIComponent(val)}`);
        }
    };

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
                        <button
                            onClick={() => setShowVendorModal(true)}
                            className="inline-flex w-full bg-primary text-black font-black px-8 py-4 rounded-lg items-center justify-center gap-2 hover:brightness-110 transition-all uppercase tracking-wider text-sm"
                            style={{ boxShadow: '0 0 20px rgba(212,175,55,0.3)' }}
                        >
                            FALAR COM VENDEDOR
                            <ArrowRight className="w-5 h-5" />
                        </button>
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
                        onKeyDown={handleSearch}
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

                {/* Scroll horizontal: 4 cards visíveis no mobile, 280px no desktop */}
                <div className="flex gap-3 md:gap-6 overflow-x-auto no-scrollbar pb-4">
                    {FEATURED.map((item) => (
                        <Link
                            key={item.id}
                            to={`/product/${item.id}`}
                            className="min-w-[calc(25vw-10px)] md:min-w-[280px] bg-white/[0.03] backdrop-blur-xl border border-primary/20 rounded-2xl p-2 md:p-4 flex flex-col gap-2 md:gap-4 group flex-shrink-0"
                        >
                            <div className="relative aspect-[3/4] rounded-xl bg-[#1a1d23] flex items-center justify-center overflow-hidden">
                                <img
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    src={formatImageUrl(item.id, 1)}
                                    referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <button className="absolute top-2 right-2 md:top-3 md:right-3 bg-white/[0.03] backdrop-blur-xl border border-primary/20 p-1.5 md:p-2 rounded-full">
                                    <Star className="w-2.5 h-2.5 md:w-3 md:h-3 text-primary fill-primary" />
                                </button>
                                <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 flex gap-1">
                                    <span className={`${item.badgeColor} text-[8px] md:text-[9px] font-black px-1.5 py-0.5 rounded`}>
                                        {item.badge}
                                    </span>
                                </div>
                            </div>
                            <div className="px-0.5">
                                <p className="text-[9px] md:text-[10px] text-primary font-bold uppercase tracking-widest">{item.category}</p>
                                <h4 className="text-xs md:text-base font-bold text-white truncate mt-0.5">{item.name}</h4>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Category Sections */}
            <section className="mt-16 max-w-7xl mx-auto relative z-10 space-y-6">
                <h3 className="text-xl font-bold tracking-tight uppercase mb-2">CATEGORIAS</h3>

                {/* Times Brasileiros — usando Flamengo como imagem */}
                <Link to="/catalog" className="block relative w-full aspect-[21/9] rounded-2xl overflow-hidden group">
                    <img
                        alt="Times Brasileiros"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                        src={formatImageUrl('yupoo-1', 1)}
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-center">
                        <span className="text-primary font-black text-[10px] tracking-[0.3em] uppercase mb-1">🇧🇷 BRASIL</span>
                        <h4 className="text-2xl md:text-3xl font-black italic uppercase leading-none mb-1">TIMES<br />BRASILEIROS</h4>
                        <p className="text-xs text-gray-300 max-w-[200px]">Flamengo, São Paulo, Fluminense e mais.</p>
                    </div>
                </Link>

                {/* Times Estrangeiros — usando Real Madrid */}
                <Link to="/catalog" className="block relative w-full aspect-[21/9] rounded-2xl overflow-hidden group">
                    <img
                        alt="Times Estrangeiros"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                        src={formatImageUrl('yupoo-4490', 1)}
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-center">
                        <span className="text-primary font-black text-[10px] tracking-[0.3em] uppercase mb-1">🌍 EUROPA & MAIS</span>
                        <h4 className="text-2xl md:text-3xl font-black italic uppercase leading-none mb-1">TIMES<br />ESTRANGEIROS</h4>
                        <p className="text-xs text-gray-300 max-w-[200px]">Real Madrid, Barcelona, PSG e mais.</p>
                    </div>
                </Link>

                {/* Basketball — usando NBA Luka Doncic */}
                <Link to="/catalog" className="block relative w-full aspect-[21/9] rounded-2xl overflow-hidden group mb-12">
                    <img
                        alt="Basketball"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                        src={formatImageUrl('yupoo-2039', 1)}
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-center">
                        <span className="text-primary font-black text-[10px] tracking-[0.3em] uppercase mb-1">🏀 NBA</span>
                        <h4 className="text-2xl md:text-3xl font-black italic uppercase leading-none mb-1">BASKETBALL</h4>
                        <p className="text-xs text-gray-300 max-w-[200px]">Wizards, Lakers, Bulls e mais.</p>
                    </div>
                </Link>
            </section>

            {/* Modal: escolher vendedor */}
            {showVendorModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => setShowVendorModal(false)}
                    />
                    <div className="relative z-10 bg-[#141414] border border-primary/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 fade-in duration-200">
                        <h3 className="text-lg font-black uppercase tracking-wider text-white mb-1">Falar com Vendedor</h3>
                        <p className="text-sm text-gray-400 mb-6">Escolha com qual vendedor deseja falar:</p>
                        <div className="flex flex-col gap-3">
                            <a
                                href="https://wa.me/5583981109166"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 w-full py-4 px-5 bg-[#25D366] text-black font-black rounded-xl hover:brightness-105 transition-all"
                                onClick={() => setShowVendorModal(false)}
                            >
                                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Rafael
                            </a>
                            <a
                                href="https://wa.me/5583998168765"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 w-full py-4 px-5 bg-[#25D366] text-black font-black rounded-xl hover:brightness-105 transition-all"
                                onClick={() => setShowVendorModal(false)}
                            >
                                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                João Victor
                            </a>
                        </div>
                        <button
                            onClick={() => setShowVendorModal(false)}
                            className="mt-4 w-full py-3 text-sm text-gray-500 hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
