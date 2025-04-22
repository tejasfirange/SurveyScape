import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // Redirect to login if user is not authenticated
        return <Navigate to="/login" replace />;
    }

    // Render the protected component if user is authenticated
    return children;
};

export default PrivateRoute; 