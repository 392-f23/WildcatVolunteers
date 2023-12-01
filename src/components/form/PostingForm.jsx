import { useState, useEffect } from "react";
import { useDbAdd } from "../../utilities/firebase";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import "./PostingForm.css";

const PostingForm = ({ user }) => {
  const [eventName, setEventName] = useState("");
  const [organization, setOrganization] = useState("");
  const [location, setLocation] = useState("");
  const [opportunityType, setOpportunityType] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [maxVolunteers, setMaxVolunteers] = useState("");
  const [days, setDays] = useState([]);
  const [startTimes, setStartTimes] = useState([]);
  const [endTimes, setEndTimes] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  const newId = uuidv4()
  const [add, result] = useDbAdd("/", newId);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setUserEmail(user.email);
    }
  }, [user]);

  const routeChange = () =>{ 
    let path = `/myevents`; 
    navigate(path);
  }

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" && e.target.value) {
      e.preventDefault(); // Prevent form submission
      setRequiredSkills([...requiredSkills, e.target.value]);
      e.target.value = ""; // Clear the input
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setRequiredSkills(
      requiredSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleDayChange = (e) => {
    const { value, checked } = e.target;
    setDays({
      ...days,
      [value]: checked ? { startTime: "", endTime: "" } : undefined,
    });
  };

  const handleTimeChange = (day, timeType, timeValue) => {
    setDays({
      ...days,
      [day]: { ...days[day], [timeType]: timeValue },
    });
  };

  const handleSubmit = (e) => {
    if (opportunityType == "Continuous") {
      const startTimes = Object.values(days).map((day) => day.startTime);
      const endTimes = Object.values(days).map((day) => day.endTime);
      const eventData = {
        eventName,
        organization,
        location,
        opportunityType,
        description,
        requiredSkills,
        currentVolunteers: [],
        maxVolunteers,
        days: opportunityType === "Continuous" ? Object.keys(days) : undefined,
        startTimes,
        endTimes,
        poster: userEmail,
        id: newId,
      };
      console.log(eventData);
      add(eventData);
    } else {
      const eventData = {
        eventName,
        organization,
        location,
        opportunityType,
        description,
        requiredSkills,
        currentVolunteers: [],
        maxVolunteers,
        date,
        startTime,
        endTime,
        poster: userEmail,
        id: newId,
      };
      console.log(eventData);
      add(eventData);
      navigate("/");
    }
  };

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <form className="posting-form-div" onSubmit={handleSubmit}>
      <p>EVENT NAME</p>
      <input
        type="text"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        placeholder="Event Name"
        required
      />
      <p>ORGANIZATION</p>
      <input
        type="text"
        value={organization}
        onChange={(e) => setOrganization(e.target.value)}
        placeholder="Organization"
        required
      />
      <p>LOCATION</p>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
        required
      />
      <p>DESCRIPTION</p>
      <textarea
        type="text"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <p>OPPORTUNITY TYPE</p>
      <select
        value={opportunityType}
        onChange={(e) => setOpportunityType(e.target.value)}
        required
      >
        <option value="" disabled>
          Select Opportunity Type
        </option>
        <option value="Continuous">Continuous</option>
        <option value="One-off">One-off</option>
      </select>
      {opportunityType === "One-off" && (
        <>
          <p>DATE</p>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <p>START TIME</p>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
          <p>END TIME</p>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </>
      )}
      {opportunityType === "Continuous" && (
        <div>
          <p>DAYS AND TIMES</p>
          {daysOfWeek.map((day) => (
            <label key={day}>
              <input type="checkbox" value={day} onChange={handleDayChange} />{" "}
              {day}
              {days[day] && (
                <div>
                  <input
                    className="startTime"
                    type="time"
                    value={days[day].startTime}
                    onChange={(e) =>
                      handleTimeChange(day, "startTime", e.target.value)
                    }
                    required
                  />
                  <p>TO</p>
                  <input
                    type="time"
                    value={days[day].endTime}
                    onChange={(e) =>
                      handleTimeChange(day, "endTime", e.target.value)
                    }
                    required
                  />
                </div>
              )}
            </label>
          ))}
        </div>
      )}
      <p>REQUIRED SKILLS</p>
      <div className="skills-list">
        {requiredSkills.map((skill) => (
          <div key={skill} className="skill">
            {skill}{" "}
            <button type="button" onClick={() => handleRemoveSkill(skill)}>
              X
            </button>
          </div>
        ))}
      </div>
      <input
        type="text"
        onKeyDown={handleSkillKeyDown}
        placeholder="Add Required Skills (Press Enter)"
        className="skills-input"
      />
      <p>MAXMIMUM # OF VOLUNTEERS</p>
      <input
        type="number"
        value={maxVolunteers}
        onChange={(e) => setMaxVolunteers(e.target.value)}
        placeholder="Max Volunteers"
        required
      />
      <button className="submit-button" type="submit">
        Submit
      </button>
    </form>
  );
};

export default PostingForm;
