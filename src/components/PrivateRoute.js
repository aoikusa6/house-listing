import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStatus from './useAuthStatus';
import SpinnerSolar from './SpinnerSolar';

const PrivateRoute = () => {
  const { loggedIn, isLoading } = useAuthStatus();
  if (isLoading) {
    return <SpinnerSolar/>;
  }
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
