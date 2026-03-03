import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { FiShoppingBag, FiHeart, FiStar, FiChevronLeft } from 'react-icons/fi';
import api from '../api/axios';

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState('');
    const [size, setSize] = useState('');
    const [qty, setQty] = useState(1);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        api.get(`/products/${id}`)
            .then((res) => {
                setProduct(res.data);
                setActiveImg(res.data.images?.[0]);
                if (res.data.sizes?.length > 0) setSize(res.data.sizes[0]);
            })
            .catch((err) => {
                toast.error('Product not found');
                navigate('/shop');
            })
            .finally(() => setLoading(false));
    }, [id, navigate]);

    if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;
    if (!product) return null;

    const handleAdd = () => {
        if (product.sizes?.length && !size) return toast.error('Please select a size');
        addToCart({ ...product, selectedSize: size || 'Free', qty });
        toast.success(`Added ${qty} ${product.name} to cart!`);
    };

    return (
        <div className="container section" style={{ paddingTop: 'calc(var(--nav-height) + 40px)' }}>
            <button onClick={() => navigate(-1)} className="btn-ghost" style={{ marginBottom: '24px', padding: '8px 16px' }}>
                <FiChevronLeft size={16} /> Back
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px' }}>
                {/* Images */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="glass-card" style={{ aspectRatio: '3/4', padding: '0', overflow: 'hidden' }}>
                        <img src={activeImg} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                        {product.images?.map((img, i) => (
                            <div
                                key={i}
                                onClick={() => setActiveImg(img)}
                                style={{
                                    width: 80, height: 100, borderRadius: '8px', overflow: 'hidden', cursor: 'pointer',
                                    border: activeImg === img ? '2px solid var(--neon-cyan)' : '2px solid transparent',
                                    opacity: activeImg === img ? 1 : 0.6, transition: 'var(--transition)', flexShrink: 0
                                }}
                            >
                                <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                        {product.featured && <span className="badge badge-new">Featured</span>}
                        <span className="badge" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
                            {product.category}
                        </span>
                    </div>

                    <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px' }}>
                        {product.name}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex' }}>
                            {[...Array(5)].map((_, i) => (
                                <FiStar key={i} size={16} fill={i < Math.floor(product.rating) ? '#f59e0b' : 'none'} color={i < Math.floor(product.rating) ? '#f59e0b' : 'var(--border-glass)'} />
                            ))}
                        </div>
                        <span style={{ color: 'var(--text-secondary)' }}>({product.numReviews} reviews)</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                        <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--neon-cyan)' }}>PKR {product.price.toLocaleString()}</span>
                        {product.originalPrice && <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{product.originalPrice.toLocaleString()}</span>}
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>
                        {product.description}
                    </p>

                    <div className="divider" />

                    {/* Size */}
                    {product.sizes?.length > 0 && (
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ fontWeight: 600 }}>Select Size</span>
                                <span style={{ color: 'var(--neon-cyan)', fontSize: '0.9rem', cursor: 'pointer' }}>Size Guide</span>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                {product.sizes.map((s) => (
                                    <button key={s} onClick={() => setSize(s)} style={{
                                        width: 48, height: 48, borderRadius: '12px',
                                        background: size === s ? 'var(--gradient-primary)' : 'var(--bg-card)',
                                        border: size === s ? 'none' : '1px solid var(--border-glass)',
                                        color: size === s ? '#fff' : 'var(--text-primary)',
                                        fontWeight: 700, cursor: 'pointer', transition: 'var(--transition)'
                                    }}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                        <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: '12px', overflow: 'hidden' }}>
                            <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: '0 20px', color: 'var(--text-primary)', fontSize: '1.2rem' }}>-</button>
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, fontWeight: 700 }}>{qty}</span>
                            <button onClick={() => setQty(Math.min(product.stock, qty + 1))} style={{ padding: '0 20px', color: 'var(--text-primary)', fontSize: '1.2rem' }}>+</button>
                        </div>
                        <button onClick={handleAdd} disabled={product.stock === 0} className="btn-primary" style={{ flex: 1, justifyContent: 'center', opacity: product.stock === 0 ? 0.5 : 1 }}>
                            <FiShoppingBag size={18} /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <button onClick={() => setLiked(!liked)} className="btn-ghost" style={{ width: 52, padding: 0, justifyContent: 'center' }}>
                            <FiHeart size={20} fill={liked ? 'var(--neon-pink)' : 'none'} color={liked ? 'var(--neon-pink)' : 'var(--text-secondary)'} />
                        </button>
                    </div>

                    {/* Meta */}
                    <div style={{ marginTop: '32px', padding: '24px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                        <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Status</span>
                            <span style={{ color: product.stock > 0 ? 'var(--neon-green)' : '#ff4444', fontWeight: 600 }}>
                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </p>
                        <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Tags</span>
                            <span style={{ color: 'var(--text-primary)' }}>{product.tags?.join(', ') || 'N/A'}</span>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
