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

const Logo = () => {
  const buttonsInfo = [
    { link: '/signin', icon: <FaChevronCircleRight />, text: 'Sign In' },
    { link: '/signup', icon: <FaUserPlus />, text: 'Sign Up' },
  ];
  const iconButtonItems = buttonsInfo.map((item, index) => (
    <IconButton
      key={index}
      as={Link}
      to={item.link}
      icon={item.icon}
      colorScheme="green"
      size="md"
      fontSize="lg"
    />
  ));
  const buttonItems = buttonsInfo.map((item, index) => (
    <Button
      key={index}
      as={Link}
      to={item.link}
      leftIcon={item.icon}
      colorScheme="green"
      size="lg"
      fontSize="xl"
    >
      <Text>{item.text}</Text>
    </Button>
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
        <ButtonGroup spacing={4} >
          <ColorModeSwitcher size={['md', null, 'lg']} />
          {buttonVariants}
        </ButtonGroup>
      </Flex>
    </>
  );
};

export default Logo;
