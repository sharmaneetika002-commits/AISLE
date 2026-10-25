import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const cartCount = useSelector(
    (state) => state.cart?.cart?.length || 0
);
    const { isSignedIn, userName } = useAuth();

    const currentPath = location.pathname;

    const isActive = (path) => {
        if (path === '/' && currentPath === '/') return true;
        if (path !== '/' && currentPath.startsWith(path)) return true;
        return false;
    };

    const handleLinkClick = () => {
        setMobileMenuOpen(false);
    };

    const userInitial = (userName || '').trim().charAt(0).toUpperCase();

    return (
        <header className="site-header">
            <div id="site-navbar"></div>
            <div className="nav-container">
                <Link to="/" className="brand" onClick={handleLinkClick}>
                    <img src="/assets/aisle-logo.png" alt="Aisle" className="brand-logo" />
                    <span className="brand-text">AISLE</span>
                </Link>

                <button
                    className="nav-toggle"
                    id="navToggle"
                    aria-label="Open menu"
                    aria-expanded={mobileMenuOpen ? 'true' : 'false'}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <span></span><span></span><span></span>
                </button>

                <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`} id="navLinks">
                    <Link
                        to="/"
                        data-page="home"
                        className={isActive('/') ? 'active' : ''}
                        onClick={handleLinkClick}
                    >
                        Home
                    </Link>
                    <Link
                        to="/products"
                        data-page="products"
                        className={isActive('/products') ? 'active' : ''}
                        onClick={handleLinkClick}
                    >
                        Products
                    </Link>
                    <Link
                        to="/deals"
                        data-page="deals"
                        className={isActive('/deals') ? 'active' : ''}
                        onClick={handleLinkClick}
                    >
                        Deals
                    </Link>
                    <Link
                        to="/about"
                        data-page="about"
                        className={isActive('/about') ? 'active' : ''}
                        onClick={handleLinkClick}
                    >
                        About
                    </Link>
                </nav>

                <div className="nav-icons">
                    <Link
                        to="/wishlist"
                        className="icon-btn"
                        id="wishlistBtn"
                        aria-label="Wishlist"
                        onClick={handleLinkClick}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <path d="M12 20.3s-7.5-4.6-10-9.3C.4 7.6 2.3 4 6 4c2 0 3.6 1.1 4.6 2.6C11.6 5.1 13.2 4 15.2 4c3.7 0 5.6 3.6 4 7-2.5 4.7-10 9.3-10 9.3Z" />
                        </svg>
                    </Link>

                    <Link
                        to="/cart"
                        className="icon-btn"
                        id="cartBtn"
                        aria-label="Cart"
                        onClick={handleLinkClick}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.4a2 2 0 0 0 2-1.6L21 8H6" />
                            <circle cx="10" cy="21" r="1.3" />
                            <circle cx="17" cy="21" r="1.3" />
                        </svg>
                        <span className="badge" id="cartCount">{cartCount}</span>
                    </Link>

                    {isSignedIn && userInitial ? (
                        <Link
                            to="/account"
                            className="account-btn"
                            id="accountBtn"
                            aria-label={`Account: ${userName}`}
                            onClick={handleLinkClick}
                        >
                            <span id="accountInitial" className="account-initial">
                                {userInitial}
                            </span>
                        </Link>
                    ) : (
                        <Link
                            to="/signup"
                            className="account-btn"
                            id="accountBtn"
                            aria-label="Sign in"
                            onClick={handleLinkClick}
                        >
                            <svg id="accountIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                <circle cx="12" cy="8" r="3.6" />
                                <path d="M4.5 20c1.4-3.6 4.4-5.4 7.5-5.4s6.1 1.8 7.5 5.4" />
                            </svg>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
