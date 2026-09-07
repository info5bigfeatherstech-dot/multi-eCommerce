"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSearchQuery } from "@/store/slices/uiSlice";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/Select";

export function SearchBar() {
  const dispatch = useAppDispatch();
  const currentQuery = useAppSelector((state) => state.ui.searchQuery);
  const [searchTerm, setSearchTerm] = useState(currentQuery || "");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(setSearchQuery(searchTerm.trim()));
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    dispatch(setSearchQuery(""));
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="relative flex items-center w-full shadow-md rounded-full bg-white p-1 border border-slate-200/80 focus-within:ring-2 focus-within:ring-accent/50 focus-within:border-accent transition-all duration-300"
    >
      {/* Shadcn Select Category Dropdown */}
      <div className="hidden sm:block w-32 flex-shrink-0 border-r border-slate-200/80 pr-1">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="border-none bg-transparent shadow-none h-8 text-xs font-poppins font-bold text-slate-700 focus:ring-0">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Categories</SelectItem>
            <SelectItem value="home-living">Home & Living</SelectItem>
            <SelectItem value="kitchen-dining">Kitchen & Dining</SelectItem>
            <SelectItem value="electronics-gadgets">Electronics & Gadgets</SelectItem>
            <SelectItem value="beauty-care">Beauty & Personal Care</SelectItem>
            <SelectItem value="sports-fitness">Sports & Fitness</SelectItem>
            <SelectItem value="jewellery-acc">Jewellery & Accessories</SelectItem>
            <SelectItem value="home-decor">Home Decor</SelectItem>
            <SelectItem value="stationery-office">Stationery, Office & School</SelectItem>
            <SelectItem value="gifts-lifestyle">Gifts & Lifestyle</SelectItem>
            <SelectItem value="travel-outdoor">Travel & Outdoor</SelectItem>
            <SelectItem value="mix-items">Mix Items</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Shadcn Clean Search Input */}
      <div className="relative flex-1 flex items-center px-2">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search 10,000+ wholesale items..."
          className="border-none bg-transparent shadow-none h-8 text-xs sm:text-sm focus-visible:ring-0 focus-visible:ring-offset-0 px-2 font-inter text-slate-800 placeholder:text-slate-400"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Coral Search Icon Button */}
      <button
        type="submit"
        aria-label="Search"
        className="h-8 px-4 rounded-full bg-accent hover:bg-accent-hover text-white font-poppins font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 flex-shrink-0"
      >
        <Search className="w-3.5 h-3.5 stroke-[2.5]" />
        <span className="hidden sm:inline">Search</span>
      </button>
    </form>
  );
}

export default SearchBar;
