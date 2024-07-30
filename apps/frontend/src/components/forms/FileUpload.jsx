import { useSelector } from "react-redux";
import Resizer from "react-image-file-resizer";
import axios from "axios";

// STYLE
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Avatar,
  Spinner,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";

const FileUpload = ({ values, setValues, setLoading, loading }) => {
  const user = useSelector((state) => state.user.loggedInUser);

  const fileUploadAndResize = (e) => {
    let files = e.target.files; // 3
    let allUploadedFiles = values.images;

    // resize
    if (files) {
      setLoading(true);
      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(
          files[i],
          720,
          720,
          "JPEG",
          100,
          0,
          async (uri) => {
            try {
              const res = await axios.post(
                `${import.meta.env.VITE_REACT_APP_API}/uploadimages`,
                { image: uri },
                { headers: { authtoken: user ? user.token : "" } }
              );
              setLoading(false);
              allUploadedFiles.push(res.data);

              setValues({ ...values, images: allUploadedFiles });
            } catch (err) {
              setLoading(false);
              console.log("CLOUDINARY UPLOAD ERR", err);
            }
          },
          "base64"
        );
      }
    }
  };

  const handleImageRemove = async (public_id) => {
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API}/removeimage`,
        { public_id },
        {
          headers: {
            authtoken: user ? user.token : "",
          },
        }
      );

      setLoading(false);
      const { images } = values;
      let filteredImages = images.filter((item) => {
        return item.public_id !== public_id;
      });
      setValues({ ...values, images: filteredImages });
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <>
      <Flex my={2}>
        {values.images &&
          values.images.map((image) => (
            <Box key={image.public_id} pos="relative" mr={2}>
              <Avatar src={image.url} borderRadius="0px" size="xl" />
              <SmallCloseIcon
                pos="absolute"
                top={-1}
                right={-1}
                boxSize={5}
                bg="red"
                color="white"
                borderRadius="50%"
                cursor="pointer"
                onClick={() => handleImageRemove(image.public_id)}
              />
            </Box>
          ))}
      </Flex>

      <FormControl>
        {loading ? (
          <Spinner color="primary.500" />
        ) : (
          <FormLabel
            w="140px"
            bg="gray.200"
            color="primary.500"
            fontWeight="bold"
            cursor="pointer"
            borderRadius="4px"
            _hover={{ opacity: "0.7" }}
            py={2}
            px={4}
          >
            Choose image
            <Input
              focusBorderColor="primary.500"
              type="file"
              multiple
              accept="images/*"
              onChange={fileUploadAndResize}
              display="none"
            />
          </FormLabel>
        )}
      </FormControl>
    </>
  );
};

export default FileUpload;
