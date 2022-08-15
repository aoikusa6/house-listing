import React from 'react';
import { Flex, Heading, Image } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Flex gap={4} alignItems="center" mx="auto" mt={4}>
      <Image
        src="https://www.svgrepo.com/show/230345/solar-system-space.svg"
        boxSize="75px"
      />
      <Heading>Made by Thien Ha &copy; Aug 2022</Heading>
    </Flex>
  );
};

export default Footer;
