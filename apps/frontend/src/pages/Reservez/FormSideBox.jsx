import { Flex, Text, Image } from '@chakra-ui/react';

const FormSideBox = (props) => {
  return (
    <Flex direction="column" w="35%" >
      <Text color="gray.700">{props.description}</Text>
      <Image src={props.image} p="50px" />
    </Flex>
  );
};

export default FormSideBox;
