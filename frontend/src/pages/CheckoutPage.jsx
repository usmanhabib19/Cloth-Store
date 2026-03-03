import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, SignInButton } from '@clerk/clerk-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { FiLock, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import api from '../api/axios';

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const { isSignedIn, userId } = useAuth();
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
        <div className="container section" style={{ paddingTop: 'calc(var(--nav-height) + 40px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
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
                    <SignInButton mode="modal">
                        <button className="btn-primary" style={{ padding: '14px 40px' }}>Sign In to Proceed</button>
                    </SignInButton>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
                    {/* Shipping Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="glass-card" style={{ padding: '32px' }}>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '24px' }}>Shipping Information</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
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

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
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
                            <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', border: '1.5px solid var(--neon-cyan)' }}>
                                <FiCheckCircle size={24} color="var(--neon-cyan)" />
                                <div>
                                    <p style={{ fontWeight: 700 }}>Cash on Delivery (COD)</p>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Pay when you receive the package.</p>
                                </div>
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
                    <div style={{ position: 'sticky', top: 'calc(var(--nav-height) + 40px)', alignSelf: 'start' }}>
                        <div className="glass-card" style={{ padding: '30px' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>Order Summary</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '300px', overflowY: 'auto', paddingRight: '10px', marginBottom: '20px' }}>
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
