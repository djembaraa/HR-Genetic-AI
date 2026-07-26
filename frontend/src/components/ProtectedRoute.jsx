import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0) {
    try {
      const user = JSON.parse(userStr);
      if (!allowedRoles.includes(user.role)) {
        return <Navigate to={user.role === 'CANDIDATE' ? '/candidate' : '/admin'} replace />;
      }
    } catch (e) {
      return <Navigate to="/login" replace />;
    }
  }
  
  return <Outlet />;
};
