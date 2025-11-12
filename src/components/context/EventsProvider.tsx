import { createContext, useState, useEffect, type ReactElement } from "react";
import axios from "axios";

export type TicketTypes = {
  type: string;
  price: number | "Free";
  available: number | "string";
  details: string;
};

export type EventType = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  hostId: string;
  tickets: TicketTypes[];
  imageUrl?: string; // filename or base64
  createdAt: string;
};

export type UseEventsContextType = {
  events: EventType[];
  addEvent: (e: EventType) => void;
  updateEvent: (id: string, changes: Partial<EventType>) => void;
  deleteEvent: (id: string) => void;
  refreshEvents: () => Promise<void>;
};

const initContext: UseEventsContextType = {
  events: [],
  addEvent: () => {},
  updateEvent: () => {},
  deleteEvent: () => {},
  refreshEvents: async () => {},
};

const EventsContext = createContext<UseEventsContextType>(initContext);

type ChildrenType = { children?: ReactElement | ReactElement[] };

const API_URL =  "http://localhost:3000" as string;

export const EventsProvider = ({ children }: ChildrenType): ReactElement => {
  const [events, setEvents] = useState<EventType[]>([]);

  // fetch events from json-server
  const refreshEvents = async () => {
    try {
      const res = await axios.get<EventType[]>(
        `${API_URL}/events?_sort=createdAt&_order=desc`
      );
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  useEffect(() => {
    refreshEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // add event to API and local state
  const addEvent = async (event: EventType) => {
    try {
      const res = await axios.post<EventType>(`${API_URL}/events`, event);
      setEvents((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Failed to create event:", err);
      // fallback to local only
      setEvents((prev) => [event, ...prev]);
    }
  };

  // update event
  const updateEvent = async (id: string, changes: Partial<EventType>) => {
    try {
      const res = await axios.patch<EventType>(`${API_URL}/events/${id}`, changes);
      setEvents((prev) => prev.map((ev) => (ev.id === id ? res.data : ev)));
    } catch (err) {
      console.error("Failed to update event:", err);
      setEvents((prev) => prev.map((ev) => (ev.id === id ? { ...ev, ...changes } : ev)));
    }
  };

  // delete event
  const deleteEvent = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/events/${id}`);
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
    } catch (err) {
      console.error("Failed to delete event:", err);
      setEvents((prev) => prev.filter((ev) => ev.id !== id)); // best-effort
    }
  };

  return (
    <EventsContext.Provider
      value={{ events, addEvent, updateEvent, deleteEvent, refreshEvents }}
    >
      {children}
    </EventsContext.Provider>
  );
};

export default EventsContext;
