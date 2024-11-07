import logo from "@/images/logo.png";
import { useNavigate } from "react-router-dom";
import { Image } from "@chakra-ui/react";
const Logo = () => {
  const navigate = useNavigate();
  return (
    <Image
      objectFit="cover"
      src={logo}
      alt="logo"
      h="auto"
      w="210px"
      cursor="pointer"
      _hover={{
        opacity: 0.7,
      }}
      onClick={() => navigate("/")}
    />
  );
};
export default Logo;
