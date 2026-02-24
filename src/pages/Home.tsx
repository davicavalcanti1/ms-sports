import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatImageUrl } from '../data/products';
import { VENDORS, buildVendorUrl } from '../lib/whatsapp';
import stadiumImg from '../assets/stadium.jpg';

// Carrossel: um produto real de cada categoria, usando formatImageUrl (proxy nginx)
const CAROUSEL_ITEMS = [
    { id: 'yupoo-31',   label: 'Player Version',    tag: 'PLAYER',    tagColor: 'bg-primary text-black',        category: 'Soccer',     name: 'Flamenco Special Edition',       price: 'R$ 190,00' },
    { id: 'yupoo-2',    label: 'Versão Torcedor',   tag: 'TORCEDOR',  tagColor: 'bg-white/20 text-white',       category: 'Soccer',     name: 'Palmeiras Special Edition',      price: 'R$ 150,00' },
    { id: 'yupoo-67',   label: 'Feminino',          tag: 'WOMEN',     tagColor: 'bg-pink-500/80 text-white',    category: 'Feminino',   name: 'Cruzeiro Training Feminino',     price: 'R$ 150,00' },
    { id: 'yupoo-17',   label: 'Infantil',          tag: 'KIDS',      tagColor: 'bg-blue-400/80 text-white',    category: 'Infantil',   name: 'Tottenham III Kids',             price: 'R$ 180,00' },
    { id: 'yupoo-1710', label: 'Fórmula 1',         tag: 'F1',        tagColor: 'bg-red-600 text-white',        category: 'F1',         name: 'F1 Formula One 2025',            price: 'R$ 240,00' },
    { id: 'yupoo-2039', label: 'NBA',               tag: 'NBA',       tagColor: 'bg-red-600 text-white',        category: 'Basketball', name: 'NBA Luka Doncic Jersey',         price: 'R$ 240,00' },
    { id: 'yupoo-976',  label: 'Short Futebol',     tag: 'SHORT',     tagColor: 'bg-green-600 text-white',      category: 'Soccer',     name: 'Real Betis Home Shorts',         price: 'R$ 95,00'  },
    { id: 'yupoo-3971', label: 'Short NBA',         tag: 'NBA SHORT', tagColor: 'bg-orange-500 text-white',     category: 'Basketball', name: 'New York Knicks Shorts',         price: 'R$ 140,00' },
    { id: 'yupoo-210',  label: 'Kit',               tag: 'KIT',       tagColor: 'bg-yellow-500 text-black',     category: 'Kit',        name: 'Kit Brasil Training 2022',       price: 'R$ 280,00' },
    { id: 'yupoo-59',   label: 'Retrô',             tag: 'RETRÔ',     tagColor: 'bg-amber-700 text-white',      category: 'Retro',      name: 'Botafogo Retrô 1996',            price: 'R$ 190,00' },
    { id: 'yupoo-4',    label: 'Polo',              tag: 'POLO',      tagColor: 'bg-primary text-black',        category: 'Polo',       name: 'Cruzeiro POLO Jersey',           price: 'R$ 165,00' },
];

// Banners de categoria — usando imagens reais de produtos via proxy
const CATEGORY_BANNERS = [
    {
        to: '/catalog',
        productId: 'yupoo-31',
        emoji: '🇧🇷',
        subtitle: 'BRASIL',
        title: 'TIMES\nBRASILEIROS',
        desc: 'Flamengo, São Paulo, Fluminense e mais.',
    },
    {
        to: '/catalog',
        productId: 'yupoo-18',
        emoji: '🌍',
        subtitle: 'EUROPA & MAIS',
        title: 'TIMES\nESTRANGEIROS',
        desc: 'Real Madrid, Barcelona, PSG e mais.',
    },
    {
        to: '/catalog',
        productId: 'yupoo-2039',
        emoji: '🏀',
        subtitle: 'NBA',
        title: 'BASKETBALL',
        desc: 'Lakers, Bulls, Knicks e mais.',
    },
];

export default function Home() {
    return (
        <div className="space-y-0">
            {/* Hero Section — background inline garante que a imagem aparece independente do nginx */}
            <section
                className="relative w-full h-[75vh] flex flex-col justify-end overflow-hidden -mx-4 -mt-8 px-8 pb-10"
                style={{
                    backgroundImage: `url(${stadiumImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-[#0a0a0a]/55 pointer-events-none" />
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
                    <div className="pt-4 flex flex-col gap-3">
                        <a
                            href={buildVendorUrl(VENDORS.rafael, "Olá Rafael! Vim pelo site da MS Sports e gostaria de saber mais sobre os produtos.")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full bg-[#25D366] text-white font-black px-6 py-3.5 rounded-lg items-center justify-center gap-2 hover:bg-green-500 transition-all text-sm"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Falar com Rafael
                        </a>
                        <a
                            href={buildVendorUrl(VENDORS.joaoVictor, "Olá João Victor! Vim pelo site da MS Sports e gostaria de saber mais sobre os produtos.")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full bg-[#25D366] text-white font-black px-6 py-3.5 rounded-lg items-center justify-center gap-2 hover:bg-green-500 transition-all text-sm"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Falar com João Victor
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

            {/* Carrossel de categorias */}
            <section className="mt-12 max-w-7xl mx-auto relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold tracking-tight uppercase">DESTAQUES</h3>
                        <p className="text-[10px] text-primary font-bold tracking-widest mt-1 uppercase">Todas as categorias</p>
                    </div>
                    <Link to="/catalog" className="text-primary text-xs font-bold tracking-widest uppercase hover:underline">Ver Todas</Link>
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3">
                    {CAROUSEL_ITEMS.map((item) => (
                        <Link
                            key={item.id}
                            to={`/product/${item.id}`}
                            className="min-w-[90px] sm:min-w-[120px] bg-white/[0.03] border border-primary/20 rounded-lg p-1.5 flex flex-col gap-1 group flex-shrink-0"
                        >
                            <div className="relative aspect-[3/4] rounded-md bg-[#1a1d23] overflow-hidden">
                                <img
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    src={formatImageUrl(item.id, 1)}
                                    referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                <div className="absolute bottom-1 left-1">
                                    <span className={`${item.tagColor} text-[7px] font-black px-1 py-px rounded`}>{item.tag}</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-white truncate leading-tight">{item.name}</h4>
                                <p className="text-[10px] font-bold text-primary">{item.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Category Banners */}
            <section className="mt-16 max-w-7xl mx-auto relative z-10 space-y-6">
                <h3 className="text-xl font-bold tracking-tight uppercase mb-2">CATEGORIAS</h3>

                {CATEGORY_BANNERS.map((banner) => (
                    <Link
                        key={banner.productId}
                        to={banner.to}
                        className="block relative w-full aspect-[4/1] sm:aspect-[5/1] rounded-xl overflow-hidden group"
                    >
                        <img
                            alt={banner.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                            src={formatImageUrl(banner.productId, 1)}
                            referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/50 to-transparent"></div>
                        <div className="absolute inset-0 p-3 sm:p-5 flex flex-col justify-center">
                            <span className="text-primary font-black text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mb-0.5">
                                {banner.emoji} {banner.subtitle}
                            </span>
                            <h4 className="text-base sm:text-xl font-black italic uppercase leading-none whitespace-pre-line">
                                {banner.title}
                            </h4>
                            <p className="hidden sm:block text-[10px] text-gray-300 mt-1">{banner.desc}</p>
                        </div>
                    </Link>
                ))}
            </section>

            <div className="h-12" />
        </div>
    );
}
