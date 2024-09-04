import { Input } from "@chakra-ui/react";
import Resizer from "react-image-file-resizer";

const ImageUpload = ({ onChange }) => {
  const uploadImageHandler = (event) => {
    const image = event.target.files[0];

    // resize
    Resizer.imageFileResizer(
      image,
      720,
      720,
      "JPEG",
      100,
      0,
      async (uri) => {
        onChange(uri);
      },
      "base64"
    );
  };

  return (
    <Input
      type="file"
      display="none"
      accept="images/*"
      onChange={uploadImageHandler}
    />
  );
};

export default ImageUpload;
