import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');

        if (!email.trim() || !password) {
            setMessage('Please complete the login form.');
            setIsSuccess(false);
            return;
        }

        const res = login(email, password);
        setMessage(res.message);
        setIsSuccess(res.success);

        if (res.success) {
            setTimeout(() => {
                navigate('/');
            }, 1000);
        }
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        setMessage('For this demo, please create a new account if you cannot remember your password.');
        setIsSuccess(false);
    };

    return (
        <div>
            {/* HEADER */}
            <header>
                <Link to="/" className="logo">
                    AISLE
                </Link>
                <Link to="/" className="back-home">
                    <span>←</span> Back to Home
                </Link>
            </header>

            {/* LOGIN SECTION */}
            <main className="login-section">
                <div className="decor decor-one"></div>
                <div className="decor decor-two"></div>

                <div className="login-card">
                    <div className="heading">
                        <div className="small-title">Welcome Back</div>
                        <h1>Log In to Aisle</h1>
                        <p>
                            Sign in to access your account,<br />
                            orders and wishlist.
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

                    <form id="loginForm" onSubmit={handleSubmit}>
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
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    placeholder="Enter your password"
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

                        <div className="forgot-row">
                            <a href="#forgot" id="forgotPassword" onClick={handleForgotPassword}>
                                Forgot password?
                            </a>
                        </div>

                        <button type="submit" className="login-btn">
                            LOG IN
                        </button>
                    </form>

                    <div className="divider">OR</div>

                    <div className="signup-text">
                        Don't have an account?
                        <Link to="/signup" style={{ marginLeft: '4px' }}>
                            Create one
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
