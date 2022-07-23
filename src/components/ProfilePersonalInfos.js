import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useBoolean,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react';
import { getAuth, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
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

const ProfilePersonalInfos = () => {
  //** Component states & functions **//

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

  //** Motion setting **//

  const generalMotion = {
    initial: { opacity: 0, x: '-100%' },
    animate: { opacity: 1, x: 0, transition: { duration: 1 } },
    exit: { opacity: 0, x: '-100%', transition: { duration: 1 } },
  };

  //** Button setting **//

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
      as={motion.button}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.8 }}
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
      as={motion.button}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.8 }}
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
  
  const buttonVariants = useBreakpointValue({
    base: iconButtonItems,
    md: buttonItems,
  });

  //** Input setting **//

  const inputsInfo = [
    { type: 'text', name: 'name', icon: <FaEnvelope /> },
    { type: 'text', name: 'email', icon: <FaAt /> },
  ];

  const inputItems = inputsInfo.map((item, index) => (
    <InputGroup
      mb={4}
      key={index}
      as={motion.div}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: { opacity: 0, x: '-100%' },
        animate: {
          opacity: 1,
          x: 0,
          transition: { duration: 1 + (1 + index) * 0.5 },
        },
        exit: {
          opacity: 0,
          x: '-100%',
          transition: { duration: 1 + (1 + index) * 0.5 },
        },
      }}
    >
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
    <Box w="100%" p={4}>
      <Heading
        as={motion.h2}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={generalMotion}
        size={['md', null, 'lg']}
      >
        {name ? `${name}'s` : 'New'} profile
      </Heading>
      <Box as="form" onSubmit={handleSubmit}>
        <FormControl as="fieldset" mt={4}>
          {inputItems}
        </FormControl>
      </Box>
      <ButtonGroup
        as={motion.div}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          initial: { opacity: 0, x: '-100%' },
          animate: { opacity: 1, x: 0, transition: { duration: 2.5 } },
          exit: { opacity: 0, x: '-100%', transition: { duration: 2.5 } },
        }}
        mt={4}
        spacing={4}
      >
        {buttonVariants}
      </ButtonGroup>
    </Box>
  );
};

export default ProfilePersonalInfos;
