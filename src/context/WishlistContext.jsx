import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const { addToCart } = useCart();
    const { showToast } = useToast();

    const [wishlist, setWishlist] = useState(() => {
        try {
            const saved = localStorage.getItem('aisleWishlist');
            if (!saved) return [];
            const parsed = JSON.parse(saved);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error('Could not read wishlist:', e);
            return [];
        }
    });

    const saveWishlist = (newWishlist) => {
        setWishlist(newWishlist);
        localStorage.setItem('aisleWishlist', JSON.stringify(newWishlist));
    };

    const isWishlisted = (id) => {
        return wishlist.some(item => {
            if (typeof item === 'string') return item === id;
            return item && item.id === id;
        });
    };

    const toggleWishlist = (product) => {
        if (!product || !product.id) return;
        const existsIndex = wishlist.findIndex(item => {
            if (typeof item === 'string') return item === product.id;
            return item && item.id === product.id;
        });

        if (existsIndex > -1) {
            const updated = [...wishlist];
            updated.splice(existsIndex, 1);
            saveWishlist(updated);
            if (showToast) {
                showToast(`${product.name} removed from wishlist`);
            }
        } else {
            const itemToAdd = {
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.price,
                image: product.image,
                badge: product.badge || '',
                room: product.room || '',
                style: product.style || '',
                brand: product.brand || 'AISLE',
                stock: product.stock ?? 1
            };
            const updated = [...wishlist, itemToAdd];
            saveWishlist(updated);
            if (showToast) {
                showToast(`${product.name} added to wishlist ♡`);
            }
        }
    };

    const removeFromWishlist = (id) => {
        const item = wishlist.find(i => (typeof i === 'string' ? i === id : i?.id === id));
        const itemName = item?.name || 'Product';
        const updated = wishlist.filter(i => (typeof i === 'string' ? i !== id : i?.id !== id));
        saveWishlist(updated);
        if (showToast) {
            showToast(`${itemName} removed from wishlist`);
        }
    };

    const addToCartFromWishlist = (id) => {
        const product = wishlist.find(i => (typeof i === 'string' ? i === id : i?.id === id));
        if (!product) {
            if (showToast) showToast('Product not found.');
            return;
        }

        if (Number(product.stock ?? 1) <= 0) {
            if (showToast) showToast('This product is out of stock.');
            return;
        }

        addToCart({
            id: product.id,
            name: product.name || 'Furniture',
            category: product.category || 'Furniture',
            brand: product.brand || 'AISLE',
            price: Number(product.price) || 0,
            image: product.image || '',
            quantity: 1
        });
    };

    // Cross-tab sync
    useEffect(() => {
        const handleStorage = (event) => {
            if (event.key === 'aisleWishlist') {
                try {
                    const parsed = JSON.parse(event.newValue || '[]');
                    setWishlist(Array.isArray(parsed) ? parsed : []);
                } catch (e) {
                    setWishlist([]);
                }
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    return (
        <WishlistContext.Provider value={{
            wishlist,
            wishlistCount: wishlist.length,
            isWishlisted,
            toggleWishlist,
            removeFromWishlist,
            addToCartFromWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}
