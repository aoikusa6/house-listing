import { Flex } from '@chakra-ui/react';
import React from 'react';
import ProfileListingInfos from '../components/ProfileListingInfos';
import ProfilePersonalInfos from '../components/ProfilePersonalInfos';

const Profile = () => {
  return (
    <Flex gap={4}>
      <ProfilePersonalInfos />
      <ProfileListingInfos />
    </Flex>
  );
};

export default Profile;
