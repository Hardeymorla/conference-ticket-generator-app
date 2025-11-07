import { useNavigate } from "react-router";
import useBookings from "../components/hooks/UseBookings";
import useEvents from "../components/hooks/UseEvents";
import "./TicketReady.css"

// import "../styles/TicketReady.css";
type Html2PdfOptions = {
  margin?: number;
    filename?: string;
    image?: {
      type?: "jpeg" | "png" | "webp";
        quality?: number;
    };
    html2canvas?: {
        scale?: number;
    };
    jsPDF?: {
        unit?: string;
        format?: string | [number, number];
        orientation?: "portrait" | "landscape";
    };
}
const TicketReady = () => {
  const navigate = useNavigate();
  const { currentBooking, setCurrentBooking } = useBookings();
  const { events } = useEvents();

  console.log("My Events " + events)
  console.log(currentBooking);

  const event = events.find((e) => e.id === currentBooking?.eventId);
  console.log(event)

  if (!currentBooking) {
    return (
      <div className="event-not-found">
        <p>Event or booking not found.</p>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  const handleDownload = () => {
    const ticket = document.getElementById("ticket-card");
    if (ticket) {
      const opt: Html2PdfOptions = {
        margin: 0.3,
        filename: `${currentBooking.attendeeName}-ticket.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      // lazy-load html2pdf
      import("html2pdf.js").then((html2pdf) => {
        html2pdf.default().set(opt).from(ticket).save();
      });
    }
  };

  const handleNewBooking = () => {
    setCurrentBooking(null); // clear localStorage
    navigate("/");
  };

  const { attendeeName, attendeeEmail, selectedTicket, ticketCount, qrCode } =
    currentBooking;

  return (
    <div className=" ticket-ready-container">
      <div className="ticket-ready-content ">
        <header className="ticketheader">
            <h2>Ready</h2>
            <p className="small">Step 4/4</p>
        </header>
        <h3>Your Ticket is Booked!</h3>
        <p className="subtext">
          Check your email for a copy or you can download below.
        </p>

        <div className="cardview">
          {/* Ticket Preview */}
        <div id="ticket-card" className="ticket-card">
          <h4>{event?.title}</h4>
          <p className="event-date">{event?.location}</p>
          <p className="event-date">{event?.date}</p>
          
          <div className="profile">
              {currentBooking.attendeeImage ? (
                <img
                  src={currentBooking.attendeeImage}
                  alt="Attendee"
                  className="profile-photo"
                />
              ) : (
                <div className="photo-placeholder">No Image</div>
              )}
          </div>

          <div className="ticket-body">
            <div className="details">
              <div className="enteryourname">
                <p>Enter your name</p>
                <strong>{attendeeName}</strong>
              </div>
              <div className="enteryouremail">
                <p>Enter your email</p>
                <strong>{attendeeEmail}</strong>
              </div>
              <div className="ticketreadytype">
                <p>Ticket Type:</p>
                  <strong>{selectedTicket?.type}</strong>
              </div>
              <div className="ticketfor">
                <p>Ticket for</p>
                <strong>{ticketCount}</strong>
              </div>
            </div>
              <p className="note">
                Hold this ticket securely. Entry may require QR scan.
              </p>
          </div>
        </div>
        
        {/* QR / Barcode */}
        <div className="barcode">
          <img
            src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${qrCode || "000000"}&includetext&scale=3&backgroundcolor=eeeeee&barcolor=003366`}
            alt="Barcode"
          />
        </div>
        </div>

        <div className="ticket-actions">
          <button className="secondary-btn" onClick={handleNewBooking}>
            Book Another Ticket
          </button>
          <button className="primary-btn" onClick={handleDownload}>
            Download Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketReady;
