import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import Confirm from "./pages/Confirm";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";



export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/admin" element={<Admin />} />
<Route path="/admin-login" element={<AdminLogin />} />


      </Routes>
    </>
  );
}
