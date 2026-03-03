import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiStar } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [liked, setLiked] = useState(false);
    const [imgIdx, setImgIdx] = useState(0);

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        const size = product.sizes?.[0] || 'Free';
        addToCart({ ...product, selectedSize: size, qty: 1 });
        toast.success(`"${product.name}" added to cart!`);
    };

    const image = product.images?.[imgIdx] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600';

    return (
        <Link to={`/product/${product._id}`} style={{ display: 'block', textDecoration: 'none' }}>
            <div
                className="glass-card"
                style={{ overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'pointer' }}
                onMouseEnter={() => product.images?.[1] && setImgIdx(1)}
                onMouseLeave={() => setImgIdx(0)}
            >
                {/* Image */}
                <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', borderRadius: '14px 14px 0 0' }}>
                    <img
                        src={image}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                    {/* Badges */}
                    <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {discount > 0 && <span className="badge badge-sale">-{discount}%</span>}
                        {product.featured && <span className="badge badge-new">Featured</span>}
                    </div>
                    {/* Like */}
                    <button
                        onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
                        style={{
                            position: 'absolute', top: '12px', right: '12px',
                            width: 34, height: 34, borderRadius: '50%',
                            background: 'rgba(5,5,16,0.8)', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: liked ? '#ff00e5' : '#a0a0c0', transition: 'all 0.2s',
                        }}
                    >
                        <FiHeart size={16} fill={liked ? '#ff00e5' : 'none'} />
                    </button>
                    {/* Quick Add */}
                    <button
                        onClick={handleAddToCart}
                        style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            padding: '12px', background: 'rgba(0,245,255,0.95)',
                            color: '#050510', fontWeight: 700, fontSize: '0.875rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            transform: 'translateY(100%)', transition: 'transform 0.3s ease',
                            border: 'none', cursor: 'pointer',
                        }}
                        className="quick-add-btn"
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                        <FiShoppingBag size={16} /> Quick Add
                    </button>
                </div>

                {/* Info */}
                <div style={{ padding: '14px 16px' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize', marginBottom: '4px' }}>
                        {product.category} · {product.subCategory}
                    </p>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.3, color: 'var(--text-primary)' }}>
                        {product.name}
                    </h3>
                    {/* Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
                        <FiStar size={13} fill="#f59e0b" color="#f59e0b" />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {product.rating} ({product.numReviews})
                        </span>
                    </div>
                    {/* Price */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--neon-cyan)' }}>
                            PKR {product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                                {product.originalPrice.toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <style>{`.quick-add-btn:hover { transform: translateY(0) !important; } .glass-card:hover .quick-add-btn { transform: translateY(0) !important; }`}</style>
        </Link>
    );
}
