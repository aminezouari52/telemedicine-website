// COMPONENTS
import FormSideBox from "./FormSideBox";

// // SVG IMAGES
// import ContactInfoImage from 'assets/images-svg/contactInformation.svg';
// import DateImage from 'assets/images-svg/date.svg';
// import OtherImage from 'assets/images-svg/other.svg';
import Doctors from "../../images/doctors.svg";
import Doctors2 from "../../images/doctors2.svg";
import Doctors3 from "../../images/doctors3.svg";

// FORMS
import ContactInfoForm from "./Forms/ContactInfo";
import DateForm from "./Forms/Date";
import OtherInformationForm from "./Forms/OtherInformation";

//CHAKRA_COMPONENTS
import { Flex, Box } from "@chakra-ui/react";
import { useEffect } from "react";

const FormsWrapper = (props) => {
  let description, image, form;
  switch (props.activeStep) {
    case 0:
      description = "Choisir la date et l'heure";
      image = Doctors;
      form = <DateForm nextForm={props.nextForm} />;
      break;
    case 1:
      description = "Permettez nous de vous contacter!";
      image = Doctors2;
      form = (
        <ContactInfoForm prevForm={props.prevForm} nextForm={props.nextForm} />
      );
      break;
    case 2:
      description = "Avez vous une assurance?";
      image = Doctors3;
      form = (
        <OtherInformationForm
          prevForm={props.prevForm}
          nextForm={props.nextForm}
        />
      );
      break;
    default:
      description = "form description";
      image = "form image";
      form = <Box></Box>;
      break;
  }

  return (
    <Flex justifyContent="space-between" p={8} mt={4}>
      <FormSideBox description={description} image={image} />
      <Flex w={{ lg: "60%", base: "90%" }}>{form}</Flex>
    </Flex>
  );
};

export default FormsWrapper;
