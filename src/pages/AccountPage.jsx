import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import '../styles/account.css';


export default function AccountPage() {
    const navigate = useNavigate();

    const {
        userName,
        userEmail,
        currentUser,
        logout,
        refreshAuth
    } = useAuth();

    const { showToast } = useToast();


    const [activeSection, setActiveSection] = useState('overview');
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [editingProfile, setEditingProfile] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const [addressForm, setAddressForm] = useState({
        label: 'Home',
        addressLine: '',
        landmark: '',
        city: '',
        state: '',
        pinCode: '',
        isDefault: false
    });

    const savedAddresses =
        currentUser?.deliveryAddresses ??
        (currentUser?.deliveryAddress
            ? [{ ...currentUser.deliveryAddress, id: 'legacy-address', label: 'Home', isDefault: true }]
            : []);
    
    useEffect(() => {
        setFirstName(currentUser?.firstName || '');
        setLastName(
            currentUser?.lastName ||
            (currentUser?.name || '').replace(currentUser?.firstName || '', '').trim()
        );
        setEmail(currentUser?.email || '');
    }, [currentUser]);

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

    const updateStoredUser = (changes) => {
        const raw = localStorage.getItem('aisleUser');
        if (!raw) {
            showToast('Please log in again.');
            return null;
        }

        const user = JSON.parse(raw);
        const updatedUser = { ...user, ...changes };

        localStorage.setItem('aisleUser', JSON.stringify(updatedUser));

        if (updatedUser.firstName) {
            localStorage.setItem('aisleUserName', updatedUser.firstName);
        }
        if (updatedUser.email) {
            localStorage.setItem('aisleUserEmail', updatedUser.email);
        }

        refreshAuth();
        return updatedUser;
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();

        if (!firstName.trim() || !lastName.trim() || !email.trim()) {
            showToast('Please complete all profile fields.');
            return;
        }

        updateStoredUser({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            name: `${firstName.trim()} ${lastName.trim()}`.trim(),
            email: email.trim()
        });

        setEditingProfile(false);
        showToast('Profile details saved.');
    };

    const resetAddressForm = () => {
        setAddressForm({
            label: 'Home',
            addressLine: '',
            landmark: '',
            city: '',
            state: '',
            pinCode: '',
            isDefault: false
        });
        setEditingAddressId(null);
    };

    const handleSaveAddress = (e) => {
        e.preventDefault();

        if (
            !addressForm.label.trim() ||
            !addressForm.addressLine.trim() ||
            !addressForm.city.trim() ||
            !addressForm.state.trim() ||
            !/^[1-9][0-9]{5}$/.test(addressForm.pinCode.trim())
        ) {
            showToast('Enter the required address details and a valid 6-digit PIN code.');
            return;
        }

        const existing = savedAddresses.map((address) => ({ ...address }));
        const id = editingAddressId || `address-${Date.now()}`;

        let updatedAddresses = existing.filter((address) => address.id !== id);

        const newAddress = {
            ...addressForm,
            id,
            label: addressForm.label.trim(),
            addressLine: addressForm.addressLine.trim(),
            landmark: addressForm.landmark.trim(),
            city: addressForm.city.trim(),
            state: addressForm.state.trim(),
            pinCode: addressForm.pinCode.trim(),
            isDefault: addressForm.isDefault || existing.length === 0
        };

        if (newAddress.isDefault) {
            updatedAddresses = updatedAddresses.map((address) => ({
                ...address,
                isDefault: false
            }));
        }

        updatedAddresses.push(newAddress);

        updateStoredUser({
            deliveryAddresses: updatedAddresses,
            deliveryAddress: updatedAddresses.find((address) => address.isDefault) || updatedAddresses[0]
        });

        resetAddressForm();
        showToast('Delivery address saved.');
    };

    const handleEditAddress = (address) => {
        setAddressForm({
            label: address.label || 'Home',
            addressLine: address.addressLine || '',
            landmark: address.landmark || '',
            city: address.city || '',
            state: address.state || '',
            pinCode: address.pinCode || '',
            isDefault: Boolean(address.isDefault)
        });
        setEditingAddressId(address.id);
    };

    const handleRemoveAddress = (id) => {
        const remaining = savedAddresses.filter((address) => address.id !== id);

        if (remaining.length && !remaining.some((address) => address.isDefault)) {
            remaining[0].isDefault = true;
        }

        updateStoredUser({
            deliveryAddresses: remaining,
            deliveryAddress: remaining.find((address) => address.isDefault) || null
        });

        if (editingAddressId === id) resetAddressForm();
        showToast('Address removed.');
    };

    const handleSetDefaultAddress = (id) => {
        const updatedAddresses = savedAddresses.map((address) => ({
            ...address,
            isDefault: address.id === id
        }));

        updateStoredUser({
            deliveryAddresses: updatedAddresses,
            deliveryAddress: updatedAddresses.find((address) => address.isDefault) || null
        });

        showToast('Default address updated.');
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

                    
                    <button
                        type="button"
                        className={`sidebar-item ${activeSection === 'help' ? 'active' : ''}`}
                        onClick={() => navigate('/about#support')}
                    >
                        <span className="sidebar-icon" aria-hidden="true">?</span>
                        Help Centre
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

                    
                    {/* PROFILE DETAILS */}
                    <section className="account-form-section" id="profile-details">
                        <div className="section-heading">
                            <h2>Profile Details</h2>
                            <button
                                type="button"
                                className="account-action-button"
                                onClick={() => setEditingProfile(!editingProfile)}
                            >
                                {editingProfile ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>

                        {editingProfile ? (
                            <form className="account-edit-form" onSubmit={handleSaveProfile}>
                                <label>
                                    First Name
                                    <input
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </label>

                                <label>
                                    Last Name
                                    <input
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </label>

                                <label>
                                    Email Address
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </label>

                                <button type="submit" className="account-action-button">
                                    Save Changes
                                </button>
                            </form>
                        ) : (
                            <div className="account-info-panel">
                                <p><strong>Name:</strong> {displayName}</p>
                                <p><strong>Email:</strong> {displayEmail}</p>
                                <p><strong>Phone:</strong> {currentUser?.phone || 'Not provided'}</p>
                            </div>
                        )}
                    </section>

                    {/* DELIVERY ADDRESSES */}
                    <section className="account-form-section" id="delivery-addresses">
                        <div className="section-heading">
                            <h2>Delivery Addresses</h2>
                            <button
                                type="button"
                                className="account-action-button"
                                onClick={() => {
                                    resetAddressForm();
                                    setEditingAddressId('new-address');
                                }}
                            >
                                + Add Address
                            </button>
                        </div>

                        {savedAddresses.length === 0 && editingAddressId !== 'new-address' && (
                            <p className="account-muted-text">
                                You haven't saved any delivery addresses yet.
                            </p>
                        )}

                        <div className="saved-address-grid">
                            {savedAddresses.map((address) => (
                                <article className="saved-address-card" key={address.id}>
                                    <div className="saved-address-title">
                                        <h3>{address.label || 'Address'}</h3>
                                        {address.isDefault && (
                                            <span className="default-address-tag">Default</span>
                                        )}
                                    </div>

                                    <p>{address.addressLine}</p>
                                    {address.landmark && <p>{address.landmark}</p>}
                                    <p>
                                        {[address.city, address.state, address.pinCode]
                                            .filter(Boolean)
                                            .join(', ')}
                                    </p>

                                    <div className="address-actions">
                                        <button
                                            type="button"
                                            className="account-secondary-button"
                                            onClick={() => handleEditAddress(address)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            className="account-secondary-button"
                                            onClick={() => handleRemoveAddress(address.id)}
                                        >
                                            Remove
                                        </button>

                                        {!address.isDefault && (
                                            <button
                                                type="button"
                                                className="account-secondary-button"
                                                onClick={() => handleSetDefaultAddress(address.id)}
                                            >
                                                Set as Default
                                            </button>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>

                        {editingAddressId !== null && (
                            <form
                                className="account-edit-form address-edit-form"
                                onSubmit={handleSaveAddress}
                            >
                                <h3>
                                    {editingAddressId === 'new-address'
                                        ? 'Add Delivery Address'
                                        : 'Edit Delivery Address'}
                                </h3>

                                <label>
                                    Address Label
                                    <select
                                        value={addressForm.label}
                                        onChange={(e) =>
                                            setAddressForm({ ...addressForm, label: e.target.value })
                                        }
                                    >
                                        <option value="Home">Home</option>
                                        <option value="Work">Work</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </label>

                                <label>
                                    Street Address
                                    <input
                                        value={addressForm.addressLine}
                                        onChange={(e) =>
                                            setAddressForm({
                                                ...addressForm,
                                                addressLine: e.target.value
                                            })
                                        }
                                        required
                                    />
                                </label>

                                <label>
                                    Landmark (Optional)
                                    <input
                                        value={addressForm.landmark}
                                        onChange={(e) =>
                                            setAddressForm({
                                                ...addressForm,
                                                landmark: e.target.value
                                            })
                                        }
                                    />
                                </label>

                                <div className="address-form-row">
                                    <label>
                                        City
                                        <input
                                            value={addressForm.city}
                                            onChange={(e) =>
                                                setAddressForm({ ...addressForm, city: e.target.value })
                                            }
                                            required
                                        />
                                    </label>

                                    <label>
                                        State
                                        <input
                                            value={addressForm.state}
                                            onChange={(e) =>
                                                setAddressForm({ ...addressForm, state: e.target.value })
                                            }
                                            required
                                        />
                                    </label>

                                    <label>
                                        PIN Code
                                        <input
                                            inputMode="numeric"
                                            maxLength={6}
                                            value={addressForm.pinCode}
                                            onChange={(e) =>
                                                setAddressForm({
                                                    ...addressForm,
                                                    pinCode: e.target.value.replace(/\D/g, '').slice(0, 6)
                                                })
                                            }
                                            required
                                        />
                                    </label>
                                </div>

                                <label className="default-address-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={addressForm.isDefault}
                                        onChange={(e) =>
                                            setAddressForm({
                                                ...addressForm,
                                                isDefault: e.target.checked
                                            })
                                        }
                                    />
                                    Set as default address
                                </label>

                                <div className="address-actions">
                                    <button type="submit" className="account-action-button">
                                        Save Address
                                    </button>

                                    <button
                                        type="button"
                                        className="account-secondary-button"
                                        onClick={resetAddressForm}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
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
