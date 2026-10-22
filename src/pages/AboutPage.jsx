
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/style.css';

export default function AboutPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true);
        event.target.reset();
    };

    return (
        <main>
            {/* About Hero */}
            <section className="about-hero">
                <img src="/assets/new-arrival.jpg" alt="Aisle furniture" />
                <div className="about-hero-text">
                    <p>OUR STORY</p>
                    <h1>
                        Furniture made<br />
                        to <i>feel like home.</i>
                    </h1>
                </div>
            </section>

            {/* Introduction */}
            <section className="about-intro">
                <div className="about-intro-heading">
                    <p>ABOUT AISLE</p>
                    <h2>
                        We believe your<br />
                        home should feel<br />
                        <i>like you.</i>
                    </h2>
                </div>

                <div className="about-intro-text">
                    <p>
                        Aisle started with a simple idea: finding furniture
                        for your home shouldn't have to be complicated.
                    </p>
                    <p>
                        We bring together comfortable, practical and
                        thoughtfully designed pieces that make everyday
                        spaces feel a little more special.
                    </p>
                    <p>
                        Whether you're furnishing your first apartment,
                        updating your bedroom or creating a space to work
                        from home, we want Aisle to make the process easier.
                    </p>
                </div>
            </section>

            {/* Image + Text */}
            <section className="about-story">
                <div className="about-story-image">
                    <img
                        src="/assets/category-living.jpg"
                        alt="Comfortable living room"
                    />
                </div>

                <div className="about-story-content">
                    <p>DESIGNED FOR EVERYDAY LIFE</p>
                    <h2>
                        Good furniture<br />
                        should work<br />
                        <i>with you.</i>
                    </h2>
                    <p>
                        We focus on pieces that look good without
                        sacrificing comfort. From a sofa you can sink
                        into after a long day to a desk that makes
                        working from home a little easier, our collection
                        is made for real life.
                    </p>
                    <Link to="/products" className="about-button">
                        Explore our furniture
                    </Link>
                </div>
            </section>

            {/* Values */}
            <section className="values">
                <div className="section-title">
                    <p>WHAT MATTERS TO US</p>
                    <h2>Our Values</h2>
                </div>

                <div className="values-grid">
                    <div className="value-card">
                        <div className="value-number">01</div>
                        <h3>Comfort</h3>
                        <p>
                            Furniture should be beautiful, but it should
                            also be somewhere you actually want to sit,
                            work and relax.
                        </p>
                    </div>

                    <div className="value-card">
                        <div className="value-number">02</div>
                        <h3>Simplicity</h3>
                        <p>
                            We keep things simple. Easy-to-love designs
                            that can fit naturally into different homes
                            and different styles.
                        </p>
                    </div>

                    <div className="value-card">
                        <div className="value-number">03</div>
                        <h3>Everyday Living</h3>
                        <p>
                            Our furniture is made for real homes,
                            everyday routines and all the little moments
                            that happen in between.
                        </p>
                    </div>
                </div>
            </section>

            {/* Final Image */}
            <section className="about-final">
                <img
                    src="/assets/sale-room.jpg"
                    alt="Aisle furniture collection"
                />
                <div className="about-final-text">
                    <p>MAKE YOUR SPACE YOUR OWN</p>
                    <h2>
                        Your home.<br />
                        Your <i>aisle.</i>
                    </h2>
                    <Link to="/#categories" className="about-button">
                        Shop the collection
                    </Link>
                </div>
            </section>

            {/* Contact Us */}
            <section className="about-contact" id="contact">
                <div className="about-contact-heading">
                    <p>WE'RE HERE FOR YOU</p>
                    <h2>
                        Let's talk.<br />
                        <i>We're listening.</i>
                    </h2>
                    <p className="about-contact-description">
                        Need help with an order, have a question about
                        a product, or just want to get in touch?
                        We'd love to hear from you.
                    </p>
                </div>

                <div className="about-contact-details">
                    <div className="contact-detail">
                        <span className="contact-icon" aria-hidden="true">
                            ✉
                        </span>
                        <div>
                            <h3>Email Us</h3>
                            <p>
                                For general questions and assistance,
                                reach out to our support team.
                            </p>
                            {/* Replace this sample address with your real one */}
                            <a href="mailto:support@aisle.com">
                                support@aisle.com
                            </a>
                        </div>
                    </div>

                    <div className="contact-detail">
                        <span className="contact-icon" aria-hidden="true">
                            ↗
                        </span>
                        <div>
                            <h3>Product Questions</h3>
                            <p>
                                Need help choosing the right piece
                                for your space?
                            </p>
                            <Link to="/products">
                                Explore our collection
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Support Request Form */}
            <section className="support-section" id="support">
                <div className="support-heading">
                    <p>HOW CAN WE HELP?</p>
                    <h2>Submit a support request</h2>
                    <p>
                        Tell us a little about your issue and we'll
                        have the details we need to assist you.
                    </p>
                </div>

                <form
                    className="support-form"
                    onSubmit={handleSubmit}
                >
                    <div className="support-form-row">
                        <div className="support-field">
                            <label htmlFor="support-name">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                id="support-name"
                                name="name"
                                placeholder="Enter your full name"
                                autoComplete="name"
                                required
                            />
                        </div>

                        <div className="support-field">
                            <label htmlFor="support-email">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                id="support-email"
                                name="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                            />
                        </div>
                    </div>

                    <div className="support-form-row">
                        <div className="support-field">
                            <label htmlFor="support-type">
                                Request Type *
                            </label>
                            <select
                                id="support-type"
                                name="requestType"
                                defaultValue=""
                                required
                            >
                                <option value="" disabled>
                                    Select a topic
                                </option>
                                <option value="Order and delivery">
                                    Order and delivery
                                </option>
                                <option value="Product information">
                                    Product information
                                </option>
                                <option value="Returns and refunds">
                                    Returns and refunds
                                </option>
                                <option value="Payment issue">
                                    Payment issue
                                </option>
                                <option value="Website issue">
                                    Website issue
                                </option>
                                <option value="Other">
                                    Other
                                </option>
                            </select>
                        </div>

                        <div className="support-field">
                            <label htmlFor="support-order">
                                Order ID
                                <span className="optional-label">
                                    (Optional)
                                </span>
                            </label>
                            <input
                                type="text"
                                id="support-order"
                                name="orderId"
                                placeholder="e.g. AIS-1024"
                            />
                        </div>
                    </div>

                    <div className="support-field">
                        <label htmlFor="support-message">
                            How can we help? *
                        </label>
                        <textarea
                            id="support-message"
                            name="message"
                            rows="6"
                            placeholder="Describe your question or issue..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="support-submit"
                    >
                        Submit Request <span aria-hidden="true">→</span>
                    </button>

                    {submitted && (
                        <p
                            className="support-success"
                            role="status"
                            aria-live="polite"
                        >
                            Thank you for reaching out! Your form
                            passed validation. 
                        </p>
                    )}
                </form>
            </section>
        </main>
    );
}
