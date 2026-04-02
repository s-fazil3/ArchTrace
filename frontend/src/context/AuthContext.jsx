import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem('archtrace_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();
            const userData = {
                email: data.email,
                role: data.role ? data.role.toUpperCase() : 'DEVELOPER', // Normalize role
                token: data.token,
                name: data.name || data.email.split('@')[0], // Fallback if name is missing
                team: data.team || 'None'
            };

            setUser(userData);
            localStorage.setItem('archtrace_token', data.token);
            localStorage.setItem('archtrace_user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await fetch('http://localhost:8080/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Signup failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('archtrace_user');
        localStorage.removeItem('archtrace_token');
    };

    const updateUserRole = (role) => {
        // Mock update to current user if needed, or if admin updates someone else, this simulates it.
        if (user) {
            const updated = { ...user, role };
            setUser(updated);
            localStorage.setItem('archtrace_user', JSON.stringify(updated));
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, updateUserRole }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
