import { extendTheme } from "@chakra-ui/react";
import { globalStyles } from "./styles";
import { StepsTheme as Steps } from "chakra-ui-steps";

export const steps = {
  components: {
    Steps,
  },
};

export default extendTheme(globalStyles, steps);
