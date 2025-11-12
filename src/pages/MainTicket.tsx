import { useNavigate, useParams } from "react-router";
import TicketCard from "../components/TicketCard";
import TicketSelection from "../components/TicketSelection";
import useAuth from "../components/hooks/UseAuth";
import useEvents from "../components/hooks/UseEvents";
import useBookings from "../components/hooks/UseBookings";
import { useState } from "react";
import "./MainTicket.css"

function MainTicket() {
  const { id } = useParams()
  const { events } = useEvents()
  const {currentBooking, setCurrentBooking} = useBookings()
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const[ticketCount, setTicketCount] = useState(1)

  const event = events.find(ev => ev.id === id)


  if (!event) {
    return <p className="event-not-found">Event not found.</p>;
  }

  if (!currentUser) {
      alert("Please register or log in to book a ticket.")
      navigate("/login") 
    }

  const handleNext = () => {
    if (selectedTicket === null) {
      alert("Select a Ticket Type before continuing.")
      return
    }

    //store the state temporarily
    setCurrentBooking({
      eventId: event.id,
      selectedTicket: event.tickets[selectedTicket],
      ticketCount,
      bookedAt: new Date().toISOString(),
    })
    console.log(currentBooking)
    navigate(`/booking/${event.id}/attendee`)
  }
  
  return (
    <main className="main">
      <header className="ticketheader">
        <h2>Ticket Selection</h2>
        <p className="small">Step 1/4</p>
      </header>
      <div className="ticketwrapper">
        <section className="ticketinfo">
          <h1 className="CTAheader">{event.title}</h1>
          <p className="CTA">
            {event.description}
          </p>
          <ul className="CTAlist">
            <li>📍 {event.location}</li>
            <li>| |</li>
            <li>{event.date} | {event.time}</li>
          </ul>
        </section>

        <TicketCard tickets={event.tickets}
          selectedTicket={ selectedTicket }
          setSelectedTicket={setSelectedTicket}
        />
        <TicketSelection
          ticketCount={ticketCount}
          setTicketCount={setTicketCount}
        />
        
        <section className="btnwrapper">
          <button onClick={() => navigate("/")}>Cancel</button>
          <button onClick={handleNext}>Next</button>
        </section>
      </div>
    </main>
  );
}

export default MainTicket;
