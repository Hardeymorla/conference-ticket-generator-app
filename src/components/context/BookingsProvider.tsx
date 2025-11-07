import { createContext, useEffect, useState, type ReactElement } from "react"
import { TicketTypes } from "./EventsProvider"

export type BookingType = {
  eventId: string
  selectedTicket: TicketTypes | null
  ticketCount: number
  attendeeName?: string
  attendeeEmail?: string
  specialRequest?: string
  attendeeImage?: string // base64 or file path
  qrCode?: string
  bookedAt: string
}

export type useBookingsContextType = {
  currentBooking: BookingType | null
  setCurrentBooking: React.Dispatch<React.SetStateAction<BookingType | null>>
}

const initContextState: useBookingsContextType = {
  currentBooking: null,
  setCurrentBooking: () => {}
}

const BookingsContext = createContext<useBookingsContextType>(initContextState)

type ChildrenType = {
  children?: ReactElement | ReactElement[]
}

export const BookingsProvider = ({ children }: ChildrenType): ReactElement => {
  const [currentBooking, setCurrentBooking] = useState<BookingType | null>(() => {
    const saved = localStorage.getItem("currentBooking")
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (currentBooking) {
      localStorage.setItem("curretBooking", JSON.stringify(currentBooking))
    }
    else {
      localStorage.removeItem("currentBooking");
    }
  }, [currentBooking])
  
  return (
    <BookingsContext.Provider value={{ currentBooking, setCurrentBooking }}>
      {children}
    </BookingsContext.Provider>
  )
}

export default BookingsContext
