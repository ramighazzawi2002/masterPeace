import React, { useState } from "react";
import { Search } from "lucide-react";

const SearchBar = ({ pageType, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = e => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto mt-28 relative"
      dir="rtl"
    >
      <div className="relative flex-grow">
        <input
          type="search"
          className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-customBrown focus:border-customBrown"
          placeholder={`ابحث في ${pageType}...`}
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="absolute top-0 left-0 p-2.5 text-sm font-medium h-full text-white bg-customBrown hover:bg-customBrown/80 rounded-l-lg border border-customBrown focus:ring-4 focus:outline-none focus:ring-customBrown/50 transition-colors"
        >
          <Search className="w-5 h-5" />
          <span className="sr-only">بحث</span>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
