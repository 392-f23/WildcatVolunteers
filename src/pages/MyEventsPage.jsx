import { useState, useEffect } from "react";
import { useDbData } from "../utilities/firebase"

const MyEventsPage = ({ user }) => {
  const [myData, setMyData] = useState([]);
  const [data, loading, error] = useDbData("/");

  console.log(user)
  console.log(data)

//   if (!events) {
//     return (
//       <p className="no-events">You haven't signed up for any events yet.</p>
//     );
//   }

  return (
    <div className="my-events-page">
      {/* {events.map((event) => (
        <Posting key={event.id} {...event} /> // Render Posting component for each event
      ))} */}
    </div>
  );
};

export default MyEventsPage;
