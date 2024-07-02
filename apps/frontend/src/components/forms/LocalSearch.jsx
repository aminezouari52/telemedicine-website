// STYLE
import { InputGroup, InputLeftElement, Input, Icon } from "@chakra-ui/react";

// ICONS
import { AiOutlineSearch } from "react-icons/ai";

const LocalSearch = ({ keyword, setKeyword }) => {
  const handleSearchChange = (e) => {
    e.preventDefault();
    setKeyword(e.target.value.toLowerCase());
  };

  return (
    <InputGroup my={2}>
      <InputLeftElement pointerEvents="none">
        <Icon as={AiOutlineSearch} color="gray.300" />
      </InputLeftElement>
      <Input
        focusBorderColor="primary.500"
        variant="flushed"
        type="search"
        placeholder="Chercher..."
        value={keyword}
        onChange={handleSearchChange}
      />
    </InputGroup>
  );
};

export default LocalSearch;
