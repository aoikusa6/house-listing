import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStatus from './useAuthStatus';
import spinnerImage from '../assets/spinnerImage.gif';

const PrivateRoute = () => {
  const { loggedIn, loading } = useAuthStatus();
  if (loading) {
    return spinnerImage;
  }
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
