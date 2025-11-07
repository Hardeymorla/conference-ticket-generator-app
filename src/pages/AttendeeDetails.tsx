import { useState, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router";
import useBookings from "../components/hooks/UseBookings";
import useAuth from "../components/hooks/UseAuth";
import useEvents from "../components/hooks/UseEvents";
import { CloudUpload } from "lucide-react";
import "./AttendeeDetails.css";

function AttendeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentBooking, setCurrentBooking } = useBookings();
  const { currentUser } = useAuth();
  const { events } = useEvents();

  console.log(id);
  const event = events.find((ev) => ev.id === id);

  const [formData, setFormData] = useState({
    image: "",
    fullName: "",
    email: "",
    specialRequest: "",
  });

  const [errors, setErrors] = useState({
    fullName: false,
    email: false,
  });

  if (!currentUser) {
    alert("Please register or log in to book a ticket.");
    navigate("/login");
  }

  if (!event || !currentBooking) {
    return (
      <div className="event-not-found">
        <p>Selected Ticket missing. Please start booking again.</p>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () =>
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    const nameParts = formData.fullName.trim().split(" ").filter(Boolean);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {
      fullName: nameParts.length < 2,
      email: formData.email.trim() === "" || !emailRegex,
    };

    setErrors(newErrors);

    if (newErrors.fullName || newErrors.email) return;

    // Save attendee info into booking context
    setCurrentBooking((prev) => ({
      ...prev!,
      attendeeImage: formData.image,
      attendeeName: formData.fullName,
      attendeeEmail: formData.email,
      specialRequest: formData.specialRequest,
    }));

    navigate(`/booking/${id}/payment`);
  };
  console.log(currentBooking);

  const handleBack = () => navigate(`/booking/${id}/ticket`);

  return (
    <main className="main">
      <header className="ticketheader">
        <h2>Attendee Details</h2>
        <p className="small">Step 2/3</p>
      </header>

      <div className="ticketwrapper">
        <form className="attendee-form" onSubmit={(e) => e.preventDefault()}>
          <div className="ticketinfo ticketimg">
            <section className="upload-container">
              <label className="upload-box">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="upload-preview"
                  />
                ) : (
                  <>
                    <CloudUpload className="upload-icon" size={40} />
                    <p>Drag & drop or click to upload</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  hidden
                />
              </label>
            </section>
          </div>
          <label htmlFor="fullName">Name</label>
          {errors.fullName && (
            <p className="error">Please enter your first and last name</p>
          )}
          <input
            type="text"
            name="fullName"
            id="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          {errors.email && (
            <p className="error">Please enter a valid Email Address</p>
          )}
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="specialRequest">Special Request (optional)</label>
          <textarea
            id="specialRequest"
            name="specialRequest"
            value={formData.specialRequest}
            onChange={handleChange}
            rows={4}
          />

          <section className="btnwrapper">
            <button type="button" onClick={handleBack}>
              Back
            </button>
            <button type="button" onClick={handleNext}>
              Next
            </button>
          </section>
        </form>
      </div>
    </main>
  );
}

export default AttendeeDetails;
