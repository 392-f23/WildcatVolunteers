import React, { useState } from "react";
import Postings from "../components/postings/Postings";
import Search from "../components/search/Search";
import Filter from "../components/filter/Filter";
import "./HomePage.css"

const HomePage = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterData, setFilterData] = useState({});

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterSubmit = (data) => {
    setFilterData(data);
  };

  return (
    <div>
      <div className="search-filter-div">
        <Search onSearch={handleSearch} />
        <Filter onSubmit={handleFilterSubmit}></Filter>
      </div>
      <Postings user={user} searchTerm={searchTerm} filterData={filterData}></Postings>
    </div>
  );
};

export default HomePage;
