import React from "react";
import { Search } from "lucide-react";

function SearchBar({ value, onChange, placeholder = "بحث بالاسم أو القسم..." }) {
  return (
    <div className="relative w-full md:w-80">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
      />
    </div>
  );
}

export default SearchBar;