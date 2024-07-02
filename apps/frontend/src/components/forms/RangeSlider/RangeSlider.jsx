import { Box, chakra, useRangeSlider } from "@chakra-ui/react";
import Thumb from "./Thumb";

export default function RangeSlider({
  min,
  max,
  stepToNumber,
  stepToIndex,
  stepByNumber,
  defaultValue,
  onChangeSlider,
  isExpandedCustomProp,
  ...rest
}) {
  const {
    state,
    actions,
    getInnerTrackProps,
    getInputProps,
    getRootProps,
    getThumbProps,
    getTrackProps,
  } = useRangeSlider({
    min,
    max,
    defaultValue,
    onChange: () => {
      onChangeSlider(state.value);
    },
    ...rest,
  });

  const { onKeyDown: onThumbKeyDownFirstIndex, ...thumbPropsFirstIndex } =
    getThumbProps({
      index: 0,
    });

  const { onKeyDown: onThumbKeyDownSecondIndex, ...thumbPropsSecondIndex } =
    getThumbProps({
      index: 1,
    });

  const onKeyDownStepBy = (e, thumbIndex) => {
    if (e.code === "ArrowRight") actions.stepUp(thumbIndex, stepByNumber);
    else if (e.code === "ArrowLeft") actions.stepDown(thumbIndex, stepByNumber);
    else if (thumbIndex === 0 && typeof onThumbKeyDownFirstIndex === "function")
      onThumbKeyDownFirstIndex(e);
    else if (
      thumbIndex === 1 &&
      typeof onThumbKeyDownSecondIndex === "function"
    )
      onThumbKeyDownSecondIndex(e);
  };

  return (
    <Box px={8}>
      <chakra.div
        cursor="pointer"
        w={{ sm: "96%", lg: "98%" }}
        ml={{ sm: "2%", lg: "1%" }}
        {...getRootProps()}
      >
        <input {...getInputProps({ index: 0 })} hidden />
        <input {...getInputProps({ index: 1 })} hidden />
        <Box
          h="7px"
          bgColor="silver.500"
          borderRadius="full"
          {...getTrackProps()}
        >
          <Box
            h="9px"
            bgColor="primary.500"
            borderRadius="full"
            {...getInnerTrackProps()}
          />
        </Box>
        <Thumb
          isExpandedCustomProp={isExpandedCustomProp}
          value={state.value[0]}
          thumbIndex={0}
          thumbProps={thumbPropsFirstIndex}
          onKeyDownStepBy={onKeyDownStepBy}
          bgColor="primary.500"
          placement="top-end"
        />
        <Thumb
          isExpandedCustomProp={isExpandedCustomProp}
          value={state.value[1]}
          thumbIndex={1}
          thumbProps={thumbPropsSecondIndex}
          onKeyDownStepBy={onKeyDownStepBy}
          bgColor="primary.500"
          placement="top-start"
        />
      </chakra.div>
    </Box>
  );
}
