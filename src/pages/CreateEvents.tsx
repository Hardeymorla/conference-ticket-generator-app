// src/pages/CreateEvent.tsx
import { useState } from "react";
import { useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";
import useEvents from "../components/hooks/UseEvents";
import type { EventType, TicketTypes } from "../components/context/EventsProvider";
import api from "../api/axios";
// import axios from "axios";
import { uploadImageToCloudinary } from "../utils/uploadImage";
import "./CreateEvents.css";

const defaultTicket = (): TicketTypes => ({
  type: "Regular",
  price: "Free",
  available: 100,
  details: "General admission",
});

export default function CreateEvent() {
  const navigate = useNavigate();
  const { refreshEvents } = useEvents();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [tickets, setTickets] = useState<TicketTypes[]>([defaultTicket()]);
  const [imageBase64, setImageBase64] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  // const handleImage = (file?: File) => {
  //   if (!file) return setImageBase64(undefined);
  //   const reader = new FileReader();
  //   reader.onload = () => setImageBase64(reader.result as string);
  //   reader.readAsDataURL(file);
  // };
  
  const handleImage = async (file?: File) => {
    if (!file) return setImageBase64(undefined);
  
    try {
      setImageBase64("uploading...");
  
      const imageUrl = await uploadImageToCloudinary(file);
  
      setImageBase64(imageUrl); // NOW THIS IS A STRING URL 🌟
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    }
  };
  
  

  const validate = () => {
    if (!title.trim()) return "Title is required.";
    if (!date || !time) return "Please select a date and time.";
    if (!location.trim()) return "Location is required.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) return alert(err);

    const newEvent: EventType = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim(),
      date,
      time,
      location: location.trim(),
      hostId: "host_001",
      tickets,
      imageUrl: imageBase64,
      createdAt: new Date().toISOString(),
    };

    try {
      setSubmitting(true);

      // wake up backend
      await api.get("/events");

      // POST directly to backend
      await api.post("/events", newEvent);
      // await axios.post("/https://conference-ticket-generator-json-backend.onrender.com/events", newEvent);

      // reload events into context
      await refreshEvents();

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Failed to create event. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const onAddTicket = () => setTickets((t) => [...t, defaultTicket()]);
  const onRemoveTicket = (index: number) =>
    setTickets((t) => t.filter((_, i) => i !== index));
  const onUpdateTicket = (index: number, partial: Partial<TicketTypes>) =>
    setTickets((t) => t.map((tk, i) => (i === index ? { ...tk, ...partial } : tk)));

  return (
    <main className="create-event-page">
      <h1 className="create-title">Create Event</h1>

      <form className="create-form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

        <div className="row">
          <div>
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div>
            <label>Time</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>

        <label>Location</label>
        <input value={location} onChange={(e) => setLocation(e.target.value)} />

        <label>Event Image (optional)</label>
        <input type="file" accept="image/*" onChange={(e) => handleImage(e.target.files?.[0])} />
        {imageBase64 && <img className="preview-img" src={imageBase64} alt="preview" />}

        <fieldset className="ticket-section">
          <legend>Tickets</legend>

          {tickets.map((t, i) => (
            <div className="ticket-item" key={i}>
              <input
                placeholder="Ticket type"
                value={t.type}
                onChange={(e) => onUpdateTicket(i, { type: e.target.value })}
              />

              <input
                placeholder="Price"
                value={String(t.price)}
                onChange={(e) => {
                  const val = e.target.value.trim();
                  const price = val.toLowerCase() === "free" ? "Free" : Number(val);
                  onUpdateTicket(i, { price });
                }}
              />

              <input
                type="number"
                placeholder="Available"
                value={t.available}
                onChange={(e) => onUpdateTicket(i, { available: Number(e.target.value) })}
              />

              <input
                placeholder="Details"
                value={t.details}
                onChange={(e) => onUpdateTicket(i, { details: e.target.value })}
              />

              <button
                type="button"
                className="remove-btn"
                onClick={() => onRemoveTicket(i)}
                disabled={tickets.length === 1}
              >
                Remove
              </button>
            </div>
          ))}

          <button type="button" className="add-ticket-btn" onClick={onAddTicket}>
            Add Ticket Type
          </button>
        </fieldset>

        <div className="btn-group">
          <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
            Cancel
          </button>

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Submitting..." : "Create Event"}
          </button>
        </div>
      </form>
    </main>
  );
}
