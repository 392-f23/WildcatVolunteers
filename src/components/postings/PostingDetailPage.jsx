import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDbData } from '../../utilities/firebase';
import "./PostingDetailPage.css"; // Import the CSS for consistent styling

const PostingDetailPage = () => {
  const { postingId } = useParams();
  const [data, loading, error] = useDbData(`/${postingId}`);
  const [user] = useState(null); // Replace with actual user state logic

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

  const createGoogleCalendarEventUrl = (eventData) => {
    const { eventName, description, location, date, startTime, endTime } = eventData;
  
    const startDate = new Date(`${date} ${startTime}`);
    const endDate = new Date(`${date} ${endTime}`);
  
    // Format dates to YYYYMMDDTHHMMSSZ
    const formatGoogleCalendarDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };
  
    const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render?action=TEMPLATE');
    googleCalendarUrl.searchParams.append('text', eventName);
    googleCalendarUrl.searchParams.append('details', description);
    googleCalendarUrl.searchParams.append('location', location);
    googleCalendarUrl.searchParams.append('dates', `${formatGoogleCalendarDate(startDate)}/${formatGoogleCalendarDate(endDate)}`);
  
    return googleCalendarUrl.href;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No posting found</div>;
  }

  // Check if the current user is signed up
  const currentVolunteers = data.currentVolunteers || [];
  const isFull = currentVolunteers.length >= data.maxVolunteers;
  let isSignedUp = user && currentVolunteers.some(volunteer => volunteer.email === user.email);

  return (
    <div className="posting-div-detail">
      <Link to={`/postings/${data.id}`}> {/* Assuming 'data.id' is the unique identifier */}
        <h1>{data.eventName}</h1>
      </Link>
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
                className="button-post share"
                onClick={() => {
                  /* share event logic */
                }}
              >
                <img src="../../public/share.png"></img>
              </button>
              <button
                className="button-post add-to-cal"
                onClick={() => {
                  const googleCalendarEventUrl = createGoogleCalendarEventUrl();
                  window.open(googleCalendarEventUrl, '_blank');
                }}
              >
                <img src="../../public/cal.png" alt="Add to Calendar"></img>
              </button>

            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostingDetailPage;
