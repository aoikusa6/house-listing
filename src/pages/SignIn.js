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
  Flex,
  useToast,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  FaEye,
  FaEyeSlash,
  FaQuestionCircle,
  FaChevronCircleRight,
  FaAt,
} from 'react-icons/fa';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const SignIn = () => {
  const [isHidden, setIsHidden] = useBoolean(true);
  const [signInFormData, setSignInFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = signInFormData;
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = e => {
    const { name, value } = e.target;
    setSignInFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        toast({
          title: 'Logged in.',
          description: 'Redirecting to your profile.',
          status: 'success',
          duration: 3000,
        });
        navigate('/profile');
      }
    } catch (error) {
      toast({
        title: 'Can not login.',
        description: 'Something goes wrong, please try again',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const buttonsInfo = [
    { icon: <FaChevronCircleRight />, text: 'Sign In' },
    { icon: <FaQuestionCircle />, text: 'Forgot password?', to: '/forgot' },
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

  const inputsInfo = [
    { type: 'text', name: 'email', icon1: <FaAt /> },
    {
      type: isHidden ? 'password' : 'text',
      name: 'password',
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
        value={signInFormData[item.name]}
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
  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl as="fieldset" w="50%" mx="auto" mt={4}>
          <FormLabel as="legend" fontSize="xl">
            Welcome back
          </FormLabel>
          {inputItems}
          <Flex mt={4} justifyContent="space-between">
            {buttonVariants}
          </Flex>
        </FormControl>
      </form>
    </>
  );
};

export default SignIn;
