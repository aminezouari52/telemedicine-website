// COMPONENTS
import RangeSlider from "./forms/RangeSlider/RangeSlider";

// STYLE
import {
  Flex,
  Text,
  Accordion as ChakraAccordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Icon,
  CheckboxGroup,
  Stack,
  Checkbox,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";

// ASSETS
import {
  AiOutlineDollarCircle,
  AiOutlineTag,
  AiOutlineBgColors,
} from "react-icons/ai";
import { BiShapeCircle } from "react-icons/bi";
import { MdOutlineLocalShipping } from "react-icons/md";
import { GrCheckboxSelected } from "react-icons/gr";

const Accordion = ({
  handleSlider,
  categories,
  categoryIds,
  handleCategoryChange,
  subs,
  subIds,
  handleSubChange,
  brands,
  handleBrandChange,
  colors,
  handleColorChange,
  handleShippingchange,
}) => {
  return (
    <ChakraAccordion
      defaultIndex={[0]}
      allowMultiple
      w={{
        sm: "100%",
        md: "350px",
      }}
      background="white"
    >
      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <h2>
              <AccordionButton>
                <Flex flex="1" textAlign="left" alignItems="center">
                  <Icon as={AiOutlineDollarCircle} mr={2} />
                  <Text>Price</Text>
                </Flex>
                <AccordionIcon />
              </AccordionButton>
            </h2>

            <AccordionPanel pb={15} pt={30}>
              <RangeSlider
                isExpandedCustomProp={isExpanded}
                min={0}
                max={4999}
                onChangeSlider={handleSlider}
                defaultValue={[0, 4999]}
              />
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Flex flex="1" textAlign="left" alignItems="center">
              <Icon as={GrCheckboxSelected} mr={2} />
              <Text>Category</Text>
            </Flex>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <CheckboxGroup value={!categoryIds.length && []}>
            <Stack spacing={[1, 5]} direction="column">
              {categories.map((c) => (
                <Checkbox
                  key={c._id}
                  onChange={handleCategoryChange}
                  value={c._id}
                  name="category"
                  isChecked={categoryIds.includes(c._id)}
                  colorScheme="primary"
                >
                  {c.name}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Flex flex="1" textAlign="left" alignItems="center">
              <Icon as={AiOutlineTag} mr={2} />
              <Text>Sub Categories</Text>
            </Flex>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <CheckboxGroup value={!subIds.length && []}>
            <Stack spacing={[1, 5]} direction="column">
              {subs.map((sub) => (
                <Checkbox
                  key={sub._id}
                  onChange={handleSubChange}
                  value={sub._id}
                  name="sub"
                  isChecked={subIds.includes(sub._id)}
                  colorScheme="primary"
                >
                  {sub.name}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Flex flex="1" textAlign="left" alignItems="center">
              <Icon as={BiShapeCircle} mr={2} />
              <Text>Brand</Text>
            </Flex>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <CheckboxGroup value={!brands.length && []}>
            <Stack spacing={[1, 5]} direction="column">
              {["Apple", "Samsung", "Microsoft", "Lenovo", "Asus"].map(
                (brand) => (
                  <Checkbox
                    key={brand}
                    onChange={handleBrandChange}
                    value={brand}
                    name="brand"
                    isChecked={brands.includes(brand)}
                    colorScheme="primary"
                  >
                    {brand}
                  </Checkbox>
                )
              )}
            </Stack>
          </CheckboxGroup>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Flex flex="1" textAlign="left" alignItems="center">
              <Icon as={AiOutlineBgColors} mr={2} />
              <Text>Color</Text>
            </Flex>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <CheckboxGroup value={!colors.length && []}>
            <Stack spacing={[1, 5]} direction="column">
              {["Black", "Brown", "Silver", "White", "Blue"].map((color) => (
                <Checkbox
                  key={color}
                  onChange={handleColorChange}
                  value={color}
                  name="color"
                  isChecked={colors.includes(color)}
                  colorScheme="primary"
                >
                  {color}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Flex flex="1" textAlign="left" alignItems="center">
              <Icon as={MdOutlineLocalShipping} mr={2} />
              <Text>Shipping</Text>
            </Flex>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <RadioGroup onChange={handleShippingchange} defaultValue="No">
            <Stack direction="row" spacing={5}>
              <Radio value="No" colorScheme="primary">
                No
              </Radio>
              <Radio value="Yes" colorScheme="primary">
                Yes
              </Radio>
            </Stack>
          </RadioGroup>
        </AccordionPanel>
      </AccordionItem>
    </ChakraAccordion>
  );
};

export default Accordion;
