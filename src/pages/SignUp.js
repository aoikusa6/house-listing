import {
  Button,
  Text,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useBoolean,
  Divider,
  useToast,
  useBreakpointValue,
  Box,
  Flex,
} from '@chakra-ui/react';
import {
  FaEye,
  FaEyeSlash,
  FaChevronCircleRight,
  FaEnvelope,
  FaAt,
} from 'react-icons/fa';
import React, { useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { db } from '../firebase.config';
import { Link, useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import SocialLogin from './SocialLogin';
import { motion } from 'framer-motion';

const SignUp = () => {
  //** Component states & functions **//

  const [isHidden, setIsHidden] = useBoolean(true);
  const [signUpFormData, setSignUpFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });
  const { name, email, password, password2 } = signUpFormData;
  const toast = useToast();
  let navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setSignUpFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      sendEmailVerification(auth.currentUser);
      updateProfile(auth.currentUser, {
        displayName: name,
      });

      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
        password: password,
        timestamp: serverTimestamp(),
      });
      toast({
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 3000,
      });
      navigate('/profile');
    } catch (error) {
      toast({
        title: 'Error creating account.',
        description: 'Something goes wrong, please try again',
        status: 'error',
        duration: 3000,
      });
    }
  };

  //** Button setting **//

  const buttonsInfo = [{ icon: <FaChevronCircleRight />, text: 'Sign In' }];

  const iconButtonItems = buttonsInfo.map((item, index) => (
    <Box key={index} as={item.to && Link} to={item.to && item.to}>
      <IconButton
        as={motion.button}
        whileTap={{ scale: 0.8 }}
        icon={item.icon}
        colorScheme="green"
        size="md"
        fontSize="lg"
        onClick={item.to ? null : handleSubmit}
      />
    </Box>
  ));

  const buttonItems = buttonsInfo.map((item, index) => (
    <Box key={index} as={item.to && Link} to={item.to && item.to}>
      <Button
        as={motion.button}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
        leftIcon={item.icon}
        colorScheme="green"
        size="lg"
        fontSize="xl"
        onClick={item.to ? null : handleSubmit}
      >
        <Text>{item.text}</Text>
      </Button>
    </Box>
  ));

  const buttonVariants = useBreakpointValue({
    base: iconButtonItems,
    md: buttonItems,
  });

  //** Input setting **//

  const inputsInfo = [
    { type: 'text', name: 'name', icon1: <FaEnvelope /> },
    { type: 'text', name: 'email', icon1: <FaAt /> },
    {
      type: isHidden ? 'password' : 'text',
      name: 'password',
      icon1: <FaEye />,
      icon2: <FaEyeSlash />,
    },
    {
      type: isHidden ? 'password' : 'text',
      name: 'password2',
      icon1: <FaEye />,
      icon2: <FaEyeSlash />,
    },
  ];

  const inputItems = inputsInfo.map((item, index) => (
    <InputGroup mt={4} key={index}>
      <Input
        id={index}
        borderRadius="full"
        type={item.type}
        placeholder={
          item.name === 'password2'
            ? 'Repeat your password'
            : `Enter your ${item.name}`
        }
        name={item.name}
        value={signUpFormData[item.name]}
        onChange={handleChange}
      />
      <InputRightElement
        children={
          item.icon2 ? (
            isHidden ? (
              <IconButton
                onClick={setIsHidden.toggle}
                colorScheme="green"
                variant="ghost"
                icon={item.icon1}
                isRound
              />
            ) : (
              <IconButton
                onClick={setIsHidden.toggle}
                colorScheme="green"
                variant="ghost"
                icon={item.icon2}
                isRound
              />
            )
          ) : (
            <IconButton
              colorScheme="green"
              variant="ghost"
              icon={item.icon1}
              isRound
            />
          )
        }
      />
    </InputGroup>
  ));

  //** Motion setting **//

  const pageMotion = {
    initial: { opacity: 0, y: '100%' },
    animate: { opacity: 1, y: 0, transition: { duration: 1 } },
    exit: { opacity: 0, y: '100%', transition: { duration: 1 } },
  };

  return (
    <Box
      onSubmit={handleSubmit}
      as={motion.form}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageMotion}
    >
      <FormControl as="fieldset" w="50%" mx="auto" mt={4}>
        <FormLabel as="legend" fontSize="xl">
          Register your account:
        </FormLabel>
        {inputItems}

        <Flex mt={4} justifyContent="space-between">
          {buttonVariants}
        </Flex>
        <Divider mt={4} />
        <FormLabel as="legend" fontSize="xl">
          OR Register with:
        </FormLabel>
        <SocialLogin />
      </FormControl>
    </Box>
  );
};

export default SignUp;
