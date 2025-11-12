import logofull from "../assets/images/logofull.png";
import { Link, useNavigate } from "react-router";
import useAuth from "./hooks/UseAuth";
import './Header.css'

function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleNavigateToCreateEvents = () => {
    if (!currentUser) {
      alert("You must reegister to create events")
      navigate("/")
      return
    }
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <header className="header">
      <div className="favicon">
        <Link to="/">
          <img src={logofull} alt="favicon-image" />
        </Link>
      </div>
      <nav className="Primarynav">
        <ul className="navlist">
          <li>Events</li>
          <li>My Tickets</li>
          <li>About Project</li>
        </ul>
      </nav>
      <div className="create-events-button"
        onClick={handleNavigateToCreateEvents}
      >
        <Link to="/create-events">
          Create Events
        </Link>
      </div>
      <div>
        {currentUser ? (
          <>
            <span className="welcome">Hi, {currentUser.name}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <span className="login">
              <Link to="/login">Login</Link>
            </span>
            <span className="register">
              <Link to="/register">Register</Link>
            </span>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
