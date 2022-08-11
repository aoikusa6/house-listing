import React, { useEffect, useRef, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { db } from '../firebase.config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
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
  FaWindowClose,
} from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import SpinnerSolar from '../components/SpinnerSolar';

const CreateListing = () => {
  const [isLoading, setIsLoading] = useState(false);
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
    images: {},
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
  } = listingFormData;
  const auth = getAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const isMounted = useRef(true);

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

  console.log(listingFormData)

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);

    if (discountedPrice >= regularPrice) {
      setIsLoading(false);
      toast({
        title: 'Wrong input.',
        description: 'Discounted price need to be less than regular price.',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    if (images.length > 5) {
      setIsLoading(false);
      toast({
        title: 'Too many files.',
        description: 'Maximum 5 images',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    let geoLocation = {};
    let location;
    try {
      const response = await fetch(
        `http://api.positionstack.com/v1/forward?access_key=${process.env.REACT_APP_GEOCODE_API_KEY}&query=${address}`
      );

      const data = await response.json();

      geoLocation.lat = data.data[0]?.latitude ?? 0;
      geoLocation.lng = data.data[0]?.longitude ?? 0;

      location =
        data.status === 'ZERO_RESULTS' ? undefined : data.data[0]?.label;

    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Wrong location.',
        description: 'Please enter a correct address.',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    const storeImage = async image => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, 'image/' + fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          'state_changed',
          snapshot => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          },
          error => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imageUrls = await Promise.all(
      [...images].map(image => storeImage(image))
    ).catch(() => {
      setIsLoading(false);
      toast({
        title: 'Can not upload your images.',
        description: 'Please check your images then try again.',
        status: 'error',
        duration: 3000,
      });
      return;
    });

    const listingFormDataCopy = {
      ...listingFormData,
      imageUrls,
      geoLocation,
      location,
      timestamp: serverTimestamp(),
    };
    delete listingFormDataCopy.address;
    delete listingFormDataCopy.images;

    const docRef = await addDoc(
      collection(db, 'listings'),
      listingFormDataCopy
    );
    setIsLoading(false);
    toast({
      title: 'New property added.',
      description: 'Redirecting to your new item.',
      status: 'success',
      duration: 3000,
    });
    navigate(`/category/${listingFormDataCopy.type}/${docRef.id}`);
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

  if (isLoading) {
    return <SpinnerSolar />;
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
            max={5}
            placeholder="Upload your property images"
            name="images"
            accept=".jpg,.png,.jpeg"
            multiple
            onChange={handleChange}
          />
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
            <InputRightElement children={<Icon color="green" as={FaBath} />} />
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
              colorScheme={type === 'sale' ? 'green' : 'gray'}
              size="md"
              fontSize="lg"
              leftIcon={<FaMoneyBill />}
              w="100%"
              borderRadius="full"
              name="type"
              value="sale"
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
          onClick={handleSubmit}
        >
          <Text>Create new listing</Text>
        </Button>
      </FormControl>
    </Box>
  );
};

export default CreateListing;
