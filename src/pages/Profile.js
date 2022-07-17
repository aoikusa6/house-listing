import {
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  Text,
  useBoolean,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react';
import { getAuth, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  FaAt,
  FaEnvelope,
  FaSave,
  FaSignOutAlt,
  FaWrench,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase.config';

const Profile = () => {
  const auth = getAuth();
  const toast = useToast();
  const [isEdit, setIsEdit] = useBoolean(false);
  const [profileFormData, setProfileFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = profileFormData;
  const navigate = useNavigate();
  const handleEdit = () => {
    setIsEdit.toggle();
  };
  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setProfileFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, { name });
        toast({
          title: 'Profile updated.',
          description: 'Please check your info.',
          status: 'success',
          duration: 3000,
        });
        setIsEdit.toggle();
      }
    } catch (error) {
      toast({
        title: 'Can not update profile.',
        description: 'Something goes wrong, please try again',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const buttonsInfo = [
    {
      icon: isEdit ? <FaSave /> : <FaWrench />,
      action: isEdit ? handleSubmit : handleEdit,
      text: isEdit ? 'Save' : 'Edit',
    },
    { icon: <FaSignOutAlt />, action: handleLogout, text: 'Logout' },
  ];
  const iconButtonItems = buttonsInfo.map((item, index) => (
    <IconButton
      key={index}
      icon={item.icon}
      colorScheme="green"
      size="md"
      fontSize="lg"
      onClick={item.action}
    />
  ));
  const buttonItems = buttonsInfo.map((item, index) => (
    <Button
      key={index}
      leftIcon={item.icon}
      colorScheme="green"
      size="lg"
      fontSize="xl"
      type="submit"
      onClick={item.action}
    >
      <Text>{item.text}</Text>
    </Button>
  ));
  const buttonVariants = useBreakpointValue({base: iconButtonItems,  md: buttonItems})

  const inputsInfo = [
    { type: 'text', name: 'name', icon: <FaEnvelope /> },
    { type: 'text', name: 'email', icon: <FaAt /> },
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
        value={profileFormData[item.name]}
        onChange={handleChange}
        isDisabled={!isEdit}
      />
      <InputRightElement
        children={
          <IconButton
            colorScheme="green"
            variant="ghost"
            icon={item.icon}
            isRound
          />
        }
      />
    </InputGroup>
  ));

  return (
    <>
      <Flex mt={4}>
        <Heading as="h2" size={['lg', null, 'xl']}>
          {name ? `${name}'s` : 'New'} profile
        </Heading>
        <Spacer />
        <ButtonGroup spacing={4}>{buttonVariants}</ButtonGroup>
      </Flex>
      <form onSubmit={handleSubmit}>
        <FormControl as="fieldset" w="50%" mx="auto" mt={4}>
          {inputItems}
        </FormControl>
      </form>
    </>
  );
};

export default Profile;