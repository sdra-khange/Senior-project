import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserType } from '../utils/auth';

export default function ProtectedRoute({ children, allowedUserType }) {
    const isAuth = isAuthenticated();
    const userType = getUserType();

    if (!isAuth) {
        return <Navigate to="/login" />;
    }

    if (allowedUserType && userType !== allowedUserType) {
        return <Navigate to="/" />;
    }

    return children;
}



