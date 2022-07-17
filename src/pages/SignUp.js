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
  ButtonGroup,
} from '@chakra-ui/react';
import {
  FaEye,
  FaEyeSlash,
  FaChevronCircleRight,
  FaGoogle,
  FaFacebook,
  FaEnvelope,
  FaAt,
} from 'react-icons/fa';
import React, { useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { db } from '../firebase.config';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const SignUp = () => {
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
  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl as="fieldset" w="50%" mx="auto" mt={4}>
          <FormLabel as="legend" fontSize="xl">
            Register your account:
          </FormLabel>
          {inputItems}

          <Button
            mt={4}
            leftIcon={<FaChevronCircleRight />}
            colorScheme="green"
            size="lg"
            fontSize="xl"
            type="submit"
            onClick={handleSubmit}
          >
            <Text display={['none', null, 'inline']}>Sign Up</Text>
          </Button>
          <Divider mt={4} />
          <FormLabel as="legend" fontSize="xl">
            OR Register with:
          </FormLabel>
          <ButtonGroup mt={4} size="lg" fontSize="xl">
            <Button leftIcon={<FaGoogle />} colorScheme="red">
              <Text display={['none', null, 'inline']}>Google</Text>
            </Button>
            <Button leftIcon={<FaFacebook />} colorScheme="facebook">
              <Text display={['none', null, 'inline']}>facebook</Text>
            </Button>
          </ButtonGroup>
        </FormControl>
      </form>
    </>
  );
};

export default SignUp;
