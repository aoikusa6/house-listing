import { Box, keyframes } from '@chakra-ui/react';
import React from 'react';

const rotationCounterClockwise = keyframes`
  from {transform: rotate(360deg);}
  to {transform: rotate(0deg)}
`;

const rotationClockwise = keyframes`
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg)}
`;

const SpinnerSolar = () => {
  return (
    <Box
      backgroundColor="#2c3e50"
      opacity={0.9}
      height="100%"
      width="100%"
      position="fixed"
      top={0}
      left={0}
    >
      <Box
        background="radial-gradient(#ff0,#f90)"
        height="50px"
        width="50px"
        borderRadius="full"
        position="absolute"
        left={0}
        right={0}
        top={0}
        bottom={0}
        margin="auto"
      ></Box>
      <Box
        background="transparent"
        borderRadius="full"
        border="1px"
        borderStyle="solid"
        borderColor="#fff"
        position="absolute"
        height="100px"
        width="100px"
        left={0}
        right={0}
        top={0}
        bottom={0}
        margin="auto"
        animation={`${rotationCounterClockwise} infinite 0.9s linear`}
      >
        <Box
          position="absolute"
          zIndex={100}
          borderRadius="full"
          left="20px"
          height="13px"
          width="13px"
          backgroundColor="#ff8"
        ></Box>
      </Box>

      <Box
        background="transparent"
        borderRadius="full"
        border="1px"
        borderStyle="solid"
        borderColor="#fff"
        position="absolute"
        height="150px"
        width="150px"
        left={0}
        right={0}
        top={0}
        bottom={0}
        margin="auto"
        animation={`${rotationClockwise} infinite 2.2s linear`}
      >
        <Box
          position="absolute"
          zIndex={100}
          borderRadius="full"
          left="23px"
          height="20px"
          width="20px"
          backgroundColor="#FFFFE0"
        ></Box>
      </Box>
      
      <Box
        background="transparent"
        borderRadius="full"
        border="1px"
        borderStyle="solid"
        borderColor="#fff"
        position="absolute"
        height="230px"
        width="230px"
        left={0}
        right={0}
        top={0}
        bottom={0}
        margin="auto"
        animation={`${rotationCounterClockwise} infinite 3.6s linear`}
      >
        <Box
          position="absolute"
          zIndex={100}
          borderRadius="full"
          left="60px"
          height="20px"
          width="20px"
          background={"linear-gradient(#00ff00,#09f,#09f)"}
        ></Box>
      </Box>

      <Box
        background="transparent"
        borderRadius="full"
        border="1px"
        borderStyle="solid"
        borderColor="#fff"
        position="absolute"
        height="300px"
        width="300px"
        left={0}
        right={0}
        top={0}
        bottom={0}
        margin="auto"
        animation={`${rotationCounterClockwise} infinite 6.8s linear`}
      >
        <Box
          position="absolute"
          zIndex={100}
          borderRadius="full"
          left="90px"
          height="17px"
          width="17px"
          background={"radial-gradient(#ff9900,#ff4400)"}
        ></Box>
      </Box>
    </Box>
  );
};

export default SpinnerSolar;
