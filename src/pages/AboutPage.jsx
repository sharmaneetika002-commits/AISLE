import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/style.css';

export default function AboutPage() {
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
                    <img src="/assets/category-living.jpg" alt="Comfortable living room" />
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
                <img src="/assets/sale-room.jpg" alt="Aisle furniture collection" />
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
        </main>
    );
}
