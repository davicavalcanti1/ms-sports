import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { cartCount } = useCart();

    return (
        <nav className="bg-[#0a0a0a]/90 backdrop-blur-md border-b border-primary/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-28">

                    {/* Logo + links desktop */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <img src="/logosemfundo.png" alt="MS Sports Logo" className="h-24 w-auto object-contain" />
                        </Link>
                        <div className="hidden md:block ml-10">
                            <div className="flex items-baseline space-x-6">
                                <Link to="/" className="text-gray-300 hover:text-primary px-3 py-2 text-sm font-bold uppercase tracking-widest transition-colors">Home</Link>
                                <Link to="/catalog" className="text-gray-300 hover:text-primary px-3 py-2 text-sm font-bold uppercase tracking-widest transition-colors">Shop</Link>
                            </div>
                        </div>
                    </div>

                    {/* Carrinho — sempre visível em qualquer tamanho de tela */}
                    <div className="flex items-center gap-3">
                        <Link to="/cart" className="relative p-2 rounded-full hover:bg-white/5 text-white transition-colors">
                            <ShoppingBag className="h-6 w-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary text-secondary text-[10px] font-black rounded-full flex items-center justify-center px-1 border-2 border-[#0a0a0a]">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Botão hambúrguer — só mobile */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
                        >
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu mobile */}
            {isOpen && (
                <div className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-primary/10">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-white hover:text-primary text-sm font-bold uppercase tracking-widest border-b border-white/5">Home</Link>
                        <Link to="/catalog" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-white hover:text-primary text-sm font-bold uppercase tracking-widest">Shop</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
