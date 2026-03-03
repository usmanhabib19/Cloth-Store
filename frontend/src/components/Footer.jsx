import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiMail } from 'react-icons/fi';

export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer style={{
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-glass)',
            padding: '60px 0 30px',
        }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '48px' }}>
                    {/* Brand */}
                    <div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '12px' }}>
                            ✦ LUMI<span className="neon-text">NARA</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem', maxWidth: 240 }}>
                            Elevating your wardrobe with premium fashion. Neon meets luxury.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                            {[FiInstagram, FiTwitter, FiFacebook, FiYoutube].map((Icon, i) => (
                                <a key={i} href="#" style={{
                                    width: 38, height: 38, borderRadius: '10px',
                                    background: 'var(--bg-card)', border: '1px solid var(--border-glass)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--text-secondary)', transition: 'var(--transition)',
                                }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--neon-cyan)'; e.currentTarget.style.color = 'var(--neon-cyan)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-glass)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 style={{ fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>Shop</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {['Men', 'Women', 'Kids', 'Accessories', 'Sale'].map((item) => (
                                <li key={item}>
                                    <Link to={`/shop?category=${item.toLowerCase()}`} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'color 0.2s' }}
                                        onMouseEnter={(e) => (e.target.style.color = 'var(--neon-cyan)')}
                                        onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
                                    >{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help */}
                    <div>
                        <h4 style={{ fontWeight: 700, marginBottom: '16px' }}>Help</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {['Track Order', 'Returns & Exchanges', 'Size Guide', 'Contact Us', 'FAQs'].map((item) => (
                                <li key={item}>
                                    <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'color 0.2s' }}
                                        onMouseEnter={(e) => (e.target.style.color = 'var(--neon-cyan)')}
                                        onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
                                    >{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 style={{ fontWeight: 700, marginBottom: '12px' }}>Stay in Style</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '16px' }}>
                            Get exclusive drops, style tips & offers.
                        </p>
                        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="form-input"
                                    style={{ flex: 1, minWidth: 0 }}
                                />
                                <button type="submit" style={{
                                    padding: '12px', background: 'var(--gradient-primary)',
                                    borderRadius: '10px', color: '#fff', display: 'flex', alignItems: 'center',
                                    border: 'none', cursor: 'pointer',
                                }}>
                                    <FiMail size={16} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="divider" />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        © {year} LUMINARA. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {['Privacy Policy', 'Terms of Service', 'Cookies'].map((t) => (
                            <a key={t} href="#" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', transition: 'color 0.2s' }}
                                onMouseEnter={(e) => (e.target.style.color = 'var(--text-secondary)')}
                                onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}
                            >{t}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
