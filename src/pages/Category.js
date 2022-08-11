import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { Box, Grid, Heading, Text, useToast } from '@chakra-ui/react';

import ListingItems from '../components/ListingItems';
import { motion } from 'framer-motion';
import SpinnerSolar from '../components/SpinnerSolar';

const Category = () => {
  //** Component states & functions **//

  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const toast = useToast();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, 'listings');
        const q = query(
          listingsRef,
          where('type', '==', params.categoryName),
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
  }, [params.categoryName, toast]);

  //** Motion setting **//
  const pageMotion = {
    initial: { opacity: 0, y: '100%' },
    animate: { opacity: 1, y: 0, transition: { duration: 1 } },
    exit: { opacity: 0, y: '100%', transition: { duration: 1 } },
  };

  if (isLoading) {
    return <SpinnerSolar />;
  }

  return (
    <Box mt={4}>
      <Heading as="h2" size="lg" textAlign="center">
        {params.categoryName === 'rent'
          ? `Places for ${params.categoryName}`
          : `Places for ${params.categoryName}`}
      </Heading>
      {listings && listings.length > 0 ? (
        <Grid
          mt={4}
          gap={2}
          as={motion.div}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageMotion}
          templateColumns={['repeat(1, 1fr)', null, 'repeat(2, 1fr)']}
        >
          {listings.map((listing, index) => (
            <ListingItems
              index={index}
              key={listing.id}
              listing={listing.data}
              id={listing.id}
            />
          ))}
        </Grid>
      ) : (
        <SpinnerSolar />
      )}
    </Box>
  );
};

export default Category;
