import { useState } from "react";
import "./Filter.css";

const Filter = ({ onSubmit }) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filterType, setFilterType] = useState("all"); // "all", "one-off", or "continuous"
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [volunteerSpots, setVolunteerSpots] = useState("");

  const handleSubmit = () => {
    const filterData = {
      filterType,
      skills,
      volunteerSpots,
    };
    console.log(filterData); // For debugging, can be removed later
    onSubmit(filterData);
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const handleSkillInput = (e) => {
    if (e.key === "Enter") {
      setSkills([...skills, skillInput]);
      setSkillInput("");
    }
  };

  return (
    <div className="filter-div">
      <button onClick={toggleFilter} className="filter-pop">
        <img src="filter.png" alt="Filter" />
      </button>
      {isFilterVisible && (
        <div className="filter-popup-overlay" onClick={toggleFilter}>
          <div className="filter-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={toggleFilter}>
              X
            </button>
            <p>TYPE</p>
            <select
              onChange={(e) => setFilterType(e.target.value)}
              value={filterType}
            >
              <option value="all">All</option>
              <option value="one-off">One-off</option>
              <option value="continuous">Continuous</option>
            </select>

            <p>REQUIRED SKILLS</p>
            <div className="skills-list">
              {skills.map((skill, index) => (
                <div key={index} className="skill">
                  {skill}{" "}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillInput}
              placeholder="Add Required Skills (Press Enter)"
              className="skills-input"
            />
            <p>MIN. # OF SPOTS</p>
            <input
              type="number"
              value={volunteerSpots}
              onChange={(e) => setVolunteerSpots(e.target.value)}
              placeholder="Number of volunteer spots left"
            />
            <div className="submit-btn-container">
              <button className="submit-btn" onClick={handleSubmit}>
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
