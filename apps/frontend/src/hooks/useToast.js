import { useToast as useChakraToast } from "@chakra-ui/react";

const useToast = () => {
  const toast = useChakraToast();

  return (title, status) => {
    toast({
      title,
      status,
      duration: 3000,
      isClosable: true,
    });
  };
};

export default useToast;
