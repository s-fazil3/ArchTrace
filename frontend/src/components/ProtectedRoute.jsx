import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading } = useAuth();

    if (loading) return <div className="p-8 text-center text-slate-500">Loading auth state...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles) {
        const normalizedAllowedRoles = allowedRoles.map(r => r.toUpperCase().replace(' ', '_'));
        const userRole = user.role?.toUpperCase();

        if (!normalizedAllowedRoles.includes(userRole)) {
            return <Navigate to="/access-denied" replace />;
        }
    }

    return children ? children : <Outlet />;
}
