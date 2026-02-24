import { useNavigate } from 'react-router-dom';
import { ShoppingBag, X, CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartNotification() {
    const { notification, lastAddedProduct, dismissNotification } = useCart();
    const navigate = useNavigate();

    if (notification === 'none') return null;

    if (notification === 'toast') {
        return (
            <div className="fixed bottom-4 right-4 z-[9999] animate-in slide-in-from-bottom-4 fade-in duration-300">
                <div className="flex items-center gap-3 bg-[#1a1a1a] border border-primary/30 rounded-xl px-4 py-3 shadow-2xl">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-white">Produto adicionado ao carrinho</span>
                </div>
            </div>
        );
    }

    // modal — primeiro produto
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={dismissNotification}
            />

            {/* Modal */}
            <div className="relative z-10 bg-[#141414] border border-primary/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 fade-in duration-200">
                <button
                    onClick={dismissNotification}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-xs text-primary font-bold uppercase tracking-widest">Adicionado!</p>
                        <h3 className="text-base font-bold text-white leading-tight">
                            Produto adicionado ao carrinho
                        </h3>
                    </div>
                </div>

                {lastAddedProduct && (
                    <p className="text-sm text-gray-400 mb-6 truncate">
                        {lastAddedProduct.name}
                    </p>
                )}

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => {
                            dismissNotification();
                            navigate('/cart');
                        }}
                        className="w-full py-3 bg-primary text-black font-black rounded-xl hover:brightness-110 transition-all uppercase tracking-wider text-sm"
                    >
                        Finalizar Compra
                    </button>
                    <button
                        onClick={dismissNotification}
                        className="w-full py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all text-sm"
                    >
                        Continuar Comprando
                    </button>
                </div>
            </div>
        </div>
    );
}
