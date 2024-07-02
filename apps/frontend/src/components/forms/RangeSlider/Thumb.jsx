import { Flex, Box, Tooltip } from "@chakra-ui/react";

const Thumb = ({
  value,
  bgColor,
  thumbIndex,
  thumbProps,
  onKeyDownStepBy,
  isExpandedCustomProp,
  placement,
}) => {
  document.querySelectorAll(".css-3l0anw").forEach((tooltip) => {
    tooltip.style.zIndex = 1;
  });

  return (
    <Box
      top="1%"
      boxSize={5}
      bgColor={bgColor}
      borderRadius="full"
      _focusVisible={{
        outline: "none",
      }}
      onKeyDown={(e) => {
        onKeyDownStepBy(e, thumbIndex);
      }}
      {...thumbProps}
      display="flex"
      justifyContent="center"
    >
      <Tooltip
        hasArrow
        isOpen={isExpandedCustomProp}
        placement={placement}
        bg="primary.500"
        color="white"
        label={`${value}$`}
        aria-label="Value Tooltip"
        zIndex="1"
      >
        <Flex
          w="10px"
          h="10px"
          alignItems="center"
          justifyContent="center"
        ></Flex>
      </Tooltip>
    </Box>
  );
};
export default Thumb;
