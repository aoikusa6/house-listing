import {
  Heading,
  Img,
  Flex,
  Button,
  Spacer,
  ButtonGroup,
  Text,
  Box,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FaChevronCircleRight, FaUserPlus } from 'react-icons/fa';
import logo from '../assets/logo.png';
import React from 'react';
import { Link } from 'react-router-dom';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { motion } from 'framer-motion';

const Logo = () => {
  //** Button setting **//

  const buttonsInfo = [
    { link: '/sign-in', icon: <FaChevronCircleRight />, text: 'Sign In' },
    { link: '/sign-up', icon: <FaUserPlus />, text: 'Sign Up' },
  ];

  const iconButtonItems = buttonsInfo.map((item, index) => (
    <Box as={Link} to={item.link} key={index}>
      <IconButton
        as={motion.button}
        whileTap={{ scale: 0.8 }}
        icon={item.icon}
        colorScheme="green"
        size="md"
        fontSize="lg"
      />
    </Box>
  ));

  const buttonItems = buttonsInfo.map((item, index) => (
    <Box as={Link} to={item.link} key={index}>
      <Button
        as={motion.button}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
        leftIcon={item.icon}
        colorScheme="green"
        size="lg"
        fontSize="xl"
      >
        <Text>{item.text}</Text>
      </Button>
    </Box>
  ));

  const buttonVariants = useBreakpointValue({
    base: iconButtonItems,
    md: buttonItems,
  });
  
  return (
    <>
      <Flex py={4} gap={4}>
        <Box as={Link} to="/">
          <Img src={logo} width={[150, null, 200]} />
          <Heading as="h2" size={['lg', null, 'xl']} color="green.500">
            Land market
          </Heading>
        </Box>

        <Spacer />
        <ButtonGroup spacing={4}>
          <ColorModeSwitcher
            size={['md', null, 'lg']}
            as={motion.button}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          />
          {buttonVariants}
        </ButtonGroup>
      </Flex>
    </>
  );
};

export default Logo;
