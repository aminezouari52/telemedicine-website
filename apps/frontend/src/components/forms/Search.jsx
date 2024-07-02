// HOOKS
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// FUNCTIONS
import { setSearchText } from "../../reducers/searchReducer";

// STYLE
import { Input, IconButton } from "@chakra-ui/react";
import { motion } from "framer-motion";

// ICONS
import { Search2Icon } from "@chakra-ui/icons";

const Search = () => {
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef(null);
  const formRef = useRef(null);

  const toggleExpand = (event) => {
    setExpanded((prevState) => !prevState);
    event.stopPropagation();
  };
  const dispatch = useDispatch();
  const search = useSelector((state) => state.search.searchText);
  const { text } = search;
  const navigate = useNavigate();

  const handleChange = (e) => {
    dispatch(
      setSearchText({
        text: e.target.value,
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/shop?${text}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setExpanded(false);
      }
    };

    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [expanded]);

  const handleKeyPress = (event) => {
    if (event.key === "Escape") {
      setExpanded(false);
    }
  };

  const variants = {
    open: { opacity: 1, width: "auto" },
    closed: { opacity: 0, width: "0" },
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", alignItems: "center" }}
      ref={formRef}
    >
      <motion.div
        animate={expanded ? "open" : "closed"}
        variants={variants}
        delay={{}}
      >
        <Input
          ref={inputRef}
          type="text"
          focusBorderColor="primary.500"
          placeholder="Chercher..."
          onChange={handleChange}
          color="#000"
          borderTopRightRadius={expanded ? "0" : "md"}
          borderBottomRightRadius={expanded ? "0" : "md"}
          px={expanded ? "4" : "0"}
        />
      </motion.div>
      <IconButton
        borderTopLeftRadius={expanded ? "0" : "md"}
        borderBottomLeftRadius={expanded ? "0" : "md"}
        colorScheme={expanded ? "primary" : "white"}
        color={expanded ? "white" : "primary"}
        icon={<Search2Icon />}
        onClick={toggleExpand}
        _hover={{
          bg: !expanded && "lightgray",
        }}
      />
      <button type="submit" style={{ display: "none" }} />
    </form>
  );
};

export default Search;
