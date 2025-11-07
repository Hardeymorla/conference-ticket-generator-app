import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useEvents from "../components/hooks/UseEvents";
import useBookings from "../components/hooks/UseBookings";
import useAuth from "../components/hooks/UseAuth";
import { PaystackButton } from "react-paystack";
import "./Payment.css";


const PaymentPage = () => {
  const { id } = useParams()
  const navigate = useNavigate();
  const { currentBooking } = useBookings();
  const { events } = useEvents();
  const { currentUser } = useAuth();
  console.log(currentBooking)
  console.log("My Events" + events)
  
  const event = events.find(ev => ev.id === id);
  console.log("ID", event?.id)
  
  const [isPaying, setIsPaying] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  if (!currentUser) {
    alert("Please register or log in to book a ticket.")
    navigate("/login")
  }

  if (!event || !currentBooking) {
    return (
      <div className="event-not-found">
        <p>Selected Ticket missing. Please start booking again.</p>
        <button onClick={()=> navigate("/")}>Go Home</button>
      </div>
    )
  }

  // Compute Total Price (Number of "Free")
  const totalPrice =
    currentBooking?.selectedTicket?.price === "Free"
      ? "Free"
      : (Number(currentBooking?.selectedTicket?.price) *
        currentBooking!.ticketCount).toFixed(2);

  useEffect(() => {
    if (paymentDone && event.id) {
      navigate(`/booking/${event.id}/ticket-ready`);
      return
  }
    }, [paymentDone, event.id, navigate])
  
    // 🟢 PAYSTACK CONFIG
    const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    const paystackProps = {
      email: currentBooking?.attendeeEmail ?? "",
      amount:
        currentBooking?.selectedTicket?.price === "Free"
          ? 0
          : Number(currentBooking?.selectedTicket?.price || 0) *
          100 * currentBooking!.ticketCount, // kobo conversion
          metadata: {
            custom_fields: [
              {
                display_name: "Attendee Name",
                variable_name: "attendee_name",
                value: currentBooking?.attendeeName ?? "",
              },
              {
                display_name: "Event ID",
                variable_name: "event_id",
                value: event.id,
              },
              {
                display_name: "Ticket Type",
                variable_name: "ticket_type",
                value: currentBooking?.selectedTicket ?? "",
              },
              {
                display_name: "Ticket Count",
                variable_name: "ticket_count",
                value: currentBooking?.ticketCount ?? "",
              },
            ],
          },
        
      publicKey: paystackKey,
      onSuccess: () => {
        setIsPaying(false);
        setPaymentDone(true);
        alert("Payment successful!");
      },
      onClose: () => {
        setIsPaying(false);
        alert("Payment cancelled!");
      },
    };

    // Mock for free event
  const handleFreeBooking = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaymentDone(true);
      alert("Booking successful for free event!");
    }, 1500);
  };

  // Navigate to ticket-ready page
  const handleCompleteBooking = () => {
    console.log("Navigating to :", `/booking/${event?.id}/ticket-ready`);
    navigate(`/booking/${event.id}/ticket-ready`);
  };

    return (
      <main className="main">
        <header className="ticketheader">
          <h2>Payment</h2>
          <p className="small">Step 3/4</p>
        </header>

        <div className="payment-wrapper">
          <section className="payment-summary">
            <h3>Order Summary</h3>
            <p><strong>Event:</strong> {event.title} </p>
            <p><strong>Ticket:</strong> {currentBooking!.selectedTicket?.type}</p>
            <p><strong>Quantity:</strong> {currentBooking!.ticketCount}</p>
            <p><strong>Total:</strong> {totalPrice === "Free" ? "Free" : `$${totalPrice}`}</p>
          </section>

          <h3>Pay With Paystack</h3>
          <section className="btnwrapper">
            <button onClick={() => navigate(-1)} disabled={isPaying}>
              Back
            </button>
            {!paymentDone ? (totalPrice === "Free" ? (
              <button onClick={handleFreeBooking} disabled={isPaying}>
                {isPaying ? "Processing..." : "Complete Booking"}
              </button>
            ) : (
              <PaystackButton className="paystack-button" {...paystackProps} text="Pay Now"/>
            )    
            ) : (
                <button onClick={handleCompleteBooking}>Complete Booking</button>
            )}
          </section>
        </div>
      </main>
    );
  };
export default PaymentPage;
