import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const isTokenExpired = (token) => {
    if (!token) return true; // No token means expired

    try {
        const decodedToken = jwtDecode(token);
        if (decodedToken && decodedToken.exp) {
            const expiryDate = new Date(decodedToken.exp * 1000);
            return expiryDate < new Date();
            
        }
        return true; // If no expiry, consider it expired or invalid
    } catch (error) {
        console.error('Error decoding token:', error);
        return true; // If decoding fails, consider it invalid
    }
};

const PrivateRoute = ({ children, allowedRoles }) => {
    const storedToken = localStorage.getItem('token');
    const location = useLocation(); 

    if (!storedToken) {
        if (location.pathname.startsWith('/admin/')) {
            return <Navigate to="/admin/login" state={{ from: location }} replace />;
        } else {
            return <Navigate to="/user/login" state={{ from: location }} replace />;
        }
    }

    try {
        const tokenData = JSON.parse(storedToken);
        const token = tokenData ? tokenData.token : null;

        if (token) {
            if (location.pathname == '/admin/login') {
                return <Navigate to="/admin/dashboard" replace />;
            } else if (location.pathname == '/user/login' || location.pathname == '/user/signup') {
                return <Navigate to="/home" replace />;
            }
        }

        if (!token || isTokenExpired(token)) {
            localStorage.removeItem('token'); // Clear the expired token
            if (location.pathname.startsWith('/admin/')) {
                return <Navigate to="/admin/login" state={{ from: location }} replace />;
            } else {
                return <Navigate to="/user/login" state={{ from: location }} replace />;
            }
        }

        const decodedToken = jwtDecode(token);
        const userRole = decodedToken?.role || [];

        if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
            return <Navigate to="/unauthorized" state={{ from: location }} replace />;
        }

        return children;
    } catch (error) {
        console.error('Token handling error:', error);
        localStorage.removeItem('token'); // Clear token on any error
        if (location.pathname.startsWith('/admin/')) {
            return <Navigate to="/admin/login" state={{ from: location }} replace />;
        } else {
            return <Navigate to="/user/login" state={{ from: location }} replace />;
        }
    }
};

export default PrivateRoute;