import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function CartPage() {
    const { cart, cartTotal, removeFromCart, updateQty } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="container section" style={{ paddingTop: 'calc(var(--nav-height) + 60px)', textAlign: 'center' }}>
                <div style={{ padding: '80px 0' }}>
                    <FiShoppingBag size={80} color="var(--text-muted)" style={{ marginBottom: '24px' }} />
                    <h2 style={{ marginBottom: '16px' }}>Your cart is empty</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                        Looks like you haven't added anything to your cart yet.
                    </p>
                    <Link to="/shop" className="btn-primary">
                        Start Shopping <FiArrowRight />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container section" style={{ paddingTop: 'calc(var(--nav-height) + 40px)' }}>
            <h1 className="section-title" style={{ marginBottom: '40px' }}>
                Your <span className="neon-text">Cart</span>
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
                {/* Cart Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {cart.map((item) => (
                        <div key={`${item._id}-${item.selectedSize}`} className="glass-card" style={{ padding: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <img
                                src={item.images?.[0]}
                                alt={item.name}
                                style={{ width: '100px', height: '130px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{item.name}</h3>
                                    <button
                                        onClick={() => {
                                            removeFromCart(item._id, item.selectedSize);
                                            toast.info('Item removed from cart');
                                        }}
                                        style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                                    Size: <span style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>{item.selectedSize}</span>
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                                        <button
                                            onClick={() => updateQty(item._id, item.selectedSize, Math.max(1, item.qty - 1))}
                                            style={{ padding: '6px 14px', color: 'var(--text-primary)' }}
                                        >
                                            <FiMinus size={14} />
                                        </button>
                                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', fontWeight: 600, fontSize: '0.9rem' }}>
                                            {item.qty}
                                        </span>
                                        <button
                                            onClick={() => updateQty(item._id, item.selectedSize, item.qty + 1)}
                                            style={{ padding: '6px 14px', color: 'var(--text-primary)' }}
                                        >
                                            <FiPlus size={14} />
                                        </button>
                                    </div>
                                    <span style={{ fontWeight: 700, color: 'var(--neon-cyan)' }}>
                                        PKR {(item.price * item.qty).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary side */}
                <div style={{ position: 'sticky', top: 'calc(var(--nav-height) + 40px)', alignSelf: 'start' }}>
                    <div className="glass-card" style={{ padding: '30px' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '24px' }}>Summary</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                                <span>PKR {cartTotal.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Shipping Fee</span>
                                <span>PKR 150</span>
                            </div>
                            <div className="divider" style={{ margin: '8px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800 }}>
                                <span>Total</span>
                                <span className="neon-text">PKR {(cartTotal + 150).toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="btn-primary"
                            style={{ width: '100%', justifyContent: 'center', padding: '16px' }}
                        >
                            Checkout Now <FiArrowRight />
                        </button>

                        <Link to="/shop" style={{ display: 'block', textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
