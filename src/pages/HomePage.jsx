import Postings from "../components/postings/Postings";
import Search from "../components/search/Search";
import Filter from "../components/filter/Filter";
import "./HomePage.css"

const HomePage = ({ user }) => {
  return (
    <div>
      <div className="search-filter-div">
        <Search></Search>
        <Filter></Filter>
      </div>
      <Postings user={user}></Postings>
    </div>
  );
};

export default HomePage;
