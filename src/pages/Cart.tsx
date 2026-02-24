import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ArrowRight, MapPin, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

type FreightState = 'idle' | 'loading' | 'free' | 'paid' | 'error';

function calcShipping(cep: string): number | 'free' {
    const digits = cep.replace(/\D/g, '');
    // CEPs de Campina Grande: 581xx xxx
    if (digits.startsWith('581')) return 'free';

    const num = parseInt(digits, 10);
    // Nordeste: 40000-000 a 69999-999
    if (num >= 40000000 && num <= 69999999) return 15;
    // Sul, Sudeste, Centro-Oeste
    if ((num >= 1000000 && num <= 39999999) || (num >= 70000000 && num <= 99999999)) return 20;
    return 25;
}

export default function Cart() {
    const { cart, removeFromCart, cartTotal } = useCart();
    const navigate = useNavigate();

    const [cep, setCep] = useState('');
    const [freightState, setFreightState] = useState<FreightState>('idle');
    const [freightValue, setFreightValue] = useState<number | 'free' | null>(null);
    const [freightCity, setFreightCity] = useState('');

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '').slice(0, 8);
        if (val.length > 5) val = val.slice(0, 5) + '-' + val.slice(5);
        setCep(val);
        setFreightState('idle');
        setFreightValue(null);
    };

    const handleCalcShipping = async () => {
        const digits = cep.replace(/\D/g, '');
        if (digits.length !== 8) return;

        setFreightState('loading');
        try {
            const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
            const data = await res.json();
            if (data.erro) {
                setFreightState('error');
                return;
            }
            setFreightCity(`${data.localidade} - ${data.uf}`);
            const result = calcShipping(digits);
            setFreightValue(result);
            setFreightState(result === 'free' ? 'free' : 'paid');
        } catch {
            setFreightState('error');
        }
    };

    const shippingCost = freightValue === 'free' ? 0 : (typeof freightValue === 'number' ? freightValue : null);
    const totalWithShipping = shippingCost !== null ? cartTotal + shippingCost : cartTotal;

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
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 sticky top-24 space-y-6">
                        <h2 className="text-xl font-bold">Resumo do Pedido</h2>

                        {/* CEP / Frete */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-300">
                                <MapPin className="w-4 h-4 text-primary" />
                                Calcular Frete
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="00000-000"
                                    value={cep}
                                    onChange={handleCepChange}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCalcShipping()}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-gray-600"
                                    maxLength={9}
                                />
                                <button
                                    onClick={handleCalcShipping}
                                    disabled={cep.replace(/\D/g, '').length !== 8 || freightState === 'loading'}
                                    className="px-4 py-2 bg-primary text-black text-sm font-bold rounded-lg hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                                >
                                    {freightState === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'OK'}
                                </button>
                            </div>

                            {freightState === 'free' && (
                                <div className="flex items-center gap-2 text-green-400 text-sm">
                                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                    <span><span className="font-bold">Frete Grátis</span> para {freightCity}!</span>
                                </div>
                            )}
                            {freightState === 'paid' && typeof freightValue === 'number' && (
                                <div className="flex items-center gap-2 text-gray-300 text-sm">
                                    <CheckCircle className="w-4 h-4 flex-shrink-0 text-primary" />
                                    <span>Frete para {freightCity}: <span className="font-bold text-white">R$ {freightValue.toFixed(2).replace('.', ',')}</span></span>
                                </div>
                            )}
                            {freightState === 'error' && (
                                <div className="flex items-center gap-2 text-red-400 text-sm">
                                    <XCircle className="w-4 h-4 flex-shrink-0" />
                                    CEP não encontrado. Verifique e tente novamente.
                                </div>
                            )}
                        </div>

                        {/* Totais */}
                        <div className="space-y-4 text-sm text-gray-300">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Frete</span>
                                <span className={freightState === 'free' ? 'text-green-400 font-bold' : ''}>
                                    {freightState === 'free'
                                        ? 'Grátis'
                                        : freightState === 'paid' && typeof freightValue === 'number'
                                        ? `R$ ${freightValue.toFixed(2).replace('.', ',')}`
                                        : 'A Calcular'}
                                </span>
                            </div>
                            <div className="border-t border-white/10 pt-4 flex justify-between text-lg font-bold text-white">
                                <span>Total Previsto</span>
                                <span>R$ {totalWithShipping.toFixed(2).replace('.', ',')}</span>
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
