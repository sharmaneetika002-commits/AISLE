import React, { useState, useEffect } from 'react';
import { deals } from '../data/deals';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import '../styles/deals.css';

export default function DealsPage() {
    const { addToCart } = useCart();
    const { isWishlisted, toggleWishlist } = useWishlist();
    const [addedMap, setAddedMap] = useState({});

    // Countdown timer matching deals.js: end date = now + 2 days + 12 hours
    const [timeLeft, setTimeLeft] = useState(() => {
        const end = new Date();
        end.setDate(end.getDate() + 2);
        end.setHours(end.getHours() + 12);
        return {
            endDate: end,
            days: '02',
            hours: '12',
            minutes: '45',
            seconds: '30'
        };
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const difference = timeLeft.endDate - now;

            if (difference <= 0) {
                setTimeLeft(prev => ({
                    ...prev,
                    days: '00',
                    hours: '00',
                    minutes: '00',
                    seconds: '00'
                }));
                clearInterval(timer);
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / (1000 * 60)) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            setTimeLeft(prev => ({
                ...prev,
                days: String(days).padStart(2, '0'),
                hours: String(hours).padStart(2, '0'),
                minutes: String(minutes).padStart(2, '0'),
                seconds: String(seconds).padStart(2, '0')
            }));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft.endDate]);

    const handleShopDeal = (deal) => {
        addToCart({
            id: deal.id,
            name: deal.name,
            category: deal.category,
            price: deal.price,
            image: deal.image,
            quantity: 1
        });

        setAddedMap(prev => ({ ...prev, [deal.id]: true }));
        setTimeout(() => {
            setAddedMap(prev => ({ ...prev, [deal.id]: false }));
        }, 1200);
    };

    return (
        <div>
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
                        Shop the deals <i className="fa-solid fa-arrow-right"></i>
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
                        Explore our handpicked furniture deals before they're gone.
                    </p>
                </div>

                <div className="products-grid">
                    {deals.map(deal => {
                        const wishlisted = isWishlisted(deal.id);
                        const isAdded = addedMap[deal.id];

                        return (
                            <article className="product-card" key={deal.id}>
                                <div className="product-image">
                                    <img src={deal.image} alt={deal.name} />
                                    <span className="discount">{deal.discount}</span>
                                    <button
                                        className={`wishlist ${wishlisted ? 'active' : ''}`}
                                        onClick={() => toggleWishlist(deal)}
                                        aria-label="Wishlist"
                                    >
                                        <i className={wishlisted ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                                    </button>
                                </div>

                                <div className="product-info">
                                    <p className="category">{deal.category}</p>
                                    <h3>{deal.name}</h3>

                                    <div className="rating">
                                        <span>★★★★★</span>
                                        <small>({deal.ratingCount})</small>
                                    </div>

                                    <div className="price">
                                        <span className="sale-price">₹{deal.price.toLocaleString('en-IN')}</span>
                                        <span className="old-price">₹{deal.oldPrice.toLocaleString('en-IN')}</span>
                                    </div>

                                    <button
                                        className="deal-button"
                                        disabled={isAdded}
                                        onClick={() => handleShopDeal(deal)}
                                    >
                                        {isAdded ? (
                                            <>Added to Cart <i className="fa-solid fa-check"></i></>
                                        ) : (
                                            <>Shop deal <i className="fa-solid fa-arrow-right"></i></>
                                        )}
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            {/* WEEKEND EDIT BANNER */}
            <section className="sale-banner">
                <div className="sale-banner-content">
                    <p className="eyebrow">THE WEEKEND EDIT</p>
                    <h2>
                        Make room for <em>something beautiful.</em>
                    </h2>
                    <p>Save up to 50% on selected pieces while stocks last.</p>
                    <a href="#deals" className="light-button">
                        Explore offers <i className="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </section>

            {/* COUNTDOWN */}
            <section className="countdown-section">
                <div className="countdown-text">
                    <p className="eyebrow">ENDING SOON</p>
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
                        <span id="days">{timeLeft.days}</span>
                        <small>DAYS</small>
                    </div>
                    <div className="colon">:</div>
                    <div className="time-box">
                        <span id="hours">{timeLeft.hours}</span>
                        <small>HOURS</small>
                    </div>
                    <div className="colon">:</div>
                    <div className="time-box">
                        <span id="minutes">{timeLeft.minutes}</span>
                        <small>MINUTES</small>
                    </div>
                    <div className="colon">:</div>
                    <div className="time-box">
                        <span id="seconds">{timeLeft.seconds}</span>
                        <small>SECONDS</small>
                    </div>
                </div>
            </section>
        </div>
    );
}
