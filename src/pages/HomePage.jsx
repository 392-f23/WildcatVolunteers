import Postings from "../components/postings/Postings";

const HomePage = ( {user} ) => {
  return (
    <div>
      <h2>Insert Search Bar</h2>
      <h2>Insert Filtering System</h2>
      <Postings user={user}>
      </Postings>
    </div>
  );
};

export default HomePage;
