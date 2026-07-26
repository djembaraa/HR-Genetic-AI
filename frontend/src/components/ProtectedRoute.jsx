import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0) {
    try {
      const decoded = jwtDecode(token);
      if (!allowedRoles.includes(decoded.role)) {
        return <Navigate to={decoded.role === 'CANDIDATE' ? '/candidate' : '/admin'} replace />;
      }
    } catch (e) {
      console.error("Invalid token format", e);
      return <Navigate to="/login" replace />;
    }
  }
  
  return <Outlet />;
};
