// STYLE
import {
  Flex,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Select,
  RadioGroup,
  Stack,
  Radio,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  CheckboxGroup,
  Checkbox,
} from "@chakra-ui/react";

const ProductCreateForm = ({
  handleSubmit,
  handleChange,
  handleCategoryChange,
  incrementPrice,
  decrementPrice,
  incrementQuantity,
  decrementQuantity,
  subOptions,
  values,
  categories,
  setArrayOfSubs,
  arrayOfSubs,
  selectedCategory,
}) => {
  const {
    title,
    description,
    price,
    category,
    shipping,
    quantity,
    colors,
    brands,
    color,
    brand,
  } = values;

  return (
    <Flex
      as="form"
      direction="column"
      alignItems={{ sm: "start", lg: "end" }}
      onSubmit={handleSubmit}
    >
      <Flex
        w="100%"
        direction={{ sm: "column", lg: "row" }}
        justifyContent="space-between"
        mb={4}
      >
        <Box w={{ sm: "90%", lg: "45%" }}>
          <FormControl isRequired>
            <FormLabel color="gray">Title</FormLabel>
            <Input
              focusBorderColor="primary.500"
              name="title"
              value={title}
              onChange={handleChange}
              placeholder="title"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel mt={2} color="gray">
              Description
            </FormLabel>
            <Input
              focusBorderColor="primary.500"
              name="description"
              value={description}
              onChange={handleChange}
              placeholder="description"
            />
          </FormControl>
          <Flex>
            <FormControl isRequired>
              <FormLabel mt={2} color="gray">
                Price
              </FormLabel>
              <Flex alignItems="center">
                <Text fontSize="lg" mr={2}>
                  $
                </Text>
                <NumberInput
                  variant="flushed"
                  step={0.01}
                  min={0}
                  value={price}
                  name="price"
                  w="30%"
                >
                  <NumberInputField onChange={handleChange} />
                  <NumberInputStepper>
                    <NumberIncrementStepper onClick={incrementPrice} />
                    <NumberDecrementStepper onClick={decrementPrice} />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>
            </FormControl>
          </Flex>
          <Text color="gray" fontSize="md" fontWeight="600" mt={2}>
            Shipping
          </Text>
          <RadioGroup name="shipping" value={shipping}>
            <Stack
              mt={2}
              direction="row"
              onChange={(event) => handleChange(event)}
            >
              <Radio value="Yes">Yes</Radio>
              <Radio value="No">No</Radio>
            </Stack>
          </RadioGroup>
        </Box>

        <Box w={{ sm: "90%", lg: "45%" }}>
          <Flex>
            <FormControl>
              <FormLabel mt={2} color="gray">
                Quantity
              </FormLabel>
              <NumberInput
                step={1}
                min={1}
                value={quantity}
                name="quantity"
                w="30%"
              >
                <NumberInputField onChange={handleChange} />
                <NumberInputStepper>
                  <NumberIncrementStepper onClick={incrementQuantity} />
                  <NumberDecrementStepper onClick={decrementQuantity} />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </Flex>
          <FormControl isRequired direction="column">
            <Text color="gray" fontSize="md" fontWeight="600" mt={2}>
              Color
            </Text>
            <Select
              name="color"
              variant="flushed"
              placeholder="Please select"
              onChange={handleChange}
              value={color}
            >
              {colors.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl isRequired direction="column">
            <Text color="gray" fontSize="md" fontWeight="600" mt={2}>
              Brand
            </Text>
            <Select
              name="brand"
              variant="flushed"
              placeholder="Please select"
              onChange={handleChange}
              value={brand}
            >
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired direction="column">
            <Text color="gray" fontSize="md" fontWeight="600" mt={2}>
              Category
            </Text>
            <Select
              name="category"
              variant="flushed"
              placeholder="Please select"
              onChange={handleCategoryChange}
              value={selectedCategory ? selectedCategory : category._id}
            >
              {categories.length > 0 &&
                categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
            </Select>
          </FormControl>
          {subOptions?.length > 0 && (
            <Flex direction="column">
              <Text fontSize="md" fontWeight="600" my={2}>
                Sub category
              </Text>
              <CheckboxGroup
                value={arrayOfSubs}
                defaultValue={[]}
                onChange={(value) => setArrayOfSubs(value)}
              >
                <Flex
                  wrap="wrap"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  {subOptions.map((s) => (
                    <Checkbox key={s._id} value={s._id}>
                      {s.name}
                    </Checkbox>
                  ))}
                </Flex>
              </CheckboxGroup>
            </Flex>
          )}
        </Box>
      </Flex>
      <Button size="sm" type="submit" colorScheme="primary">
        Save
      </Button>
    </Flex>
  );
};

export default ProductCreateForm;
