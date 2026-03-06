import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { FiLock, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import api from '../api/axios';
import styles from './CheckoutPage.module.css';

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const isSignedIn = !!user;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Pakistan'
    });
    const [selectedPayment, setSelectedPayment] = useState('cod');

    const paymentMethods = [
        { id: 'cod', name: 'Cash on Delivery (COD)', desc: 'Pay when you receive the package.' },
        { id: 'bank', name: 'Bank Transfer', desc: 'Coming soon' },
        { id: 'jazzcash', name: 'Jazzcash', desc: 'Coming soon' },
        { id: 'easypaisa', name: 'Easypaisa', desc: 'Coming soon' },
        { id: 'nayapay', name: 'Nayapay', desc: 'Coming soon' },
        { id: 'sadapay', name: 'Sadapay', desc: 'Coming soon' }
    ];

    const handlePaymentSelect = (id) => {
        if (id !== 'cod') {
            toast.info(`${paymentMethods.find(m => m.id === id).name} integration is coming soon!`);
            return;
        }
        setSelectedPayment(id);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isSignedIn) {
            toast.warn('Please sign in to complete your order');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                items: cart.map(item => ({
                    product: item._id,
                    name: item.name,
                    image: item.images?.[0],
                    price: item.price,
                    size: item.selectedSize,
                    qty: item.qty
                })),
                shippingAddress: formData,
                totalAmount: cartTotal + 150,
                shippingFee: 150,
                paymentMethod: 'COD'
            };

            const res = await api.post('/orders', orderData);
            toast.success('Order placed successfully!');
            clearCart();
            navigate('/orders');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className={`container section ${styles.page}`}>
            <div className={styles.header}>
                <button onClick={() => navigate('/cart')} className="btn-ghost" style={{ padding: '8px' }}>
                    <FiArrowLeft size={18} />
                </button>
                <h1 className="section-title" style={{ marginBottom: 0 }}>
                    Check<span className="neon-text">out</span>
                </h1>
            </div>

            {!isSignedIn ? (
                <div className="glass-card" style={{ padding: '60px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                    <FiLock size={48} color="var(--neon-pink)" style={{ marginBottom: '24px' }} />
                    <h2 style={{ marginBottom: '16px' }}>Sign in required</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                        Please sign in to your account to securely complete your order and track your shipping.
                    </p>
                    <Link to="/login?redirect=/checkout" className="btn-primary" style={{ padding: '14px 40px' }}>Sign In to Proceed</Link>
                </div>
            ) : (
                <div className={styles.layout}>
                    {/* Shipping Form */}
                    <form onSubmit={handleSubmit}>
                        <div className={`glass-card ${styles.shippingCard}`}>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '24px' }}>Shipping Information</h2>

                            <div className={styles.formGrid}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text" name="fullName" required
                                        className="form-input" placeholder="Enter your full name"
                                        value={formData.fullName} onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel" name="phone" required
                                        className="form-input" placeholder="e.g. 0300 1234567"
                                        value={formData.phone} onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label>Address</label>
                                <input
                                    type="text" name="address" required
                                    className="form-input" placeholder="House#, Street#, Area"
                                    value={formData.address} onChange={handleChange}
                                />
                            </div>

                            <div className={styles.formGrid} style={{ marginBottom: '32px' }}>
                                <div className="form-group">
                                    <label>City</label>
                                    <input
                                        type="text" name="city" required
                                        className="form-input" placeholder="e.g. Karachi"
                                        value={formData.city} onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Postal Code</label>
                                    <input
                                        type="text" name="postalCode" required
                                        className="form-input" placeholder="e.g. 75500"
                                        value={formData.postalCode} onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '24px' }}>Payment Method</h2>
                            <div className={styles.paymentList}>
                                {paymentMethods.map((method) => (
                                    <div
                                        key={method.id}
                                        onClick={() => handlePaymentSelect(method.id)}
                                        className="glass-card"
                                        style={{
                                            padding: '20px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '16px',
                                            cursor: 'pointer',
                                            border: selectedPayment === method.id ? '2px solid var(--neon-cyan)' : '1px solid var(--border-glass)',
                                            transition: 'all 0.3s ease',
                                            opacity: method.id !== 'cod' ? 0.7 : 1
                                        }}
                                    >
                                        <div style={{
                                            width: '24px', height: '24px', borderRadius: '50%',
                                            border: `2px solid ${selectedPayment === method.id ? 'var(--neon-cyan)' : 'var(--text-muted)'}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {selectedPayment === method.id && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--neon-cyan)' }} />}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 700, color: selectedPayment === method.id ? 'var(--neon-cyan)' : 'var(--text-primary)' }}>{method.name}</p>
                                            <p style={{ color: method.id !== 'cod' ? 'var(--neon-pink)' : 'var(--text-secondary)', fontSize: '0.85rem' }}>{method.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit" disabled={loading}
                            className="btn-primary"
                            style={{ width: '100%', justifyContent: 'center', padding: '18px', marginTop: '24px', fontSize: '1.1rem' }}
                        >
                            {loading ? 'Processing...' : `Place Order (PKR ${(cartTotal + 150).toLocaleString()})`}
                        </button>
                    </form>

                    {/* Order Summary */}
                    <div className={styles.summarySidebar}>
                        <div className={`glass-card ${styles.summaryCard}`}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>Order Summary</h2>
                            <div className={styles.itemScroll}>
                                {cart.map((item) => (
                                    <div key={`${item._id}-${item.selectedSize}`} style={{ display: 'flex', gap: '12px' }}>
                                        <img src={item.images?.[0]} style={{ width: '50px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} alt="" />
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '0.9rem', fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.name}</p>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.qty} x PKR {item.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="divider" />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Items Total</span>
                                    <span>PKR {cartTotal.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Delivery Fee</span>
                                    <span>PKR 150</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, marginTop: '10px' }}>
                                    <span>Grand Total</span>
                                    <span className="neon-text">PKR {(cartTotal + 150).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
