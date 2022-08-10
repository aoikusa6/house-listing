import { Box, Heading, Text } from '@chakra-ui/react';
import React from 'react';

const About = () => {
  return (
    <>
      <Box w="75%" mx="auto" pt={4}>
        <Heading as="h5" fontSize="2xl">
          This is a solo project made by Thien Ha.
        </Heading>
        <Text fontSize='lg'>Using React, Firebase, Chakra UI, Framer Motion, Swiper, Leaflet.</Text>
        <Text fontSize='lg'>Complete within 3 weeks.</Text>
      </Box>
    </>
  );
};

export default About;
