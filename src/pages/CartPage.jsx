import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import '../styles/cart.css';

export default function CartPage() {
    const navigate = useNavigate();
    const {
        cart,
        subtotal,
        delivery,
        gst,
        total,
        deliveryDate,
        changeQuantity,
        removeFromCart,
        clearCart
    } = useCart();

    const handleCheckout = () => {
        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }
        navigate('/checkout');
    };

    return (
        <main className="cart-page">
            <section className="cart-header">
                <p className="eyebrow">YOUR SHOPPING BAG</p>
                <h1>Your Cart</h1>
                <p>Review your pieces before bringing them home.</p>
            </section>

            {cart.length === 0 ? (
                <div id="cartEmpty" className="cart-empty" style={{ display: 'block' }}>
                    <div className="empty-icon">
                        <i className="fa-solid fa-cart-shopping"></i>
                    </div>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't found your perfect piece yet.</p>
                    <button onClick={() => navigate('/products')}>
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <section id="cartContent" className="cart-layout" style={{ display: 'grid' }}>
                    {/* CART PRODUCTS */}
                    <div className="cart-products">
                        <div className="cart-top">
                            <h2>Shopping Cart</h2>
                            <button className="clear-cart" onClick={clearCart}>
                                Clear cart
                            </button>
                        </div>

                        <div id="cartItems">
                            {cart.map(item => {
                                const price = Number(item.price) || 0;
                                const quantity = Number(item.quantity) || 1;
                                const itemTotal = price * quantity;

                                return (
                                    <article className="cart-item" key={item.id}>
                                        <img
                                            src={item.image || ''}
                                            alt={item.name || 'Product'}
                                            className="cart-image"
                                        />

                                        <div className="cart-info">
                                            <p className="cart-category">{item.category || 'Furniture'}</p>
                                            <h3>{item.name || 'Unnamed Product'}</h3>
                                            <p className="cart-price">{formatPrice(price)}</p>

                                            <div className="cart-controls">
                                                <div className="quantity">
                                                    <button
                                                        type="button"
                                                        onClick={() => changeQuantity(item.id, -1)}
                                                    >
                                                        −
                                                    </button>
                                                    <span>{quantity}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => changeQuantity(item.id, 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="remove-item"
                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>

                                        <div className="item-total">
                                            {formatPrice(itemTotal)}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>

                    {/* ORDER SUMMARY */}
                    <aside className="order-summary">
                        <h2>Order Summary</h2>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span id="subtotal">{formatPrice(subtotal)}</span>
                        </div>

                        <div className="summary-row">
                            <span>Delivery</span>
                            <span id="deliveryCharge">
                                {delivery === 0 ? 'FREE' : formatPrice(delivery)}
                            </span>
                        </div>

                        <div className="summary-row">
                            <span>GST</span>
                            <span id="gst">{formatPrice(gst)}</span>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-total">
                            <span>Total</span>
                            <strong id="total">{formatPrice(total)}</strong>
                        </div>

                        <div className="delivery-box">
                            <i className="fa-solid fa-truck"></i>
                            <div>
                                <strong>Estimated Delivery</strong>
                                <p id="deliveryDate">{deliveryDate} • Estimated</p>
                            </div>
                        </div>

                        <button className="order-button" onClick={handleCheckout}>
                            Proceed to Checkout <i className="fa-solid fa-arrow-right"></i>
                        </button>

                        <p className="secure-text">
                            <i className="fa-solid fa-lock"></i> Secure checkout
                        </p>
                    </aside>
                </section>
            )}
        </main>
    );
}
