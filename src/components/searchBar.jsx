import { useState } from "react";
function SearchBar() {
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const handleCategorySelect = category => {
    setSelectedCategory(category);
    setOpenFilter(false);
  };

  function toggleOpenFilter() {
    setOpenFilter(!openFilter);
  }
  const categories = [
    "All categories",
    "Mockups",
    "Templates",
    "Design",
    "Logos",
  ];
  return (
    <form className="max-w-5xl mx-auto mt-28 mb-20 relative">
      <div className="flex">
        <label
          for="search-dropdown"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Your Email
        </label>
        <button
          id="dropdown-button"
          data-dropdown-toggle="dropdown"
          className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center border rounded-s-lg focus:ring-4 focus:outline-none text-white bg-[#8B4513] hover:bg-[#5A2E0F] dark:focus:ring-[#8B4513]"
          type="button"
          onClick={toggleOpenFilter}
        >
          {selectedCategory}
          <svg
            className="w-2.5 h-2.5 ms-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>
        {openFilter && (
          <div
            id="dropdown"
            className="z-10 absolute top-12 bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
          >
            <ul className="py-2 text-sm text-gray-700">
              {categories.map(category => (
                <li key={category}>
                  <button
                    type="button"
                    className="inline-flex w-full px-4 py-2 hover:bg-gray-100"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="relative w-full">
          <input
            type="search"
            id="search-dropdown"
            className="text-black font-semibold  block p-2.5 w-full z-20 text-sm rounded-e-lg border-t border-b outline-none focus:border-[#8B4513] dark:border-gray-700"
            placeholder="Search Mockups, Logos, Design Templates..."
            required
          />
          <button
            type="submit"
            className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-[#8B4513] hover:bg-[#5A2E0F] rounded-e-lg border focus:ring-4 focus:outline-none dark:focus:ring-[#8B4513]"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
}
export default SearchBar;
