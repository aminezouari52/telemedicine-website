// HOOKS
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// STYLE
import { Button, Box } from "@chakra-ui/react";

const HeaderButton = ({ pathname, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovering, setIsHovering] = useState(false);

  const color = () => {
    return location.pathname === pathname || isHovering
      ? "primary.500"
      : "#000";
  };

  return (
    <Button
      variant="transparent-with-icon"
      size="lg"
      display="flex"
      h="100%"
      color={color}
      style={{
        fill: color,
        transition: "all ease-in-out 0.2s",
      }}
      letterSpacing="2px"
      onClick={() => navigate(pathname)}
      onMouseEnter={() => {
        setIsHovering(true);
      }}
      onMouseLeave={() => setIsHovering(false)}
      fontWeight="bold"
      py={0}
      px={2}
    >
      {children}
      <Box
        pos="absolute"
        left="0"
        bottom="0"
        width={location.pathname === pathname || isHovering ? "100%" : "0"}
        height="3px"
        borderRadius="2px"
        backgroundColor="primary.500"
        transition="width 0.3s ease-in-out"
      />
    </Button>
  );
};

export default HeaderButton;
