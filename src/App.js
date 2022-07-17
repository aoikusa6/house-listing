import React from 'react';
import { ChakraProvider, Box, theme, Flex } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Logo from './pages/Logo';
import Footer from './pages/Footer';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Offer from './pages/Offer';
import Explore from './pages/Explore';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box>
        <Flex minHeight="100vh" direction="column" width="80%" mx="auto">
          <Logo />
          <Navbar />
          <Box flexGrow={1}>
            <Routes>
              <Route path="/" element={<Explore />} />
              <Route path="/offer" element={<Offer />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<PrivateRoute />}>
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Routes>
          </Box>
          <Footer />
        </Flex>
      </Box>
    </ChakraProvider>
  );
}

export default App;
