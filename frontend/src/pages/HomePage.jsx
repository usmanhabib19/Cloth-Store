import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiZap, FiTruck, FiShield, FiHeadphones } from 'react-icons/fi';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const categories = [
    { label: 'Men', key: 'men', icon: '👔', color: 'var(--neon-cyan)' },
    { label: 'Women', key: 'women', icon: '👗', color: 'var(--neon-pink)' },
    { label: 'Kids', key: 'kids', icon: '🎒', color: 'var(--neon-green)' },
    { label: 'Accessories', key: 'accessories', icon: '👜', color: 'var(--neon-orange)' },
];

const features = [
    { icon: FiTruck, title: 'Free Delivery', desc: 'On orders above PKR 3,000', color: 'var(--neon-cyan)' },
    { icon: FiShield, title: 'Original Products', desc: '100% authentic guarantee', color: 'var(--neon-purple)' },
    { icon: FiZap, title: 'Fast Processing', desc: 'Same-day order processing', color: 'var(--neon-green)' },
    { icon: FiHeadphones, title: '24/7 Support', desc: 'Always here to help', color: 'var(--neon-orange)' },
];

export default function HomePage() {
    const [featured, setFeatured] = useState([]);
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [prodRes, dealRes] = await Promise.all([
                    api.get('/products?featured=true&limit=8'),
                    api.get('/deals')
                ]);
                
                let featuredProducts = prodRes.data.products || [];
                
                // Fallback: if no featured products, get latest 8
                if (featuredProducts.length === 0) {
                    const fallbackRes = await api.get('/products?limit=8');
                    featuredProducts = fallbackRes.data.products || [];
                }
                
                setFeatured(featuredProducts);
                setDeals(dealRes.data || []);
            } catch (err) {
                console.error('Error loading home data:', err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const primaryBanner = deals.find(d => d.type === 'primary_banner');
    const featuredDeal = deals.find(d => d.type === 'featured_deal');

    return (
        <div>
            {/* ── Hero ── */}
            <section style={{
                minHeight: '100vh',
                background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,245,255,0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 50%, rgba(139,92,246,0.1) 0%, transparent 70%), var(--bg-primary)',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                paddingTop: 'var(--nav-height)',
            }}>
                {/* Grid background */}
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.04,
                    backgroundImage: 'linear-gradient(var(--neon-cyan) 1px, transparent 1px), linear-gradient(90deg, var(--neon-cyan) 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                    pointerEvents: 'none',
                }} />
                {/* Floating orbs */}
                <div style={{ position: 'absolute', top: '20%', right: '10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)', borderRadius: '50%', animation: 'float 6s ease-in-out infinite', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '20%', left: '5%', width: 200, height: 200, background: 'radial-gradient(circle, rgba(0,245,255,0.1), transparent 70%)', borderRadius: '50%', animation: 'float 8s ease-in-out infinite 2s', pointerEvents: 'none' }} />

                <div className="container" style={{ position: 'relative', zIndex: 1, padding: '80px 24px' }}>
                    <div style={{ maxWidth: 760 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.2)', marginBottom: '24px' }}>
                            <FiZap size={14} color="var(--neon-cyan)" />
                            <span style={{ fontSize: '0.8rem', color: 'var(--neon-cyan)', fontWeight: 600, letterSpacing: 1 }}>{primaryBanner?.subtitle || 'NEW COLLECTION 2026'}</span>
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.8rem, 8vw, 5.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1px' }}>
                            {primaryBanner?.title ? (
                                <>
                                    {primaryBanner.title.split(' ').slice(0, -1).join(' ')} <span className="neon-text">{primaryBanner.title.split(' ').slice(-1)}</span>
                                </>
                            ) : (
                                <>Wear The <span className="neon-text">Future</span><br />
                                <span className="neon-text-pink">Define Yourself</span></>
                            )}
                        </h1>
                        <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--text-secondary)', maxWidth: 500, marginBottom: '40px', lineHeight: 1.7 }}>
                            {primaryBanner?.description || 'Discover premium fashion that lives at the intersection of luxury and streetwear. Neon-lit aesthetics for a bold generation.'}
                        </p>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <Link to={primaryBanner?.buttonLink || '/shop'} className="btn-primary" style={{ fontSize: '1rem', padding: '14px 36px' }}>
                                {primaryBanner?.buttonText || 'Shop Now'} <FiArrowRight />
                            </Link>
                            {!primaryBanner && (
                                <Link to="/shop?featured=true" className="btn-outline" style={{ fontSize: '1rem', padding: '13px 36px' }}>
                                    Featured Drops
                                </Link>
                            )}
                        </div>
                        {/* Stats */}
                        <div style={{ display: 'flex', gap: '40px', marginTop: '60px', flexWrap: 'wrap' }}>
                            {[['10K+', 'Happy Customers'], ['500+', 'Premium Products'], ['4.9', 'Average Rating']].map(([num, label]) => (
                                <div key={label}>
                                    <div style={{ fontSize: '2rem', fontWeight: 900 }} className="neon-text">{num}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Categories ── */}
            <section className="section">
                <div className="container">
                    <div style={{ marginBottom: '40px' }}>
                        <h2 className="section-title">Shop by <span className="neon-text">Category</span></h2>
                        <p className="section-subtitle">Explore our curated collections for every style and occasion.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        {categories.map((cat) => (
                            <Link to={`/shop?category=${cat.key}`} key={cat.key}>
                                <div className="glass-card" style={{
                                    padding: '32px 24px',
                                    textAlign: 'center',
                                    transition: 'var(--transition)',
                                    cursor: 'pointer',
                                }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 0 30px ${cat.color}22`; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{cat.icon}</div>
                                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: cat.color }}>{cat.label}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>Explore →</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Featured Products ── */}
            <section className="section" style={{ paddingTop: 0 }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h2 className="section-title">
                                {featured.length > 0 ? (
                                    <>Featured <span className="neon-text">Drops</span></>
                                ) : (
                                    <>Latest <span className="neon-text">Arrivals</span></>
                                )}
                            </h2>
                            <p className="section-subtitle">
                                {featured.length > 0 
                                    ? "Our hottest picks of the season, handcurated for you."
                                    : "Check out the newest additions to our collection."
                                }
                            </p>
                        </div>
                        <Link to="/shop" className="btn-ghost">View All <FiArrowRight /></Link>
                    </div>
                    {loading ? (
                        <div className="spinner-container"><div className="spinner"></div></div>
                    ) : (
                        <div className="grid-products">
                            {featured.slice(0, 8).map((p) => <ProductCard key={p._id} product={p} />)}
                        </div>
                    )}
                </div>
            </section>

            {/* ── Features ── */}
            <section className="section" style={{ paddingTop: 0 }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                        {features.map(({ icon: Icon, title, desc, color }) => (
                            <div key={title} className="glass-card" style={{ padding: '28px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                <div style={{ width: 48, height: 48, borderRadius: '12px', background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Icon size={22} color={color} />
                                </div>
                                <div>
                                    <h4 style={{ fontWeight: 700, marginBottom: '4px' }}>{title}</h4>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="section" style={{ paddingTop: 0 }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 className="section-title">Loved by <span className="neon-text">Thousands</span></h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        {[
                            { name: 'Ayesha Khan', rating: 5, text: 'The quality is unmatched! The Urban Bomber Jacket literally glows. Will definitely order more.', avatar: '👩' },
                            { name: 'Ahmed Raza', rating: 5, text: 'Fast delivery, premium packaging, and the clothes feel incredibly luxurious. 10/10 experience!', avatar: '👨' },
                            { name: 'Sara Ali', rating: 5, text: 'The Crystal Evening Dress was perfect for my event. Got so many compliments. LUMINARA is my go-to!', avatar: '👩‍🦱' },
                        ].map((t) => (
                            <div key={t.name} className="glass-card" style={{ padding: '28px' }}>
                                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                                    {[...Array(t.rating)].map((_, i) => <FiStar key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '20px' }}>"{t.text}"</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '1.8rem' }}>{t.avatar}</span>
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--neon-cyan)' }}>Verified Buyer</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Floating Sale Icon */}
            <Link 
                to="/deals" 
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    left: '30px',
                    width: '70px',
                    height: '70px',
                    background: 'var(--neon-pink)',
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textDecoration: 'none',
                    boxShadow: '0 0 20px var(--neon-pink)',
                    zIndex: 9999,
                    animation: 'pulse 2s infinite',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    border: '2px solid rgba(255,255,255,0.3)',
                    transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
                <FiZap size={20} style={{ marginBottom: '-2px' }} />
                <span>SALE</span>
                <style>{`
                    @keyframes pulse {
                        0% { transform: scale(1); box-shadow: 0 0 10px var(--neon-pink); }
                        50% { transform: scale(1.05); box-shadow: 0 0 25px var(--neon-pink); }
                        100% { transform: scale(1); box-shadow: 0 0 10px var(--neon-pink); }
                    }
                `}</style>
            </Link>
        </div>
    );
}
