
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import {
    removeFromWishlist as removeFromWishlistAction
} from '../features/wishlist/wishlistSlice';

import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';

import '../styles/wishlist.css';

export default function WishlistPage() {
    const dispatch = useDispatch();

    const { addToCart } = useCart();

    // Get wishlist from Redux
    const wishlist = useSelector(
        (state) => state.wishlist?.wishlist || []
    );

    const wishlistCount = wishlist.length;

    // Remove a product from the wishlist
    const removeFromWishlist = (id) => {
        dispatch(removeFromWishlistAction(id));
    };

    // Add a wishlist product to the cart
    const addToCartFromWishlist = (id) => {
        const product = wishlist.find(
            (item) => item.id === id
        );

        if (!product) {
            return;
        }

        // Prevent adding out-of-stock products
        if (Number(product.stock ?? 1) <= 0) {
            return;
        }

        addToCart({
            ...product,
            quantity: 1
        });
    };

    return (
        <main className="wishlist-page">

            {/* WISHLIST HEADING */}
            <section className="wishlist-heading">
                <div>
                    <span className="eyebrow">
                        YOUR SAVED PIECES
                    </span>

                    <h1>My Wishlist</h1>

                    <p id="itemCount">
                        {wishlistCount}{' '}
                        {wishlistCount === 1 ? 'item' : 'items'}
                    </p>
                </div>

                <Link
                    to="/products"
                    className="continue-shopping"
                >
                    Continue Shopping <span>→</span>
                </Link>
            </section>


            {/* WISHLIST PRODUCTS */}
            <section className="wishlist-section">

                {wishlist.length === 0 ? (

                    // EMPTY WISHLIST
                    <div
                        id="emptyWishlist"
                        className="empty-wishlist"
                    >
                        <div className="empty-heart">
                            ♡
                        </div>

                        <h2>Your wishlist is empty</h2>

                        <p>
                            Save your favourite furniture by clicking
                            the heart on a product.
                        </p>

                        <Link
                            to="/products"
                            className="shop-button"
                        >
                            Explore Furniture <span>→</span>
                        </Link>
                    </div>

                ) : (

                    // WISHLIST GRID
                    <div
                        id="wishlistGrid"
                        className="wishlist-grid"
                    >

                        {wishlist.map((product) => {

                            const outOfStock =
                                Number(product.stock ?? 1) <= 0;

                            return (
                                <article
                                    className="wishlist-card"
                                    key={product.id}
                                >

                                    {/* PRODUCT IMAGE */}
                                    <div className="wishlist-image">

                                        <img
                                            src={product.image}
                                            alt={product.name}
                                        />

                                        <button
                                            type="button"
                                            className="wishlist-heart"
                                            title="Remove from wishlist"
                                            aria-label={`Remove ${product.name} from wishlist`}
                                            onClick={() =>
                                                removeFromWishlist(product.id)
                                            }
                                        >
                                            ♥
                                        </button>

                                    </div>


                                    {/* PRODUCT DETAILS */}
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


                                        {/* PRICE */}
                                        <div className="wishlist-price-row">

                                            <span className="wishlist-price">
                                                {formatPrice(product.price)}
                                            </span>

                                        </div>


                                        {/* STOCK STATUS */}
                                        <div
                                            className={`wishlist-stock ${
                                                outOfStock ? 'out' : ''
                                            }`}
                                        >
                                            {outOfStock
                                                ? 'Out of Stock'
                                                : 'In Stock'}
                                        </div>


                                        {/* ACTION BUTTONS */}
                                        <div className="wishlist-actions">

                                            <button
                                                type="button"
                                                className="add-cart-button"
                                                onClick={() =>
                                                    addToCartFromWishlist(
                                                        product.id
                                                    )
                                                }
                                                disabled={outOfStock}
                                            >
                                                {outOfStock
                                                    ? 'Out of Stock'
                                                    : 'Add to Cart'}
                                            </button>


                                            <button
                                                type="button"
                                                className="remove-wishlist-button"
                                                onClick={() =>
                                                    removeFromWishlist(
                                                        product.id
                                                    )
                                                }
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
