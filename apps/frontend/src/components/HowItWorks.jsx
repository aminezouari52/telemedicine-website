import {
  Flex,
  Heading,
  Text,
  Image,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepSeparator,
  useSteps,
  CardBody,
  Card,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import illustrationDate from "@/images/illustration-date.svg";
import illustrationProfile from "@/images/illustration-profile.svg";
import illustrationChat from "@/images/illustration-chat.svg";

const steps = [
  {
    img: illustrationProfile,
    text: "Create an account",
  },
  {
    img: illustrationDate,
    text: "Book a consultation",
  },
  {
    img: illustrationChat,
    text: "Join a consultation",
  },
];

const CustomStepper = ({ activeStep }) => {
  return (
    <Stepper size="sm" colorScheme="primary" index={activeStep} p={12}>
      <Step>
        <StepIndicator>
          <StepStatus
            complete={<StepIcon />}
            incomplete={<StepNumber />}
            active={<StepNumber />}
          />
        </StepIndicator>
        <StepSeparator />
      </Step>
      <Step>
        <StepIndicator>
          <StepStatus
            complete={<StepIcon />}
            incomplete={<StepNumber />}
            active={<StepNumber />}
          />
        </StepIndicator>

        <StepSeparator />
      </Step>
      <Step>
        <StepIndicator>
          <StepStatus
            complete={<StepIcon />}
            incomplete={<StepNumber />}
            active={<StepNumber />}
          />
        </StepIndicator>

        <StepSeparator />
      </Step>
    </Stepper>
  );
};

const HowItWorks = () => {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: 2,
  });

  // Add transition to stepper indicators and separators
  useEffect(() => {
    const stepper = document.querySelector(".chakra-stepper");
    if (stepper) {
      const inds = stepper.querySelectorAll(".chakra-step__indicator");
      const sprs = stepper.querySelectorAll(".chakra-step__separator ");
      inds.forEach((ind) => (ind.style.transition = "background 1s ease"));
      sprs.forEach((spr) => (spr.style.transition = "background 1.5s ease"));
    }
  }, []);

  return (
    <Card>
      <CardBody>
        <Heading
          display="flex"
          fontSize="3xl"
          as="h1"
          p={12}
          justifyContent="center"
        >
          Join a consultation in 3 &nbsp;
          <Text color="primary.500"> simple </Text>
          &nbsp; steps
        </Heading>

        <CustomStepper activeStep={activeStep} />

        <Flex justifyContent="space-between">
          {steps.map((step, index) => (
            <Flex
              key={index}
              flexDirection="column"
              alignItems="center"
              justifyContent="space-between"
              onMouseEnter={() => {
                if (activeStep !== 3) {
                  setActiveStep(index + 1);
                }
              }}
              py={10}
            >
              <motion.div
                whileHover={{
                  scale: 1.2,
                  rotate: (index % 2 === 0 ? -1 : 1) * 10,
                }}
              >
                <Flex justifyContent="center" alignItems="center">
                  <Image boxSize="150px" src={step.img} alt="Dan Abramov" />
                </Flex>
              </motion.div>

              <Heading
                gap="10px"
                display="flex"
                fontWeight="extrabold"
                fontSize="xl"
                alignItems="center"
                py={8}
              >
                {step.text}
              </Heading>
            </Flex>
          ))}
        </Flex>
      </CardBody>
    </Card>
  );
};

export default HowItWorks;
