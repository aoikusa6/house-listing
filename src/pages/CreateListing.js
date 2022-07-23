import React, { useEffect, useRef, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FaBath,
  FaBed,
  FaCar,
  FaCarCrash,
  FaClinicMedical,
  FaCoins,
  FaCouch,
  FaHome,
  FaLocationArrow,
  FaMoneyBill,
  FaMoneyBillWave,
  FaReceipt,
  FaTag,
  FaUpload,
  FaWindowClose,
} from 'react-icons/fa';
const CreateListing = () => {
  const [geolocationIsEnabled, setGeolocationIsEnable] = useState(true);
  const [loading, setIsLoading] = useState(false);
  const [listingFormData, setListingFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: '',
    bathrooms: '',
    parking: false,
    furnished: false,
    address: '',
    offer: true,
    regularPrice: '',
    discountedPrice: '',
    images: '',
    latitude: 0,
    longitude: 0,
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = listingFormData;
  const auth = getAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const isMounted = useRef(true);

  console.log(listingFormData);
  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, user => {
        if (user) {
          setListingFormData({ ...listingFormData, userRef: user.uid });
        } else {
          navigate('/sign-in');
        }
      });
    }
    return () => {
      isMounted.current = false;
    };
  }, [isMounted, auth, navigate]);

  const handleChange = e => {
    const { name, value, files } = e.target;

    let boolean = null;
    if (value === 'true') {
      boolean = true;
    }
    if (value === 'false') {
      boolean = false;
    }
    console.log(name, value, boolean);
    if (files) {
      setListingFormData(prevState => ({
        ...prevState,
        images: files,
      }));
    }
    if (!files) {
      setListingFormData(prevState => ({
        ...prevState,
        [name]: boolean ?? value,
      }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
  };

  //** Motion setting **//

  const pageMotion = {
    initial: { opacity: 0, y: '100%' },
    animate: { opacity: 1, y: 0, transition: { duration: 1 } },
    exit: { opacity: 0, y: '100%', transition: { duration: 1 } },
  };

  const leftToRightMotion = {
    initial: { opacity: 0, x: '-100%' },
    animate: { opacity: 1, x: 0, transition: { duration: 1 } },
    exit: { opacity: 0, x: '-100%', transition: { duration: 1 } },
  };

  const rightToLeftMotion = {
    initial: { opacity: 0, x: '100%' },
    animate: { opacity: 1, x: 0, transition: { duration: 1 } },
    exit: { opacity: 0, x: '100%', transition: { duration: 1 } },
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <Box
      as={motion.form}
      onSubmit={handleSubmit}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageMotion}
    >
      <FormControl as="fieldset" w="50%" mx="auto" mt={4}>
        <FormLabel
          as={motion.legend}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={leftToRightMotion}
          fontSize="xl"
        >
          Add new property for rent / sale
        </FormLabel>
        <InputGroup mt={4}>
          <Input
            initial="initial"
            animate="animate"
            exit="exit"
            variants={rightToLeftMotion}
            as={motion.input}
            borderRadius="full"
            type="text"
            placeholder="Enter property name"
            name="name"
            value={name}
            onChange={handleChange}
          />
          <InputRightElement children={<Icon color="green" as={FaHome} />} />
        </InputGroup>
        <InputGroup mt={4}>
          <Input
            initial="initial"
            animate="animate"
            exit="exit"
            variants={leftToRightMotion}
            as={motion.input}
            borderRadius="full"
            type="text"
            placeholder="Enter property address"
            name="address"
            value={address}
            onChange={handleChange}
          />
          <InputRightElement
            children={<Icon color="green" as={FaLocationArrow} />}
          />
        </InputGroup>
        <InputGroup mt={4}>
          <Input
            initial="initial"
            animate="animate"
            exit="exit"
            variants={rightToLeftMotion}
            as={motion.input}
            borderRadius="full"
            type="file"
            placeholder="Upload your property images"
            name="images"
          />
          <InputRightElement w="fit-content">
            <Button
              as={motion.button}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={rightToLeftMotion}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              colorScheme={type === 'rent' ? 'green' : 'gray'}
              size="md"
              fontSize="lg"
              leftIcon={<FaUpload />}
              w="100%"
              borderRadius="full"
            >
              <Text>Upload</Text>
            </Button>
          </InputRightElement>
        </InputGroup>
        <Grid
          templateColumns={['repeat(1, 1fr)', null, 'repeat(2, 1fr)']}
          gap={4}
          mt={4}
        >
          <InputGroup>
            <Input
              as={motion.input}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={leftToRightMotion}
              borderRadius="full"
              type="text"
              placeholder="Number of bathrooms"
              name="bathrooms"
              value={bathrooms}
              onChange={handleChange}
            />
            <InputRightElement
              as={motion.icon}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={leftToRightMotion}
              children={<Icon color="green" as={FaBath} />}
            />
          </InputGroup>
          <InputGroup>
            <Input
              as={motion.input}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={rightToLeftMotion}
              borderRadius="full"
              type="text"
              placeholder="Number of bedrooms"
              name="bedrooms"
              value={bedrooms}
              onChange={handleChange}
            />
            <InputRightElement children={<Icon color="green" as={FaBed} />} />
          </InputGroup>
          <InputGroup>
            <Input
              as={motion.input}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={leftToRightMotion}
              borderRadius="full"
              type="text"
              placeholder={
                type === 'rent' ? 'Regular price / Month' : 'Regular price'
              }
              name="regularPrice"
              value={regularPrice}
              onChange={handleChange}
            />
            <InputRightElement
              as={motion.icon}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={leftToRightMotion}
              children={<Icon color="green" as={FaMoneyBill} />}
            />
          </InputGroup>
          <Flex
            as={motion.div}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={rightToLeftMotion}
            gap={4}
          >
            <Button
              as={motion.button}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              colorScheme={type === 'rent' ? 'green' : 'gray'}
              size="md"
              fontSize="lg"
              leftIcon={<FaCoins />}
              w="100%"
              borderRadius="full"
              name="type"
              value="rent"
              onClick={handleChange}
            >
              <Text>Rent</Text>
            </Button>
            <Button
              as={motion.button}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              colorScheme={type === 'sell' ? 'green' : 'gray'}
              size="md"
              fontSize="lg"
              leftIcon={<FaMoneyBill />}
              w="100%"
              borderRadius="full"
              name="type"
              value="sell"
              onClick={handleChange}
            >
              <Text>Sell</Text>
            </Button>
          </Flex>
          <InputGroup>
            <Input
              as={motion.input}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={leftToRightMotion}
              display={offer ? 'inline' : 'none'}
              borderRadius="full"
              type="text"
              placeholder="Discounted price"
              name="discountedPrice"
              value={discountedPrice}
              onChange={handleChange}
            />
            <InputRightElement
              as={motion.icon}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={leftToRightMotion}
              display={offer ? 'inherit' : 'none'}
              children={<Icon color="green" as={FaMoneyBillWave} />}
            />
          </InputGroup>
          <Flex
            as={motion.div}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={rightToLeftMotion}
            gap={4}
          >
            <Button
              as={motion.button}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              colorScheme={offer ? 'gray' : 'green'}
              size="md"
              fontSize="lg"
              leftIcon={<FaReceipt />}
              w="100%"
              borderRadius="full"
              name="offer"
              value={false}
              onClick={handleChange}
            >
              <Text>Full price</Text>
            </Button>
            <Button
              as={motion.button}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              colorScheme={offer ? 'green' : 'gray'}
              size="md"
              fontSize="lg"
              leftIcon={<FaTag />}
              w="100%"
              borderRadius="full"
              name="offer"
              value={true}
              onClick={handleChange}
            >
              <Text>On sale</Text>
            </Button>
          </Flex>
          <Flex
            as={motion.div}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={leftToRightMotion}
            gap={4}
          >
            <Button
              as={motion.button}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              colorScheme={parking ? 'green' : 'gray'}
              size="md"
              fontSize="lg"
              leftIcon={<FaCar />}
              w="100%"
              borderRadius="full"
              name="parking"
              value={true}
              onClick={handleChange}
            >
              <Text>Parking</Text>
            </Button>
            <Button
              as={motion.button}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              colorScheme={parking ? 'gray' : 'green'}
              size="md"
              fontSize="lg"
              leftIcon={<FaCarCrash />}
              w="100%"
              borderRadius="full"
              name="parking"
              value={false}
              onClick={handleChange}
            >
              <Text>No parking</Text>
            </Button>
          </Flex>
          <Flex
            as={motion.div}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={rightToLeftMotion}
            gap={4}
          >
            <Button
              as={motion.button}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              colorScheme={furnished ? 'green' : 'gray'}
              size="md"
              fontSize="lg"
              leftIcon={<FaCouch />}
              w="100%"
              borderRadius="full"
              name="furnished"
              value={true}
              onClick={handleChange}
            >
              <Text>Furnished</Text>
            </Button>
            <Button
              as={motion.button}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              colorScheme={furnished ? 'gray' : 'green'}
              size="md"
              fontSize="lg"
              leftIcon={<FaWindowClose />}
              w="100%"
              borderRadius="full"
              name="furnished"
              value={false}
              onClick={handleChange}
            >
              <Text>Unprepared</Text>
            </Button>
          </Flex>
        </Grid>
        <Button
          mt={4}
          w="100%"
          as={motion.button}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageMotion}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          colorScheme="green"
          size="md"
          fontSize="lg"
          leftIcon={<FaClinicMedical />}
        >
          <Text>Create new listing</Text>
        </Button>
      </FormControl>
    </Box>
  );
};

export default CreateListing;
