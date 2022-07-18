import {
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

const SocialLogin = () => {
  const toast = useToast();
  const navigate = useNavigate()
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
        title: `Created an account with your ${social} account.`,
        description: 'Redirecting to your profile',
        status: 'success',
        duration: 3000,
      });
      navigate('/profile')
    } catch (error) {
      toast({
        title: `Error creating ${social} account.`,
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
    <IconButton
      key={index}
      colorScheme={item.theme}
      icon={item.icon}
      size="md"
      fontSize="lg"
      onClick={() => handleSocialClick(item.name)}
    />
  ));
  const buttonItems = buttonsInfo.map((item, index) => (
    <Button
      key={index}
      leftIcon={item.icon}
      colorScheme={item.theme}
      size="lg"
      fontSize="xl"
      onClick={() => handleSocialClick(item.name)}
    >
      <Text>{item.name}</Text>
    </Button>
  ));
  const buttonVariants = useBreakpointValue({
    base: iconButtonItems,
    md: buttonItems,
  });
  return (
    <ButtonGroup mt={4} size="lg" fontSize="xl">
      {buttonVariants}
    </ButtonGroup>
  );
};

export default SocialLogin;