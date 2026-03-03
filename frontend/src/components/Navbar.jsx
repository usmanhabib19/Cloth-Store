import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { FiShoppingBag, FiSearch, FiMenu, FiX } from 'react-icons/fi';
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

export default function Navbar() {
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => { setMenuOpen(false); }, [location.pathname]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
            setSearchOpen(false);
            setSearchTerm('');
        }
    };

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className={`container ${styles.inner}`}>
                {/* Logo */}
                <Link to="/" className={styles.logo}>
                    <span className={styles.logoIcon}>✦</span>
                    <span>LUMI<span className="neon-text">NARA</span></span>
                </Link>

                {/* Desktop Links */}
                <ul className={styles.links}>
                    {LINKS.map((l) => (
                        <li key={l.path}>
                            <Link
                                to={l.path}
                                className={`${styles.link} ${location.pathname === l.path.split('?')[0] && !l.path.includes('?') ? styles.active : ''}`}
                            >
                                {l.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Actions */}
                <div className={styles.actions}>
                    {/* Search */}
                    <div className={styles.searchWrap}>
                        {searchOpen ? (
                            <form onSubmit={handleSearch} className={styles.searchForm}>
                                <input
                                    autoFocus
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
                            <button className={styles.iconBtn} onClick={() => setSearchOpen(true)} title="Search">
                                <FiSearch size={20} />
                            </button>
                        )}
                    </div>

                    {/* Cart */}
                    <Link to="/cart" className={styles.cartBtn} title="Cart">
                        <FiShoppingBag size={20} />
                        {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
                    </Link>

                    {/* Auth */}
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="btn-outline" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>Sign In</button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Link to="/orders" className={styles.iconBtn} title="My Orders">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                                    <rect x="9" y="3" width="6" height="4" rx="1" />
                                    <line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" />
                                </svg>
                            </Link>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </SignedIn>

                    {/* Hamburger */}
                    <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className={styles.mobileMenu}>
                    {LINKS.map((l) => (
                        <Link key={l.path} to={l.path} className={styles.mobileLink}>{l.label}</Link>
                    ))}
                    <div className={styles.mobileActions}>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Sign In</button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <Link to="/orders" className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>My Orders</Link>
                        </SignedIn>
                    </div>
                </div>
            )}
        </nav>
    );
}
