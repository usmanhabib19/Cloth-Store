import { useState, useEffect } from 'react';
import { FiTag, FiCopy, FiZap, FiArrowRight, FiClock } from 'react-icons/fi';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function DealsPage() {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const res = await api.get('/deals');
                setDeals(res.data || []);
            } catch (err) {
                console.error('Error fetching deals:', err);
                toast.error('Failed to load active deals');
            } finally {
                setLoading(false);
            }
        };
        fetchDeals();
    }, []);

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        toast.success(`Code ${code} copied!`);
    };

    if (loading) {
        return (
            <div className="spinner-container" style={{ minHeight: '80vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '100px' }}>
            {/* Header */}
            <header style={{
                padding: '120px 0 60px',
                background: 'radial-gradient(circle at 50% 0%, rgba(255, 0, 229, 0.1), transparent 70%), var(--bg-primary)',
                textAlign: 'center',
                borderBottom: '1px solid var(--border-glass)'
            }}>
                <div className="container">
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '10px',
                        padding: '8px 16px', borderRadius: '99px',
                        background: 'rgba(255, 0, 229, 0.1)', border: '1px solid rgba(255, 0, 229, 0.2)',
                        color: 'var(--neon-pink)', fontWeight: 700, fontSize: '0.85rem',
                        marginBottom: '20px'
                    }}>
                        <FiZap size={16} /> EXCLUSIVE OFFERS
                    </div>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 900, marginBottom: '16px' }}>
                        Active <span className="neon-text-pink">Sales & Deals</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
                        Don't miss out on our premium collections. Save big with these limited-time promotions and exclusive discount codes.
                    </p>
                </div>
            </header>

            <div className="container" style={{ marginTop: '60px' }}>
                {deals.length === 0 ? (
                    <div className="glass-card" style={{ padding: '80px 40px', textAlign: 'center' }}>
                        <FiTag size={48} style={{ color: 'var(--text-muted)', marginBottom: '20px', opacity: 0.5 }} />
                        <h3>No Active Deals Right Now</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>We're preparing some amazing offers for you. Check back soon!</p>
                        <Link to="/shop" className="btn-primary">Browse Collection</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                        {deals.map((deal) => (
                            <div key={deal._id} className="glass-card" style={{ 
                                overflow: 'hidden', display: 'flex', flexDirection: 'column',
                                transition: 'var(--transition)', border: '1px solid var(--border-glass)'
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                                    <img src={deal.image} alt={deal.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{
                                        position: 'absolute', top: '15px', right: '15px',
                                        background: 'rgba(10, 10, 20, 0.8)', backdropFilter: 'blur(10px)',
                                        padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-glass)',
                                        color: 'var(--neon-cyan)', fontSize: '0.8rem', fontWeight: 700,
                                        display: 'flex', alignItems: 'center', gap: '6px'
                                    }}>
                                        <FiClock size={14} /> Limited Time
                                    </div>
                                </div>
                                
                                <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h4 style={{ color: 'var(--neon-pink)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        {deal.subtitle}
                                    </h4>
                                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '15px' }}>{deal.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '25px', flex: 1 }}>
                                        {deal.description}
                                    </p>

                                    {deal.discountCode && (
                                        <div style={{ 
                                            background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--border-glass)',
                                            padding: '15px', borderRadius: '12px', marginBottom: '20px',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                        }}>
                                            <div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Promo Code</div>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--neon-cyan)', letterSpacing: '2px' }}>{deal.discountCode}</div>
                                            </div>
                                            <button 
                                                onClick={() => copyCode(deal.discountCode)}
                                                className="iconBtn"
                                                title="Copy Code"
                                                style={{ background: 'rgba(0, 245, 255, 0.1)', color: 'var(--neon-cyan)' }}
                                            >
                                                <FiCopy size={18} />
                                            </button>
                                        </div>
                                    )}

                                    <Link to={deal.buttonLink || '/shop'} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                        {deal.buttonText || 'Claim Deal'} <FiArrowRight />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Newsletter section maybe? */}
            <div className="container" style={{ marginTop: '100px' }}>
                <div className="glass-card" style={{ 
                    padding: '60px', textAlign: 'center', 
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(0, 245, 255, 0.1))',
                    borderRadius: '30px'
                }}>
                    <h2 style={{ marginBottom: '15px' }}>Join the <span className="neon-text">VIP</span> List</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', maxWidth: '500px', margin: '0 auto 30px' }}>
                        Be the first to hear about new drops and get exclusive early access to our major sales events.
                    </p>
                    <div style={{ display: 'flex', gap: '10px', maxWidth: '450px', margin: '0 auto', flexWrap: 'wrap' }}>
                        <input type="email" placeholder="Enter your email" className="form-input" style={{ flex: 1, minWidth: '200px' }} />
                        <button className="btn-primary">Subscribe Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
