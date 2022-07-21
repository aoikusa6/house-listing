import React, { useEffect, useRef, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@chakra-ui/react';
const CreateListing = () => {
  const [geolocationIsEnabled, setGeolocationIsEnable] = useState(true);
  const [loading, setIsLoading] = useState(false);
  const [listingFormData, setListingFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });
  const auth = getAuth();
  const navigate = useNavigate();
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
  }, [isMounted]);
  if(loading){
    return <Spinner/>
  }
  return <div>CreateListing</div>;
};

export default CreateListing;
