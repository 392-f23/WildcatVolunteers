import React, { useState } from "react";
import Postings from "../components/postings/Postings";
import Search from "../components/search/Search";
import Filter from "../components/filter/Filter";
import "./HomePage.css"

const HomePage = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <div className="search-filter-div">
        <Search onSearch={handleSearch} />
        <Filter></Filter>
      </div>
      <Postings user={user} searchTerm={searchTerm}></Postings>
    </div>
  );
};

export default HomePage;
