import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiSliders } from 'react-icons/fi';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['all', 'men', 'women', 'kids', 'accessories'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SORT_OPTIONS = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Top Rated', value: 'rating' },
];

export default function ShopPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showFilter, setShowFilter] = useState(false);

    const category = searchParams.get('category') || 'all';
    const size = searchParams.get('size') || '';
    const sort = searchParams.get('sort') || 'newest';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 12;

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        const params = { sort, page, limit };
        if (category !== 'all') params.category = category;
        if (size) params.size = size;
        if (search) params.search = search;
        api.get('/products', { params })
            .then((res) => { setProducts(res.data.products || []); setTotal(res.data.total || 0); })
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, [category, size, sort, search, page]);

    const setParam = (key, value) => {
        const sp = new URLSearchParams(searchParams);
        if (!value || value === 'all') sp.delete(key); else sp.set(key, value);
        sp.delete('page');
        setSearchParams(sp);
    };
    const setPage = (p) => { const sp = new URLSearchParams(searchParams); sp.set('page', p); setSearchParams(sp); };
    const pages = Math.ceil(total / limit);

    const FilterPanel = ({ isMobile }) => (
        <div className={isMobile ? '' : 'glass-card'} style={{ padding: '24px', ...(isMobile ? {} : {}) }}>
            <h3 style={{ fontWeight: 700, marginBottom: '24px', fontSize: '1.1rem' }}>Filters</h3>
            {/* Category */}
            <div style={{ marginBottom: '28px' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: '12px' }}>Category</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {CATEGORIES.map((c) => (
                        <button key={c} onClick={() => setParam('category', c)} style={{
                            padding: '8px 12px', borderRadius: '8px', textAlign: 'left',
                            background: category === c ? 'rgba(0,245,255,0.12)' : 'transparent',
                            border: category === c ? '1px solid rgba(0,245,255,0.3)' : '1px solid transparent',
                            color: category === c ? 'var(--neon-cyan)' : 'var(--text-secondary)',
                            fontWeight: category === c ? 700 : 400,
                            fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize',
                        }}>
                            {c === 'all' ? 'All Categories' : c}
                        </button>
                    ))}
                </div>
            </div>
            {/* Sizes */}
            <div style={{ marginBottom: '28px' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: '12px' }}>Size</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {SIZES.map((s) => (
                        <button key={s} onClick={() => setParam('size', size === s ? '' : s)} style={{
                            width: 42, height: 42, borderRadius: '8px',
                            background: size === s ? 'var(--gradient-primary)' : 'var(--bg-card)',
                            border: size === s ? 'none' : '1px solid var(--border-glass)',
                            color: size === s ? '#050510' : 'var(--text-secondary)',
                            fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s',
                        }}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>
            {/* Clear */}
            <button onClick={() => setSearchParams({})} className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                Clear All Filters
            </button>
        </div>
    );

    return (
        <div style={{ paddingTop: 'var(--nav-height)' }}>
            {/* Header */}
            <div style={{
                background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,245,255,0.06), transparent)',
                padding: '50px 0 30px', borderBottom: '1px solid var(--border-glass)',
            }}>
                <div className="container">
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '8px' }}>
                        {search ? `"${search}"` : category !== 'all' ? <span style={{ textTransform: 'capitalize' }}>{category}&rsquo;s Collection</span> : <><span className="neon-text">All</span> Collections</>}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {loading ? 'Loading...' : `${total} products found`}
                    </p>
                </div>
            </div>

            <div className="container" style={{ padding: '40px 24px' }}>
                {/* Sort + Mobile Filter Toggle */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                    <button className="btn-ghost" onClick={() => setShowFilter(!showFilter)} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <FiFilter size={16} /> Filters {showFilter ? <FiX size={14} /> : ''}
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FiSliders size={16} color="var(--text-muted)" />
                        <select value={sort} onChange={(e) => setParam('sort', e.target.value)} className="form-input" style={{ padding: '8px 14px', fontSize: '0.875rem' }}>
                            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: showFilter ? '260px 1fr' : '1fr', gap: '32px' }}>
                    {/* Filter Sidebar */}
                    {showFilter && (
                        <div style={{ position: 'sticky', top: 'calc(var(--nav-height) + 20px)', alignSelf: 'start' }}>
                            <FilterPanel />
                        </div>
                    )}

                    {/* Products */}
                    <div>
                        {loading ? (
                            <div className="spinner-container"><div className="spinner"></div></div>
                        ) : products.length === 0 ? (
                            <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
                                <p style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</p>
                                <h3 style={{ marginBottom: '8px' }}>No products found</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters or search term.</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid-products">
                                    {products.map((p) => <ProductCard key={p._id} product={p} />)}
                                </div>
                                {/* Pagination */}
                                {pages > 1 && (
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px', flexWrap: 'wrap' }}>
                                        {[...Array(pages)].map((_, i) => (
                                            <button key={i} onClick={() => setPage(i + 1)} style={{
                                                width: 40, height: 40, borderRadius: '10px',
                                                background: page === i + 1 ? 'var(--gradient-primary)' : 'var(--bg-card)',
                                                border: page === i + 1 ? 'none' : '1px solid var(--border-glass)',
                                                color: page === i + 1 ? '#050510' : 'var(--text-secondary)',
                                                fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                                            }}>{i + 1}</button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
