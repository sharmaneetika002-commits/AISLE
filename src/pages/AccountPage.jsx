import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import '../styles/account.css';

export default function AccountPage() {
    const navigate = useNavigate();
    const { userName, userEmail, logout } = useAuth();
    const { showToast } = useToast();

    const [activeSection, setActiveSection] = useState('overview');
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const displayName = userName || 'Neetika Sharma';
    const displayEmail = userEmail || 'neetika@example.com';
    const displayInitial = displayName.trim().charAt(0).toUpperCase();

    const handleSectionClick = (section) => {
        setActiveSection(section);
        if (section === 'profile') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            showToast('Profile Details selected');
        } else if (section === 'wishlist') {
            navigate('/wishlist');
        } else if (section === 'overview') {
            showToast('Overview selected');
        }
    };

    const handleConfirmLogout = () => {
        logout();
        setShowLogoutModal(false);
        navigate('/signup');
    };

    return (
        <main className="account-page">
            {/* BREADCRUMB */}
            <div className="breadcrumb">
                <Link to="/">Home</Link>
                <span>›</span>
                <strong>My Account</strong>
            </div>

            {/* PAGE INTRO */}
            <section className="account-intro">
                <div>
                    <p className="eyebrow">WELCOME BACK</p>
                    <h1>My Account</h1>
                    <p className="intro-text">
                        Manage your profile, orders and everything in one place.
                    </p>
                </div>

                <div className="intro-decoration">
                    <span>
                        A home<br />
                        for a better you.
                    </span>
                </div>
            </section>

            {/* ACCOUNT LAYOUT */}
            <section className="account-layout">
                {/* SIDEBAR */}
                <aside className="account-sidebar">
                    <button
                        type="button"
                        className={`sidebar-item ${activeSection === 'overview' ? 'active' : ''}`}
                        onClick={() => handleSectionClick('overview')}
                    >
                        <span className="sidebar-symbol">⌂</span>
                        Overview
                    </button>

                    <button
                        type="button"
                        className={`sidebar-item ${activeSection === 'profile' ? 'active' : ''}`}
                        onClick={() => handleSectionClick('profile')}
                    >
                        <span className="sidebar-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18">
                                <circle cx="12" cy="8" r="3.6" />
                                <path d="M4.5 20c1.4-3.6 4.4-5.4 7.5-5.4s6.1 1.8 7.5 5.4" />
                            </svg>
                        </span>
                        Profile Details
                    </button>

                    <button
                        type="button"
                        className="sidebar-item"
                        onClick={() => handleSectionClick('wishlist')}
                    >
                        <span className="sidebar-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18">
                                <path d="M20.8 8.7c0 5-8.8 10.3-8.8 10.3S3.2 13.7 3.2 8.7C3.2 5.9 5.1 4 7.7 4c1.8 0 3.3 1 4.3 2.4C13 5 14.5 4 16.3 4c2.6 0 4.5 1.9 4.5 4.7z" />
                            </svg>
                        </span>
                        Saved Wishlist
                    </button>

                    <div className="sidebar-divider"></div>

                    <button
                        type="button"
                        className="sidebar-item logout"
                        id="logoutButton"
                        onClick={() => setShowLogoutModal(true)}
                    >
                        <span className="sidebar-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18">
                                <path d="M12 3v9" />
                                <path d="M7.5 6.5a8 8 0 1 0 9 0" />
                            </svg>
                        </span>
                        Logout
                    </button>
                </aside>

                {/* MAIN CONTENT */}
                <div className="account-content">
                    {/* PROFILE CARD */}
                    <section className="profile-card">
                        <div className="profile-photo">
                            <div className="profile-initial" id="profileInitial">
                                {displayInitial}
                            </div>
                        </div>

                        <div className="profile-information">
                            <h2 id="accountName">{displayName}</h2>
                            <p id="accountEmail">{displayEmail}</p>
                            <span>Member since September 2024</span>
                        </div>
                    </section>

                    {/* QUICK LINKS */}
                    <section className="quick-links-section">
                        <div className="section-heading">
                            <h2>Quick Links</h2>
                        </div>

                        <div className="quick-links-grid">
                            <button
                                type="button"
                                className="quick-card"
                                onClick={() => navigate('/wishlist')}
                            >
                                <div className="quick-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="22" height="22">
                                        <path d="M20.8 8.7c0 5-8.8 10.3-8.8 10.3S3.2 13.7 3.2 8.7C3.2 5.9 5.1 4 7.7 4c1.8 0 3.3 1 4.3 2.4C13 5 14.5 4 16.3 4c2.6 0 4.5 1.9 4.5 4.7z" />
                                    </svg>
                                </div>

                                <div className="quick-card-text">
                                    <h3>Saved Wishlist</h3>
                                    <p>View your favourite<br />products.</p>
                                </div>

                                <span className="card-arrow">→</span>
                            </button>
                        </div>
                    </section>
                </div>
            </section>

            {/* LOGOUT MODAL */}
            {showLogoutModal && (
                <div
                    className="modal-overlay show"
                    id="logoutModal"
                    onClick={(e) => {
                        if (e.target.id === 'logoutModal') setShowLogoutModal(false);
                    }}
                >
                    <div className="logout-modal">
                        <div className="modal-icon">↗</div>
                        <h2>Leaving already?</h2>
                        <p>Are you sure you want to log out of your AISLE account?</p>

                        <div className="modal-buttons">
                            <button
                                id="cancelLogout"
                                className="cancel-button"
                                onClick={() => setShowLogoutModal(false)}
                            >
                                Stay
                            </button>
                            <button
                                id="confirmLogout"
                                className="confirm-button"
                                onClick={handleConfirmLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
