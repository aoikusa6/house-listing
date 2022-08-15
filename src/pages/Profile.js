import { Grid } from '@chakra-ui/react';
import React from 'react';
import ProfileListingInfos from '../components/ProfileListingInfos';
import ProfilePersonalInfos from '../components/ProfilePersonalInfos';

const Profile = () => {
  return (
    <Grid gap={4} templateColumns={['repeat(1, 1fr)', null, null, 'repeat(2, 1fr)']}>
      <ProfilePersonalInfos />
      <ProfileListingInfos />
    </Grid>
  );
};

export default Profile;
