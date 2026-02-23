import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Product } from '../data/products';

export interface CartItem extends Product {
    cartId: string;
    size: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, size: string) => void;
    removeFromCart: (cartId: string) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('@mssports/cart');
        if (savedCart) {
            try {
                return JSON.parse(savedCart);
            } catch (error) {
                console.error("Failed to parse cart from localStorage", error);
            }
        }
        return [];
    });

    // Save to localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem('@mssports/cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: Product, size: string) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id && item.size === size);
            if (existing) {
                return prev.map((item) =>
                    item.cartId === existing.cartId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, cartId: `${product.id}-${size}-${Date.now()}`, size, quantity: 1 }];
        });
    };

    const removeFromCart = (cartId: string) => {
        setCart((prev) => prev.filter((item) => item.cartId !== cartId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
