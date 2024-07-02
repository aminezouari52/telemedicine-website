// HOOKS
// import { useDispatch } from 'react-redux';

// // FUNCTIONS
// import { setSearchText } from 'modules/Admin/redux';

// STYLE
import { Input, IconButton, Flex } from "@chakra-ui/react";

// ICONS
import { Search2Icon } from "@chakra-ui/icons";
import React from "react";

const Search = () => {
  //   const dispatch = useDispatch();
  //   const handleChange = (event: any) => {
  //     dispatch(
  //       setSearchText({
  //         text: event.target.value,
  //       })
  //     );
  //   };

  return (
    <Flex>
      <IconButton
        aria-label="search"
        borderTopRightRadius="0"
        borderBottomRightRadius="0"
        colorScheme="primary"
        color="white"
        icon={<Search2Icon />}
        size="sm"
      />
      <Input
        size="sm"
        type="text"
        focusBorderColor="primary.500"
        placeholder="Chercher..."
        // onChange={handleChange}
        color="#000"
        borderTopLeftRadius="0"
        borderBottomLeftRadius="0"
        px="4"
      />
    </Flex>
  );
};

export default Search;
