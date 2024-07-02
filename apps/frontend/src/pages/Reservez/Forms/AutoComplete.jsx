import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { Flex, Avatar, Text } from "@chakra-ui/react";

const people = [
  {
    name: "Dan Abramov",
    image: "https://bit.ly/dan-abramov",
  },
  {
    name: "Kent Dodds",
    image: "https://bit.ly/kent-c-dodds",
  },
  {
    name: "Segun Adebayo",
    image: "https://bit.ly/sage-adebayo",
  },
  {
    name: "Prosper Otemuyiwa",
    image: "https://bit.ly/prosper-baba",
  },
  {
    name: "Ryan Florence",
    image: "https://bit.ly/ryan-florence",
  },
];

const AutoCompleteComponent = ({ onChange }) => {
  return (
    <AutoComplete rollNavigation>
      <AutoCompleteInput
        focusBorderColor="secondary.500"
        borderColor="secondary.500"
        borderRadius={0}
        variant="outline"
        placeholder="Chercher..."
        autoFocus
        onChange={(e) => {
          onChange("doctor", e.target.value);
        }}
        name="doctor"
      />
      <AutoCompleteList>
        {people.map((person, oid) => (
          <AutoCompleteItem
            key={`option-${oid}`}
            value={person.name}
            textTransform="capitalize"
            align="center"
            onClick={(e) => {
              onChange("doctor", person.name);
            }}
          >
            <Avatar size="sm" name={person.name} src={person.image} />
            <Text ml="4">{person.name}</Text>
          </AutoCompleteItem>
        ))}
      </AutoCompleteList>
    </AutoComplete>
  );
};

export default AutoCompleteComponent;
