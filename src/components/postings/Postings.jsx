import { useState, useEffect } from "react";
import { useDbData } from "../../utilities/firebase";
import Posting from "./Posting.jsx";
import "./Postings.css";

const Postings = ({ user, searchTerm, filterData }) => {
  const [data, loading, error] = useDbData("/");
  const [filteredData, setFilteredData] = useState(data);
  useEffect(() => {
    setFilteredData(data);
    if (data) {
      let newFilteredData = Object.values(data);
      if (searchTerm && searchTerm.trim() !== "") {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        newFilteredData = newFilteredData.filter(
          (item) =>
            item.eventName.toLowerCase().includes(lowerCaseSearchTerm) ||
            item.description.toLowerCase().includes(lowerCaseSearchTerm) ||
            item.organization.toLowerCase().includes(lowerCaseSearchTerm)
        );
      }
      if (filterData && Object.keys(filterData).length) {
        newFilteredData = newFilteredData.filter((item) => {
          // Check filterType only if filterData.filterType is not null
          let isTypeMatch = filterData.filterType
            ? filterData.filterType.toLowerCase() ===
              item.opportunityType.toLowerCase()
            : true;

          if (filterData.filterType === "all") {
            isTypeMatch = true;
          }

          // Check skills only if filterData.skills is not null
          let isSkillMatch =
            filterData.skills && item.requiredSkills
              ? filterData.skills.some((skill) =>
                  item.requiredSkills
                    .map((itemSkill) => itemSkill.toLowerCase())
                    .includes(skill.toLowerCase())
                )
              : true; // If no skills specified in filterData, don't filter out this item.

          if (filterData.skills && filterData.skills.length === 0) {
            isSkillMatch = true;
          }

          // Check volunteer spots only if filterData.volunteerSpots is not null
          const currentVolunteersCount = item.currentVolunteers
            ? Array.isArray(item.currentVolunteers)
              ? item.currentVolunteers.length
              : Object.values(item.currentVolunteers).length
            : 0;

          const isVolunteerSpotMatch =
            filterData.volunteerSpots !== null
              ? filterData.volunteerSpots <=
                item.maxVolunteers - currentVolunteersCount
              : true;

          // Return true if all conditions are met
          return isTypeMatch && isSkillMatch && isVolunteerSpotMatch;
        });
      }
      setFilteredData(newFilteredData);
    }
  }, [data, searchTerm, filterData]);

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
