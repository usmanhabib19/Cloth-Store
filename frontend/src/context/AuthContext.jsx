import { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { user: clerkUser, isLoaded } = useUser();
    const { signOut } = useClerkAuth();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (isLoaded && clerkUser) {
            setUser({
                _id: clerkUser.id,
                name: clerkUser.fullName || clerkUser.firstName || 'User',
                email: clerkUser.primaryEmailAddress?.emailAddress,
                isAdmin: clerkUser.primaryEmailAddress?.emailAddress === import.meta.env.VITE_ADMIN_EMAIL
            });
        } else if (isLoaded && !clerkUser) {
            setUser(null);
        }
    }, [isLoaded, clerkUser]);

    const logout = async () => {
        await signOut();
        setUser(null);
    };

    // login and register are now handled by Clerk UI
    const login = () => {};
    const register = () => {};

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading: !isLoaded }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
