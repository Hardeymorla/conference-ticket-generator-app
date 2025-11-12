// src/pages/CreateEvent.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router";
import useEvents from "../components/hooks/UseEvents"; 
import { v4 as uuidv4 } from "uuid"; 
import type { EventType, TicketTypes } from "../components/context/EventsProvider";

// const generateHostId = (): string => {
//     const randomNum = Math.floor(Math.random() * 100000);
//     // const timestamp = Date.now().toString().slice(-5);
//     return `host_${randomNum.toString().padStart(5, '0')}`;
// };
  
const defaultTicket = (): TicketTypes => ({
  type: "Regular",
  price: "Free",
  available: 100,
  details: "General admission",
});

const CreateEvent = () => {
  const navigate = useNavigate();
  const { addEvent } = useEvents();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(""); // e.g. 2025-03-15
  const [time, setTime] = useState(""); // e.g. 19:00
  const [location, setLocation] = useState("");
  const [tickets, setTickets] = useState<TicketTypes[]>([defaultTicket()]);
  const [imageBase64, setImageBase64] = useState<string | undefined>();
  const [hostId] = useState("host_002"); // replace with currentUser?.id when you have auth

  const onAddTicket = () => setTickets((t) => [...t, defaultTicket()]);
  const onRemoveTicket = (index: number) =>
    setTickets((t) => t.filter((_, i) => i !== index));
  const onUpdateTicket = (index: number, partial: Partial<TicketTypes>) =>
    setTickets((t) => t.map((tk, i) => (i === index ? { ...tk, ...partial } : tk)));
  

  const handleImage = (file?: File) => {
    if (!file) return setImageBase64(undefined);
    const reader = new FileReader();
    reader.onload = () => setImageBase64(reader.result as string);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    if (!title.trim()) return "Title required";
    if (!date || !time) return "Date and time required";
    if (!location.trim()) return "Location required";
    // you can add more validation for tickets etc.
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
      date: date,
      time: time,
      location: location.trim(),
      hostId,
      tickets,
      imageUrl: imageBase64, // store base64 for now, or a filename
      createdAt: new Date().toISOString(),
    };

    try {
      addEvent(newEvent);
      alert("Event created");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to create event");
    }
  };

  return (
    <main className="main create-event-page">
      <header className="ticketheader">
        <h2>Create Event</h2>
      </header>

      <form className="ticketwrapper" onSubmit={handleSubmit}>
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <label>Time</label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />

        <label>Location</label>
        <input value={location} onChange={(e) => setLocation(e.target.value)} />

        <label>Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImage(e.target.files ? e.target.files[0] : undefined)}
        />
        {imageBase64 && <img src={imageBase64} alt="preview" style={{ width: 120 }} />}

        <fieldset style={{ marginTop: 12 }}>
          <legend>Tickets</legend>
          {tickets.map((t, i) => (
            <div key={i} style={{ display: "grid", gap: 6, marginBottom: 8 }}>
              <input
                placeholder="Ticket type (e.g. VIP)"
                value={t.type}
                onChange={(e) => onUpdateTicket(i, { type: e.target.value })}
              />
              <input
                placeholder="Price (enter Free or number)"
                value={String(t.price)}
                onChange={(e) => {
                  const val = e.target.value.trim();
                  const price = val.toLowerCase() === "free" ? "Free" : Number(val || 0);
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
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={() => onRemoveTicket(i)} disabled={tickets.length === 1}>
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={onAddTicket}>Add ticket type</button>
        </fieldset>

        <section className="btnwrapper" style={{ marginTop: 12 }}>
          <button type="button" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit">Create Event</button>
        </section>
      </form>
    </main>
  );
};

export default CreateEvent;
