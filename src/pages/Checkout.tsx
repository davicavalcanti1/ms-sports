import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buildWhatsappUrl } from '../lib/whatsapp';

export default function Checkout() {
    const { cart, cartTotal, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);

    // Form states
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        let message = `Olá, gostaria de finalizar meu pedido do MS Sports!\n\n*Resumo do Pedido:*\n`;
        cart.forEach(item => {
            message += `- ${item.quantity}x ${item.name} (Tam: ${item.size}) - R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n`;
        });

        message += `\n*Total Previsto:* R$ ${cartTotal.toFixed(2).replace('.', ',')}\n`;
        message += `\n*Dados de Entrega:*\nNome: ${firstName} ${lastName}\nEndereço: ${address}, ${city} - ${postalCode}\nEmail: ${email}`;

        const whatsappUrl = buildWhatsappUrl(message);

        setTimeout(() => {
            setIsProcessing(false);
            clearCart();
            window.open(whatsappUrl, '_blank');
            window.location.href = '/';
        }, 1000);
    };

    if (cart.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-400 mb-4">Seu carrinho está vazio.</p>
                <Link to="/catalog" className="text-primary hover:underline">Ir para a Loja</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-3xl font-bold tracking-tighter mb-8">Finalizar Compra</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Form */}
                <form onSubmit={handleCheckout} className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold mb-4">Dados de Entrega</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Nome" value={firstName} onChange={e => setFirstName(e.target.value)} required className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 w-full focus:border-primary focus:outline-none" />
                            <input type="text" placeholder="Sobrenome" value={lastName} onChange={e => setLastName(e.target.value)} required className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 w-full focus:border-primary focus:outline-none" />
                        </div>
                        <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required className="mt-4 bg-white/5 border border-white/10 rounded-lg px-4 py-3 w-full focus:border-primary focus:outline-none" />
                        <input type="text" placeholder="Endereço Completo" value={address} onChange={e => setAddress(e.target.value)} required className="mt-4 bg-white/5 border border-white/10 rounded-lg px-4 py-3 w-full focus:border-primary focus:outline-none" />
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <input type="text" placeholder="Cidade / Estado" value={city} onChange={e => setCity(e.target.value)} required className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 w-full focus:border-primary focus:outline-none" />
                            <input type="text" placeholder="CEP" value={postalCode} onChange={e => setPostalCode(e.target.value)} required className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 w-full focus:border-primary focus:outline-none" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-4 bg-[#25D366] text-white font-bold rounded-full hover:bg-green-500 transition-colors flex items-center justify-center gap-2 mt-8"
                    >
                        {isProcessing ? <Loader className="w-5 h-5 animate-spin" /> : `Finalizar no WhatsApp (R$ ${cartTotal.toFixed(2).replace('.', ',')})`}
                    </button>
                    <p className="text-xs text-center text-gray-500 mt-2">Você será redirecionado para o WhatsApp para concluir o pagamento.</p>
                </form>

                {/* Order Summary Preview */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 h-fit">
                    <h2 className="text-xl font-bold mb-6">Resumo do Pedido</h2>
                    <div className="space-y-4 max-h-[25rem] overflow-y-auto pr-2 custom-scrollbar">
                        {cart.map(item => (
                            <div key={item.cartId} className="flex gap-4">
                                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover bg-gray-800" />
                                <div>
                                    <div className="font-bold text-sm text-ellipsis overflow-hidden whitespace-nowrap max-w-[150px] sm:max-w-xs">{item.name}</div>
                                    <div className="text-xs text-gray-400">Tam: {item.size} | Qtd: {item.quantity}</div>
                                    <div className="text-sm font-bold text-primary">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-white/10 mt-6 pt-4 flex justify-between text-lg font-bold">
                        <span>Total Previsto</span>
                        <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
