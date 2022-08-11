import React from 'react';
import { Flex, Image, Button, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import interior from '../assets/interior.png';
import exterior from '../assets/exterior.png';
import { FaCoins, FaMoneyBill } from 'react-icons/fa';
import RecentCarousel from '../components/RecentCarousel';

const Explore = () => {
  //** Image setting **//

  const imgsInfo = [
    {
      to: '/category/rent',
      src: interior,
      icon: <FaCoins />,
      text: 'Rent a property',
    },
    {
      to: '/category/sale',
      src: exterior,
      icon: <FaMoneyBill />,
      text: 'Buy a property',
    },
  ];

  const imgItems = imgsInfo.map((item, index) => (
    <Flex gap={8} direction="column" as={Link} to={item.to} w={400} key={index}>
      <Image
        border={2}
        borderStyle="solid"
        borderColor="cyan.700"
        borderRadius="15%"
        as={motion.img}
        src={item.src}
        align="center"
        fit="contain"
        whileHover={{ scale: 1.2 }}
      />
      <Button
        as={motion.button}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
        leftIcon={item.icon}
        colorScheme="green"
        size="lg"
        fontSize="xl"
      >
        <Text display={['none', null, 'inline']}>{item.text}</Text>
      </Button>
    </Flex>
  ));

  //** Motion setting **//

  const pageMotion = {
    initial: { opacity: 0, y: '100%' },
    animate: { opacity: 1, y: 0, transition: { duration: 1 } },
    exit: { opacity: 0, y: '100%', transition: { duration: 1 } },
  };

  return (
    <>
      <RecentCarousel/>
      <Flex
        as={motion.div}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageMotion}
        mt={8}
        justify="space-around"
        gap={4}
        alignContent="center"
      >
        {imgItems}
      </Flex>
    </>
  );
};

export default Explore;
