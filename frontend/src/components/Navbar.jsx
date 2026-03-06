import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { FiShoppingBag, FiSearch, FiMenu, FiX, FiShield, FiPackage, FiBell } from 'react-icons/fi';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

const LINKS = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Deals', path: '/deals' },
    { label: 'Men', path: '/shop?category=men' },
    { label: 'Women', path: '/shop?category=women' },
    { label: 'Kids', path: '/shop?category=kids' },
    { label: 'Accessories', path: '/shop?category=accessories' },
];

export default function Navbar() {
    const { user } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    // UI State
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Notification State
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [notifOpen, setNotifOpen] = useState(false);

    const searchRef = useRef(null);
    const notifRef = useRef(null);

    const isAdmin = !!user && user.isAdmin;

    // Scroll effect
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close on navigation
    useEffect(() => {
        setMenuOpen(false);
        setSearchOpen(false);
        setNotifOpen(false);
    }, [location.pathname]);

    // Handle Search Focus
    useEffect(() => {
        if (searchOpen && searchRef.current) searchRef.current.focus();
    }, [searchOpen]);

    // Body scroll lock
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    // Notifications Fetch Logic
    useEffect(() => {
        if (user) {
            const fetchNotifs = async () => {
                try {
                    // 1. Get system notification count (everyone)
                    // This now includes 'message' type notifications for admins
                    const notifRes = await api.get('/notifications/unread-count');
                    let count = notifRes.data.count || 0;

                    setUnreadCount(count);

                    // 2. Fetch actual notification list if dropdown is open
                    if (notifOpen) {
                        const listRes = await api.get('/notifications');
                        setNotifications(listRes.data || []);
                    }
                } catch (err) {
                    console.error('Notification fetch error:', err);
                }
            };
            fetchNotifs();
            const interval = setInterval(fetchNotifs, 30000); // 30s
            return () => clearInterval(interval);
        } else {
            setUnreadCount(0);
            setNotifications([]);
        }
    }, [user, isAdmin, notifOpen]);

    // Notification outside click handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
            setSearchOpen(false);
            setSearchTerm('');
        }
    };

    const isActive = (path) => {
        const base = path.split('?')[0];
        if (path.includes('?')) return false;
        return location.pathname === base;
    };

    return (
        <>
            <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
                <div className={styles.pill}>
                    {/* Logo */}
                    <Link to="/" className={styles.logo}>
                        <span className={styles.logoIcon}>✦</span>
                        <span className={styles.logoText}>SUBHAN.TAIR</span>
                    </Link>

                    {/* Desktop Links */}
                    <ul className={styles.links}>
                        {LINKS.map((l) => (
                            <li key={l.path}>
                                <Link
                                    to={l.path}
                                    className={`${styles.link} ${isActive(l.path) ? styles.active : ''}`}
                                >
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Right actions */}
                    <div className={styles.actions}>
                        {/* Search */}
                        <div style={{ position: 'relative' }}>
                            {searchOpen ? (
                                <form onSubmit={handleSearch} className={styles.searchForm}>
                                    <input
                                        ref={searchRef}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search clothes..."
                                        className={styles.searchInput}
                                    />
                                    <button type="button" onClick={() => setSearchOpen(false)} className={styles.iconBtn}>
                                        <FiX size={18} />
                                    </button>
                                </form>
                            ) : (
                                <button className={styles.iconBtn} onClick={() => setSearchOpen(true)}>
                                    <FiSearch size={18} />
                                </button>
                            )}
                        </div>

                        {/* My Orders */}
                        <SignedIn>
                            <Link to="/orders" className={styles.iconBtn} title="My Orders">
                                <FiPackage size={18} />
                            </Link>
                        </SignedIn>

                        {/* Cart */}
                        <Link to="/cart" className={styles.cartBtn}>
                            <FiShoppingBag size={18} />
                            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
                        </Link>

                        {/* Notifications */}
                        <SignedIn>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} ref={notifRef}>
                                <button
                                    className={styles.iconBtn}
                                    onClick={() => setNotifOpen(!notifOpen)}
                                    title="Notifications"
                                >
                                    <FiBell size={18} />
                                    {unreadCount > 0 && (
                                        <span style={{
                                            position: 'absolute', top: -5, right: -5,
                                            background: 'var(--neon-pink)', color: 'white',
                                            fontSize: '0.65rem', padding: '2px 5px', borderRadius: '50%',
                                            fontWeight: 900, minWidth: '15px', textAlign: 'center',
                                            boxShadow: '0 0 10px var(--neon-pink)',
                                            pointerEvents: 'none'
                                        }}>{unreadCount}</span>
                                    )}
                                </button>

                                {/* Notifications Dropdown */}
                                {notifOpen && (
                                    <div style={{
                                        position: 'absolute', top: '100%', right: 0,
                                        width: '300px', background: 'rgba(10, 10, 20, 0.95)',
                                        backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px', marginTop: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                        zIndex: 1000, overflow: 'hidden'
                                    }}>
                                        <div style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h4 style={{ margin: 0, color: 'white', fontSize: '0.9rem' }}>Notifications</h4>
                                            <button
                                                onClick={async () => {
                                                    await api.patch('/notifications/read-all');
                                                    setUnreadCount(isAdmin ? unreadCount : 0); // Keep admin message count if any
                                                    setNotifOpen(false);
                                                }}
                                                style={{ background: 'none', border: 'none', color: 'var(--neon-cyan)', fontSize: '0.7rem', cursor: 'pointer' }}
                                            >
                                                Mark all read
                                            </button>
                                        </div>
                                        <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                            {notifications.length === 0 ? (
                                                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                                    <FiBell size={20} style={{ marginBottom: '8px', opacity: 0.5 }} />
                                                    <p style={{ margin: 0, fontSize: '0.8rem' }}>No recent alerts</p>
                                                </div>
                                            ) : (
                                                notifications.map(n => (
                                                    <Link
                                                        key={n._id}
                                                        to={n.link || '#'}
                                                        onClick={async () => {
                                                            await api.patch(`/notifications/${n._id}/read`);
                                                            setNotifOpen(false);
                                                        }}
                                                        style={{
                                                            display: 'block', padding: '12px 15px',
                                                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                            textDecoration: 'none', transition: 'background 0.2s',
                                                            background: n.isRead ? 'transparent' : 'rgba(0, 245, 255, 0.05)'
                                                        }}
                                                    >
                                                        <div style={{ color: 'white', fontWeight: 600, fontSize: '0.8rem' }}>{n.title}</div>
                                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: '2px' }}>{n.message}</div>
                                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.6rem', marginTop: '4px' }}>
                                                            {new Date(n.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </Link>
                                                ))
                                            )}
                                            {isAdmin && (
                                                <Link
                                                    to="/admin"
                                                    onClick={() => setNotifOpen(false)}
                                                    style={{ display: 'block', padding: '10px', textAlign: 'center', color: 'var(--neon-cyan)', fontSize: '0.75rem', textDecoration: 'none', background: 'rgba(255,255,255,0.03)', fontWeight: 600 }}
                                                >
                                                    Go to Admin Dashboard
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </SignedIn>

                        {/* Auth - desktop only */}
                        <div className={styles.authDesktop}>
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className={styles.signInBtn}>Sign In</button>
                                </SignInButton>
                            </SignedOut>
                            <SignedIn>
                                <UserButton afterSignOutUrl="/">
                                    {isAdmin && (
                                        <UserButton.MenuItems>
                                            <UserButton.Action
                                                label="Admin Panel"
                                                labelIcon={<FiShield size={16} />}
                                                onClick={() => navigate('/admin')}
                                            />
                                        </UserButton.MenuItems>
                                    )}
                                </UserButton>
                            </SignedIn>
                        </div>

                        {/* Hamburger */}
                        <button
                            className={styles.hamburger}
                            onClick={() => setMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <FiMenu size={22} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer Overlay */}
            {menuOpen && (
                <div className={styles.overlay} onClick={() => setMenuOpen(false)} />
            )}

            {/* Mobile Drawer */}
            <aside className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}>
                {/* Drawer Header */}
                <div className={styles.drawerHeader}>
                    <Link to="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
                        <span className={styles.logoIcon}>✦</span>
                        <span className={styles.logoText}>LUMINARA</span>
                    </Link>
                    <button className={styles.closeBtn} onClick={() => setMenuOpen(false)}>
                        <FiX size={22} />
                    </button>
                </div>

                {/* Nav Links */}
                <nav className={styles.drawerNav}>
                    {LINKS.map((l) => (
                        <Link
                            key={l.path}
                            to={l.path}
                            className={`${styles.drawerLink} ${isActive(l.path) ? styles.drawerLinkActive : ''}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>

                {/* Drawer Footer */}
                <div className={styles.drawerFooter}>
                    <Link to="/orders" className={styles.drawerFooterLink} onClick={() => setMenuOpen(false)}>
                        My Orders
                    </Link>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className={styles.drawerSignIn} onClick={() => setMenuOpen(false)}>
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <div className={styles.drawerUser}>
                            <UserButton afterSignOutUrl="/" />
                            <span className={styles.drawerUserName}>
                                {user?.name || 'Account'}
                            </span>
                        </div>
                        {isAdmin && (
                            <Link to="/admin" className={styles.adminBtn} onClick={() => setMenuOpen(false)}>
                                <FiShield size={14} /> Admin Panel
                            </Link>
                        )}
                    </SignedIn>
                </div>
            </aside>
        </>
    );
}
