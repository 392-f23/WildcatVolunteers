import "./Header.css";
import {
  useAuthState,
  signInWithGoogle,
  signOut,
} from "../../utilities/firebase.js";
import { Link } from "react-router-dom";

const Header = ({ user }) => {
  return (
    <div className="header-div">
      <img className="header-icon" src="/icon.png"></img>
      <h1 className="header-title">Wildcat Volunteers</h1>
      <div className="header-buttons">
        <button className="find-opps-btn left-buttons">
          <Link className="nav-link" to="/">
            FIND OPPORTUNITIES
          </Link>
        </button>
        {user && (
          <button className="my-events-btn left-buttons">
            <Link className="nav-link" to="/myevents">
              MY EVENTS
            </Link>
          </button>
        )}
        <button className="post-opps-btn left-buttons">
          POST OPPORTUNITIES
          <img src="edit.png"></img>
        </button>
        <div className="sign-in-div">
          {user ? (
            <button className="google-signed-in-btn" onClick={signOut}>
              <img
                src={user.photoURL || "url_to_default_profile_pic.png"}
                alt={user.displayName || "User Profile"}
              />
            </button>
          ) : (
            <button className="google-signin-btn" onClick={signInWithGoogle}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
