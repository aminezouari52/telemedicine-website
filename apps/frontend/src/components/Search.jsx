"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

// // FUNCTIONS
import { setSearchText } from "@/reducers/searchReducer";

// STYLE
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ICONS
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  const dispatch = useDispatch();
  const handleChange = (event) => {
    dispatch(
      setSearchText({
        text: event.target.value,
      }),
    );
  };

  useEffect(() => {
    dispatch(
      setSearchText({
        text: "",
      }),
    );
  }, []);

  return (
    <div className="flex">
      <Button
        aria-label="search"
        className="rounded-r-none bg-primary-500 text-white hover:bg-primary-600"
        size="sm"
      >
        <SearchIcon className="h-4 w-4" />
      </Button>
      <Input
        className="rounded-l-none px-4 text-black"
        type="text"
        placeholder="Search..."
        onChange={handleChange}
      />
    </div>
  );
};

export default Search;
