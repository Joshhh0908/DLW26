import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    // Check if the browser has a token saved from the login page
    // (Note: If your teammate named it something besides 'token' in login.jsx, just change the word below!)
    const isAuthenticated = localStorage.getItem('token') !== null;

    // If they have a token, let them into the dashboard. If not, kick to login.
    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;