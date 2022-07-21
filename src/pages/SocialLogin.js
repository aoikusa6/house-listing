import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Text,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react';
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import React from 'react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { db } from '../firebase.config';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SocialLogin = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const handleSocialClick = async social => {
    try {
      const auth = getAuth();
      let provider = null;
      switch (social) {
        case 'Google': {
          provider = new GoogleAuthProvider();
          break;
        }
        case 'Facebook': {
          provider = new FacebookAuthProvider();
          break;
        }
        default:
          provider = null;
      }

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      toast({
        title: `Logging in with an account from your ${social}.`,
        description: 'Redirecting to your profile',
        status: 'success',
        duration: 3000,
      });
      navigate('/profile');
    } catch (error) {
      toast({
        title: `Error creating account from your ${social} account.`,
        description: 'Something goes wrong, please try again',
        status: 'error',
        duration: 3000,
      });
    }
  };
  const buttonsInfo = [
    { name: 'Google', icon: <FaGoogle />, theme: 'red' },
    { name: 'Facebook', icon: <FaFacebook />, theme: 'facebook' },
  ];
  const iconButtonItems = buttonsInfo.map((item, index) => (
    <Box key={index}>
      <IconButton
        as={motion.button}
        whileTap={{ scale: 0.8 }}
        colorScheme={item.theme}
        icon={item.icon}
        size="md"
        fontSize="lg"
        onClick={() => handleSocialClick(item.name)}
      />
    </Box>
  ));
  const buttonItems = buttonsInfo.map((item, index) => (
    <Box key={index}>
      <Button
        as={motion.button}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
        leftIcon={item.icon}
        colorScheme={item.theme}
        size="lg"
        fontSize="xl"
        onClick={() => handleSocialClick(item.name)}
      >
        <Text>{item.name}</Text>
      </Button>
    </Box>
  ));
  const buttonVariants = useBreakpointValue({
    base: iconButtonItems,
    md: buttonItems,
  });
  return (
    <ButtonGroup mt={4} size="lg" fontSize="xl" gap={4}>
      {buttonVariants}
    </ButtonGroup>
  );
};

export default SocialLogin;
