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
  StepSeparator,
  CardBody,
  Card,
} from "@chakra-ui/react";
import illustrationDate from "@/assets/illustration-date.svg";
import illustrationProfile from "@/assets/illustration-profile.svg";
import illustrationChat from "@/assets/illustration-chat.svg";

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
          <StepStatus complete={<StepIcon />} />
        </StepIndicator>
        <StepSeparator />
      </Step>
      <Step>
        <StepIndicator>
          <StepStatus complete={<StepIcon />} />
        </StepIndicator>

        <StepSeparator />
      </Step>
      <Step>
        <StepIndicator>
          <StepStatus complete={<StepIcon />} />
        </StepIndicator>

        <StepSeparator />
      </Step>
    </Stepper>
  );
};

const HowItWorks = () => {
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

        <CustomStepper activeStep={3} />

        <Flex justifyContent="space-between">
          {steps.map((step, index) => (
            <Flex
              key={index}
              flexDirection="column"
              alignItems="center"
              justifyContent="space-between"
              py={10}
            >
              <Flex justifyContent="center" alignItems="center">
                <Image boxSize="150px" src={step.img} alt="Dan Abramov" />
              </Flex>

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
