import React from "react";
import { CiSearch } from "react-icons/ci";

const Search = () => {
  return (
    <label
      htmlFor="search"
      className="relative w-full rounded-full border border-gray-300"
    >
      <div className="absolute left-3 top-[2px] flex h-full items-center text-gray-700">
        <CiSearch />
      </div>
      <input
        type="text"
        id="search"
        className="flex h-full items-center rounded-full px-2 py-1 pl-8
    text-gray-700 outline-none placeholder:text-sm"
        placeholder="Search ..."
      />
    </label>
  );
};

export default Search;
