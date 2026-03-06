import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { FiShoppingBag, FiHeart, FiStar, FiChevronLeft } from 'react-icons/fi';
import api from '../api/axios';
import ProductVideo from '../components/ProductVideo';

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
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

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
        addToCart({ ...product, selectedSize: size || 'Free', qty });
        toast.success(`Added ${qty} ${product.name} to cart!`);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!reviewComment.trim()) return toast.error('Please enter a comment');
        setSubmittingReview(true);
        try {
            await api.post(`/products/${id}/reviews`, { rating: reviewRating, comment: reviewComment });
            toast.success('Review submitted!');
            setReviewComment('');
            setReviewRating(5);
            // Refresh product data
            const res = await api.get(`/products/${id}`);
            setProduct(res.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
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

                    {/* Product Video */}
                    {product.video && (
                        <div style={{ marginTop: '24px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>
                                Product Video
                            </h3>
                            <ProductVideo src={product.video} poster={product.images?.[0]} />
                        </div>
                    )}
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

            {/* Reviews Section */}
            <div style={{ marginTop: '80px' }}>
                <div className="divider" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', marginTop: '40px' }}>
                    {/* List */}
                    <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '30px' }}>
                            Customer <span className="neon-text">Reviews</span>
                        </h2>
                        {product.reviews?.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to review this product!</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {product.reviews.map((rev) => (
                                    <div key={rev._id} className="glass-card" style={{ padding: '24px', border: '1px solid var(--border-glass)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <span style={{ fontWeight: 700, color: 'var(--neon-cyan)' }}>{rev.name}</span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                {new Date(rev.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <FiStar key={i} size={14} fill={i < rev.rating ? '#f59e0b' : 'none'} color={i < rev.rating ? '#f59e0b' : 'var(--border-glass)'} />
                                            ))}
                                        </div>
                                        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{rev.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Form */}
                    <div className="glass-card" style={{ padding: '40px' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px' }}>Write a Review</h3>
                        <form onSubmit={handleReviewSubmit}>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>Rating</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewRating(star)}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                                                color: star <= reviewRating ? '#f59e0b' : 'var(--border-glass)',
                                                transition: 'transform 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        >
                                            <FiStar size={24} fill={star <= reviewRating ? '#f59e0b' : 'none'} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>Your Comment</label>
                                <textarea
                                    className="form-input"
                                    rows="4"
                                    placeholder="Tell us what you think..."
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    style={{ width: '100%', resize: 'none' }}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn-primary" disabled={submittingReview} style={{ width: '100%', justifyContent: 'center' }}>
                                {submittingReview ? <div className="spinner" style={{ width: 16, height: 16 }} /> : 'Submit Review'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
