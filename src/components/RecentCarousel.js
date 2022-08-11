import { Box, Heading, Image, useToast } from '@chakra-ui/react';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { db } from '../firebase.config';
import SpinnerSolar from './SpinnerSolar';

const RecentCarousel = () => {
  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, 'listings');
        const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(10));

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
  }, [toast]);

  console.log(listings);

  if (isLoading) {
    return <SpinnerSolar />;
  }
  return (
    <Box pt={4} as={motion.div} initial="initial"
    animate="animate"
    exit="exit"
    variants={{
      initial: { opacity: 0, x: '100%' },
      animate: {
        opacity: 1,
        x: 0,
        transition: { duration: 1  },
      },
      exit: {
        opacity: 0,
        x: '100%',
        transition: { duration: 1},
      },
    }}>
      <Heading pb={4} as="h1" fontSize={['lg', null, 'xl']}>
        Our latest items:
      </Heading>
      <Swiper
        modules={[Autoplay, Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        navigation={true}
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
      >
        {listings.map(item => (
          <SwiperSlide key={item.id}>
            <Box as={Link} to={`/category/${item.data.type}/${item.id}`}>
              <Image
                borderRadius={20}
                src={item.data.imageUrls[0]}
                fit="cover"
                display="block"
                width="100%"
                height={['200px', null, '300px']}
              />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default RecentCarousel;
