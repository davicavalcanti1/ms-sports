import { ShoppingBag, Home, ShoppingCart } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
    const { cartCount } = useCart();

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-primary' : 'text-gray-400 hover:text-white'}`;

    return (
        <nav className="bg-[#0a0a0a]/90 backdrop-blur-md border-b border-primary/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 sm:h-28">

                    {/* Logo */}
                    <Link to="/" className="flex items-center flex-shrink-0">
                        <img src="/logosemfundo.png" alt="MS Sports Logo" className="h-14 sm:h-24 w-auto object-contain" />
                    </Link>

                    {/* Links — sempre visíveis, em todos os tamanhos */}
                    <div className="flex items-center gap-1 sm:gap-6">
                        {/* Desktop: texto */}
                        <NavLink to="/" className={({ isActive }) =>
                            `hidden sm:block px-3 py-2 text-sm font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-primary' : 'text-gray-300 hover:text-primary'}`
                        }>
                            Home
                        </NavLink>
                        <NavLink to="/catalog" className={({ isActive }) =>
                            `hidden sm:block px-3 py-2 text-sm font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-primary' : 'text-gray-300 hover:text-primary'}`
                        }>
                            Shop
                        </NavLink>

                        {/* Mobile: ícones + label */}
                        <NavLink to="/" end className={linkClass}>
                            <Home className="sm:hidden w-5 h-5" />
                            <span className="sm:hidden">Home</span>
                        </NavLink>
                        <NavLink to="/catalog" className={linkClass}>
                            <ShoppingCart className="sm:hidden w-5 h-5" />
                            <span className="sm:hidden">Shop</span>
                        </NavLink>

                        {/* Carrinho — sempre visível */}
                        <Link to="/cart" className="relative flex flex-col items-center gap-0.5 p-2 text-gray-400 hover:text-white transition-colors">
                            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                            <span className="sm:hidden text-[10px] font-bold uppercase tracking-widest">Carrinho</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 right-0 min-w-[17px] h-[17px] bg-primary text-secondary text-[9px] font-black rounded-full flex items-center justify-center px-1 border-2 border-[#0a0a0a]">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
