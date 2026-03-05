import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import {
    FiPlus, FiEdit2, FiTrash2, FiShoppingBag, FiLayers,
    FiX, FiCheck, FiPackage, FiTrendingUp, FiDollarSign,
    FiUploadCloud, FiImage, FiChevronDown, FiVideo
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

export default function AdminPage() {
    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('products');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [videoPreview, setVideoPreview] = useState(null);

    useEffect(() => {
        if (isLoaded && isSignedIn) fetchData();
    }, [isLoaded, isSignedIn]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, orderRes] = await Promise.all([
                api.get('/products?limit=100'),
                api.get('/orders')
            ]);
            setProducts(prodRes.data.products || []);
            setOrders(orderRes.data || []);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch data');
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

    const updateOrderStatus = async (id, status) => {
        try {
            await api.patch(`/orders/${id}/status`, { status });
            toast.success('Status updated');
            fetchData();
        } catch (err) {
            toast.error('Update failed');
        }
    };

    if (!isLoaded || !isSignedIn) {
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
                    <p className={styles.headerSub}>Welcome back, {user?.firstName || 'Admin'} 👋</p>
                    <h1 className={styles.headerTitle}>Admin <span className={styles.neon}>Dashboard</span></h1>
                </div>
                <button className={styles.addBtn} onClick={() => openForm()}>
                    <FiPlus size={16} /> Add Product
                </button>
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
                                                <div className={styles.selectWrap}>
                                                    <select
                                                        className={styles.statusSelect}
                                                        value={o.status}
                                                        onChange={(e) => updateOrderStatus(o._id, e.target.value)}
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
        </div>
    );
}
