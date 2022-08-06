import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import {
  Badge,
  Button,
  Flex,
  Grid,
  Heading,
  Icon,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaShareAlt, FaBed, FaBath } from 'react-icons/fa';
import SpinnerSolar from '../components/SpinnerSolar';

const SingleListItem = () => {
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();
  const toast = useToast();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.singleListItemId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists) {
        setListing(docSnap.data());
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [navigate, params.singleListItemId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Copied',
      description: 'Link copied to clipboard',
      variant: 'subtle',
      duration: 3000,
    });
  };

  return (
    <Flex w="50%" mx="auto" pt={4} direction="column" align="center">
      {isLoading ? (
        <SpinnerSolar />
      ) : (
        <>
          <Heading as="h2" fontSize="2xl">
            {listing.name}
          </Heading>
          <Text fontSize="md">Địa chỉ: {listing.location}</Text>
          <Grid templateColumns="repeat(2, 1fr)" gap={4} pt={4} w="100%">
            <Badge
              p={2}
              colorScheme={listing.type === 'rent' ? 'green' : 'red'}
              borderRadius="full"
            >
              <Text fontSize="md" textAlign="center">
                {listing.type === 'rent' ? 'For rent' : 'For sale'}
              </Text>
            </Badge>
            <Badge
              p={2}
              colorScheme={listing.offer ? 'green' : 'red'}
              borderRadius="full"
            >
              <Text fontSize="md" textAlign="center">
                {listing.offer
                  ? `Discounted ${(
                      listing.regularPrice - listing.discountedPrice
                    )
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VND`
                  : 'Full price'}
              </Text>
            </Badge>
            <Badge
              p={2}
              colorScheme={listing.bathrooms !== 1 ? 'green' : 'red'}
              borderRadius="full"
            >
              <Text fontSize="md" textAlign="center">
                {listing.bathrooms !== 1
                  ? `${listing.bathrooms} bathrooms`
                  : '1 bathroom'}
              </Text>
            </Badge>
            <Badge
              p={2}
              colorScheme={listing.bedrooms !== 1 ? 'green' : 'red'}
              borderRadius="full"
            >
              <Text fontSize="md" textAlign="center">
                {listing.bedrooms !== 1
                  ? `${listing.bedrooms} bedrooms`
                  : '1 bedroom'}
              </Text>
            </Badge>
            <Badge
              p={2}
              colorScheme={listing.parking ? 'green' : 'red'}
              borderRadius="full"
            >
              <Text fontSize="md" textAlign="center">
                {listing.parking ? 'Have parking slot' : 'No parking slot'}
              </Text>
            </Badge>
            <Badge
              p={2}
              colorScheme={listing.furnished ? 'green' : 'red'}
              borderRadius="full"
            >
              <Text fontSize="md" textAlign="center">
                {listing.furnished ? 'Furnished' : 'Unprepared'}
              </Text>
            </Badge>
          </Grid>
          {auth.currentUser?.uid !== listing.userRef && (
            <Button
              mt={4}
              as={Link}
              to={`/contact/${listing.userRef}?listingName=${listing.name}&listingLocation=${listing.location}`}
              colorScheme="green"
            >
              <Text>Contact Landlord</Text>
            </Button>
          )}
        </>
      )}
    </Flex>
  );
};

export default SingleListItem;
