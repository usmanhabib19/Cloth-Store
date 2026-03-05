import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';
import { FiShoppingBag, FiSearch, FiMenu, FiX, FiShield, FiHome, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import styles from './Navbar.module.css';

const LINKS = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Men', path: '/shop?category=men' },
    { label: 'Women', path: '/shop?category=women' },
    { label: 'Kids', path: '/shop?category=kids' },
    { label: 'Accessories', path: '/shop?category=accessories' },
];

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

export default function Navbar() {
    const { user } = useUser();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const searchRef = useRef(null);

    const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
        setSearchOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (searchOpen && searchRef.current) {
            searchRef.current.focus();
        }
    }, [searchOpen]);

    // Close menu when clicking overlay
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

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
                        <span className={styles.logoText}>LUMINARA</span>
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
                        <>
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
                        </>

                        {/* Cart */}
                        <Link to="/cart" className={styles.cartBtn}>
                            <FiShoppingBag size={18} />
                            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
                        </Link>

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
                            <span className={styles.drawerUserName}>
                                {user?.firstName || 'Account'}
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
