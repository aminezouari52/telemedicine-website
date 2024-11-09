// HOOKS
import { useDisclosure, useSteps } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// FUNCTIONS
import { createConsultation } from "@/modules/consultation/functions/consultation";
import { updatePatient } from "../../../patient/functions/patient";
import { getDoctor } from "@/modules/doctor/functions/doctor";
import { setLoggedInUser } from "@/reducers/userReducer";
import * as Yup from "yup";

// COMPONENTS
import VerifyData from "./VerifyData";
import DateStep from "./forms/DateStep";
import PorfileInfo from "./forms/PorfileInfo";
import { Formik, Form } from "formik";

// STYLE
import {
  Flex,
  chakra,
  Box,
  Heading,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepTitle,
  StepSeparator,
  StepIcon,
  StepNumber,
} from "@chakra-ui/react";

const steps = [{ title: "Informations de Profil" }, { title: "Date et Heure" }];

const Consultation = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.loggedInUser);
  const { onClose } = useDisclosure();
  const params = useParams();
  const [doctor, setDoctor] = useState();

  const loadDoctor = async () => {
    const response = await getDoctor(params.id);
    setDoctor(response.data);
  };

  useEffect(() => {
    loadDoctor();
  }, []);

  const { activeStep, goToNext, goToPrevious } = useSteps({
    index: 0,
    count: steps.length,
  });

  const resetHandler = () => {
    onClose();
    goToPrevious();
  };

  useEffect(() => {
    if (user?.isProfileCompleted) {
      goToNext();
    }
  }, [user]);

  return (
    <Flex direction="column" bg="#fff" p={10} w="100%">
      <Formik
        initialValues={{
          date: new Date(),
          firstName: user?.firstName ?? "",
          lastName: user?.lastName ?? "",
          address: user?.address ?? "",
          phone: user?.phone ?? "",
          age: user?.age ?? 0,
          city: user?.city ?? "",
          zip: user?.zip ?? "",
          weight: user?.weight ?? "",
          patient: user?._id,
          doctor: params?.id,
          isProfileCompleted: true,
        }}
        validationSchema={Yup.object({
          date: Yup.string().required("La date est requis"),
          firstName: Yup.string().required("Le prenom est requis").trim(),
          lastName: Yup.string().required("Le nom est requis").trim(),
          age: Yup.number()
            .required("L'âge est requis")
            .min(18, "Vous devez avoir au moins 18 ans")
            .max(100, "L'âge ne peut pas dépasser 100 ans"),
          phone: Yup.string()
            .required("Le numéro de téléphone est requis")
            .trim()
            .matches(/^[0-9]*$/, "Le numéro de téléphone n'nest pas valide"),
          address: Yup.string()
            .required("L'adresse est requise")
            .max(50, "L'adresse ne peut pas dépasser 50 caractères"),
          city: Yup.string()
            .required("La ville est requise")
            .max(50, "La ville ne peut pas dépasser 50 caractères"),
          zip: Yup.string()
            .required("Le code postal est requis")
            .matches(/^[0-9]+$/, "Le code postal doit être un nombre")
            .min(4, "Le code postal doit comporter au moins 4 chiffres")
            .max(5, "Le code postal ne peut pas dépasser 5 chiffres"),
        })}
        onSubmit={async (values) => {
          const { date, patient, doctor, ...resValues } = values;
          await updatePatient({ id: user._id, token: user.token }, resValues);
          await createConsultation({ date, patient, doctor });
          dispatch(
            setLoggedInUser({
              ...user,
              ...resValues,
            })
          );
        }}
      >
        <Form>
          <Stepper pb={10} size="lg" colorScheme="primary" index={activeStep}>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>
                <Box flexShrink="0">
                  <StepTitle>{step.title}</StepTitle>
                </Box>
                <StepSeparator />
              </Step>
            ))}
          </Stepper>
          <Flex justifyContent="space-between" gap={10}>
            <Flex direction="column" w="35%" gap={4}>
              <Heading size="sm">Consultation avec</Heading>
              <Flex direction="column" bg="#fff" w="full">
                <Box
                  h={64}
                  bgSize="cover"
                  bgImage={`url('${doctor?.photo}')`}
                  borderRadius="md"
                ></Box>
                <Box py={8} maxW="xl">
                  <chakra.h2 fontSize="2xl" color="gray.800" fontWeight="bold">
                    <chakra.span color="primary.600">Dr.</chakra.span>{" "}
                    {doctor?.firstName} {doctor?.lastName}
                  </chakra.h2>
                  <chakra.p mt={4} color="gray.600">
                    {doctor?.description}
                  </chakra.p>
                </Box>
              </Flex>
            </Flex>
            <Flex w="90%" justifyContent="center">
              {activeStep === 0 ? (
                <PorfileInfo goToNext={goToNext} goToPrevious={goToPrevious} />
              ) : (
                activeStep === 1 && (
                  <DateStep goToNext={goToNext} goToPrevious={goToPrevious} />
                )
              )}
            </Flex>
          </Flex>
          <VerifyData
            isOpen={activeStep === steps.length}
            onClose={resetHandler}
          />
        </Form>
      </Formik>
    </Flex>
  );
};

export default Consultation;
