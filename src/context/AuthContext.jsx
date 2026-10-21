import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isSignedIn, setIsSignedIn] = useState(() => {
        return localStorage.getItem('aisleSignedIn') === 'true';
    });

    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const raw = localStorage.getItem('aisleUser');
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    });

    const getUserName = () => {
        const storedName = localStorage.getItem('aisleUserName');
        if (storedName && storedName.trim()) return storedName.trim();
        if (currentUser && (currentUser.firstName || currentUser.name)) {
            return (currentUser.firstName || currentUser.name).trim();
        }
        return '';
    };

    const getUserEmail = () => {
        const storedEmail = localStorage.getItem('aisleUserEmail');
        if (storedEmail && storedEmail.trim()) return storedEmail.trim();
        if (currentUser && currentUser.email) return currentUser.email.trim();
        return '';
    };

    const [userName, setUserName] = useState(getUserName);
    const [userEmail, setUserEmail] = useState(getUserEmail);

    const refreshAuth = () => {
        const signed = localStorage.getItem('aisleSignedIn') === 'true';
        setIsSignedIn(signed);
        try {
            const raw = localStorage.getItem('aisleUser');
            const parsed = raw ? JSON.parse(raw) : null;
            setCurrentUser(parsed);
            
            const name = localStorage.getItem('aisleUserName') || (parsed && (parsed.firstName || parsed.name)) || '';
            const email = localStorage.getItem('aisleUserEmail') || (parsed && parsed.email) || '';
            setUserName(name);
            setUserEmail(email);
        } catch (e) {
            setCurrentUser(null);
            setUserName('');
            setUserEmail('');
        }
    };

    const signup = (user) => {
        localStorage.setItem('aisleUser', JSON.stringify(user));
        localStorage.setItem('aisleSignedIn', 'true');
        localStorage.setItem('aisleUserName', user.firstName);
        localStorage.setItem('aisleUserEmail', user.email);
        
        window.dispatchEvent(new Event('aisleLoginUpdated'));
        refreshAuth();

        return {
            success: true,
            message: `Welcome to Aisle, ${user.firstName}! Your account has been created successfully.`
        };
    };

    const login = (email, password) => {
        const raw = localStorage.getItem('aisleUser');
        let user = null;
        try {
            user = raw ? JSON.parse(raw) : null;
        } catch (e) {
            user = null;
        }

        if (!user) {
            return {
                success: false,
                message: 'No account found. Please create an account first.'
            };
        }

        const savedEmail = user.email ? user.email.trim().toLowerCase() : '';
        const savedPassword = user.password || '';

        if (email.trim().toLowerCase() !== savedEmail || password !== savedPassword) {
            return {
                success: false,
                message: 'Incorrect email or password. Please try again.'
            };
        }

        localStorage.setItem('aisleUser', JSON.stringify(user));
        localStorage.setItem('aisleSignedIn', 'true');
        localStorage.setItem('aisleUserName', user.firstName || user.name || '');
        localStorage.setItem('aisleUserEmail', user.email || '');

        window.dispatchEvent(new Event('aisleLoginUpdated'));
        refreshAuth();

        return {
            success: true,
            message: `Welcome back, ${user.firstName || user.name}!`
        };
    };

    const logout = () => {
        localStorage.removeItem('aisleSignedIn');
        localStorage.removeItem('aisleUserName');
        localStorage.removeItem('aisleUserEmail');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('loggedIn');

        window.dispatchEvent(new Event('aisleLoginUpdated'));
        refreshAuth();
    };

    useEffect(() => {
        const handleSync = () => refreshAuth();
        window.addEventListener('storage', handleSync);
        window.addEventListener('aisleLoginUpdated', handleSync);
        return () => {
            window.removeEventListener('storage', handleSync);
            window.removeEventListener('aisleLoginUpdated', handleSync);
        };
    }, []);

    return (
        <AuthContext.Provider value={{
            isSignedIn,
            currentUser,
            userName,
            userEmail,
            login,
            signup,
            logout,
            refreshAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
