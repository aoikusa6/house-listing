import React from 'react';
import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  deleteDoc,
  startAfter,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  useToast,
} from '@chakra-ui/react';
import ListingItems from '../components/ListingItems';
import { motion } from 'framer-motion';
import { getAuth } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { FaClinicMedical } from 'react-icons/fa';
import SpinnerSolar from './SpinnerSolar';

const ProfileListingInfos = () => {
  //** Component states & functions **//

  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const toast = useToast();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, 'listings');
        const q = query(
          listingsRef,
          where('userRef', '==', user.uid),
          orderBy('timestamp', 'desc'),
          limit(10)
        );

        const querySnap = await getDocs(q);
        const listings = [];

        querySnap.forEach(doc => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings);
        setIsLoading(false);
      } catch (error) {
        toast({
          title: 'Error connecting to server.',
          description: `${error}`,
          status: 'error',
          duration: 3000,
        });
      }
    };

    fetchListings();
  }, [toast, user.uid]);

  const navigate = useNavigate();
  const handleDelete = async listingId => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      await deleteDoc(doc(db, 'listings', listingId));
      const updatedListings = listings.filter(item => item.id !== listingId);
      setListings(updatedListings);
      navigate('/profile');
      toast({
        title: 'Property deleted.',
        description: 'Item has been remove from your list',
        status: 'success',
        duration: 3000,
      });
    }
  };

  //** Motion setting **//

  const pageMotion = [
    {
      rightToLeftShort: {
        initial: { opacity: 0, x: '100%' },
        animate: { opacity: 1, x: 0, transition: { duration: 1 } },
        exit: { opacity: 0, x: '100%', transition: { duration: 1 } },
      },
    },
    {
      bottomToTopShort: {
        initial: { opacity: 0, y: '100%' },
        animate: { opacity: 1, y: 0, transition: { duration: 1 } },
        exit: { opacity: 0, y: '100%', transition: { duration: 1 } },
      },
    },
    {
      rightToLeftLong: {
        initial: { opacity: 0, x: '100%' },
        animate: { opacity: 1, x: 0, transition: { duration: 2.5 } },
        exit: { opacity: 0, x: '100%', transition: { duration: 2.5 } },
      },
    },
  ];

  if (isLoading) {
    return <SpinnerSolar />;
  }

  return (
    <Flex mt={4} w="100%" direction="column" alignItems="flex-end">
      <Heading
        as={motion.h2}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageMotion[0].rightToLeftShort}
        size="lg"
      >
        Items from your account:
      </Heading>
      {listings && listings.length > 0 ? (
        <Grid
          w="100%"
          mt={4}
          gap={2}
          as={motion.div}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageMotion[1].bottomToTopShort}
          templateColumns={'repeat(1, 1fr)'}
        >
          {listings.map((listing, index) => (
            <ListingItems
              index={index}
              key={listing.id}
              listing={listing.data}
              id={listing.id}
              onDelete={() => handleDelete(listing.id)}
            />
          ))}
        </Grid>
      ) : (
        <Text>There are no item from your account</Text>
      )}
      <Box as={Link} to="/create-listing">
        <Button
          leftIcon={<FaClinicMedical />}
          colorScheme="green"
          size="lg"
          fontSize="xl"
          as={motion.button}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageMotion[2].rightToLeftLong}
          mt={4}
        >
          <Text>Add new item for rent / sale</Text>
        </Button>
      </Box>
    </Flex>
  );
};

export default ProfileListingInfos;
