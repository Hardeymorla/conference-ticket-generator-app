import { createContext, useState, type ReactElement } from "react"

export type TicketTypes = {
    type: string
    price: number | "Free"
    available: number
    details: string
}
export type EventType = {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  hostId: string
  tickets: TicketTypes[],
  imageUrl: string,
  createdAt: string
}

const initState: EventType[] = [
  {
    id: "event001",
    title: "Techember Fest ’25",
    description: "Join us for an unforgettable tech experience!",
    date: "March 15, 2025",
    time: "7:00 PM",
    location: "Lagos Tech Arena",
    hostId: "user002",
    tickets: [
      { type: "Regular", price: "Free", available: 100, details: "Regular ACCESS" },
      { type: "VIP", price: 150, available: 50, details: "Vip ACCESS" },
      { type: "VVIP", price: 250, available: 20, details: "VVIP ACCESS" }
    ],
    "imageUrl": "event-banner.jpg",
    "createdAt": "2025-10-05T12:00:00Z"
  },
  {
    id: "event002",
    title: "Techember Fest ’25",
    description: "Join us for an unforgettable tech experience!",
    date: "March 15, 2025",
    time: "7:00 PM",
    location: "Lagos Tech Arena",
    hostId: "user002",
    tickets: [
      { type: "Regular", price: "Free", available: 100, details: "Regular ACCESS" },
      { type: "VIP", price: 150, available: 50, details: "Vip ACCESS" },
      { type: "VVIP", price: 250, available: 20, details: "VVIP ACCESS" }
    ],
    "imageUrl": "event-banner.jpg",
    "createdAt": "2025-10-05T12:00:00Z"
  },
  {
    id: "event003",
    title: "Techember Fest ’25",
    description: "Join us for an unforgettable tech experience!",
    date: "March 15, 2025",
    time: "7:00 PM",
    location: "Lagos Tech Arena",
    hostId: "user002",
    tickets: [
      { type: "Regular", price: "Free", available: 100, details: "Regular ACCESS" },
      { type: "VIP", price: 150, available: 50, details: "Vip ACCESS" },
      { type: "VVIP", price: 250, available: 20, details: "VVIP ACCESS" }
    ],
    "imageUrl": "event-banner.jpg",
    "createdAt": "2025-10-05T12:00:00Z"
  }
]

export type useEventsContextType = {
  events: EventType[]
  setEvents: React.Dispatch<React.SetStateAction<EventType[]>>
}

const initContextState: useEventsContextType = {
  events: [],
  setEvents: () => {}
}

const EventsContext = createContext<useEventsContextType>(initContextState)

type ChildrenType = {
  children?: ReactElement | ReactElement[]
}

export const EventsProvider = ({ children }: ChildrenType): ReactElement => {
  const [events, setEvents] = useState<EventType[]>(initState)

  return (
    <EventsContext.Provider value={{ events, setEvents }}>
      {children}
    </EventsContext.Provider>
  )
}

export default EventsContext
