import {
  Flex,
  GridItem,
  Heading,
  Image,
  Text,
  Badge,
  Icon,
} from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaBath } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ListingItems = ({ listing, id, index }) => {
  return (
    <GridItem
      w="100%"
      border={2}
      borderStyle="dashed"
      borderColor="cyan.700"
      borderRadius={16}
      as={Link}
      to={`/category/${listing.type}/${id}`}
    >
      <Flex
        as={motion.div}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          initial: { opacity: 0, x: '100%' },
          animate: {
            opacity: 1,
            x: 0,
            transition: { duration: 1 + index * 0.5 },
          },
          exit: {
            opacity: 0,
            x: '100%',
            transition: { duration: 1 + index * 0.5 },
          },
        }}
        p={4}
        justify="space-around"
      >
        <Image
          my="auto"
          borderRadius="full"
          boxSize={['50px', null, '100px']}
          src={listing.imageUrls[0]}
          alt={listing.name}
        />

        <Flex direction="column" justify="space-around">
          <Heading as="h4" size={['sm', null, 'md']}>
            {listing.name}
          </Heading>
          <Text>{listing.location}</Text>
          <Heading as="h5" size="sm" color={listing.offer ? 'green' : 'gray'}>
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            VND {listing.type === 'rent' && '/ Month'}
          </Heading>
          <Flex gap={4}>
            <Badge p={2} colorScheme={listing.bedrooms > 1 ? 'green' : 'gray'}>
              <Flex gap={4}>
                <Icon boxSize={[4, null, 8]} as={FaBed} />
                <Text
                  display={['none', null, 'inline']}
                  fontSize="md"
                  my="auto"
                >
                  {listing.bedrooms > 1
                    ? `${listing.bedrooms} bedrooms`
                    : '1 bedrooms'}
                </Text>
              </Flex>
            </Badge>
            <Badge p={2} colorScheme={listing.bathrooms > 1 ? 'green' : 'gray'}>
              <Flex gap={4}>
                <Icon boxSize={[4, null, 8]} as={FaBath} />
                <Text
                  display={['none', null, 'inline']}
                  fontSize="md"
                  my="auto"
                >
                  {listing.bathrooms > 1
                    ? `${listing.bathrooms} bathrooms`
                    : '1 bathrooms'}
                </Text>
              </Flex>
            </Badge>
          </Flex>
        </Flex>
      </Flex>
    </GridItem>
  );
};

export default ListingItems;
