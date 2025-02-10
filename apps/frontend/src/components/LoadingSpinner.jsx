import { Spinner as ChakraSpinner } from '@chakra-ui/react';
import React from 'react'

function LoadingSpinner() {
  return (
        <ChakraSpinner
          thickness="4px"
          emptyColor="gray.200"
          color="primary.500"
          size="xl"
        />
    );
}

export default LoadingSpinner