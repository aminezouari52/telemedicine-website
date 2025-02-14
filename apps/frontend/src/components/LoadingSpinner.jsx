import { Spinner as ChakraSpinner } from '@chakra-ui/react';
import React from 'react'

function LoadingSpinner({size = 'default'}) {
  if(size == 'small'){
    return (
<ChakraSpinner
          thickness="1px"
          emptyColor="gray.200"
          color="primary.500"
          size="sm"
        />
    )
  }

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