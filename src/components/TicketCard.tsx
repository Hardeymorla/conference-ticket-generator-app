import type { TicketTypes } from "./context/EventsProvider";

// const ticketTypes = [
//     { type: "Regular", price: "Free", details: "Regular ACCESS", id:0 },
//     { type: "VIP", price: "$150", details: "Vip ACCESS", id:1 },
//     { type: "VVIP", price: "$150", details: "VVIP ACCESS", id:2 }
// ];
  
type PropsType = {
  tickets: TicketTypes[],
  selectedTicket: number | null,
  setSelectedTicket: React.Dispatch<React.SetStateAction<number | null>>
}

const TicketCard = ({tickets, selectedTicket, setSelectedTicket}: PropsType) => {
      
  return (
    <section className="tickettype">
          <p>Select Ticket Type:</p>
          <div className="plan">
            {tickets.map((ticket, index) => (
              <div  
                key={index}
                onClick={() => { setSelectedTicket(index) }} className={`planchild 
                ${selectedTicket === index ? "active" : ""}`}>
                <>
                  <h2>{ticket.price}</h2>
                  <p>{ticket.type}</p>
                  <p className="small">{ticket.details}</p>
                </>
              </div>
            ))};
          </div>
        </section>
  )
}

export default TicketCard
