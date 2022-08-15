import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { db } from '../firebase.config';

const ContactLandlord = () => {
  const [message, setMessage] = useState('');
  const [landlord, setLandlord] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, 'users', params.landlordId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast({
          title: "User doesn't exists",
          description:
            "We can't find user you're looking for, redirecting to main page",
          variant: 'error',
          duration: 3000,
        });
        navigate('/');
      }
    };

    getLandlord();
  }, [params.landlordId, navigate, toast]);

  const handleChange = e => {
    setMessage(e.target.value);
  };
  return (
    <Box pt={4} w="75%" mx="auto">
      <Heading as="h4" fontSize={['xl', null, '2xl']}>
        Contact Landlord
      </Heading>
      {landlord !== null && (
        <>
          <Box>
            <Text>To Mr / Mrs {landlord?.name}</Text>
          </Box>
          <FormControl>
            <FormLabel>Message:</FormLabel>
            <Textarea
              name="message"
              value={message}
              onChange={handleChange}
            ></Textarea>
            <a
              
              href={`mailto:${landlord.email}?Subject=${searchParams.get(
                'listingName'
              )}&body=${message}`}
            >
              <Button
                as={motion.button}
                mt={4}
                colorScheme="green"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              >
                <Text>Send message</Text>
              </Button>
            </a>
          </FormControl>
        </>
      )}
    </Box>
  );
};

export default ContactLandlord;
