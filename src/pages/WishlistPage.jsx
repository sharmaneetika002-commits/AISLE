import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatPrice } from '../data/products';
import '../styles/wishlist.css';

export default function WishlistPage() {
    const wishlist = useSelector(
    (state) => state.wishlist?.wishlist || []
    );

    const wishlistCount = wishlist.length;

    const removeFromWishlist = () => {
    console.log('Redux migration pending');
    };

    const addToCartFromWishlist = () => {
    console.log('Redux migration pending');
    };

    return (
        <main className="wishlist-page">
            <section className="wishlist-heading">
                <div>
                    <span className="eyebrow">YOUR SAVED PIECES</span>
                    <h1>My Wishlist</h1>
                    <p id="itemCount">
                        {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}
                    </p>
                </div>

                <Link to="/products" className="continue-shopping">
                    Continue Shopping <span>→</span>
                </Link>
            </section>

            <section className="wishlist-section">
                {wishlist.length === 0 ? (
                    <div id="emptyWishlist" className="empty-wishlist">
                        <div className="empty-heart">♡</div>
                        <h2>Your wishlist is empty</h2>
                        <p>
                            Save your favourite furniture by clicking
                            the heart on a product.
                        </p>
                        <Link to="/products" className="shop-button">
                            Explore Furniture <span>→</span>
                        </Link>
                    </div>
                ) : (
                    <div id="wishlistGrid" className="wishlist-grid">
                        {wishlist.map(product => {
                            const outOfStock = Number(product.stock ?? 1) <= 0;

                            return (
                                <article className="wishlist-card" key={product.id}>
                                    <div className="wishlist-image">
                                        <img src={product.image} alt={product.name} />
                                        <button
                                            type="button"
                                            className="wishlist-heart"
                                            title="Remove from wishlist"
                                            aria-label="Remove from wishlist"
                                            onClick={() => removeFromWishlist(product.id)}
                                        >
                                            ♥
                                        </button>
                                    </div>

                                    <div className="wishlist-details">
                                        <div className="wishlist-category">
                                            {product.category || 'Furniture'}
                                        </div>

                                        <h2 className="wishlist-name">
                                            {product.name || 'Furniture'}
                                        </h2>

                                        <p className="wishlist-brand">
                                            {product.brand || 'AISLE'}
                                        </p>

                                        <div className="wishlist-price-row">
                                            <span className="wishlist-price">
                                                {formatPrice(product.price)}
                                            </span>
                                        </div>

                                        <div className={`wishlist-stock ${outOfStock ? 'out' : ''}`}>
                                            {outOfStock ? 'Out of Stock' : 'In Stock'}
                                        </div>

                                        <div className="wishlist-actions">
                                            <button
                                                type="button"
                                                className="add-cart-button"
                                                onClick={() => addToCartFromWishlist(product.id)}
                                                disabled={outOfStock}
                                            >
                                                {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                                            </button>

                                            <button
                                                type="button"
                                                className="remove-wishlist-button"
                                                onClick={() => removeFromWishlist(product.id)}
                                            >
                                                Remove from Wishlist
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}
