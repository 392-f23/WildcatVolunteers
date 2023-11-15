import "./App.css";
import { useState } from "react";
import { useProfile } from "./utilities/profile";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import HomePage from "./pages/HomePage";
import MyEventsPage from "./pages/MyEventsPage";

const App = () => {
  const [{ user, isAdmin, emailVerified }, profileLoading, profileError] =
    useProfile();

  return (
    <div className="app-div">
      <Router>
        <Header user={user} />
        <div className="page-body">
          <Routes>
            <Route path="/" element={<HomePage user={user}/>} />
            <Route path="/myevents" element={<MyEventsPage user={user}/>} />
            {/* <Route path="/activate" element={<ActivatePage />} />
            <Route path="found/:id" element={<FoundPage />} />
            <Route path="myqr/:id" element={<QRPage />} /> */}
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
