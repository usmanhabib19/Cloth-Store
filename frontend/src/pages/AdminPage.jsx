import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiShoppingBag, FiLayers, FiUsers } from 'react-icons/fi';
import api from '../api/axios';

export default function AdminPage() {
    const { isLoaded, isSignedIn, user } = useAuth();
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('products');

    // Form states
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'men',
        sizes: ['M', 'L'],
        stock: 10,
        featured: false,
        images: [] // Will be populated by file input
    });

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            // Ideally you'd check role here. For now, we list items.
            fetchData();
        }
    }, [isLoaded, isSignedIn]);

    const fetchData = async () => {
        try {
            const [prodRes, orderRes] = await Promise.all([
                api.get('/products?limit=100'),
                api.get('/orders')
            ]);
            setProducts(prodRes.data.products);
            setOrders(orderRes.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, images: e.target.files });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'images') {
                for (let i = 0; i < formData.images.length; i++) {
                    data.append('images', formData.images[i]);
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
            setShowAddForm(false);
            setEditingId(null);
            fetchData();
        } catch (err) {
            toast.error('Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/products/${id}`);
                toast.success('Product deleted');
                fetchData();
            } catch (err) {
                toast.error('Delete failed');
            }
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

    if (!isLoaded || (isLoaded && !isSignedIn)) return <div className="spinner-container"><div className="spinner"></div></div>;

    return (
        <div className="container section" style={{ paddingTop: 'calc(var(--nav-height) + 40px)' }}>
            <h1 className="section-title">Admin <span className="neon-text">Dashboard</span></h1>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                <button
                    onClick={() => setActiveTab('products')}
                    className={activeTab === 'products' ? 'btn-primary' : 'btn-ghost'}
                >
                    <FiLayers /> Products
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={activeTab === 'orders' ? 'btn-primary' : 'btn-ghost'}
                >
                    <FiShoppingBag /> Orders
                </button>
            </div>

            {activeTab === 'products' ? (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2>Managed Products ({products.length})</h2>
                        <button className="btn-primary" onClick={() => { setShowAddForm(true); setEditingId(null); }}>
                            <FiPlus /> Add Product
                        </button>
                    </div>

                    {showAddForm && (
                        <div className="glass-card" style={{ padding: '32px', marginBottom: '40px' }}>
                            <h3 style={{ marginBottom: '24px' }}>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input className="form-input" name="name" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Price (PKR)</label>
                                    <input className="form-input" type="number" name="price" value={formData.price} onChange={handleChange} required />
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label>Description</label>
                                    <textarea className="form-input" name="description" value={formData.description} onChange={handleChange} rows="3" required></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select className="form-input" name="category" value={formData.category} onChange={handleChange}>
                                        <option value="men">Men</option>
                                        <option value="women">Women</option>
                                        <option value="kids">Kids</option>
                                        <option value="accessories">Accessories</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Stock</label>
                                    <input className="form-input" type="number" name="stock" value={formData.stock} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Images</label>
                                    <input type="file" multiple onChange={handleFileChange} />
                                </div>
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                                    <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
                                    <label>Featured Product</label>
                                </div>
                                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px', marginTop: '12px' }}>
                                    <button type="submit" className="btn-primary" disabled={loading}>
                                        {loading ? 'Saving...' : 'Save Product'}
                                    </button>
                                    <button type="button" className="btn-ghost" onClick={() => setShowAddForm(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-secondary)' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left' }}>
                                    <th style={{ padding: '16px' }}>Product</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p._id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                        <td style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <img src={p.images[0]} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{p.name}</span>
                                        </td>
                                        <td style={{ textTransform: 'capitalize' }}>{p.category}</td>
                                        <td>PKR {p.price.toLocaleString()}</td>
                                        <td>{p.stock}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => { setEditingId(p._id); setFormData(p); setShowAddForm(true); }} className="iconBtn"><FiEdit2 size={14} /></button>
                                                <button onClick={() => handleDelete(p._id)} className="iconBtn" style={{ color: 'var(--neon-pink)' }}><FiTrash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <>
                    <h2>Recent Orders ({orders.length})</h2>
                    <div style={{ overflowX: 'auto', marginTop: '24px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-secondary)' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left' }}>
                                    <th style={{ padding: '16px' }}>Order ID</th>
                                    <th>Customer</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(o => (
                                    <tr key={o._id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                        <td style={{ padding: '16px' }}><p style={{ fontFamily: 'monospace' }}>#{o._id.slice(-6)}</p></td>
                                        <td>{o.shippingAddress.fullName}</td>
                                        <td>PKR {o.totalAmount.toLocaleString()}</td>
                                        <td><span className={`badge badge-status-${o.status}`}>{o.status}</span></td>
                                        <td>
                                            <select
                                                className="form-input"
                                                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                                                value={o.status}
                                                onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
