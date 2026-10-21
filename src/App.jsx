import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import DealsPage from './pages/DealsPage';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AccountPage from './pages/AccountPage';

function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const id = hash.replace('#', '');
            const elem = document.getElementById(id);
            if (elem) {
                elem.scrollIntoView({ behavior: 'smooth' });
                return;
            }
        }
        window.scrollTo(0, 0);
    }, [pathname, hash]);

    return null;
}

function MainLayout({ children }) {
    return (
        <div className="site-wrapper">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}

export default function App() {
    return (
        <ToastProvider>
            <CartProvider>
                <WishlistProvider>
                    <AuthProvider>
                        <BrowserRouter>
                            <ScrollToTop />
                            <Routes>
                                {/* Auth pages with custom minimal header */}
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/signup" element={<SignupPage />} />

                                {/* Standard pages with shared Navbar and Footer */}
                                <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
                                <Route path="/home" element={<MainLayout><HomePage /></MainLayout>} />
                                <Route path="/products" element={<MainLayout><ProductsPage /></MainLayout>} />
                                <Route path="/categories" element={<MainLayout><HomePage /></MainLayout>} />
                                <Route path="/deals" element={<MainLayout><DealsPage /></MainLayout>} />
                                <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
                                <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
                                <Route path="/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />
                                <Route path="/wishlist" element={<MainLayout><WishlistPage /></MainLayout>} />
                                <Route path="/account" element={<MainLayout><AccountPage /></MainLayout>} />

                                {/* Fallback route */}
                                <Route path="*" element={<MainLayout><HomePage /></MainLayout>} />
                            </Routes>
                        </BrowserRouter>
                    </AuthProvider>
                </WishlistProvider>
            </CartProvider>
        </ToastProvider>
    );
}
