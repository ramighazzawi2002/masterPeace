import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = ["القوالب", "النماذج", "التصميم", "الشعارات"];

const SearchBar = () => {
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("القوالب");
  const dropdownRef = useRef(null);

  const handleCategorySelect = category => {
    setSelectedCategory(category);
    setOpenFilter(false);
  };

  const toggleOpenFilter = () => setOpenFilter(!openFilter);

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <form className="max-w-5xl mx-auto mt-28 mb-20 relative" dir="rtl">
      <div className="flex">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={toggleOpenFilter}
            className="flex items-center justify-between w-full py-2.5 px-4 text-sm font-medium text-white bg-customBrown hover:bg-customBrown/80 rounded-r-lg focus:ring-2 focus:outline-none focus:ring-customBrown/50 transition-colors"
            aria-haspopup="listbox"
            aria-expanded={openFilter}
          >
            {selectedCategory}
            <ChevronDown className="w-4 h-4 mr-2" />
          </button>
          {openFilter && (
            <ul className="absolute z-10 w-full py-2 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm right-0">
              {categories.map(category => (
                <li
                  key={category}
                  className="text-gray-900 cursor-default select-none relative py-2 pr-3 pl-9 hover:bg-customBrown/10"
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative flex-grow">
          <input
            type="search"
            className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-l-lg bg-gray-50 focus:ring-customBrown focus:border-customBrown"
            placeholder="ابحث عن النماذج والشعارات وقوالب التصميم..."
            required
          />
          <button
            type="submit"
            className="absolute top-0 left-0 p-2.5 text-sm font-medium h-full text-white bg-customBrown hover:bg-customBrown/80 rounded-l-lg border border-customBrown focus:ring-4 focus:outline-none focus:ring-customBrown/50 transition-colors"
          >
            <Search className="w-5 h-5" />
            <span className="sr-only">بحث</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
