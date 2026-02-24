import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../data/products';
import type { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { buildWhatsappUrl } from '../lib/whatsapp';
import { ShoppingBag, ArrowLeft, Loader2, MessageCircle } from 'lucide-react';

export default function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const sizes = ['PP', 'P', 'M', 'G', 'GG', 'XGG'];

    const handleAddToCart = () => {
        if (product && selectedSize) {
            addToCart(product, selectedSize);
        }
    };

    const handleBuyNow = () => {
        if (!product || !selectedSize) return;
        const message = `Olá! Tenho interesse em comprar:\n\n*${product.name}*\nTamanho: ${selectedSize}\nPreço: R$ ${product.price.toFixed(2).replace('.', ',')}\n\nPoderia me ajudar?`;
        window.open(buildWhatsappUrl(message), '_blank');
    };

    // Filter available images (deduplicate and ensure valid)
    const displayImages = product?.images && product.images.length > 0
        ? [...new Set(product.images)]
        : product?.image ? [product.image] : [];

    useEffect(() => {
        const fetchProduct = async () => {
            if (id) {
                setLoading(true);
                const data = await getProductById(id);
                setProduct(data || null);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // Auto-advance carousel
    useEffect(() => {
        if (!isHovering && displayImages.length > 1) {
            const timer = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
            }, 3000); // 3 seconds per slide
            return () => clearInterval(timer);
        }
    }, [isHovering, displayImages.length]);

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!product) {
        return <div className="text-center py-20 text-2xl text-gray-400">Produto não encontrado</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" /> Voltar para a Loja
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div
                        className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-800 group"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <img
                            src={displayImages[currentImageIndex]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500"
                            referrerPolicy="no-referrer"
                        />

                        {/* Navigation Arrows */}
                        {displayImages.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                                >
                                    <ArrowLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                                >
                                    <ArrowLeft className="w-6 h-6 rotate-180" />
                                </button>

                                {/* Dots Indicator */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {displayImages.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Thumbnail Grid */}
                    {displayImages.length > 1 && (
                        <div className="grid grid-cols-5 gap-4">
                            {displayImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`aspect-square rounded-lg bg-gray-800 overflow-hidden cursor-pointer ring-2 transition-all ${currentImageIndex === idx ? 'ring-primary' : 'ring-transparent hover:ring-white/20'}`}
                                >
                                    <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col justify-center">
                    <div className="mb-2 text-primary font-bold tracking-wider uppercase text-sm">{product.category}</div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">{product.name}</h1>
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-3xl font-bold">
                            {product.price > 0 ? `R$ ${product.price.toFixed(2)}` : 'Preço sob consulta'}
                        </span>

                        {/* Stock Status */}
                        {product.stock_status && product.stock_status !== 'in_stock' && (
                            <span className={`px-3 py-1 rounded text-sm font-bold uppercase ${product.stock_status === 'made_to_order' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'
                                }`}>
                                {product.stock_status === 'made_to_order' ? 'Sob Encomenda' : 'Sem Estoque'}
                            </span>
                        )}
                    </div>

                    <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                        {product.description || 'Sem descrição disponível.'}
                    </p>

                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <label className="font-bold text-gray-200">Selecione o Tamanho</label>
                            <button className="text-primary text-sm hover:underline">Guia de Tamanhos</button>
                        </div>
                        <div className="grid grid-cols-5 gap-4">
                            {sizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`py-3 rounded-lg font-bold transition-all ${selectedSize === size
                                        ? 'bg-primary text-secondary scale-105'
                                        : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleBuyNow}
                            className={`w-full py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-colors ${selectedSize
                                ? 'bg-[#25D366] text-white hover:bg-green-500'
                                : 'bg-[#25D366]/40 text-gray-400 cursor-not-allowed'
                                }`}
                            disabled={!selectedSize}
                        >
                            <MessageCircle className="w-5 h-5" />
                            {selectedSize ? 'Comprar Agora' : 'Selecione um Tamanho'}
                        </button>
                        <button
                            onClick={handleAddToCart}
                            className={`w-full py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-colors ${selectedSize
                                ? 'bg-white text-secondary hover:bg-gray-200'
                                : 'bg-white/50 text-gray-500 cursor-not-allowed'
                                }`}
                            disabled={!selectedSize}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {selectedSize ? 'Adicionar ao Carrinho' : 'Selecione um Tamanho'}
                        </button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/10 space-y-4 text-sm text-gray-400">
                        <div className="flex gap-4">
                            <span>Frete a combinar</span>
                            <span>•</span>
                            <span>Atendimento via WhatsApp</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
