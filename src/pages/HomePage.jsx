import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bestsellerProducts, newArrivalProducts, formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import '../styles/style.css';

export default function HomePage() {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isWishlisted, toggleWishlist } = useWishlist();

    const goToCategory = (category) => {
        const roomMap = {
            "living room": "living",
            "living": "living",
            "bedroom": "bedroom",
            "dining room": "dining",
            "dining": "dining",
            "home office": "study",
            "study": "study",
            "outdoor": "outdoor",
            "outdoor furniture": "outdoor",
            "storage": "storage"
        };
        const key = category.toLowerCase().trim();
        const room = roomMap[key] || key;
        navigate(`/products?room=${encodeURIComponent(room)}`);
    };

    return (
        <main>
            {/* HERO */}
            <section class="hero" id="home">
                <img src="/assets/hero-room.jpg" alt="Living room with furniture" />
                <div class="hero-text">
                    <p>Furniture for every room</p>
                    <h1>Make your space<br /><i>feel like home.</i></h1>
                    <p class="hero-description">
                        Simple and comfortable furniture for your home, office and everyday life.
                    </p>
                </div>
            </section>

            {/* CATEGORIES */}
            <section class="section" id="categories">
                <div class="section-title">
                    <p>Browse our collection</p>
                    <h2>Shop by Category</h2>
                </div>
                <div class="category-grid">
                    <div class="category-card" onClick={() => goToCategory('living')}>
                        <img src="/assets/category-living.jpg" alt="Living Room" />
                        <h3>Living Room</h3>
                        <p>Sofas, chairs and tables</p>
                    </div>
                    <div class="category-card" onClick={() => goToCategory('bedroom')}>
                        <img src="/assets/Bedroom-photo.png" alt="Bedroom" />
                        <h3>Bedroom</h3>
                        <p>Beds and bedside tables</p>
                    </div>
                    <div class="category-card" onClick={() => goToCategory('dining')}>
                        <img src="/assets/category-dining.jpg" alt="Dining Room" />
                        <h3>Dining Room</h3>
                        <p>Tables and dining chairs</p>
                    </div>
                    <div class="category-card" onClick={() => goToCategory('study')}>
                        <img src="/assets/home-office.png" alt="Home Office" />
                        <h3>Home Office</h3>
                        <p>Desks and chairs</p>
                    </div>
                    <div class="category-card" onClick={() => goToCategory('storage')}>
                        <img src="/assets/pantry-photo.png" alt="Storage" />
                        <h3>Storage</h3>
                        <p>Cabinets and shelves</p>
                    </div>
                    <div class="category-card" onClick={() => goToCategory('outdoor')}>
                        <img src="/assets/category-outdoor.jpg" alt="Outdoor" />
                        <h3>Outdoor</h3>
                        <p>Furniture for outside</p>
                    </div>
                </div>
                <div class="explore-more-wrap">
                    <Link to="/products" class="explore-more-btn">
                        Explore More
                        <span>→</span>
                    </Link>
                </div>
            </section>

            {/* BESTSELLERS */}
            <section class="section products" id="products">
                <div class="section-title product-heading">
                    <div>
                        <p>Our popular products</p>
                        <h2>Bestsellers</h2>
                    </div>
                </div>
                <div class="product-grid" id="productGrid">
                    {bestsellerProducts.map(product => {
                        const wishlisted = isWishlisted(product.id);
                        return (
                            <div key={product.id} class="product-card" data-product-id={product.id}>
                                <img src={product.image} alt={product.name} loading="lazy" />
                                <div class="product-info">
                                    <h3>{product.name}</h3>
                                    <p>{product.category}</p>
                                    <p class="price">{formatPrice(product.price)}</p>
                                    <div class="product-buttons">
                                        <button
                                            type="button"
                                            class="add-cart-button"
                                            onClick={() => addToCart(product)}
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            type="button"
                                            class={`wishlist-product-button ${wishlisted ? 'wishlisted' : ''}`}
                                            onClick={() => toggleWishlist(product)}
                                        >
                                            {wishlisted ? '♥ Wishlisted' : '♡ Wishlist'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* DEAL BANNER */}
            <section class="deal" id="deals">
                <img src="/assets/sale-room.jpg" alt="Furniture sale" />
                <div class="deal-text">
                    <p>Special Offer</p>
                    <h2>Refresh Your Space</h2>
                    <h3>Up to 30% off selected furniture</h3>
                    <Link to="/deals" class="button">Shop the Sale</Link>
                </div>
            </section>

            {/* NEW ARRIVALS */}
            <section class="section" id="new-arrivals">
                <div class="section-title">
                    <p>Just added</p>
                    <h2>New Arrivals</h2>
                </div>
                <div class="product-grid" id="newProductGrid">
                    {newArrivalProducts.map(product => {
                        const wishlisted = isWishlisted(product.id);
                        return (
                            <div key={product.id} class="product-card" data-product-id={product.id}>
                                <img src={product.image} alt={product.name} loading="lazy" />
                                <div class="product-info">
                                    <h3>{product.name}</h3>
                                    <p>{product.category}</p>
                                    <p class="price">{formatPrice(product.price)}</p>
                                    <div class="product-buttons">
                                        <button
                                            type="button"
                                            class="add-cart-button"
                                            onClick={() => addToCart(product)}
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            type="button"
                                            class={`wishlist-product-button ${wishlisted ? 'wishlisted' : ''}`}
                                            onClick={() => toggleWishlist(product)}
                                        >
                                            {wishlisted ? '♥ Wishlisted' : '♡ Wishlist'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ABOUT */}
            <section class="about" id="about">
                <img src="/assets/new-arrival.jpg" alt="Furniture at Aisle" />
                <div>
                    <p>About Aisle</p>
                    <h2>Furniture for the life you live.</h2>
                    <p>
                        We wanted to make furniture shopping a little easier. Aisle has simple, comfortable pieces that can fit into different kinds of homes.
                    </p>
                    <Link class="simple-button" to="/about">About Us</Link>
                </div>
            </section>
        </main>
    );
}
