import { useParams, useNavigate } from "react-router"
import { useContext } from "react"
import EventsContext from "../components/context/EventsProvider"
import AuthContext from "../components/context/UsersProvider"
// import "../styles/EventDetails.css"

const EventDetails = () => {
  const { id } = useParams()
  const { events } = useContext(EventsContext)
  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const event = events.find(ev => ev.id === id)

  if (!event) {
    return <p className="event-not-found">Event not found.</p>
  }

  const handleBooking = () => {
    if (currentUser) {
      navigate(`/book/${event.id}`) // proceed to ticket selection
    } else {
      alert("Please register or log in to book a ticket.")
      navigate("/register") // or wherever your registration route will be
    }
  }

  return (
    <main className="event-details">
      <div className="event-hero">
        <img src={new URL(`../images/${event.id}.jpeg`, import.meta.url).href}
                alt={event.title}
                className="event-image" />
      </div>

      <section className="event-info">
        <h1 className="event-title">{event.title}</h1>
        <p className="event-date">{event.date} — {event.time}</p>
        <p className="event-location">{event.location}</p>
        <p className="event-description">{event.description}</p>
        <button className="book-btn" onClick={handleBooking}>Book Ticket</button>
      </section>
    </main>
  )
}

export default EventDetails
