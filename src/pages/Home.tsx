import { useContext } from "react"
import EventsContext from "../components/context/EventsProvider"
import AuthContext from "../components/context/UsersProvider"
import { useNavigate } from "react-router"
import "./Home.css"

function HomePage() {
  const { events } = useContext(EventsContext)
  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleBook = (eventId: string) => {
    if (!currentUser) {
      // If not logged in, show alert or redirect to login page
      alert("Please register or log in to view event details.")
      localStorage.setItem("redirectAfterAuth", `/events/${eventId}`)
      navigate("/register")
    } else {
      // If user is logged in, go to event details
      navigate(`/booking/${eventId}/ticket`)
    }
  }

  // const img:string = new URL(`../images/${eventImg}.jpg`, import.meta.url).href

  return (
    <main className="home">
      <h1 className="home-title">Upcoming Events</h1>
      <section className="event-grid">
        {events.map((event) => (
          <div className="event-card" key={event.id}>
            <div className="event-image-wrapper">
              <img
                src={new URL(`../images/${event.id}.jpeg`, import.meta.url).href}
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
      </section>
    </main>
  )
}

export default HomePage
