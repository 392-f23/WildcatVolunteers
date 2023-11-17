import "./Search.css";
import React, { useState } from "react";

const Search = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchInput);
    }
  };

  return (
    <div className="search-div">
      <form onSubmit={handleSearchSubmit}>
        <input
          type="search"
          placeholder="Search..."
          onChange={handleSearchChange}
          value={searchInput}
        />
      </form>
      <img className="search-icon" src="search.png"></img>
    </div>
  );
};

export default Search;
