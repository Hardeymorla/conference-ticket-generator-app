// src/pages/Home.tsx
import { useContext } from "react";
import EventsContext from "../components/context/EventsProvider";
import AuthContext from "../components/context/UsersProvider";
import { useNavigate } from "react-router";
import "./Home.css";

function HomePage() {
  const { events, loading, error } = useContext(EventsContext);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleBook = (eventId: string) => {
    if (!currentUser) {
      alert("Please register or log in to book an event.");
      navigate("/register");
    } else {
      navigate(`/booking/${eventId}/ticket`);
    }
  };

  // ------ SKELETON UI ------  
  const renderSkeletons = () => {
    return Array.from({ length: 4 }).map((_, i) => (
      <div className="event-card skeleton" key={i}>
        <div className="event-image-wrapper skeleton-box" />
        <div className="event-info">
          <div className="skeleton-box info-line title" />
          <div className="skeleton-box info-line" />
          <div className="skeleton-box info-line short" />
        </div>
      </div>
    ));
  };

  return (
    <main className="home">
      <h1 className="home-title">Upcoming Events</h1>

      {/* 🔴 Error State */}
      {error && (
        <p className="error-text">
          Failed to load events. Please refresh the page.
        </p>
      )}

      <section className="event-grid">

        {/* 🟡 Loading State → Skeleton boxes */}
        {loading && renderSkeletons()}

        {/* 🟢 Loaded Successfully */}
        {!loading && !error && events.length > 0 &&
          events.map((event) => (
            <div className="event-card" key={event.id}>
              <div className="event-image-wrapper">
                <img
                  src={event.imageUrl || "/placeholder.png"}
                  alt={event.title}
                  className="event-image"
                />

                <button
                  className="view-more-btn"
                  onClick={() => handleBook(event.id)}
                >
                  Book Now
                </button>
              </div>

              <div className="event-info">
                <h2 className="event-title">{event.title}</h2>
                <p className="event-date">{event.date}</p>
                <p className="event-location">{event.location}</p>
              </div>
            </div>
          ))}

        {/* ⚪ No events fallback */}
        {!loading && !error && events.length === 0 && (
          <p className="no-events">No upcoming events found.</p>
        )}

      </section>
    </main>
  );
}

export default HomePage;
