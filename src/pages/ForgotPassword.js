import {
  FormControl,
  FormLabel,
  useToast,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Button,
  Text,
  useBreakpointValue,
  Flex,
  Box,
} from '@chakra-ui/react';
import { FaAt, FaPaperPlane, FaHome } from 'react-icons/fa';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [forgotFormData, setForgotFormData] = useState({ email: '' });
  const { email } = forgotFormData;
  const toast = useToast();
  const handleChange = e => {
    const { name, value } = e.target;
    setForgotFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Email was send.',
        description: 'Please check your email, include trash and spam folder.',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Could not send reset email.',
        description: 'Something goes wrong, please try again',
        status: 'error',
        duration: 3000,
      });
    }
  };
  const inputsInfo = [{ type: 'text', name: 'email', icon1: <FaAt /> }];
  const inputItems = inputsInfo.map((item, index) => (
    <InputGroup mt={4} key={index}>
      <Input
        id={index}
        borderRadius="full"
        type={item.type}
        placeholder={`Enter your ${item.name}`}
        name={item.name}
        value={forgotFormData[item.name]}
        onChange={handleChange}
      />
      <InputRightElement
        children={
          <IconButton
            colorScheme="green"
            variant="ghost"
            icon={item.icon1}
            isRound
          />
        }
      />
    </InputGroup>
  ));

  const buttonsInfo = [
    { icon: <FaPaperPlane />, text: 'Send' },
    { icon: <FaHome />, text: 'Back to Homepage', to: '/' },
  ];

  const iconButtonItems = buttonsInfo.map((item, index) => (
    <IconButton
      key={index}
      as={item.to && Link}
      to={item.to && item.to}
      icon={item.icon}
      colorScheme="green"
      size="md"
      fontSize="lg"
      onClick={item.to ? null : handleSubmit}
    />
  ));
  const buttonItems = buttonsInfo.map((item, index) => (
    <Button
      key={index}
      as={item.to && Link}
      to={item.to && item.to}
      leftIcon={item.icon}
      colorScheme="green"
      size="lg"
      fontSize="xl"
      onClick={item.to ? null : handleSubmit}
    >
      <Text>{item.text}</Text>
    </Button>
  ));
  const buttonVariants = useBreakpointValue({
    base: iconButtonItems,
    md: buttonItems,
  });
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
          Enter your email for password recovery:
        </FormLabel>
        {inputItems}
        <Flex mt={4} justifyContent="space-between">
          {buttonVariants}
        </Flex>
      </FormControl>
    </Box>
  );
};

export default ForgotPassword;
