import React from 'react';
import { ChakraProvider, Box, theme, Flex } from '@chakra-ui/react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Logo from './pages/Logo';
import Footer from './pages/Footer';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Offer from './pages/Offer';
import Explore from './pages/Explore';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './pages/ForgotPassword';
import Category from './pages/Category';
import CreateListing from './pages/CreateListing';
import SingleListItem from './pages/SingleListItem';
import ContactLandlord from './pages/ContactLandlord';
import About from './pages/About';
function App() {
  const location = useLocation();
  return (
    <ChakraProvider theme={theme}>
      <Box>
        <Flex minHeight="100vh" direction="column" width="80%" mx="auto">
          <Logo />
          <Navbar />
          <Box flexGrow={1}>
            <AnimatePresence exitBeforeEnter>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Explore />} />
                <Route path="/offer" element={<Offer />} />
                <Route path="/category/:categoryName" element={<Category />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/forgot" element={<ForgotPassword />} />
                <Route path="/create-listing" element={<CreateListing />} />
                <Route
                  path="/contact/:landlordId"
                  element={<ContactLandlord />}
                />
                <Route path="/about" element={<About />} />
                <Route
                  path="/category/:categoryName/:singleListItemId"
                  element={<SingleListItem />}
                />
                <Route path="/profile" element={<PrivateRoute />}>
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Routes>
            </AnimatePresence>
          </Box>
          <Footer />
        </Flex>
      </Box>
    </ChakraProvider>
  );
}

export default App;
