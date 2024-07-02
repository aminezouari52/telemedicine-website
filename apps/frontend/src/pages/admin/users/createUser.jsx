import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import { Form } from "react-router-dom";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
function CreateUser({ mode, data, gestion }) {
  const gestionnaire = gestion ? gestion : "";
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [input, setInput] = useState("");

  const handleInputChange = (e) => setInput(e.target.value);

  const isError = input === "";
  function validateName(value) {
    let error;
    if (!value) {
      error = "Ce champs est obligatoire";
    } else if (value.toLowerCase() === "") {
      error = "valeur invalid";
    }
    return error;
  }
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <>
      <Button
        size="sm"
        colorScheme={mode == "edit" ? "yellow" : `primary`}
        _hover={{
          opacity: 0.8,
        }}
        mr={2}
        mb={mode == "edit" ? 0 : 2}
        onClick={onOpen}
      >
        {mode == "edit" ? <Icon as={AiFillEdit} /> : `Creer un ${gestionnaire}`}
      </Button>
      <Formik
        initialValues={{ name: "Sasuke" }}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }, 1000);
        }}
      >
        {(props) => (
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                {mode == "edit" ? "Modifier" : "Creer"} un {gestionnaire}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Form>
                  <Field name="fname" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <FormLabel>Nom</FormLabel>
                        <Input
                          defaultValue={data?.fname}
                          {...field}
                          placeholder="Nom"
                        />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="lname" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <FormLabel>PreNom</FormLabel>
                        <Input
                          defaultValue={data?.lname}
                          {...field}
                          placeholder="PreNom"
                        />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="email" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <FormLabel>Email</FormLabel>
                        <Input
                          defaultValue={data?.email}
                          {...field}
                          placeholder="Email"
                        />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="address" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <FormLabel>Adresse</FormLabel>
                        <Input
                          defaultValue={data?.address}
                          {...field}
                          placeholder="Adresse"
                        />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="speciality" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <FormLabel>Specialite</FormLabel>
                        <Input
                          defaultValue={data?.speciality}
                          {...field}
                          placeholder="Specialite"
                        />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="role" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <FormLabel>Role</FormLabel>
                        <Input
                          defaultValue={data?.role}
                          {...field}
                          placeholder="Role"
                        />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Form>
              </ModalBody>

              <ModalFooter>
                <Button
                  variant="ghost"
                  mr={3}
                  onClick={onClose}
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  Fermer
                </Button>
                <Button
                  colorScheme="primary"
                  _hover={{
                    opacity: 0.8,
                  }}
                >
                  {mode == "edit" ? "Modifier" : "Creer"}{" "}
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Formik>
    </>
  );
}

export default CreateUser;
