import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer>
            <div className="footer-content">
                <div>
                    <h3>AISLE</h3>
                    <p>Furniture that makes your house feel like home.</p>
                </div>
                <div>
                    <h4>Shop</h4>
                    <Link to="/products">Bestsellers</Link>
                    <Link to="/deals">Deals</Link>
                </div>
                <div>
                    <h4>Help</h4>
                    <Link to="/about">Contact Us</Link>
                    <Link to="/about">Shipping</Link>
                    <Link to="/about">Returns</Link>
                </div>
            </div>
            <p className="copyright">© 2026 Aisle Home</p>
        </footer>
    );
}
