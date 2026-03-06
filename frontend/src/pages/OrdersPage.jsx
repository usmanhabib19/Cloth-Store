import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiPackage, FiCalendar, FiMapPin, FiTruck, FiCheckCircle } from 'react-icons/fi';
import api from '../api/axios';

export default function OrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const isSignedIn = !!user;

    useEffect(() => {
        if (!authLoading && isSignedIn) {
            api.get('/orders/my')
                .then(res => setOrders(res.data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        } else if (!authLoading && !isSignedIn) {
            setLoading(false);
        }
    }, [authLoading, isSignedIn]);

    if (loading || authLoading) return <div className="spinner-container"><div className="spinner"></div></div>;

    if (!isSignedIn) {
        return (
            <div className="container section" style={{ paddingTop: 'calc(var(--nav-height) + 60px)', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '16px' }}>Sign in to view orders</h2>
                <Link to="/login" className="btn-primary">Sign In</Link>
            </div>
        );
    }

    return (
        <div className="container section" style={{ paddingTop: 'calc(var(--nav-height) + 40px)' }}>
            <h1 className="section-title" style={{ marginBottom: '40px' }}>
                My <span className="neon-text">Orders</span>
            </h1>

            {orders.length === 0 ? (
                <div className="glass-card" style={{ padding: '80px 0', textAlign: 'center' }}>
                    <FiPackage size={60} color="var(--text-muted)" style={{ marginBottom: '24px' }} />
                    <h3>No orders found</h3>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {orders.map((order) => (
                        <div key={order._id} className="glass-card" style={{ padding: '32px', borderLeft: '4px solid var(--neon-cyan)' }}>
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
                                <div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Order ID</p>
                                    <p style={{ fontFamily: 'monospace', fontSize: '1rem', color: 'var(--neon-cyan)' }}>#{order._id?.slice(-7)}</p>
                                </div>
                                {order.trackingId && (
                                    <div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Tracking #</p>
                                        <p style={{ fontFamily: 'monospace', fontSize: '1rem', color: 'var(--neon-pink)', fontWeight: 700 }}>{order.trackingId}</p>
                                    </div>
                                )}
                                <div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Date</p>
                                    <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <FiCalendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Status</p>
                                    <span className={`badge badge-status-${order.status}`}>{order.status}</span>
                                </div>
                                <div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Total Amount</p>
                                    <p style={{ fontWeight: 800, fontSize: '1.2rem' }}>PKR {order.totalAmount.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="divider" />

                            {/* Grid content */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                                {/* Items */}
                                <div>
                                    <p style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '16px' }}>Items</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {order.items.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                <img src={item.image} style={{ width: '45px', height: '55px', objectFit: 'cover', borderRadius: '4px' }} alt="" />
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.name}</p>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Size: {item.size} | Qty: {item.qty}</p>
                                                </div>
                                                <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>PKR {(item.price * item.qty).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shipping info */}
                                <div>
                                    <p style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '16px' }}>Delivery Address</p>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        <FiMapPin size={16} color="var(--neon-pink)" style={{ marginTop: '3px' }} />
                                        <div>
                                            <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px' }}>{order.shippingAddress.fullName}</p>
                                            <p>{order.shippingAddress.address}</p>
                                            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                            <p style={{ marginTop: '4px' }}>{order.shippingAddress.phone}</p>
                                        </div>
                                    </div>
                                    {order.shippingImage && (
                                        <div style={{ marginTop: '20px' }}>
                                            <p style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '10px', color: 'var(--neon-green)' }}>📦 Parcel Photo:</p>
                                            <img 
                                                src={order.shippingImage} 
                                                alt="Parcel Proof" 
                                                style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-glass)', cursor: 'zoom-in' }} 
                                                onClick={() => window.open(order.shippingImage, '_blank')}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Progress Tracker (Visual) */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '15px', left: '0', right: '0', height: '2px', background: 'var(--border-glass)', zIndex: 0 }} />
                                <div style={{ position: 'absolute', top: '15px', left: '0', height: '2px', background: 'var(--neon-cyan)', zIndex: 0, width: order.status === 'delivered' ? '100%' : order.status === 'shipped' ? '66%' : order.status === 'processing' ? '33%' : '0%' }} />

                                {[
                                    { label: 'Pending', icon: FiPackage, active: true },
                                    { label: 'Processing', icon: FiTruck, active: ['processing', 'shipped', 'delivered'].includes(order.status) },
                                    { label: 'Shipped', icon: FiTruck, active: ['shipped', 'delivered'].includes(order.status) },
                                    { label: 'Delivered', icon: FiCheckCircle, active: order.status === 'delivered' }
                                ].map((step, i) => (
                                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 1 }}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '50%', background: step.active ? 'var(--neon-cyan)' : 'var(--bg-secondary)',
                                            border: `2px solid ${step.active ? 'var(--neon-cyan)' : 'var(--border-glass)'}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: step.active ? 'var(--bg-primary)' : 'var(--text-muted)'
                                        }}>
                                            <step.icon size={16} />
                                        </div>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: step.active ? 'var(--text-primary)' : 'var(--text-muted)' }}>{step.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
