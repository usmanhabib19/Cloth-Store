import { useLayoutEffect } from 'react';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import api from './axios';

export default function AxiosInterceptor({ children }) {
    const { getToken } = useClerkAuth();

    useLayoutEffect(() => {
        const interceptor = api.interceptors.request.use(async (config) => {
            try {
                const token = await getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (err) { 
                console.error('Axios auth error:', err);
            }
            return config;
        });

        return () => {
            api.interceptors.request.eject(interceptor);
        };
    }, [getToken]);

    return children;
}
