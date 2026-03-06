import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
    FiPlus, FiEdit2, FiTrash2, FiShoppingBag, FiLayers,
    FiX, FiCheck, FiPackage, FiTrendingUp, FiDollarSign,
    FiUploadCloud, FiImage, FiChevronDown, FiVideo, FiTag, FiPercent, FiCopy
} from 'react-icons/fi';
import api from '../api/axios';
import styles from './AdminPage.module.css';

const CATEGORIES = ['men', 'women', 'kids', 'accessories'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS = {
    pending: '#f59e0b',
    processing: '#3b82f6',
    shipped: '#8b5cf6',
    delivered: '#10b981',
    cancelled: '#ef4444',
};

const EMPTY_FORM = {
    name: '', description: '', price: '', originalPrice: '',
    category: 'men', sizes: ['M', 'L'], stock: 10, featured: false, images: [], video: null
};

const DEAL_EMPTY_FORM = {
    title: '', subtitle: '', description: '', discountCode: '',
    buttonText: 'Shop Now', buttonLink: '/shop', type: 'featured_deal', isActive: true, image: null,
    discountPercentage: 0
};

export default function AdminPage() {
    const { user, loading: authLoading } = useAuth();
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('products');
    const [showForm, setShowForm] = useState(false);
    const [showDealForm, setShowDealForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [dealFormData, setDealFormData] = useState(DEAL_EMPTY_FORM);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [videoPreview, setVideoPreview] = useState(null);
    const [dealImagePreview, setDealImagePreview] = useState(null);
    const [showShippingModal, setShowShippingModal] = useState(false);
    const [shippingOrderId, setShippingOrderId] = useState(null);
    const [shippingFile, setShippingFile] = useState(null);
    const [shippingPreview, setShippingPreview] = useState(null);
    const [uploadingShip, setUploadingShip] = useState(false);

    const isSignedIn = !!user && user.isAdmin;

    useEffect(() => {
        if (!authLoading && isSignedIn) fetchData();
    }, [authLoading, isSignedIn]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Products
            try {
                const prodRes = await api.get('/products?limit=100');
                setProducts(prodRes.data.products || []);
            } catch (err) {
                console.error('Products fetch error:', err);
                toast.error(`Products: ${err.response?.data?.message || err.message}`);
            }

            // Fetch Orders
            try {
                const orderRes = await api.get('/orders');
                setOrders(orderRes.data || []);
            } catch (err) {
                console.error('Orders fetch error:', err);
                toast.error(`Orders: ${err.response?.data?.message || err.message}`);
            }

            // Fetch Deals
            try {
                const dealRes = await api.get('/deals/admin');
                setDeals(dealRes.data || []);
            } catch (err) {
                console.error('Deals fetch error:', err);
                toast.error(`Deals: ${err.response?.data?.message || err.message}`);
            }
        } catch (err) {
            console.error('General fetch error:', err);
            toast.error('Failed to initialize data');
        } finally {
            setLoading(false);
        }
    };

    const openForm = (product = null) => {
        if (product) {
            setEditingId(product._id);
            setFormData({ ...product, images: [], video: null });
            setImagePreviews(product.images || []);
            setVideoPreview(product.video || null);
        } else {
            setEditingId(null);
            setFormData(EMPTY_FORM);
            setImagePreviews([]);
            setVideoPreview(null);
        }
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData(EMPTY_FORM);
        setImagePreviews([]);
        setVideoPreview(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        setFormData(prev => ({ ...prev, images: files }));
        const previews = [];
        for (let i = 0; i < Math.min(files.length, 5); i++) {
            previews.push(URL.createObjectURL(files[i]));
        }
        setImagePreviews(previews);
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, video: file }));
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const toggleSize = (size) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    const openDealForm = (deal = null) => {
        if (deal) {
            setEditingId(deal._id);
            setDealFormData({ ...deal, image: null });
            setDealImagePreview(deal.image);
        } else {
            setEditingId(null);
            setDealFormData(DEAL_EMPTY_FORM);
            setDealImagePreview(null);
        }
        setShowDealForm(true);
    };

    const closeDealForm = () => {
        setShowDealForm(false);
        setEditingId(null);
        setDealFormData(DEAL_EMPTY_FORM);
        setDealImagePreview(null);
    };

    const handleDealChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDealFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleDealImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDealFormData(prev => ({ ...prev, image: file }));
            setDealImagePreview(URL.createObjectURL(file));
        }
    };

    const handleDealSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const data = new FormData();
        Object.keys(dealFormData).forEach(key => {
            if (key === 'image' && dealFormData.image) {
                data.append('image', dealFormData.image);
            } else {
                data.append(key, dealFormData[key]);
            }
        });

        try {
            if (editingId) {
                await api.put(`/deals/${editingId}`, data);
                toast.success('Deal updated!');
            } else {
                await api.post('/deals', data);
                toast.success('Deal created!');
            }
            closeDealForm();
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteDeal = async (id) => {
        if (!window.confirm('Delete this deal?')) return;
        try {
            await api.delete(`/deals/${id}`);
            toast.success('Deal removed');
            fetchData();
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'images') {
                for (let i = 0; i < formData.images.length; i++) {
                    data.append('images', formData.images[i]);
                }
            } else if (key === 'video') {
                if (formData.video) {
                    data.append('video', formData.video);
                }
            } else if (key === 'sizes') {
                data.append('sizes', JSON.stringify(formData.sizes));
            } else {
                data.append(key, formData[key]);
            }
        });
        try {
            if (editingId) {
                await api.put(`/products/${editingId}`, data);
                toast.success('Product updated!');
            } else {
                await api.post('/products', data);
                toast.success('Product added!');
            }
            closeForm();
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Operation failed');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success('Product deleted');
            fetchData();
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    const updateOrderStatus = async (id, status, trackingId, shippingImage) => {
        try {
            await api.patch(`/orders/${id}/status`, { status, trackingId, shippingImage });
            toast.success('Order updated');
            fetchData();
        } catch (err) {
            toast.error('Update failed');
        }
    };

    const handleShippingUpload = async (e) => {
        e.preventDefault();
        if (!shippingFile) return toast.error('Please select an image');
        setUploadingShip(true);
        const data = new FormData();
        data.append('images', shippingFile);
        try {
            const res = await api.post('/upload', data);
            const imageUrl = res.data.urls[0];
            await updateOrderStatus(shippingOrderId, 'shipped', orders.find(o => o._id === shippingOrderId)?.trackingId, imageUrl);
            setShowShippingModal(false);
            setShippingFile(null);
            setShippingPreview(null);
        } catch (err) {
            console.error('Shipping upload error:', err);
            toast.error(err.response?.data?.message || err.message || 'Upload failed');
        } finally {
            setUploadingShip(false);
        }
    };

    if (authLoading || !isSignedIn) {
        return (
            <div className={styles.loadScreen}>
                <div className={styles.spinner} />
            </div>
        );
    }

    // Stats
    const totalRevenue = orders.filter(o => o.status === 'delivered')
        .reduce((s, o) => s + (o.totalAmount || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    return (
        <div className={styles.page}>
            {/* ── Header ── */}
            <div className={styles.header}>
                <div>
                    <p className={styles.headerSub}>Welcome back, {user?.name || 'Admin'} 👋</p>
                    <h1 className={styles.headerTitle}>Admin <span className={styles.neon}>Dashboard</span></h1>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className={styles.addBtn} onClick={() => activeTab === 'deals' ? openDealForm() : openForm()} style={{ background: activeTab === 'deals' ? 'linear-gradient(135deg, #ff00e5, #8b5cf6)' : undefined }}>
                        <FiPlus size={16} /> {activeTab === 'deals' ? 'Add Deal' : 'Add Product'}
                    </button>
                </div>
            </div>

            {/* ── Stats ── */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(0,245,255,0.1)', color: '#00f5ff' }}>
                        <FiLayers size={22} />
                    </div>
                    <div>
                        <p className={styles.statLabel}>Total Products</p>
                        <p className={styles.statValue}>{products.length}</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(255,0,229,0.1)', color: '#ff00e5' }}>
                        <FiShoppingBag size={22} />
                    </div>
                    <div>
                        <p className={styles.statLabel}>Total Orders</p>
                        <p className={styles.statValue}>{orders.length}</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                        <FiPackage size={22} />
                    </div>
                    <div>
                        <p className={styles.statLabel}>Pending Orders</p>
                        <p className={styles.statValue}>{pendingOrders}</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                        <FiDollarSign size={22} />
                    </div>
                    <div>
                        <p className={styles.statLabel}>Revenue (Delivered)</p>
                        <p className={styles.statValue}>PKR {totalRevenue.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'products' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('products')}
                >
                    <FiLayers size={16} /> Products
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'orders' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    <FiShoppingBag size={16} /> Orders
                    {pendingOrders > 0 && <span className={styles.tabBadge}>{pendingOrders}</span>}
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'deals' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('deals')}
                >
                    <FiTag size={16} /> Deals & Ads
                </button>
            </div>

            {/* ── Products Tab ── */}
            {activeTab === 'products' && (
                <div className={styles.tableCard}>
                    {loading ? (
                        <div className={styles.tableLoading}><div className={styles.spinner} /></div>
                    ) : products.length === 0 ? (
                        <div className={styles.emptyState}>
                            <FiImage size={48} className={styles.emptyIcon} />
                            <p>No products yet. Add your first product!</p>
                            <button className={styles.addBtn} onClick={() => openForm()}>
                                <FiPlus size={14} /> Add Product
                            </button>
                        </div>
                    ) : (
                        <div className={styles.tableWrap}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Featured</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(p => (
                                        <tr key={p._id} className={styles.tableRow}>
                                            <td>
                                                <div className={styles.productCell}>
                                                    <img
                                                        src={p.images?.[0] || 'https://placehold.co/48x48/0a0a1a/ffffff?text=?'}
                                                        alt={p.name}
                                                        className={styles.productThumb}
                                                    />
                                                    <span className={styles.productName}>{p.name}</span>
                                                </div>
                                            </td>
                                            <td><span className={styles.categoryBadge}>{p.category}</span></td>
                                            <td className={styles.priceCell}>PKR {p.price?.toLocaleString()}</td>
                                            <td>
                                                <span className={`${styles.stockBadge} ${p.stock < 5 ? styles.stockLow : ''}`}>
                                                    {p.stock}
                                                </span>
                                            </td>
                                            <td>
                                                {p.featured
                                                    ? <span className={styles.featuredYes}><FiCheck size={14} /> Yes</span>
                                                    : <span className={styles.featuredNo}>No</span>}
                                            </td>
                                            <td>
                                                <div className={styles.actionBtns}>
                                                    <button className={styles.editBtn} onClick={() => openForm(p)}>
                                                        <FiEdit2 size={14} />
                                                    </button>
                                                    <button className={styles.deleteBtn} onClick={() => handleDelete(p._id)}>
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ── Orders Tab ── */}
            {activeTab === 'orders' && (
                <div className={styles.tableCard}>
                    {loading ? (
                        <div className={styles.tableLoading}><div className={styles.spinner} /></div>
                    ) : orders.length === 0 ? (
                        <div className={styles.emptyState}>
                            <FiShoppingBag size={48} className={styles.emptyIcon} />
                            <p>No orders yet.</p>
                        </div>
                    ) : (
                        <div className={styles.tableWrap}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Tracking ID</th>
                                        <th>Update</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(o => (
                                        <tr key={o._id} className={styles.tableRow}>
                                            <td>
                                                <span className={styles.orderId}>#{o._id?.slice(-7)}</span>
                                            </td>
                                            <td className={styles.customerCell}>{o.shippingAddress?.fullName}</td>
                                            <td className={styles.itemsCell}>{o.items?.length || 0} items</td>
                                            <td className={styles.priceCell}>PKR {o.totalAmount?.toLocaleString()}</td>
                                            <td>
                                                <span
                                                    className={styles.statusBadge}
                                                    style={{ background: `${STATUS_COLORS[o.status]}22`, color: STATUS_COLORS[o.status], borderColor: `${STATUS_COLORS[o.status]}44` }}
                                                >
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td>
                                                <input 
                                                    className={styles.statusSelect} 
                                                    style={{ width: '120px', fontSize: '0.75rem', padding: '6px' }}
                                                    placeholder="Enter Tracking #"
                                                    defaultValue={o.trackingId}
                                                    onBlur={(e) => {
                                                        if (e.target.value !== (o.trackingId || '')) {
                                                            updateOrderStatus(o._id, o.status, e.target.value);
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <div className={styles.selectWrap}>
                                                    <select
                                                        className={styles.statusSelect}
                                                        value={o.status}
                                                        onChange={(e) => {
                                                            if (e.target.value === 'shipped') {
                                                                setShippingOrderId(o._id);
                                                                setShowShippingModal(true);
                                                            } else {
                                                                updateOrderStatus(o._id, e.target.value, o.trackingId, o.shippingImage);
                                                            }
                                                        }}
                                                    >
                                                        {ORDER_STATUSES.map(s => (
                                                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                                        ))}
                                                    </select>
                                                    <FiChevronDown size={12} className={styles.selectIcon} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ── Deals Tab ── */}
            {activeTab === 'deals' && (
                <div className={styles.tableCard}>
                    {loading ? (
                        <div className={styles.tableLoading}><div className={styles.spinner} /></div>
                    ) : deals.length === 0 ? (
                        <div className={styles.emptyState}>
                            <FiTag size={48} className={styles.emptyIcon} />
                            <p>No deals yet. create your first promotion!</p>
                            <button className={styles.addBtn} onClick={() => openDealForm()} style={{ background: 'linear-gradient(135deg, #ff00e5, #8b5cf6)' }}>
                                <FiPlus size={14} /> Add Deal
                            </button>
                        </div>
                    ) : (
                        <div className={styles.tableWrap}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Deal/Ad</th>
                                        <th>Type</th>
                                        <th>Code</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deals.map(d => (
                                        <tr key={d._id} className={styles.tableRow}>
                                            <td>
                                                <div className={styles.productCell}>
                                                    <img src={d.image} alt="" className={styles.productThumb} style={{ width: 80, height: 45, objectFit: 'cover' }} />
                                                    <div>
                                                        <div className={styles.productName}>{d.title}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.subtitle}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={styles.categoryBadge} style={{ background: d.type === 'primary_banner' ? 'rgba(0,245,255,0.1)' : undefined, color: d.type === 'primary_banner' ? '#00f5ff' : undefined }}>
                                                    {d.type?.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td>
                                                {d.discountCode ? (
                                                    <span className={styles.orderId} style={{ color: 'var(--neon-pink)', fontWeight: 700 }}>{d.discountCode} <FiCopy size={10} style={{ marginLeft: 4 }} /></span>
                                                ) : <span style={{ color: 'var(--text-muted)' }}>-</span>}
                                            </td>
                                            <td>
                                                <span className={`${styles.stockBadge} ${!d.isActive ? styles.stockLow : ''}`}>
                                                    {d.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className={styles.actionBtns}>
                                                    <button className={styles.editBtn} onClick={() => openDealForm(d)}>
                                                        <FiEdit2 size={14} />
                                                    </button>
                                                    <button className={styles.deleteBtn} onClick={() => handleDeleteDeal(d._id)}>
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ── Deal Form Modal ── */}
            {showDealForm && (
                <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && closeDealForm()}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>{editingId ? 'Edit Deal' : 'Add New Deal/Ad'}</h2>
                            <button className={styles.modalClose} onClick={closeDealForm}><FiX size={18} /></button>
                        </div>

                        <form onSubmit={handleDealSubmit} className={styles.form}>
                            <div className={styles.formGrid}>
                                <div className={`${styles.formGroup} ${styles.colSpan2}`}>
                                    <label>Deal Title *</label>
                                    <input className={styles.formInput} name="title" value={dealFormData.title} onChange={handleDealChange} required placeholder="e.g. Summer Mega Sale" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Subtitle</label>
                                    <input className={styles.formInput} name="subtitle" value={dealFormData.subtitle} onChange={handleDealChange} placeholder="e.g. Up to 50% OFF" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Discount Code</label>
                                    <input className={styles.formInput} name="discountCode" value={dealFormData.discountCode} onChange={handleDealChange} placeholder="e.g. SUMMER50" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Global Discount %</label>
                                    <div style={{ position: 'relative' }}>
                                        <input className={styles.formInput} type="number" name="discountPercentage" value={dealFormData.discountPercentage} onChange={handleDealChange} placeholder="0" min="0" max="100" style={{ paddingLeft: '35px' }} />
                                        <FiPercent size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    </div>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>Applies this % discount to all products globally while active.</p>
                                </div>
                                <div className={`${styles.formGroup} ${styles.colSpan2}`}>
                                    <label>Description</label>
                                    <textarea className={styles.formInput} name="description" value={dealFormData.description} onChange={handleDealChange} rows="2" placeholder="Details about the deal..." />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Button Text</label>
                                    <input className={styles.formInput} name="buttonText" value={dealFormData.buttonText} onChange={handleDealChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Button Link</label>
                                    <input className={styles.formInput} name="buttonLink" value={dealFormData.buttonLink} onChange={handleDealChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Deal Type</label>
                                    <select className={styles.formInput} name="type" value={dealFormData.type} onChange={handleDealChange}>
                                        <option value="featured_deal">Featured Deal (Banner)</option>
                                        <option value="primary_banner">Main Hero Banner</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Status</label>
                                    <label className={styles.toggleLabel}>
                                        <input type="checkbox" name="isActive" checked={dealFormData.isActive} onChange={handleDealChange} className={styles.toggleInput} />
                                        <span className={styles.toggle} />
                                        <span className={styles.toggleText}>{dealFormData.isActive ? 'Active — show on site' : 'Inactive'}</span>
                                    </label>
                                </div>
                                <div className={`${styles.formGroup} ${styles.colSpan2}`}>
                                    <label>Deal Image *</label>
                                    <label className={styles.fileLabel} htmlFor="dealImage">
                                        <FiUploadCloud size={24} />
                                        <span>Click to upload banner image</span>
                                        <span className={styles.fileHint}>Recommend: 1200x400 for banners</span>
                                    </label>
                                    <input id="dealImage" type="file" accept="image/*" onChange={handleDealImageChange} className={styles.fileInput} required={!editingId} />
                                    {dealImagePreview && (
                                        <div className={styles.imagePreviews}>
                                            <img src={dealImagePreview} alt="" className={styles.imagePreview} style={{ width: '100%', height: '150px' }} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.formActions}>
                                <button type="button" className={styles.cancelBtn} onClick={closeDealForm}>Cancel</button>
                                <button type="submit" className={styles.submitBtn} disabled={saving} style={{ background: 'linear-gradient(135deg, #ff00e5, #8b5cf6)' }}>
                                    {saving ? 'Saving...' : editingId ? 'Update Deal' : 'Add Deal'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Product Form Modal ── */}
            {showForm && (
                <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && closeForm()}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                            <button className={styles.modalClose} onClick={closeForm}><FiX size={18} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label>Product Name *</label>
                                    <input className={styles.formInput} name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Classic Denim Jacket" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Price (PKR) *</label>
                                    <input className={styles.formInput} type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="e.g. 4500" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Original Price (PKR)</label>
                                    <input className={styles.formInput} type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} placeholder="e.g. 5000 (optional)" />
                                    {formData.price && formData.originalPrice && Number(formData.originalPrice) > Number(formData.price) && (
                                        <div style={{ fontSize: '0.75rem', color: 'var(--neon-pink)', marginTop: '4px', fontWeight: 600 }}>
                                            Calculated Discount: -{Math.round(((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100)}%
                                        </div>
                                    )}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Stock *</label>
                                    <input className={styles.formInput} type="number" name="stock" value={formData.stock} onChange={handleChange} required />
                                </div>
                                <div className={`${styles.formGroup} ${styles.colSpan2}`}>
                                    <label>Description *</label>
                                    <textarea className={styles.formInput} name="description" value={formData.description} onChange={handleChange} rows="3" required placeholder="Describe the product..." />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Category *</label>
                                    <select className={styles.formInput} name="category" value={formData.category} onChange={handleChange}>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Featured Product</label>
                                    <label className={styles.toggleLabel}>
                                        <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className={styles.toggleInput} />
                                        <span className={styles.toggle} />
                                        <span className={styles.toggleText}>{formData.featured ? 'Yes — show on homepage' : 'No'}</span>
                                    </label>
                                </div>
                                <div className={`${styles.formGroup} ${styles.colSpan2}`}>
                                    <label>Available Sizes</label>
                                    <div className={styles.sizePicker}>
                                        {SIZES.map(s => (
                                            <button
                                                key={s} type="button"
                                                className={`${styles.sizeBtn} ${formData.sizes.includes(s) ? styles.sizeBtnActive : ''}`}
                                                onClick={() => toggleSize(s)}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className={`${styles.formGroup} ${styles.colSpan2}`}>
                                    <label>Product Images</label>
                                    <label className={styles.fileLabel} htmlFor="images">
                                        <FiUploadCloud size={24} />
                                        <span>Click to upload images (up to 5)</span>
                                        <span className={styles.fileHint}>PNG, JPG, WEBP</span>
                                    </label>
                                    <input id="images" type="file" multiple accept="image/*" onChange={handleFileChange} className={styles.fileInput} />
                                    {imagePreviews.length > 0 && (
                                        <div className={styles.imagePreviews}>
                                            {imagePreviews.map((src, i) => (
                                                <img key={i} src={src} alt="" className={styles.imagePreview} />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className={`${styles.formGroup} ${styles.colSpan2}`}>
                                    <label>Product Video</label>
                                    <label className={styles.fileLabel} htmlFor="video">
                                        <FiVideo size={24} />
                                        <span>Click to upload a video</span>
                                        <span className={styles.fileHint}>MP4, WEBM, MOV (Max 1)</span>
                                    </label>
                                    <input id="video" type="file" accept="video/*" onChange={handleVideoChange} className={styles.fileInput} />
                                    {videoPreview && (
                                        <div className={styles.videoPreviewWrap}>
                                            <video src={videoPreview} controls className={styles.videoPreview} />
                                            <button type="button" className={styles.removeVideo} onClick={() => { setVideoPreview(null); setFormData(p => ({ ...p, video: null })); }}>
                                                <FiX size={14} /> Remove Video
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.formActions}>
                                <button type="button" className={styles.cancelBtn} onClick={closeForm}>Cancel</button>
                                <button type="submit" className={styles.submitBtn} disabled={saving}>
                                    {saving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* ── Shipping Proof Modal ── */}
            {showShippingModal && (
                <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && setShowShippingModal(false)}>
                    <div className={styles.modal} style={{ maxWidth: '450px' }}>
                        <div className={styles.modalHeader}>
                            <h2>Upload Shipping Proof</h2>
                            <button className={styles.modalClose} onClick={() => setShowShippingModal(false)}><FiX size={18} /></button>
                        </div>
                        <form onSubmit={handleShippingUpload} className={styles.form} style={{ padding: '20px' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
                                Please upload a photo of the parcel/waybill before marking this order as <strong>Shipped</strong>.
                            </p>
                            
                            <div className={styles.formGroup}>
                                <label className={styles.fileLabel} htmlFor="shipImg" style={{ height: '140px' }}>
                                    <FiUploadCloud size={30} />
                                    <span>{shippingFile ? 'Change Image' : 'Select Parcel Image'}</span>
                                </label>
                                <input 
                                    id="shipImg" type="file" accept="image/*" 
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setShippingFile(file);
                                            setShippingPreview(URL.createObjectURL(file));
                                        }
                                    }} 
                                    className={styles.fileInput} required 
                                />
                            </div>

                            {shippingPreview && (
                                <div style={{ marginTop: '15px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                                    <img src={shippingPreview} alt="Preview" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                                </div>
                            )}

                            <div className={styles.formActions} style={{ marginTop: '25px' }}>
                                <button type="button" className={styles.cancelBtn} onClick={() => setShowShippingModal(false)}>Cancel</button>
                                <button type="submit" className={styles.submitBtn} disabled={uploadingShip} style={{ background: 'var(--neon-purple)' }}>
                                    {uploadingShip ? 'Uploading...' : 'Confirm & Mark Shipped'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
