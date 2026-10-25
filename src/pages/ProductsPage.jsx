import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { products, money, productDetails, demoReviews } from '../data/products';
import { useCart } from '../context/CartContext';
import { useSelector, useDispatch } from 'react-redux';
import { toggleWishlist as toggleWishlistAction } from '../features/wishlist/wishlistSlice';
import '../styles/products.css';

// Maps the availability text to a CSS modifier so the status can be colour-coded.
const getAvailabilityTone = (text = '') => {
    const value = text.toLowerCase();
    if (value.startsWith('in stock')) return 'in-stock';
    if (value.startsWith('limited')) return 'limited';
    if (value.startsWith('made to order')) return 'made-to-order';
    if (value.startsWith('currently unavailable')) return 'unavailable';
    return 'unknown';
};

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const { addToCart } = useCart();

    const dispatch = useDispatch();

    const wishlist = useSelector(
        (state) => state.wishlist?.wishlist || []
    );

    const isWishlisted = (id) => {
        return wishlist.some(item => item.id === id);
    };

    const toggleWishlist = (product) => {
        dispatch(toggleWishlistAction(product));
    };


    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedRooms, setSelectedRooms] = useState(() => {
        const roomParam = searchParams.get('room');
        return roomParam ? [roomParam] : [];
    });
    const [selectedStyles, setSelectedStyles] = useState([]);
    const [selectedPrice, setSelectedPrice] = useState('all');
    const [sortValue, setSortValue] = useState('featured');
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [reviewSort, setReviewSort] = useState('newest');
    const [reviewRatingFilter, setReviewRatingFilter] = useState('all');

    // Sync room from URL search params if it changes
    useEffect(() => {
        const roomParam = searchParams.get('room');
        if (roomParam) {
            setSelectedRooms([roomParam]);
        }
    }, [searchParams]);

    const handleCategoryChange = (val) => {
        setSelectedCategories(prev =>
            prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val]
        );
    };

    const handleRoomChange = (val) => {
        setSelectedRooms(prev =>
            prev.includes(val) ? prev.filter(r => r !== val) : [...prev, val]
        );
    };

    const handleStyleChange = (val) => {
        setSelectedStyles(prev =>
            prev.includes(val) ? prev.filter(s => s !== val) : [...prev, val]
        );
    };

    const handleReset = () => {
        setSelectedCategories([]);
        setSelectedRooms([]);
        setSelectedStyles([]);
        setSelectedPrice('all');
        setSortValue('featured');
        setSearchParams({});
    };

    const filteredProducts = useMemo(() => {
        let list = products.filter(product => {
            // Category match
            const normalizedCategory = (product.category || '')
                .toLowerCase()
                .trim()
                .replace('dining tables', 'dining')
                .replace('outdoor furniture', 'outdoor')
                .replace('sofas', 'sofa')
                .replace('beds', 'bed')
                .replace('chairs', 'chair')
                .replace('tables', 'table')
                .replace('lamps', 'lamp');

            const categoryMatch =
                selectedCategories.length === 0 ||
                selectedCategories.includes(normalizedCategory);

            // Room match
            const roomMatch =
                selectedRooms.length === 0 ||
                selectedRooms.includes(product.room);

            // Style match
            const styleMatch =
                selectedStyles.length === 0 ||
                selectedStyles.includes(product.style);

            // Price match
            let priceMatch = true;
            if (selectedPrice === 'under10') {
                priceMatch = product.price < 10000;
            } else if (selectedPrice === '10-25') {
                priceMatch = product.price >= 10000 && product.price <= 25000;
            } else if (selectedPrice === '25-50') {
                priceMatch = product.price > 25000 && product.price <= 50000;
            } else if (selectedPrice === 'above50') {
                priceMatch = product.price > 50000;
            }

            return categoryMatch && roomMatch && styleMatch && priceMatch;
        });

        // Sorting
        if (sortValue === 'price-asc') {
            list = [...list].sort((a, b) => a.price - b.price);
        } else if (sortValue === 'price-desc') {
            list = [...list].sort((a, b) => b.price - a.price);
        } else if (sortValue === 'name-asc') {
            list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        }

        return list;
    }, [selectedCategories, selectedRooms, selectedStyles, selectedPrice, sortValue]);

    const quickViewAllReviews = useMemo(
        () => quickViewProduct
            ? (demoReviews[quickViewProduct.id] || [])
            : [],
        [quickViewProduct]
    );

    const quickViewReviews = useMemo(() => {
        let reviews = [...quickViewAllReviews];

        if (reviewRatingFilter !== 'all') {
            reviews = reviews.filter(
                review => review.rating === Number(reviewRatingFilter)
            );
        }

        if (reviewSort === 'newest') {
            reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (reviewSort === 'oldest') {
            reviews.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (reviewSort === 'rating-high') {
            reviews.sort((a, b) => b.rating - a.rating);
        } else if (reviewSort === 'rating-low') {
            reviews.sort((a, b) => a.rating - b.rating);
        }

        return reviews;
    }, [quickViewAllReviews, reviewRatingFilter, reviewSort]);

    const quickViewAverageRating = quickViewAllReviews.length
        ? (
            quickViewAllReviews.reduce(
                (total, review) => total + review.rating,
                0
            ) / quickViewAllReviews.length
        ).toFixed(1)
        : null;

    // Details for the product currently open in Quick View (not a hook, safe before return)
    const quickViewDetails = quickViewProduct
        ? productDetails[quickViewProduct.id]
        : null;

    return (
        <main>
            {/* PAGE INTRO */}
            <section className="page-intro">
                <span className="eyebrow">THE FULL CATALOGUE</span>
                <h1>All furniture</h1>
                <p>
                    Every piece we make, in one place. Filter by category, room,
                    style or budget to find exactly what your space needs.
                </p>
            </section>

            {/* PRODUCTS */}
            <section className="products" id="products">
                <div className="products-header">
                    <div>
                        <span className="eyebrow">FULL CATALOGUE</span>
                        <h2>Shop all products</h2>
                        <p id="resultText">
                            Showing {filteredProducts.length} of {products.length} products
                        </p>
                    </div>

                    <div className="products-header-actions">
                        <div className="sort-wrap">
                            <label htmlFor="sortSelect">Sort by</label>
                            <select
                                id="sortSelect"
                                className="sort-select"
                                value={sortValue}
                                onChange={(e) => setSortValue(e.target.value)}
                            >
                                <option value="featured">Featured</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="name-asc">Name: A-Z</option>
                            </select>
                        </div>

                        <button id="reset" className="reset" onClick={handleReset}>
                            Reset filters
                        </button>
                    </div>
                </div>

                <div className="product-layout">
                    {/* SIDEBAR FILTERS */}
                    <aside className="filters">
                        <div className="filter-title">
                            <h3>Filter</h3>
                        </div>

                        <div className="filter-group">
                            <h4>Category</h4>
                            <label>
                                <input
                                    type="checkbox"
                                    value="sofa"
                                    className="cat-filter"
                                    checked={selectedCategories.includes('sofa')}
                                    onChange={() => handleCategoryChange('sofa')}
                                /> Sofas
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    value="bed"
                                    className="cat-filter"
                                    checked={selectedCategories.includes('bed')}
                                    onChange={() => handleCategoryChange('bed')}
                                /> Beds
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    value="chair"
                                    className="cat-filter"
                                    checked={selectedCategories.includes('chair')}
                                    onChange={() => handleCategoryChange('chair')}
                                /> Chairs
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    value="table"
                                    className="cat-filter"
                                    checked={selectedCategories.includes('table')}
                                    onChange={() => handleCategoryChange('table')}
                                /> Tables
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    value="dining"
                                    className="cat-filter"
                                    checked={selectedCategories.includes('dining')}
                                    onChange={() => handleCategoryChange('dining')}
                                /> Dining Tables
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    value="lamp"
                                    className="cat-filter"
                                    checked={selectedCategories.includes('lamp')}
                                    onChange={() => handleCategoryChange('lamp')}
                                /> Lamps
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    value="storage"
                                    className="cat-filter"
                                    checked={selectedCategories.includes('storage')}
                                    onChange={() => handleCategoryChange('storage')}
                                /> Storage
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    value="outdoor"
                                    className="cat-filter"
                                    checked={selectedCategories.includes('outdoor')}
                                    onChange={() => handleCategoryChange('outdoor')}
                                /> Outdoor Furniture
                            </label>
                        </div>

                        <div className="filter-group">
                            <h4>Room</h4>
                            <label>
                                <input
                                    type="checkbox"
                                    value="living"
                                    className="room-filter"
                                    checked={selectedRooms.includes('living')}
                                    onChange={() => handleRoomChange('living')}
                                /> Living Room
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    value="bedroom"
                                    className="room-filter"
                                    checked={selectedRooms.includes('bedroom')}
                                    onChange={() => handleRoomChange('bedroom')}
                                /> Bedroom
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    value="dining"
                                    className="room-filter"
                                    checked={selectedRooms.includes('dining')}
                                    onChange={() => handleRoomChange('dining')}
                                /> Dining
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    value="study"
                                    className="room-filter"
                                    checked={selectedRooms.includes('study')}
                                    onChange={() => handleRoomChange('study')}
                                /> Study
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    value="outdoor"
                                    className="room-filter"
                                    checked={selectedRooms.includes('outdoor')}
                                    onChange={() => handleRoomChange('outdoor')}
                                /> Outdoor
                            </label>
                        </div>

                        <div className="filter-group">
                            <h4>Style</h4>
                            <label>
                                <input
                                    type="checkbox"
                                    value="minimalist"
                                    className="style-filter"
                                    checked={selectedStyles.includes('minimalist')}
                                    onChange={() => handleStyleChange('minimalist')}
                                /> Minimalist
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    value="modern"
                                    className="style-filter"
                                    checked={selectedStyles.includes('modern')}
                                    onChange={() => handleStyleChange('modern')}
                                /> Modern
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    value="scandinavian"
                                    className="style-filter"
                                    checked={selectedStyles.includes('scandinavian')}
                                    onChange={() => handleStyleChange('scandinavian')}
                                /> Scandinavian
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    value="boho"
                                    className="style-filter"
                                    checked={selectedStyles.includes('boho')}
                                    onChange={() => handleStyleChange('boho')}
                                /> Boho
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    value="industrial"
                                    className="style-filter"
                                    checked={selectedStyles.includes('industrial')}
                                    onChange={() => handleStyleChange('industrial')}
                                /> Industrial
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    value="traditional"
                                    className="style-filter"
                                    checked={selectedStyles.includes('traditional')}
                                    onChange={() => handleStyleChange('traditional')}
                                /> Traditional
                            </label>
                        </div>

                        <div className="filter-group">
                            <h4>Price</h4>
                            <label>
                                <input
                                    type="radio"
                                    name="price"
                                    value="all"
                                    className="price-filter"
                                    checked={selectedPrice === 'all'}
                                    onChange={() => setSelectedPrice('all')}
                                /> All Prices
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="price"
                                    value="under10"
                                    className="price-filter"
                                    checked={selectedPrice === 'under10'}
                                    onChange={() => setSelectedPrice('under10')}
                                /> Under &#8377;10,000
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="price"
                                    value="10-25"
                                    className="price-filter"
                                    checked={selectedPrice === '10-25'}
                                    onChange={() => setSelectedPrice('10-25')}
                                /> &#8377;10,000 &ndash; &#8377;25,000
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="price"
                                    value="25-50"
                                    className="price-filter"
                                    checked={selectedPrice === '25-50'}
                                    onChange={() => setSelectedPrice('25-50')}
                                /> &#8377;25,000 &ndash; &#8377;50,000
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="price"
                                    value="above50"
                                    className="price-filter"
                                    checked={selectedPrice === 'above50'}
                                    onChange={() => setSelectedPrice('above50')}
                                /> Above &#8377;50,000
                            </label>
                        </div>
                    </aside>

                    {/* PRODUCT GRID */}
                    <div className="product-grid-wrap">
                        {filteredProducts.length === 0 ? (
                            <div className="empty-state" id="emptyState">
                                <h3>No products found</h3>
                                <p>Try adjusting your filters.</p>
                            </div>
                        ) : (
                            <div className="product-grid" id="productGrid">
                                {filteredProducts.map(product => {
                                    const selected = isWishlisted(product.id);
                                    return (
                                        <article className="product-card" key={product.id}>
                                            <div
                                                className="image-wrap"
                                                onClick={() => setQuickViewProduct(product)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <img
                                                    className="product-img"
                                                    src={product.image}
                                                    alt={product.name}
                                                    loading="lazy"
                                                />
                                                {product.badge && (
                                                    <span className="product-badge">
                                                        {product.badge}
                                                    </span>
                                                )}
                                                <button
                                                    type="button"
                                                    className={`wish ${selected ? 'selected' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleWishlist(product);
                                                    }}
                                                    aria-label={`${selected ? 'Remove' : 'Add'} ${product.name} ${selected ? 'from' : 'to'} wishlist`}
                                                >
                                                    {selected ? '♥' : '♡'}
                                                </button>
                                            </div>

                                            <div className="product-info">
                                                <h2 className="product-name">{product.name}</h2>
                                                <p className="category">{product.category}</p>
                                                <p className="price">{money(product.price)}</p>
                                                {(() => {
                                                    const cardReviews = demoReviews[product.id] || [];
                                                    const cardRating = cardReviews.length
                                                        ? (
                                                            cardReviews.reduce(
                                                                (total, review) => total + review.rating,
                                                                0
                                                            ) / cardReviews.length
                                                        ).toFixed(1)
                                                        : null;

                                                    return (
                                                        <p className="product-rating">
                                                            {cardRating
                                                                ? `★ ${cardRating} (${cardReviews.length} sample reviews)`
                                                                : 'No reviews yet'}
                                                        </p>
                                                    );
                                                })()}

                                                <div className="card-buttons">
                                                    <button
                                                        type="button"
                                                        className="add-btn"
                                                        onClick={() => addToCart(product)}
                                                    >
                                                        Add to Cart
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="view-btn"
                                                        onClick={() => toggleWishlist(product)}
                                                    >
                                                        {selected ? '♥ Saved' : '♡ Wishlist'}
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* BOTTOM CTA */}
            <section className="final-cta">
                <span className="eyebrow">STILL LOOKING?</span>
                <h2>
                    Not sure where<br />
                    <i>to start?</i>
                </h2>
                <Link to="/#categories">
                    Let Aisle Smart Match find your fit &rarr;
                </Link>
            </section>

            {/* QUICK VIEW MODAL */}
            {quickViewProduct && (
                <div
                    className="quick-view-overlay"
                    id="quickView"
                    onClick={() => setQuickViewProduct(null)}
                >
                    <div
                        className="quick-view-panel"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="qvName"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="quick-view-close"
                            aria-label="Close quick view"
                            onClick={() => setQuickViewProduct(null)}
                        >
                            &times;
                        </button>

                        <div
                            className="quick-view-image"
                            style={{ '--qv-image': `url("${quickViewProduct.image}")` }}
                        >
                            <div className="quick-view-image-stage">
                                <img
                                    src={quickViewProduct.image}
                                    alt={quickViewProduct.name}
                                />
                            </div>
                        </div>

                        <div className="quick-view-info">
                            <span>{quickViewProduct.category}</span>

                            <h3 id="qvName">{quickViewProduct.name}</h3>

                            <p className="quick-view-style">
                                {quickViewProduct.style
                                    ? `Style: ${quickViewProduct.style.toUpperCase()}`
                                    : 'Style not specified'}
                            </p>

                            <strong>{money(quickViewProduct.price)}</strong>

                            {quickViewAverageRating ? (
                                <p className="quick-view-rating">
                                    ★ {quickViewAverageRating} / 5
                                    ({quickViewAllReviews.length} sample reviews)
                                </p>
                            ) : (
                                <p className="quick-view-rating">
                                    No reviews yet
                                </p>
                            )}

                            <section className="quick-view-details">
                                <h4>Product details</h4>

                                <p className="quick-view-description">
                                    {quickViewDetails?.description
                                        || `${quickViewProduct.name} is part of the Aisle furniture collection.`}
                                </p>

                                <dl className="quick-view-specs">
                                    <div>
                                        <dt>Material</dt>
                                        <dd>
                                            {quickViewDetails?.material
                                                || 'Not specified in product data'}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt>Dimensions</dt>
                                        <dd>
                                            {quickViewDetails?.dimensions
                                                || 'Not specified in product data'}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt>Availability</dt>
                                        <dd
                                            className={`availability availability-${getAvailabilityTone(
                                                quickViewDetails?.availability
                                            )}`}
                                        >
                                            {quickViewDetails?.availability
                                                || 'Please contact us to confirm availability'}
                                        </dd>
                                    </div>
                                </dl>
                            </section>

                            <div className="quick-view-actions">
                                <button
                                    type="button"
                                    className="add-btn"
                                    style={{ marginRight: '10px' }}
                                    onClick={() => addToCart(quickViewProduct)}
                                >
                                    Add to Cart
                                </button>

                                <button
                                    type="button"
                                    className="quick-view-heart"
                                    onClick={() => toggleWishlist(quickViewProduct)}
                                >
                                    {isWishlisted(quickViewProduct.id)
                                        ? '♥ Wishlisted'
                                        : '♡ Wishlist'}
                                </button>
                            </div>

                            <section className="quick-view-reviews">
                                <h4>Customer reviews</h4>

                                <p className="review-demo-note">
                                    Demo reviews for project presentation only.
                                    Reviewer names and review text are fictional and
                                    are not verified customer reviews.
                                </p>

                                {quickViewAllReviews.length > 0 ? (
                                    <>
                                        <div className="review-controls">
                                            <label>
                                                Sort by
                                                <select
                                                    value={reviewSort}
                                                    onChange={(e) => setReviewSort(e.target.value)}
                                                >
                                                    <option value="newest">Newest first</option>
                                                    <option value="oldest">Oldest first</option>
                                                    <option value="rating-high">Highest rating</option>
                                                    <option value="rating-low">Lowest rating</option>
                                                </select>
                                            </label>

                                            <label>
                                                Rating
                                                <select
                                                    value={reviewRatingFilter}
                                                    onChange={(e) => setReviewRatingFilter(e.target.value)}
                                                >
                                                    <option value="all">All ratings</option>
                                                    <option value="5">5 stars</option>
                                                    <option value="4">4 stars</option>
                                                    <option value="3">3 stars</option>
                                                    <option value="2">2 stars</option>
                                                    <option value="1">1 star</option>
                                                </select>
                                            </label>
                                        </div>

                                        {quickViewReviews.length > 0 ? (
                                            <div className="review-list">
                                                {quickViewReviews.map((review) => (
                                                    <article
                                                        className="review-item"
                                                        key={review.id}
                                                    >
                                                        <div className="review-item-heading">
                                                            <strong>{review.author}</strong>

                                                            <time dateTime={review.date}>
                                                                {new Date(`${review.date}T00:00:00`).toLocaleDateString(
                                                                    'en-IN',
                                                                    {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric'
                                                                    }
                                                                )}
                                                            </time>
                                                        </div>

                                                        <span
                                                            className="review-stars"
                                                            role="img"
                                                            aria-label={`${review.rating} out of 5 stars`}
                                                        >
                                                            {'★'.repeat(review.rating)}
                                                            {'☆'.repeat(5 - review.rating)}
                                                        </span>

                                                        {review.title && (
                                                            <h5 className="review-title">{review.title}</h5>
                                                        )}

                                                        <p>{review.text}</p>
                                                    </article>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="no-reviews">
                                                No demo reviews match this rating filter.
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <p className="no-reviews">
                                        No reviews have been added for this product yet.
                                    </p>
                                )}
                            </section>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}