import logo from "@/assets/logo.png";
import { useNavigate } from "react-router-dom";
import { Image } from "@chakra-ui/react";

const Logo = (props) => {
  const navigate = useNavigate();
  return (
    <Image
      objectFit="cover"
      src={logo}
      alt="logo"
      h="auto"
      w="180px"
      cursor="pointer"
      _hover={{
        opacity: 0.8,
      }}
      onClick={() => navigate("/")}
      {...props}
    />
  );
};
export default Logo;
