
import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer>
            <div className="footer-content">
                {/* Brand */}
                <div className="footer-brand">
                    <h3>AISLE</h3>
                    <p>Furniture that makes your house feel like home.</p>
                </div>

                {/* Shop */}
                <div className="footer-links">
                    <h4>Shop</h4>
                    <Link to="/products">Bestsellers</Link>
                    <Link to="/deals">Deals</Link>
                </div>

                {/* Help & Support */}
                <div className="footer-links">
                    <h4>Help & Support</h4>
                    <Link to="/about#contact">Contact Us</Link>
                    <Link to="/about#support">Submit a Request</Link>
                    <Link to="/about#support">Shipping & Delivery</Link>
                    <Link to="/about#support">Returns & Refunds</Link>
                </div>

                {/* About */}
                <div className="footer-links">
                    <h4>About AISLE</h4>
                    <Link to="about">Our Story</Link>
                    <Link to="about">Our Values</Link>
                </div>
            </div>

            <p className="copyright">
                © 2026 Aisle Home. All rights reserved.
            </p>
        </footer>
    );
}
