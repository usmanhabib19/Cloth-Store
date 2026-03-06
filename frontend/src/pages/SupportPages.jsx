import { useState } from 'react';
import { FiPackage, FiRefreshCw, FiInfo, FiMail, FiMapPin, FiPhone, FiCheckCircle, FiHelpCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';

const PageHeader = ({ title, icon: Icon }) => (
    <div style={{
        padding: '80px 0 40px',
        textAlign: 'center',
        background: 'linear-gradient(to bottom, var(--bg-secondary), var(--bg-primary))',
        borderBottom: '1px solid var(--border-glass)'
    }}>
        <div className="container">
            <div style={{
                width: 60, height: 60, borderRadius: '15px',
                background: 'var(--bg-card)', border: '1px solid var(--border-glass)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', color: 'var(--neon-cyan)',
                boxShadow: '0 0 20px rgba(0, 243, 255, 0.1)'
            }}>
                <Icon size={24} />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '10px' }}>{title}</h1>
            <div className="divider" style={{ margin: '0 auto', width: 60 }} />
        </div>
    </div>
);

// --- Track Order Page ---
export const TrackOrderPage = () => {
    return (
        <div style={{ minHeight: '80vh', paddingBottom: '80px' }}>
            <PageHeader title="Track Your Order" icon={FiPackage} />
            <div className="container" style={{ maxWidth: '600px', marginTop: '60px', textAlign: 'center' }}>
                <div className="card" style={{ padding: '40px' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                        To track your order, please visit your account dashboard where you can see real-time updates for all your purchases.
                    </p>
                    <Link to="/orders" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <FiPackage /> Go to My Orders
                    </Link>
                </div>
            </div>
        </div>
    );
};

// --- Returns & Exchanges ---
export const ReturnsPage = () => (
    <div style={{ minHeight: '80vh', paddingBottom: '80px' }}>
        <PageHeader title="Returns & Exchanges" icon={FiRefreshCw} />
        <div className="container" style={{ maxWidth: '800px', marginTop: '60px' }}>
            <div className="card" style={{ padding: '40px' }}>
                <h3 style={{ marginBottom: '20px' }}>Our Policy</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.8 }}>
                    We want you to be completely satisfied with your purchase. If for any reason you are not happy, you may return or exchange eligible items within <strong>14 days</strong> of delivery.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
                    {[
                        { title: 'Free Returns', desc: 'Complimentary returns on all domestic orders.' },
                        { title: 'Easy Exchange', desc: 'Swap sizes or colors in just a few clicks.' },
                        { title: 'Full Refund', desc: 'Money back to original payment method.' }
                    ].map((item, i) => (
                        <div key={i} style={{ padding: '20px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)' }}>
                            <FiCheckCircle style={{ color: 'var(--neon-purple)', marginBottom: '10px' }} />
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '5px' }}>{item.title}</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// --- Size Guide ---
export const SizeGuidePage = () => (
    <div style={{ minHeight: '80vh', paddingBottom: '80px' }}>
        <PageHeader title="Size Guide" icon={FiInfo} />
        <div className="container" style={{ maxWidth: '800px', marginTop: '60px' }}>
            <div className="card" style={{ padding: '40px', overflowX: 'auto' }}>
                <h3 style={{ marginBottom: '20px' }}>Mens/Unisex Sizing Chart</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-secondary)' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Size</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Chest (in)</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Waist (in)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            ['S', '34-36', '28-30'],
                            ['M', '38-40', '32-34'],
                            ['L', '42-44', '36-38'],
                            ['XL', '46-48', '40-42']
                        ].map(([size, chest, waist]) => (
                            <tr key={size} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                <td style={{ padding: '15px', color: 'var(--neon-cyan)', fontWeight: 700 }}>{size}</td>
                                <td style={{ padding: '15px' }}>{chest}</td>
                                <td style={{ padding: '15px' }}>{waist}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

// --- Contact Us ---
export const ContactPage = () => {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
            subject: 'Contact Form Inquiry'
        };

        try {
            await api.post('/messages', data);
            setSubmitted(true);
            toast.success('Message sent successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '80vh', paddingBottom: '80px' }}>
            <PageHeader title="Contact Us" icon={FiMail} />
            <div className="container" style={{ marginTop: '60px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                    <div className="card" style={{ padding: '40px' }}>
                        <h3 style={{ marginBottom: '25px' }}>Get in Touch</h3>
                        {submitted ? (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <FiCheckCircle size={48} style={{ color: 'var(--neon-cyan)', marginBottom: '20px' }} />
                                <h3>Message Sent!</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>We'll get back to you within 24 hours.</p>
                                <button onClick={() => setSubmitted(false)} className="btn-primary" style={{ marginTop: '20px' }}>Send another</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input type="text" name="name" className="form-input" placeholder="Enter your name" required />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" name="email" className="form-input" placeholder="name@example.com" required />
                                </div>
                                <div className="form-group">
                                    <label>Message</label>
                                    <textarea name="message" className="form-input" style={{ minHeight: '120px' }} placeholder="How can we help?" required></textarea>
                                </div>
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {[
                            { icon: FiMapPin, title: 'Visit Us', text: '123 Neon Circuit, Tech City, 54000' },
                            { icon: FiMail, title: 'Email Support', text: 'support@subhantair.com' },
                            { icon: FiPhone, title: 'Call Center', text: '+92 312 3456789' }
                        ].map((item, i) => (
                            <div key={i} className="card" style={{ padding: '30px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <div style={{ color: 'var(--neon-purple)' }}>
                                    <item.icon size={24} />
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: '5px' }}>{item.title}</h4>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- FAQs ---
const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div style={{ borderBottom: '1px solid var(--border-glass)', padding: '20px 0' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', background: 'none', border: 'none',
                    color: isOpen ? 'var(--neon-cyan)' : 'var(--text-primary)',
                    fontWeight: 700, textAlign: 'left', cursor: 'pointer',
                    fontSize: '1.1rem', transition: 'var(--transition)'
                }}
            >
                {question}
                <span style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0)', transition: 'var(--transition)' }}>+</span>
            </button>
            {isOpen && (
                <p style={{ marginTop: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                    {answer}
                </p>
            )}
        </div>
    );
};

export const FAQPage = () => {
    const faqs = [
        { q: "How long does shipping take?", a: "Domestic shipping typically takes 3-5 business days. International shipping can take 7-14 business days depending on location." },
        { q: "Can I cancel my order?", a: "Orders can be cancelled within 1 hour of placement. After that, the processing begins, and you must follow the return procedure." },
        { q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, and Cash on Delivery (COD) in select regions." },
        { q: "Are your products sustainable?", a: "Yes, we prioritize ethically sourced materials and use eco-friendly packaging for all our shipments." }
    ];

    return (
        <div style={{ minHeight: '80vh', paddingBottom: '80px' }}>
            <PageHeader title="Frequently Asked Questions" icon={FiHelpCircle} />
            <div className="container" style={{ maxWidth: '800px', marginTop: '60px' }}>
                <div className="card" style={{ padding: '40px' }}>
                    {faqs.map((faq, i) => (
                        <FAQItem key={i} question={faq.q} answer={faq.a} />
                    ))}
                </div>
            </div>
        </div>
    );
};
