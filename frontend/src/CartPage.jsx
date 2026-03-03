import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "./context/CartContext";
import { FiTrash2, FiShoppingCart, FiArrowRight } from "react-icons/fi";

export default function CartPage() {
    const { cart, removeFromCart, updateCartItem, clearCart } = useCart();

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 50;
    const total = subtotal + shipping;

    return (
        <div style={{ paddingTop: 'var(--nav-height)' }}>
            {/* Header */}
            <div style={{
                background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,245,255,0.06), transparent)',
                padding: '50px 0 30px',
                borderBottom: '1px solid var(--border-glass)',
            }}>
                <div className="container">
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '8px' }}>
                        Your Cart
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Review your items before checkout
                    </p>
                </div>
            </div>

            <div className="container" style={{ padding: '40px 24px' }}>
                {cart.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        background: 'var(--bg-card)',
                        borderRadius: '16px',
                        border: '1px solid var(--border-glass)',
                    }}>
                        <div style={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: 'rgba(0,245,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            color: 'var(--neon-cyan)',
                        }}>
                            <FiShoppingCart size={40} />
                        </div>
                        <h3 style={{ marginBottom: '8px', fontWeight: 700 }}>Your cart is empty</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                            Looks like you haven't added any items yet.
                        </p>
                        <Link to="/shop" style={{ textDecoration: 'none' }}>
                            <button className="btn-primary">
                                Start Shopping
                            </button>
                        </Link>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'flex-start' }}>
                            {/* Cart Items */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {cart.map((item) => (
                                    <div key={item.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        padding: '16px',
                                        background: 'var(--bg-card)',
                                        borderRadius: '16px',
                                        border: '1px solid var(--border-glass)',
                                        transition: 'all 0.2s',
                                    }}>
                                        <div style={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            background: 'var(--bg-secondary)',
                                        }}>
                                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontWeight: 700, marginBottom: '4px' }}>{item.name}</h4>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                                {item.size} • {item.color}
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '8px' }}>
                                                    <button onClick={() => updateCartItem(item.id, item.quantity - 1)} style={{ width: 28, height: 28, borderRadius: '6px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>-</button>
                                                    <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                                                    <button onClick={() => updateCartItem(item.id, item.quantity + 1)} style={{ width: 28, height: 28, borderRadius: '6px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>+</button>
                                                </div>
                                                <span style={{ fontWeight: 700, color: 'var(--neon-cyan)' }}>${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--text-muted)',
                                            cursor: 'pointer',
                                            padding: '8px',
                                            borderRadius: '8px',
                                            transition: 'all 0.2s',
                                        }}>
                                            <FiTrash2 size={20} />
                                        </button>
                                    </div>
                                ))}
                                <button onClick={clearCart} style={{
                                    alignSelf: 'flex-start',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px',
                                    transition: 'all 0.2s',
                                }}>
                                    <FiTrash2 size={16} />
                                    Clear Cart
                                </button>
                            </div>

                            {/* Summary */}
                            <div style={{
                                position: 'sticky',
                                top: 'calc(var(--nav-height) + 24px)',
                                background: 'var(--bg-card)',
                                borderRadius: '16px',
                                border: '1px solid var(--border-glass)',
                                padding: '24px',
                            }}>
                                <h3 style={{ fontWeight: 700, marginBottom: '24px', fontSize: '1.1rem' }}>Order Summary</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                                    <span style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-glass)' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                                    <span style={{ fontWeight: 600 }}>${shipping.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>Total</span>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--neon-cyan)' }}>${total.toFixed(2)}</span>
                                </div>
                                <Link to="/checkout"