import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './context/CartContext';
import App from './App';
import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY === 'pk_test_placeholder') {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <div style={{
        height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', background: '#050510', color: '#fff', textAlign: 'center', padding: '20px'
      }}>
        <h1 style={{ color: '#00f5ff' }}>Configuration Required</h1>
        <p style={{ maxWidth: '500px', color: '#a0a0c0' }}>
          Please add your <strong>VITE_CLERK_PUBLISHABLE_KEY</strong> to the <code>frontend/.env</code> file to start the application.
        </p>
      </div>
    </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <BrowserRouter>
          <CartProvider>
            <App />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
              toastStyle={{
                background: '#0d0d1f',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                color: '#fff',
              }}
            />
          </CartProvider>
        </BrowserRouter>
      </ClerkProvider>
    </React.StrictMode>
  );
}
