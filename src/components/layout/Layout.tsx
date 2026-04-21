import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, X } from 'lucide-react';

function CartToasts() {
    const { toasts, dismissToast } = useCart();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-4 z-[100] flex flex-col gap-3 items-end">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className="flex items-center gap-3 bg-[#1a1a1a] border border-primary/30 rounded-xl shadow-2xl px-4 py-3 w-80 animate-in slide-in-from-right-4 fade-in duration-300"
                >
                    <img
                        src={toast.image}
                        alt={toast.productName}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-800 flex-shrink-0"
                        referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-primary font-bold uppercase tracking-wider flex items-center gap-1">
                            <ShoppingBag className="w-3 h-3" /> Adicionado ao carrinho
                        </p>
                        <p className="text-sm font-bold text-white truncate mt-0.5">{toast.productName}</p>
                        <p className="text-xs text-gray-400">Tamanho: {toast.size}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <button
                            onClick={() => dismissToast(toast.id)}
                            className="text-gray-500 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <Link
                            to="/cart"
                            onClick={() => dismissToast(toast.id)}
                            className="text-[10px] font-bold text-primary hover:underline whitespace-nowrap"
                        >
                            Ver carrinho →
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen text-white font-sans">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <Footer />
            <CartToasts />
        </div>
    );
}
