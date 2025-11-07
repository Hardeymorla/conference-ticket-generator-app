import Header from "./components/Header";
import Home from "./pages/Home";
import MainTicket from "./pages/MainTicket";
import AttendeeDetails from "./pages/AttendeeDetails";
import Payment from "./pages/Payment";
import TicketReady from "./pages/TicketReady";
import Register from "./pages/Register";
import Login from "./pages/Login";

import { Route, Routes } from "react-router";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="booking/:id/ticket" element={<MainTicket />} />
        <Route path="booking/:id/attendee" element={<AttendeeDetails />} />
        <Route path="booking/:id/payment" element={<Payment />} />
        <Route path="booking/:id/ticket-ready" element={<TicketReady />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
