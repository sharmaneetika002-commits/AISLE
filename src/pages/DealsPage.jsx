
import React, { useState, useEffect, useMemo } from 'react';
import { deals } from '../data/deals';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import '../styles/deals.css';

// Calculate the discount from the actual prices
const getDiscount = (deal) => {
    if (!deal.oldPrice || deal.oldPrice <= 0) return 0;

    return Math.round(
        ((deal.oldPrice - deal.price) / deal.oldPrice) * 100
    );
};

// Initialize countdown values using the actual end date
const createCountdown = () => {
    const end = new Date();
    end.setDate(end.getDate() + 2);
    end.setHours(end.getHours() + 12);

    const difference = Math.max(0, end - new Date());

    return {
        endDate: end,
        days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0'),
        hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
        minutes: String(Math.floor((difference / (1000 * 60)) % 60)).padStart(2, '0'),
        seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, '0')
    };
};

export default function DealsPage() {
    const { addToCart } = useCart();
    const { isWishlisted, toggleWishlist } = useWishlist();

    const [addedMap, setAddedMap] = useState({});

    // Category filter
    const [selectedCategory, setSelectedCategory] = useState('All Deals');

    // Sorting
    const [sortBy, setSortBy] = useState('discount');

    // Countdown
    const [timeLeft, setTimeLeft] = useState(createCountdown);

    // Update countdown every second
    useEffect(() => {
        const timer = setInterval(() => {
            const difference = Math.max(
                0,
                timeLeft.endDate.getTime() - Date.now()
            );

            const days = Math.floor(
                difference / (1000 * 60 * 60 * 24)
            );

            const hours = Math.floor(
                (difference / (1000 * 60 * 60)) % 24
            );

            const minutes = Math.floor(
                (difference / (1000 * 60)) % 60
            );

            const seconds = Math.floor(
                (difference / 1000) % 60
            );

            setTimeLeft(prev => ({
                ...prev,
                days: String(days).padStart(2, '0'),
                hours: String(hours).padStart(2, '0'),
                minutes: String(minutes).padStart(2, '0'),
                seconds: String(seconds).padStart(2, '0')
            }));

            if (difference <= 0) {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft.endDate]);

    // Shop deal / Add to cart
    const handleShopDeal = (deal) => {
        addToCart({
            id: deal.id,
            name: deal.name,
            category: deal.category,
            price: deal.price,
            image: deal.image,
            quantity: 1
        });

        setAddedMap(prev => ({
            ...prev,
            [deal.id]: true
        }));

        setTimeout(() => {
            setAddedMap(prev => ({
                ...prev,
                [deal.id]: false
            }));
        }, 1200);
    };

    // Available categories
    const categories = [
        'All Deals',
        'Living Room',
        'Bedroom',
        'Dining',
        'Storage'
    ];

    // Filter and sort products
    const filteredDeals = useMemo(() => {
        let result = [...deals];

        // Filter by category
        if (selectedCategory !== 'All Deals') {
            result = result.filter(
                deal =>
                    deal.category?.toLowerCase() ===
                    selectedCategory.toLowerCase()
            );
        }

        // Sort products
        switch (sortBy) {
            case 'discount':
                result.sort(
                    (a, b) => getDiscount(b) - getDiscount(a)
                );
                break;

            case 'priceLow':
                result.sort((a, b) => a.price - b.price);
                break;

            case 'priceHigh':
                result.sort((a, b) => b.price - a.price);
                break;

            case 'rating':
                result.sort(
                    (a, b) => (b.rating || 0) - (a.rating || 0)
                );
                break;

            default:
                break;
        }

        return result;
    }, [selectedCategory, sortBy]);

    // Top 3 deals with the highest discounts
    const bestDeals = useMemo(() => {
        return [...deals]
            .sort((a, b) => getDiscount(b) - getDiscount(a))
            .slice(0, 3);
    }, []);

    return (
        <div className="deals-page">

            {/* HERO */}
            <section className="deals-hero">
                <div className="hero-overlay"></div>

                <div className="hero-content">
                    <p className="eyebrow">LIMITED TIME OFFERS</p>

                    <h1>
                        Beautiful pieces.<br />
                        <em>Better prices.</em>
                    </h1>

                    <p className="hero-description">
                        Discover thoughtful furniture and timeless designs,
                        now available at special prices.
                    </p>

                    <a href="#deals" className="hero-button">
                        Shop the deals
                        <i className="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </section>


            {/* OFFER STRIP */}
            <section className="offer-strip">
                <div className="offer-item">
                    <i className="fa-solid fa-tag"></i>

                    <div>
                        <strong>Up to 50% off</strong>
                        <span>Selected furniture</span>
                    </div>
                </div>

                <div className="offer-divider"></div>

                <div className="offer-item">
                    <i className="fa-solid fa-truck"></i>

                    <div>
                        <strong>Free delivery</strong>
                        <span>On orders over ₹10,000</span>
                    </div>
                </div>

                <div className="offer-divider"></div>

                <div className="offer-item">
                    <i className="fa-solid fa-shield-heart"></i>

                    <div>
                        <strong>Quality guaranteed</strong>
                        <span>Made for everyday living</span>
                    </div>
                </div>
            </section>


            {/* BEST DEALS */}
            <section className="best-deals-section">
                <div className="section-heading">
                    <div>
                        <p className="eyebrow">THE BEST OF THE SALE</p>

                        <h2>
                            Deals worth <em>discovering.</em>
                        </h2>
                    </div>

                    <p className="section-description">
                        Our biggest discounts, handpicked for you.
                    </p>
                </div>

                <div className="best-deals-grid">
                    {bestDeals.map(deal => (
                        <article
                            className="best-deal-card"
                            key={deal.id}
                        >
                            <div className="best-deal-image">
                                <img
                                    src={deal.image}
                                    alt={deal.name}
                                />

                                <span className="discount">
                                    {getDiscount(deal)}% OFF
                                </span>
                            </div>

                            <div className="best-deal-info">
                                <p className="category">
                                    {deal.category}
                                </p>

                                <h3>{deal.name}</h3>

                                <div className="price">
                                    <span className="sale-price">
                                        ₹{deal.price.toLocaleString('en-IN')}
                                    </span>

                                    <span className="old-price">
                                        ₹{deal.oldPrice.toLocaleString('en-IN')}
                                    </span>
                                </div>

                                <a
                                    href="#deals"
                                    className="best-deal-link"
                                >
                                    Explore deal
                                    <i className="fa-solid fa-arrow-right"></i>
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </section>


            {/* DEALS PRODUCTS */}
            <section className="deals-section" id="deals">

                <div className="section-heading">
                    <div>
                        <p className="eyebrow">SHOP OUR OFFERS</p>

                        <h2>
                            Deals worth <em>staying home for.</em>
                        </h2>
                    </div>

                    <p className="section-description">
                        Refresh your space without compromising on style.
                        Explore our handpicked furniture deals before
                        they're gone.
                    </p>
                </div>


                {/* CATEGORY FILTERS */}
                <div className="deals-toolbar">

                    <div className="category-filters">
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`category-filter ${
                                    selectedCategory === category
                                        ? 'active'
                                        : ''
                                }`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>


                    {/* SORT DROPDOWN */}
                    <div className="deals-sort">
                        <label htmlFor="deal-sort">
                            Sort by
                        </label>

                        <select
                            id="deal-sort"
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                        >
                            <option value="discount">
                                Biggest Discount
                            </option>

                            <option value="priceLow">
                                Price: Low to High
                            </option>

                            <option value="priceHigh">
                                Price: High to Low
                            </option>

                            
                        </select>
                    </div>
                </div>


                {/* PRODUCT GRID */}
                {filteredDeals.length > 0 ? (
                    <div className="products-grid">

                        {filteredDeals.map(deal => {
                            const wishlisted = isWishlisted(deal.id);
                            const isAdded = addedMap[deal.id];

                            return (
                                <article
                                    className="product-card"
                                    key={deal.id}
                                >

                                    <div className="product-image">

                                        <img
                                            src={deal.image}
                                            alt={deal.name}
                                        />

                                        <span className="discount">
                                            {getDiscount(deal)}% OFF
                                        </span>

                                        <button
                                            className={`wishlist ${
                                                wishlisted ? 'active' : ''
                                            }`}
                                            onClick={() =>
                                                toggleWishlist(deal)
                                            }
                                            aria-label={
                                                wishlisted
                                                    ? 'Remove from wishlist'
                                                    : 'Add to wishlist'
                                            }
                                        >
                                            <i
                                                className={
                                                    wishlisted
                                                        ? 'fa-solid fa-heart'
                                                        : 'fa-regular fa-heart'
                                                }
                                            ></i>
                                        </button>

                                    </div>


                                    <div className="product-info">

                                        <p className="category">
                                            {deal.category}
                                        </p>

                                        <h3>{deal.name}</h3>

                                        <div className="rating">
                                            <span>★★★★★</span>

                                            <small>
                                                ({deal.ratingCount})
                                            </small>
                                        </div>

                                        <div className="price">

                                            <span className="sale-price">
                                                ₹{deal.price.toLocaleString('en-IN')}
                                            </span>

                                            <span className="old-price">
                                                ₹{deal.oldPrice.toLocaleString('en-IN')}
                                            </span>

                                        </div>


                                        <button
                                            className="deal-button"
                                            disabled={isAdded}
                                            onClick={() =>
                                                handleShopDeal(deal)
                                            }
                                        >
                                            {isAdded ? (
                                                <>
                                                    Added to Cart
                                                    <i className="fa-solid fa-check"></i>
                                                </>
                                            ) : (
                                                <>
                                                    Shop deal
                                                    <i className="fa-solid fa-arrow-right"></i>
                                                </>
                                            )}
                                        </button>

                                    </div>

                                </article>
                            );
                        })}

                    </div>
                ) : (
                    <div className="no-deals">
                        <h3>No deals found</h3>

                        <p>
                            There are no offers available in this category
                            right now.
                        </p>

                        <button
                            className="deal-button"
                            onClick={() => setSelectedCategory('All Deals')}
                        >
                            View all deals
                        </button>
                    </div>
                )}

            </section>


            {/* WEEKEND EDIT BANNER */}
            <section className="sale-banner">

                <div className="sale-banner-content">

                    <p className="eyebrow">
                        THE WEEKEND EDIT
                    </p>

                    <h2>
                        Make room for <em>something beautiful.</em>
                    </h2>

                    <p>
                        Save up to 50% on selected pieces while stocks last.
                    </p>

                    <a
                        href="#deals"
                        className="light-button"
                    >
                        Explore offers
                        <i className="fa-solid fa-arrow-right"></i>
                    </a>

                </div>

            </section>


            {/* COUNTDOWN */}
            <section className="countdown-section">

                <div className="countdown-text">

                    <p className="eyebrow">
                        ENDING SOON
                    </p>

                    <h2>
                        These prices won't <em>last forever.</em>
                    </h2>

                    <p>
                        Our biggest furniture offers are disappearing soon.
                        Find your favourites before the clock runs out.
                    </p>

                </div>


                <div className="countdown">

                    <div className="time-box">
                        <span>{timeLeft.days}</span>
                        <small>DAYS</small>
                    </div>

                    <div className="colon">:</div>

                    <div className="time-box">
                        <span>{timeLeft.hours}</span>
                        <small>HOURS</small>
                    </div>

                    <div className="colon">:</div>

                    <div className="time-box">
                        <span>{timeLeft.minutes}</span>
                        <small>MINUTES</small>
                    </div>

                    <div className="colon">:</div>

                    <div className="time-box">
                        <span>{timeLeft.seconds}</span>
                        <small>SECONDS</small>
                    </div>

                </div>

            </section>

        </div>
    );
}
