import { Text } from '@chakra-ui/react';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStatus from './useAuthStatus';

const PrivateRoute = () => {
  const { loggedIn, loading } = useAuthStatus();
  if (loading) {
    return <Text>Loading...</Text>;
  }
  return loggedIn ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
