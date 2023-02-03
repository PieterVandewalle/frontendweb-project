import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, useLocation } from 'react-router-dom';
import Loader from './Loader';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth0();
    const location = useLocation();

    if (isLoading)
        return <div className="card"><Loader loadingText="Loading..." /></div>

    return isAuthenticated ? children : <Navigate to={"/login"} state={{ target: location.pathname }} replace />
}
export default PrivateRoute;