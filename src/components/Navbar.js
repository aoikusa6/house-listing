import { Box, Icon, Tab, TabList, Tabs, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';
import { FaCompass, FaCoins, FaUserTie, FaHome } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  //** Tab setting **//

  const tabsInfo = [
    { link: '/', icon: FaCompass, text: 'Explore' },
    { link: '/offer', icon: FaCoins, text: 'Offers' },
    { link: '/profile', icon: FaUserTie, text: 'Profile' },
    { link: '/about', icon: FaHome, text: 'About' },
  ];

  const tabItems = tabsInfo.map((item, index) => (
    <Tab size={['md', null, 'lg']} key={index} as={NavLink} to={item.link}>
      <Box as={motion.div}>
        <Icon as={item.icon} />
        <Text ml={2} display={['none', null, 'inline']}>
          {item.text}
        </Text>
      </Box>
    </Tab>
  ));

  return (
    <>
      <Tabs isFitted variant="solid-rounded" colorScheme="green">
        <TabList>{tabItems}</TabList>
      </Tabs>
    </>
  );
};

export default Navbar;
