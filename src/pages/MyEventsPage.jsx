import { useState, useEffect } from "react";

const MyEventsPage = ( {user} ) => {
  const [events, setEvents] = useState([]);
  useEffect(() => {
        // Fetch the signed-up events from an API or local storage
        // This is a placeholder for the actual fetching logic
        fetchSignedUpEvents().then(data => setEvents(data));
    }, []);

    if (events.length === 0) {
        return <p>You haven't signed up for any events yet.</p>;
    }

    return (
        <div>
            {events.map(event => (
                <Posting key={event.id} {...event} /> // Render Posting component for each event
            ))}
        </div>
    );
};

export default MyEventsPage;

// Placeholder for fetching events logic
const fetchSignedUpEvents = async () => {
    // Implement the logic to fetch events data
    // Return the data in the expected format
};