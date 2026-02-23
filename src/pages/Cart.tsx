import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ArrowRight } from 'lucide-react';

export default function Cart() {
    const { cart, removeFromCart, cartTotal } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="text-center py-20 px-4">
                <h1 className="text-3xl font-bold mb-4">Seu Carrinho está Vazio</h1>
                <p className="text-gray-400 mb-8">Parece que você ainda não adicionou nenhum item.</p>
                <Link to="/catalog" className="inline-block px-8 py-3 bg-primary text-secondary font-bold rounded-full hover:bg-white transition-colors">
                    Continuar Comprando
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold tracking-tighter mb-8">Seu Carrinho</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    {cart.map((item) => (
                        <div key={item.cartId} className="flex gap-6 p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="w-24 h-32 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div className="flex-grow flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-bold">{item.name}</h3>
                                        <button
                                            onClick={() => removeFromCart(item.cartId)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-400">{item.category}</p>
                                    <p className="text-sm text-gray-400 mt-1">Tamanho: <span className="text-white font-medium">{item.size}</span></p>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-sm text-gray-400">Qtd: {item.quantity}</div>
                                    <div className="text-lg font-bold text-primary">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 sticky top-24">
                        <h2 className="text-xl font-bold mb-6">Resumo do Pedido</h2>
                        <div className="space-y-4 mb-6 text-sm text-gray-300">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Frete</span>
                                <span>A Combinar</span>
                            </div>
                            <div className="border-t border-white/10 pt-4 flex justify-between text-lg font-bold text-white">
                                <span>Total Previsto</span>
                                <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full py-4 bg-primary text-secondary font-bold rounded-full hover:bg-white transition-colors flex items-center justify-center gap-2"
                        >
                            Finalizar Compra <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
