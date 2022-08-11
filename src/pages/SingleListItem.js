import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Image,
  Text,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaShareAlt } from 'react-icons/fa';
import SpinnerSolar from '../components/SpinnerSolar';
import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet';

const SingleListItem = () => {
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShowingAlert, setIsShowingAlert] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();
  const position = [listing?.geoLocation.lat, listing?.geoLocation.lng];

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
    setIsShowingAlert(true);
    setTimeout(() => {
      setIsShowingAlert(false);
    }, 3000);
  };

  if (isLoading) {
    return <SpinnerSolar />;
  }

  return (
    <Box
      pt={4}
      as={motion.div}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: { duration: 1 },
        },
        exit: {
          opacity: 0,
          transition: { duration: 1 },
        },
      }}
    >
      <Box
        as={motion.div}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          initial: { opacity: 0, x: '100%' },
          animate: {
            opacity: 1,
            x: 0,
            transition: { duration: 1 },
          },
          exit: {
            opacity: 0,
            x: '100%',
            transition: { duration: 1 },
          },
        }}
      >
        <Heading as="h2" fontSize={['xl', null, '2xl']} textAlign="center">
          {listing.name}
        </Heading>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          navigation={true}
          pagination={{ clickable: true, dynamicBullets: true }}
        >
          <Box position="absolute" top={4} right={4} zIndex={100}>
            <IconButton
              float="right"
              as={motion.button}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              icon={<FaShareAlt />}
              colorScheme="green"
              border={'1px solid cyan'}
              onClick={handleCopyLink}
            ></IconButton>
            {isShowingAlert && (
              <Alert
                as={motion.div}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={{
                  initial: { opacity: 0, x: '100%' },
                  animate: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 1 },
                  },
                  exit: {
                    opacity: 0,
                    x: '100%',
                    transition: { duration: 1 },
                  },
                }}
                status="info"
                borderRadius={4}
              >
                <AlertIcon />
                <Text>Link copied to your clipboard</Text>
              </Alert>
            )}
          </Box>

          {listing.imageUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <Image
                borderRadius={20}
                src={url}
                fit="cover"
                display="block"
                width="100%"
                height={['200px', null, '300px']}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
      <Box
        as={motion.div}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          initial: { opacity: 0, x: '-100%' },
          animate: {
            opacity: 1,
            x: 0,
            transition: { duration: 1 },
          },
          exit: {
            opacity: 0,
            x: '-100%',
            transition: { duration: 1 },
          },
        }}
      >
        <Heading
          as="h2"
          fontSize={['xl', null, '2xl']}
          textAlign="center"
          pt={4}
        >
          Địa chỉ: {listing.location}
        </Heading>
        <Box
          borderRadius={20}
          width="100%"
          height={['200px', null, '300px']}
          overflow="hidden"
        >
          <MapContainer
            style={{ height: '100%', width: '100%' }}
            center={position}
            zoom={15}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </Box>
      </Box>

      <GridItem>
        <Grid
          templateColumns={['repeat(1, 1fr)', null, 'repeat(2, 1fr)']}
          gap={4}
          pt={4}
          w="100%"
        >
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
                ? `Discounted ${(listing.regularPrice - listing.discountedPrice)
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
      </GridItem>

      {auth.currentUser?.uid !== listing.userRef && (
        <Box
          as={Link}
          to={`/contact/${listing.userRef}?listingName=${listing.name}`}
        >
          <Button
            mt={4}
            colorScheme="green"
            as={motion.button}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            width="100%"
          >
            <Text>Contact Landlord</Text>
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SingleListItem;
