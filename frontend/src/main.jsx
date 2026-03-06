import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import AxiosInterceptor from './api/AxiosInterceptor';
import App from './App';
import './index.css';

import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AuthProvider>
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
      </AuthProvider>
    </ClerkProvider>
  </React.StrictMode>
);
