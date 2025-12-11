import { createContext, useState, useEffect, type ReactElement } from "react";
import api from "../../api/axios"; // your custom axios instance
import useFetch from "../hooks/useFetch";

export type TicketTypes = {
  type: string;
  price: number | "Free";
  available: number;
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
  imageUrl?: string;
  createdAt: string;
};

export type UseEventsContextType = {
  events: EventType[];
  addEvent: (e: EventType) => Promise<void>;
  updateEvent: (id: string, changes: Partial<EventType>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  refreshEvents: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

const EventsContext = createContext<UseEventsContextType>({
  events: [],
  addEvent: async () => {},
  updateEvent: async () => {},
  deleteEvent: async () => {},
  refreshEvents: async () => {},
  loading: false,
  error: null,
});

type ChildrenType = { children?: ReactElement | ReactElement[] };

export const EventsProvider = ({ children }: ChildrenType): ReactElement => {
  /**
   * 1️⃣ Fetch events using your custom React hook
   *    Only pass endpoint — baseURL already exists in axios.ts
   */
  const {
    data: fetchedEvents,
    loading,
    error,
    refetch,
  } = useFetch<EventType[]>("/events?_sort=createdAt&_order=desc");

  /**
   * 2️⃣ Local state so UI updates instantly
   */
  const [events, setEvents] = useState<EventType[]>([]);

  /**
   * 3️⃣ Sync fetched events → local state
   */
  useEffect(() => {
    if (fetchedEvents) {
      setEvents(fetchedEvents);
    }
  }, [fetchedEvents]);

  /**
   * 4️⃣ Refresh events from API
   */
  const refreshEvents = async () => {
    await refetch();
  };

  /**
   * 5️⃣ Create event
   */
  const addEvent = async (event: EventType) => {
    try {
      const res = await api.post<EventType>("/events", event);
      setEvents((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Failed to add event:", err);
    }
  };

  /**
   * 6️⃣ Update event
   */
  const updateEvent = async (id: string, changes: Partial<EventType>) => {
    try {
      const res = await api.patch<EventType>(`/events/${id}`, changes);
      setEvents((prev) =>
        prev.map((ev) => (ev.id === id ? res.data : ev))
      );
    } catch (err) {
      console.error("Failed to update event:", err);
    }
  };

  /**
   * 7️⃣ Delete event
   */
  const deleteEvent = async (id: string) => {
    try {
      await api.delete(`/events/${id}`);
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
    } catch (err) {
      console.error("Failed to delete event:", err);
    }
  };

  /**
   * 8️⃣ Provide context
   */
  return (
    <EventsContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        refreshEvents,
        loading,
        error,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};

export default EventsContext;
