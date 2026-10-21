import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../data/products';
import '../styles/checkout.css';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { cart, subtotal, delivery, gst, total, deliveryDate, clearCart } = useCart();
    const { currentUser } = useAuth();

    // Preserve order snapshot on completion so the underlying checkout page remains visible behind the backdrop
    const [orderSnapshot, setOrderSnapshot] = useState(null);

    // Form states
    const [firstName, setFirstName] = useState(() => currentUser?.firstName || '');
    const [lastName, setLastName] = useState(() => currentUser?.lastName || '');
    const [phone, setPhone] = useState(() => currentUser?.phone || '');
    const [email, setEmail] = useState(() => currentUser?.email || '');
    const [address, setAddress] = useState('');
    const [area, setArea] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');

    // Payment states
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardName, setCardName] = useState('');
    const [upiId, setUpiId] = useState('');

    // Error & Success modal
    const [errorMessage, setErrorMessage] = useState('');
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [generatedOrderNumber, setGeneratedOrderNumber] = useState('');

    // Formatting helpers matching checkout.js
    const handlePhoneChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').substring(0, 10);
        setPhone(val);
    };

    const handlePincodeChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').substring(0, 6);
        setPincode(val);
    };

    const handleCardNumberChange = (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 16);
        val = val.match(/.{1,4}/g)?.join(' ') || val;
        setCardNumber(val);
    };

    const handleExpiryChange = (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (val.length >= 3) {
            val = val.substring(0, 2) + '/' + val.substring(2);
        }
        setExpiry(val);
    };

    const handleCvvChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').substring(0, 3);
        setCvv(val);
    };

    const validateForm = () => {
        setErrorMessage('');

        if (cart.length === 0) {
            setErrorMessage('Your cart is empty.');
            return false;
        }

        if (!firstName.trim() || !lastName.trim()) {
            setErrorMessage('Please enter your full name.');
            return false;
        }

        if (!/^[6-9]\d{9}$/.test(phone.trim())) {
            setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setErrorMessage('Please enter a valid email address.');
            return false;
        }

        if (!address.trim() || !area.trim() || !city.trim() || !state) {
            setErrorMessage('Please complete your delivery address.');
            return false;
        }

        if (!/^[1-9][0-9]{5}$/.test(pincode.trim())) {
            setErrorMessage('Please enter a valid 6-digit Indian PIN code.');
            return false;
        }

        // Validate payment
        if (paymentMethod === 'card') {
            const rawCard = cardNumber.replace(/\s/g, '');
            if (!/^\d{16}$/.test(rawCard)) {
                setErrorMessage('Please enter a valid 16-digit card number.');
                return false;
            }

            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry.trim())) {
                setErrorMessage('Please enter a valid expiry date in MM/YY format.');
                return false;
            }

            const [m, y] = expiry.split('/');
            const expiryMonth = Number(m);
            const expiryYear = 2000 + Number(y);
            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();

            if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
                setErrorMessage('Your card has expired.');
                return false;
            }

            if (!/^\d{3}$/.test(cvv.trim())) {
                setErrorMessage('Please enter a valid 3-digit CVV.');
                return false;
            }

            if (!cardName.trim()) {
                setErrorMessage('Please enter the name on your card.');
                return false;
            }
        }

        if (paymentMethod === 'upi') {
            if (!/^[\w.-]+@[\w.-]+$/.test(upiId.trim())) {
                setErrorMessage('Please enter a valid UPI ID.');
                return false;
            }
        }

        return true;
    };

    const handlePlaceOrder = (e) => {
        if (e) e.preventDefault();
        if (!validateForm()) return;

        const orderNum = 'AIS-' + Date.now().toString().slice(-8);
        setGeneratedOrderNumber(orderNum);

        const order = {
            orderNumber: orderNum,
            date: new Date().toISOString(),
            customer: {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                phone: phone.trim(),
                email: email.trim(),
                address: address.trim(),
                area: area.trim(),
                city: city.trim(),
                state: state,
                pincode: pincode.trim()
            },
            payment: paymentMethod,
            products: cart
        };

        localStorage.setItem('aisleLastOrder', JSON.stringify(order));
        setOrderSnapshot({
            cart: [...cart],
            subtotal,
            delivery,
            gst,
            total,
            deliveryDate
        });
        clearCart();
        setOrderSuccess(true);
    };

    const displayCart = orderSnapshot ? orderSnapshot.cart : cart;
    const displaySubtotal = orderSnapshot ? orderSnapshot.subtotal : subtotal;
    const displayDelivery = orderSnapshot ? orderSnapshot.delivery : delivery;
    const displayGst = orderSnapshot ? orderSnapshot.gst : gst;
    const displayTotal = orderSnapshot ? orderSnapshot.total : total;
    const displayDeliveryDate = orderSnapshot ? orderSnapshot.deliveryDate : deliveryDate;

    if (displayCart.length === 0 && !orderSuccess) {
        return (
            <main className="checkout-page" style={{ textAlign: 'center', padding: '80px 20px' }}>
                <h2>Your cart is empty</h2>
                <p style={{ margin: '16px 0 24px' }}>Add items to your cart before proceeding to checkout.</p>
                <Link to="/products" className="order-button" style={{ display: 'inline-block', width: 'auto', padding: '12px 28px' }}>
                    Shop Products
                </Link>
            </main>
        );
    }

    return (
        <main className="checkout-page">
            {/* PROGRESS */}
            <div className="checkout-progress">
                <div className="step active">
                    <span>1</span>
                    <p>Address</p>
                </div>
                <div className="line"></div>
                <div className="step active">
                    <span>2</span>
                    <p>Delivery</p>
                </div>
                <div className="line"></div>
                <div className="step active">
                    <span>3</span>
                    <p>Payment</p>
                </div>
            </div>

            <div className="checkout-layout">
                {/* LEFT SECTION */}
                <section className="checkout-left">
                    {/* ERROR MESSAGE */}
                    {errorMessage && (
                        <div
                            id="checkoutError"
                            className="checkout-error"
                            style={{ display: 'block' }}
                        >
                            {errorMessage}
                        </div>
                    )}

                    {/* ADDRESS CARD */}
                    <div className="checkout-card">
                        <div className="card-title">
                            <div>
                                <span className="number">1</span>
                                <div>
                                    <h2>Delivery Address</h2>
                                    <p>Where should we deliver your furniture?</p>
                                </div>
                            </div>
                        </div>

                        <form id="checkoutForm">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name *</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name *</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Mobile Number *</label>
                                <div className="phone-input">
                                    <span>+91</span>
                                    <input
                                        type="tel"
                                        id="phone"
                                        maxLength="10"
                                        placeholder="10-digit mobile number"
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        required
                                    />
                                </div>
                                <small>We'll use this number for delivery updates.</small>
                            </div>

                            <div className="form-group">
                                <label>Email Address *</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>House / Flat / Building *</label>
                                <input
                                    type="text"
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Street / Area *</label>
                                <input
                                    type="text"
                                    id="area"
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>City *</label>
                                    <input
                                        type="text"
                                        id="city"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>State *</label>
                                    <select
                                        id="state"
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        required
                                    >
                                        <option value="">Select state</option>
                                        <option>Andhra Pradesh</option>
                                        <option>Delhi</option>
                                        <option>Goa</option>
                                        <option>Gujarat</option>
                                        <option>Haryana</option>
                                        <option>Himachal Pradesh</option>
                                        <option>Jammu and Kashmir</option>
                                        <option>Jharkhand</option>
                                        <option>Karnataka</option>
                                        <option>Kerala</option>
                                        <option>Madhya Pradesh</option>
                                        <option>Maharashtra</option>
                                        <option>Odisha</option>
                                        <option>Punjab</option>
                                        <option>Rajasthan</option>
                                        <option>Tamil Nadu</option>
                                        <option>Telangana</option>
                                        <option>Uttar Pradesh</option>
                                        <option>Uttarakhand</option>
                                        <option>West Bengal</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>PIN Code *</label>
                                <input
                                    type="text"
                                    id="pincode"
                                    maxLength="6"
                                    placeholder="6-digit PIN code"
                                    value={pincode}
                                    onChange={handlePincodeChange}
                                    required
                                />
                            </div>
                        </form>
                    </div>

                    {/* DELIVERY METHOD */}
                    <div className="checkout-card">
                        <div className="card-title">
                            <div>
                                <span className="number">2</span>
                                <div>
                                    <h2>Delivery Option</h2>
                                    <p>Safe and insured furniture delivery</p>
                                </div>
                            </div>
                        </div>

                        <div className="delivery-option active">
                            <input type="radio" checked readOnly />
                            <div>
                                <strong>Standard Delivery</strong>
                                <p>Delivered by {deliveryDate}</p>
                            </div>
                            <span className="free-tag">
                                {delivery === 0 ? 'FREE' : formatPrice(delivery)}
                            </span>
                        </div>
                    </div>

                    {/* PAYMENT METHOD */}
                    <div className="checkout-card">
                        <div className="card-title">
                            <div>
                                <span className="number">3</span>
                                <div>
                                    <h2>Payment Method</h2>
                                    <p>Select your preferred payment method</p>
                                </div>
                            </div>
                        </div>

                        <div className="payment-options">
                            {/* CARD OPTION */}
                            <label className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="card"
                                    checked={paymentMethod === 'card'}
                                    onChange={() => setPaymentMethod('card')}
                                />
                                <div>
                                    <strong>Credit / Debit Card</strong>
                                    <p>Visa, MasterCard, RuPay</p>
                                </div>
                            </label>

                            {paymentMethod === 'card' && (
                                <div id="cardPayment" className="payment-fields" style={{ display: 'block' }}>
                                    <div className="form-group">
                                        <label>Card Number *</label>
                                        <input
                                            type="text"
                                            id="cardNumber"
                                            placeholder="1234 5678 9012 3456"
                                            maxLength="19"
                                            value={cardNumber}
                                            onChange={handleCardNumberChange}
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Expiry Date *</label>
                                            <input
                                                type="text"
                                                id="expiry"
                                                placeholder="MM/YY"
                                                maxLength="5"
                                                value={expiry}
                                                onChange={handleExpiryChange}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>CVV *</label>
                                            <input
                                                type="password"
                                                id="cvv"
                                                placeholder="123"
                                                maxLength="3"
                                                value={cvv}
                                                onChange={handleCvvChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Name on Card *</label>
                                        <input
                                            type="text"
                                            id="cardName"
                                            placeholder="Full name as printed on card"
                                            value={cardName}
                                            onChange={(e) => setCardName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* UPI OPTION */}
                            <label className={`payment-option ${paymentMethod === 'upi' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="upi"
                                    checked={paymentMethod === 'upi'}
                                    onChange={() => setPaymentMethod('upi')}
                                />
                                <div>
                                    <strong>UPI</strong>
                                    <p>Google Pay, PhonePe, Paytm</p>
                                </div>
                            </label>

                            {paymentMethod === 'upi' && (
                                <div id="upiPayment" className="payment-fields" style={{ display: 'block' }}>
                                    <div className="form-group">
                                        <label>UPI ID *</label>
                                        <input
                                            type="text"
                                            id="upiId"
                                            placeholder="username@bank"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* COD OPTION */}
                            <label className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="cod"
                                    checked={paymentMethod === 'cod'}
                                    onChange={() => setPaymentMethod('cod')}
                                />
                                <div>
                                    <strong>Cash on Delivery</strong>
                                    <p>Pay upon delivery at your doorstep</p>
                                </div>
                            </label>

                            {paymentMethod === 'cod' && (
                                <div id="codPayment" className="cod-info" style={{ display: 'flex' }}>
                                    <i className="fa-solid fa-circle-info"></i>
                                    <p>Pay with cash or UPI when your furniture is delivered.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* RIGHT SUMMARY */}
                <aside className="checkout-right">
                    <div className="checkout-summary">
                        <h2>Order Summary</h2>

                        <div id="checkoutItems" className="checkout-products">
                            {displayCart.map(item => {
                                const price = Number(item.price) || 0;
                                const quantity = Number(item.quantity) || 1;
                                const itemTotal = price * quantity;

                                return (
                                    <div className="checkout-product" key={item.id}>
                                        <img src={item.image || ''} alt={item.name || 'Product'} />
                                        <div className="checkout-product-info">
                                            <strong>{item.name || 'Unnamed Product'}</strong>
                                            <p>Qty: {quantity}</p>
                                        </div>
                                        <div className="checkout-product-price">
                                            {formatPrice(itemTotal)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span id="checkoutSubtotal">{formatPrice(displaySubtotal)}</span>
                        </div>

                        <div className="summary-row">
                            <span>Delivery</span>
                            <span id="checkoutDelivery">
                                {displayDelivery === 0 ? 'FREE' : formatPrice(displayDelivery)}
                            </span>
                        </div>

                        <div className="summary-row">
                            <span>GST (18%)</span>
                            <span id="checkoutGST">{formatPrice(displayGst)}</span>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-total">
                            <span>Total</span>
                            <strong id="checkoutTotal">{formatPrice(displayTotal)}</strong>
                        </div>

                        <div className="delivery-time">
                            <i className="fa-solid fa-truck"></i>
                            <div>
                                <strong>Estimated Delivery</strong>
                                <p id="checkoutDeliveryDate">{displayDeliveryDate}</p>
                            </div>
                        </div>

                        <button className="place-order" onClick={handlePlaceOrder}>
                            Place Order <i className="fa-solid fa-arrow-right"></i>
                        </button>

                        <p className="checkout-secure">
                            <i className="fa-solid fa-shield-halved"></i>
                            256-bit SSL encrypted checkout
                        </p>
                    </div>
                </aside>
            </div>

            {/* ORDER SUCCESS MODAL */}
            {orderSuccess && typeof document !== 'undefined' && createPortal(
                <div id="successModal" className="success-modal" style={{ display: 'flex' }}>
                    <div className="success-box">
                        <div className="success-icon">
                            <i className="fa-solid fa-check"></i>
                        </div>

                        <p className="success-small">ORDER CONFIRMED</p>
                        <h1>Thank you for your order!</h1>
                        <p id="orderNumber">Order #{generatedOrderNumber}</p>

                        <div className="success-delivery">
                            <i className="fa-solid fa-truck"></i>
                            <div>
                                <strong>Estimated Delivery</strong>
                                <p id="successDeliveryDate">{displayDeliveryDate}</p>
                            </div>
                        </div>

                        <p className="success-message">
                            We've sent your order confirmation and delivery details to your email.
                        </p>

                        <button onClick={() => navigate('/')}>
                            Continue Shopping
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </main>
    );
}
