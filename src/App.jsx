import "./App.css";
import { useState } from "react";
import { useProfile } from "./utilities/profile";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import HomePage from "./pages/HomePage";
import MyEventsPage from "./pages/MyEventsPage";
import PostPage from "./pages/PostPage";
import PostingDetailPage from "./components/postings/PostingDetailPage";

const App = () => {
  const [{ user, isAdmin, emailVerified }, profileLoading, profileError] =
    useProfile();

  return (
    <div className="app-div">
      <Router>
        <Header user={user} />
        <div className="page-body">
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route path="/myevents" element={<MyEventsPage user={user} />} />
            <Route
              path="/post"
              element={<PostPage user={user} />}
            ></Route>
            <Route path="/postings/:postingId" element={<PostingDetailPage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
