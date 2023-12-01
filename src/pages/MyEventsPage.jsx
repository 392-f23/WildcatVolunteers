import { useState, useEffect } from "react";
import { useDbData, useDbRemove } from "../utilities/firebase";
import "./MyEventsPage.css"

const MyEventsPage = ({ user }) => {
  const [data, loading, error] = useDbData("/");
  const [hostedEvents, setHostedEvents] = useState([]);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [removeData, removeResult] = useDbRemove();

  useEffect(() => {
    if (user && user.email && data) {
      const allEvents = Object.values(data);
      const hosted = allEvents.filter(event => event.poster === user.email);
      const attended = allEvents.filter(event => 
        event.currentVolunteers && Object.values(event.currentVolunteers).some(volunteer => volunteer === user.email)
      );
      setHostedEvents(hosted);
      setAttendedEvents(attended);
    }
  }, [data, user]);

  const deleteEvent = (eventx) => {
    removeData(`/${eventx.id}`);
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours % 12 || 12}:${minutes} ${hours >= 12 ? "PM" : "AM"}`;
  };

  const isEventPassed = (eventDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of the day
    return new Date(eventDate) < today;
  };

  const renderEvents = (events, title, noEventsMessage) => (
    <>
      <h2>{title}</h2>
      {events.length > 0 ? (
        events.map((event, index) => (
          <div key={index} className={`event-card ${isEventPassed(event.date) ? 'event-passed' : ''}`}>
            <h3>{event.eventName}</h3>
            <p>{event.description}</p>
            <p><strong>📍</strong> {event.location}</p>
            <button onClick={() => deleteEvent(event, index)}
            className="remove-btn"
            >
              X
            </button>
            {event.opportunityType === "One-off" ? (
              <p>
                <strong>⏰</strong> {formatDate(event.date)} {formatTime(event.startTime)} - {formatTime(event.endTime)}
              </p>
            ) : (
              <div>
                <strong>⏰</strong>
                <ul>
                  {event.days && Array.isArray(event.days) && event.days.map((day, idx) => (
                    <li key={idx}>{day}: {formatTime(event.startTimes[idx])} - {formatTime(event.endTimes[idx])}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>{noEventsMessage}</p>
      )}
    </>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="my-events-page">
      {renderEvents(hostedEvents, "Events Hosting", "No events hosted yet.")}
      {renderEvents(attendedEvents, "Events Attending", "No events attended yet.")}
    </div>
  );
};

export default MyEventsPage;




