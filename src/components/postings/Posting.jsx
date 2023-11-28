import { useState, useEffect } from "react";
import "./Posting.css";

const Posting = ({ key, data, user }) => {
  const currentVolunteers = data.currentVolunteers || [];
  const isFull = currentVolunteers.length >= data.maxVolunteers;
  let isSignedUp = false;

  if (user) {
    const isSignedUp = currentVolunteers.some(
      (volunteer) => volunteer.email === user.email
    );
  }

  // Function to format date in "Month Day, Year" format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to format time in "AM/PM" format
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours % 12 || 12}:${minutes} ${hours >= 12 ? "PM" : "AM"}`;
  };
  const createGoogleCalendarEventUrl = () => {
    const { eventName, description, location, date, startTime, endTime } = data;

    const startDate = new Date(`${date} ${startTime}`);
    const endDate = new Date(`${date} ${endTime}`);

    // Format dates to YYYYMMDDTHHMMSSZ
    const formatGoogleCalendarDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    const googleCalendarUrl = new URL(
      "https://calendar.google.com/calendar/render?action=TEMPLATE"
    );
    googleCalendarUrl.searchParams.append("text", eventName);
    googleCalendarUrl.searchParams.append("details", description);
    googleCalendarUrl.searchParams.append("location", location);
    googleCalendarUrl.searchParams.append(
      "dates",
      `${formatGoogleCalendarDate(startDate)}/${formatGoogleCalendarDate(
        endDate
      )}`
    );

    return googleCalendarUrl.href;
  };

  return (
    <div className="posting-div">
      <h1>{data.eventName}</h1>
      <h2>
        <strong>{data.organization}</strong>
      </h2>
      <p>{data.description}</p>
      <p>
        <strong>LOCATION</strong>
        <p>{data.location}</p>
      </p>
      <p>
        <strong>TYPE</strong>
        <p>{data.opportunityType}</p>
      </p>
      {data.opportunityType === "One-off" ? (
        <p>
          <strong className="date">DATE AND TIME</strong>
          <p>
            {formatTime(data.startTime)} - {formatTime(data.endTime)},{" "}
            {formatDate(data.date)}
          </p>
        </p>
      ) : (
        <div>
          <p>
            <strong className="days-and-times">DAYS AND TIMES</strong>
          </p>
          <ul>
            {data.days.map((day, index) => (
              <li key={index}>
                {day}: {formatTime(data.startTimes[index])} -{" "}
                {formatTime(data.endTimes[index])}
              </li>
            ))}
          </ul>
        </div>
      )}
      {data.requiredSkills && (
        <p>
          <strong>REQUIRED SKILLS</strong>
          <p>
            {data.requiredSkills.map((skill, index) => (
              <span key={index} className="required-skill">
                {skill}
              </span>
            ))}
          </p>
        </p>
      )}
      <p>
        <strong>CURRENT VOLUNTEERS</strong>
        <p>
          {currentVolunteers.length}/{data.maxVolunteers}
        </p>
      </p>
      <div className="buttons-post">
        {user ? (
          <div className="signing-up-buttons">
            {!isFull && !isSignedUp && (
              <button
                className="button-post sign-up"
                onClick={() => {
                  /* sign-up logic */
                }}
              >
                <strong>SIGN UP</strong>
              </button>
            )}

            {isFull && <p className="event-is-full">Event is full</p>}

            {isSignedUp && (
              <>
                <p>You are already signed up for this event.</p>
                <button
                  className="button-post opt-out"
                  onClick={() => {
                    /* opt-out logic */
                  }}
                >
                  <strong>OPT OUT</strong>
                </button>
              </>
            )}
          </div>
        ) : (
          <div></div>
        )}
        <div className="social-buttons">
          {!isFull && (
            <>
              <button
                className="button-post share mail"
                onClick={() => {
                  const mailtoLink = `mailto:${data.poster}`;
                  window.location.href = mailtoLink;
                }}
              >
                <img src="mail.png"></img>
              </button>
              <button
                className="button-post add-to-cal"
                onClick={() => {
                  const googleCalendarEventUrl = createGoogleCalendarEventUrl();
                  window.open(googleCalendarEventUrl, "_blank");
                }}
              >
                <img src="cal.png" alt="Add to Calendar"></img>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Posting;
