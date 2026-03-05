import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './context/CartContext';
import AxiosInterceptor from './api/AxiosInterceptor';
import App from './App';
import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isPlaceholder = !PUBLISHABLE_KEY || PUBLISHABLE_KEY === 'pk_test_placeholder' || PUBLISHABLE_KEY.includes('your_clerk');

const root = ReactDOM.createRoot(document.getElementById('root'));

if (isPlaceholder) {
  root.render(
    <React.StrictMode>
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050510',
        color: '#fff',
        textAlign: 'center',
        padding: '20px',
        fontFamily: 'sans-serif'
      }}>
        <h1 style={{ color: '#00f5ff', fontSize: '2.5rem', marginBottom: '20px' }}>✦ LUMI<span className="neon-text">NARA</span></h1>
        <div className="glass-card" style={{ padding: '40px', maxWidth: '600px' }}>
          <h2 style={{ marginBottom: '16px' }}>Setup Required</h2>
          <p style={{ color: '#a0a0c0', lineHeight: '1.6', marginBottom: '24px' }}>
            To view the store, please add your <strong>Clerk Publishable Key</strong> to the <code>frontend/.env</code> file.
          </p>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', textAlign: 'left', fontSize: '0.9rem' }}>
            <code>VITE_CLERK_PUBLISHABLE_KEY=pk_test_...</code>
          </div>
          <p style={{ marginTop: '24px', fontSize: '0.8rem', color: '#5a5a7a' }}>
            The app will automatically refresh once the key is saved.
          </p>
        </div>
      </div>
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <BrowserRouter>
          <AxiosInterceptor>
            <CartProvider>
              <App />
              <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="dark"
              />
            </CartProvider>
          </AxiosInterceptor>
        </BrowserRouter>
      </ClerkProvider>
    </React.StrictMode>
  );
}
