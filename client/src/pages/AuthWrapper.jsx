// AuthWrapper.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthWrapper = ({ children }) => {
  const token = sessionStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/LoginPage" replace />;
  }
  
  return children;
};

export default AuthWrapper;