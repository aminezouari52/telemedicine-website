// HOOKS
import { useNavigate, useLocation } from "react-router-dom";

// STYLE
import { Box, Button, Icon, Image, Stack } from "@chakra-ui/react";

// ICONS
import { AiFillLock, AiOutlineHeart } from "react-icons/ai";
import { BsClockHistory } from "react-icons/bs";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { IoPeople } from "react-icons/io5";
import { RiAdminFill } from "react-icons/ri";
import { RiFileList3Fill } from "react-icons/ri";
import loginLogo from "../../images/login-logo.png";

const SideBar = () => {
  const location = useLocation();
  // const user = useSelector((state) => state.user.loggedInUser);
  const user = { role: "admin" };
  const sideBarElements = user
    ? user?.role === "admin"
      ? [
          {
            title: "Dashboard",
            icon: <Icon as={MdOutlineSpaceDashboard} mr={2} />,
            link: "/admin/dashboard",
          },
          {
            title: "Administrateurs",
            icon: <Icon as={RiAdminFill} mr={2} />,
            link: "/admin/allUsers",
          },
          {
            title: "Medcins",
            icon: <Icon as={MdOutlineSpaceDashboard} mr={2} />,
            link: "/admin/allDoctors",
          },
          {
            title: "Patients",
            icon: <Icon as={IoPeople} mr={2} />,
            link: "/admin/allPatients",
          },
          {
            title: "Rendez-vous",
            icon: <Icon as={RiFileList3Fill} mr={2} />,
            link: "/admin/allRdv",
          },
        ]
      : [
          {
            title: "History",
            icon: <Icon as={BsClockHistory} mr={2} />,
            link: "/user/history",
          },
          {
            title: "Wishlist",
            icon: <Icon as={AiOutlineHeart} mr={2} />,
            link: "/user/wishlist",
          },
          {
            title: "Password",
            icon: <Icon as={AiFillLock} mr={2} />,
            link: "/user/password",
          },
        ]
    : [];

  const navigate = useNavigate();

  return (
    <>
      <Stack bg="#fff" spacing={4} direction="column" p={4}>
        <Image
          objectFit="cover"
          src={loginLogo}
          alt="product image"
          h="44px"
          w="140px"
          onClick={() => navigate("/admin/dashboard")}
          cursor="pointer"
          _hover={{
            opacity: 0.7,
          }}
        />
        {sideBarElements.map((element) => (
          <Button
            key={element.title}
            color={location.pathname === element.link ? "#fff" : "#000"}
            fill={location.pathname === element.link ? "#fff" : "#000"}
            colorScheme="transparent"
            justifyContent="start"
            _hover={{
              backgroundColor: "primary.500",
              color: "#fff",
              fill: "#fff",
            }}
            backgroundColor={
              location.pathname === element.link && "primary.500"
            }
            onClick={() => navigate(element.link)}
          >
            {element.icon}
            <Box>{element.title}</Box>
          </Button>
        ))}
      </Stack>
    </>
  );
};
export default SideBar;
