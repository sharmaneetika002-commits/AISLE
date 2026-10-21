import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export function CartProvider({ children }) {
    const { showToast } = useToast();
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('aisleCart');
            if (!saved) return [];
            const parsed = JSON.parse(saved);
            if (!Array.isArray(parsed)) return [];
            return parsed.map(item => ({
                ...item,
                id: item.id || (item.name ? item.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : ''),
                quantity: Number(item.quantity ?? item.qty) || 1
            })).filter(item => item.id);
        } catch (e) {
            console.error('Could not read cart:', e);
            return [];
        }
    });

    const saveCart = (newCart) => {
        const cleaned = newCart.map(item => ({
            ...item,
            id: item.id || (item.name ? item.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : ''),
            quantity: Number(item.quantity ?? item.qty) || 1
        })).filter(item => item.id);
        
        setCart(cleaned);
        localStorage.setItem('aisleCart', JSON.stringify(cleaned));
        window.dispatchEvent(new Event('aisleCartUpdated'));
    };

    const addToCart = (product) => {
        if (!product || !product.id) return;
        setCart(prevCart => {
            const existingIndex = prevCart.findIndex(item => item.id === product.id);
            let updated;
            if (existingIndex > -1) {
                updated = [...prevCart];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: (Number(updated[existingIndex].quantity) || 1) + 1
                };
            } else {
                updated = [...prevCart, {
                    ...product,
                    quantity: Number(product.quantity) || 1
                }];
            }
            saveCart(updated);
            return updated;
        });

        if (showToast) {
            showToast(`${product.name} added to cart`);
        }
    };

    const removeFromCart = (id) => {
        setCart(prevCart => {
            const updated = prevCart.filter(item => item.id !== id);
            saveCart(updated);
            return updated;
        });
    };

    const changeQuantity = (id, amount) => {
        setCart(prevCart => {
            let updated = prevCart.map(item => {
                if (item.id === id) {
                    const newQty = (Number(item.quantity) || 0) + amount;
                    return { ...item, quantity: newQty };
                }
                return item;
            }).filter(item => item.quantity > 0);
            saveCart(updated);
            return updated;
        });
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('aisleCart');
        window.dispatchEvent(new Event('aisleCartUpdated'));
    };

    // Cross-tab sync
    useEffect(() => {
        const handleStorage = (event) => {
            if (event.key === 'aisleCart') {
                try {
                    const parsed = JSON.parse(event.newValue || '[]');
                    setCart(Array.isArray(parsed) ? parsed : []);
                } catch (e) {
                    setCart([]);
                }
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const cartCount = cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
    const subtotal = cart.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 0)), 0);
    const delivery = (subtotal === 0 || subtotal >= 20000) ? 0 : 499;
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + delivery + gst;

    const getDeliveryDate = () => {
        const start = new Date();
        start.setDate(start.getDate() + 5);
        const end = new Date();
        end.setDate(end.getDate() + 7);
        const options = { day: 'numeric', month: 'short' };
        return `${start.toLocaleDateString('en-IN', options)} – ${end.toLocaleDateString('en-IN', options)}`;
    };

    return (
        <CartContext.Provider value={{
            cart,
            cartCount,
            subtotal,
            delivery,
            gst,
            total,
            deliveryDate: getDeliveryDate(),
            addToCart,
            removeFromCart,
            changeQuantity,
            clearCart,
            saveCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
