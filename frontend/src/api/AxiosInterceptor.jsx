import { useLayoutEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import api from './axios';

/**
 * This component must sit inside the ClerkProvider.
 * It sets up an Axios request interceptor that automatically
 * attaches the latest Clerk session token to every request.
 *
 * Uses useLayoutEffect so the interceptor is installed BEFORE
 * children (like AdminPage) mount and fire their API calls.
 */
export default function AxiosInterceptor({ children }) {
    const { getToken, isSignedIn } = useAuth();
    const getTokenRef = useRef(getToken);
    const isSignedInRef = useRef(isSignedIn);

    // Keep refs up-to-date on every render without re-installing interceptor
    getTokenRef.current = getToken;
    isSignedInRef.current = isSignedIn;

    useLayoutEffect(() => {
        const interceptor = api.interceptors.request.use(async (config) => {
            try {
                if (isSignedInRef.current) {
                    const token = await getTokenRef.current();
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                }
            } catch (_) { }
            return config;
        });

        return () => {
            api.interceptors.request.eject(interceptor);
        };
    }, []); // Install once, use refs to always get fresh token

    return children;
}
