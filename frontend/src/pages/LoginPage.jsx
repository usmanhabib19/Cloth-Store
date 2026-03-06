import { SignIn } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';

export default function LoginPage() {
    const location = useLocation();
    const redirect = location.search ? location.search.split('=')[1] : '/';

    return (
        <div className="container section animate-fade-in" style={{ 
            minHeight: '80vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            paddingTop: 'calc(var(--nav-height) + 40px)'
        }}>
            <SignIn 
                appearance={{
                    elements: {
                        card: "glass-card",
                        headerTitle: "neon-text",
                        formButtonPrimary: "btn-primary",
                    }
                }}
                afterSignInUrl={redirect}
                signUpUrl="/register"
            />
        </div>
    );
}
