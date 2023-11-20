import { useState, useEffect } from "react";
import { useDbData } from "../../utilities/firebase";
import Posting from "./Posting.jsx";
import "./Postings.css";

const Postings = ( {user, searchTerm} ) => {
  const [data, loading, error] = useDbData("/");
  const [filteredData, setFilteredData] = useState(data);
  console.log(searchTerm)

  // everytime data gets updated, set the filtered data to data
  useEffect(() => {
    setFilteredData(data);
    if (data) {
      setFilteredData(Object.values(data))
      if (searchTerm && searchTerm.trim() !== "") {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filtered = Object.values(data).filter((item) => 
          item.eventName.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.description.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.organization.toLowerCase().includes(lowerCaseSearchTerm)
        );
        setFilteredData(filtered)
      }
      
    }
  }, [data, searchTerm]);


  // if the data for posting is still loading, then display the loading screen
  if (loading) {
    return (
      <div className="loading-indicator">
        <div className="loader"></div>;
      </div>
    );
  }

  return (
    <div className="postings-div">
      {filteredData &&
        filteredData.map((postData, index) => (
          <Posting key={index} data={postData} user={user}></Posting>
        ))}
    </div>
  );
};

export default Postings;