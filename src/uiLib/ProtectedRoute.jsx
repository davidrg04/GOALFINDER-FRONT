import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('jwt');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
export default ProtectedRoute;