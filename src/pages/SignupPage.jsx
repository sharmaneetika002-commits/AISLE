import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/signup.css';

export default function SignupPage() {
    const navigate = useNavigate();
    const { signup } = useAuth();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(true);

    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePhoneInput = (e) => {
        const val = e.target.value.replace(/\D/g, '');
        setPhone(val);
        setPhoneError('');

        if (val.length > 0 && !/^[6-9]/.test(val)) {
            setPhoneError('Please enter a valid Indian mobile number.');
        } else if (val.length === 10 && !/^[6-9][0-9]{9}$/.test(val)) {
            setPhoneError('Please enter a valid Indian mobile number.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');

        if (!/^[6-9][0-9]{9}$/.test(phone)) {
            setPhoneError('Please enter a valid Indian mobile number.');
            return;
        }

        if (password !== confirmPassword) {
            setMessage('Passwords do not match. Please try again.');
            setIsSuccess(false);
            return;
        }

        if (password.length < 8) {
            setMessage('Password must contain at least 8 characters.');
            setIsSuccess(false);
            return;
        }

        const user = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            name: `${firstName} ${lastName}`.trim(),
            email: email.trim(),
            phone: phone.trim(),
            password: password
        };

        const res = signup(user);
        setMessage(res.message);
        setIsSuccess(true);

        setTimeout(() => {
            navigate('/');
        }, 1500);
    };

    return (
        <div className="signup-page-container">
            {/* HEADER */}
            <header className="signup-header">
                <Link to="/" className="logo">
                    AISLE
                </Link>
                <Link to="/" className="back-home">
                    <span>←</span> Back to Home
                </Link>
            </header>

            {/* SIGNUP SECTION */}
            <main className="signup-section">
                <div className="decor decor-one"></div>
                <div className="decor decor-two"></div>

                <div className="signup-card">
                    <div className="heading">
                        <div className="small-title">Create Account</div>
                        <h1>Join Aisle</h1>
                        <p>
                            Create an account to save favourites, track orders and check out faster.
                        </p>
                    </div>

                    {message && (
                        <div
                            className="message show"
                            id="message"
                            style={{
                                background: isSuccess ? '#e6f4ea' : '#eee7dd',
                                color: isSuccess ? '#137333' : '#302721',
                                borderColor: isSuccess ? '#ceead6' : '#ded5ca'
                            }}
                        >
                            {message}
                        </div>
                    )}

                    <form id="signupForm" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    placeholder="First name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    placeholder="Last name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <div className="phone-input">
                                <span className="country-code">+91</span>
                                <input
                                    type="tel"
                                    id="phone"
                                    maxLength="10"
                                    placeholder="10-digit mobile number"
                                    value={phone}
                                    onChange={handlePhoneInput}
                                    required
                                />
                            </div>
                            {phoneError && <p className="phone-error" id="phoneError">{phoneError}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper password-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    placeholder="At least 8 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="show-password"
                                    id="togglePassword"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="terms">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                required
                            />
                            <label htmlFor="terms" style={{ fontWeight: 'normal', margin: 0 }}>
                                I agree to the <a href="#terms">Terms of Service</a> and{' '}
                                <a href="#privacy">Privacy Policy</a>.
                            </label>
                        </div>

                        <button type="submit" className="signup-btn">
                            CREATE ACCOUNT
                        </button>
                    </form>

                    <div className="divider">OR</div>

                    <div className="login-text">
                        Already have an account?
                        <Link to="/login">Log in</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
