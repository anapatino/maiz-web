import React from 'react';

interface SearchBarProps {
  onChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-6 w-6 text-[#DEA001] absolute left-3 top-2.5 max-phone:top-[2px]"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            className="w-64 max-phone:w-48 py-2 max-phone:py-0.5 pl-10 pr-4 border text-black rounded-full focus:outline-none focus:border-[#DEA001]"
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
