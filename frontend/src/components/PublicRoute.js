import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const PublicRoute = ({ children }) => {
    if (isAuthenticated()) {
        return <Navigate to="/main" />;
    }

    return children;
};

export default PublicRoute;
