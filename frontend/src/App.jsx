import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminPerformers from "./pages/admin/AdminPerformers";
import AdminHome from "./pages/admin/AdminHome";
import AdminEvents from "./pages/admin/AdminEvents";
import "./App.css";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Events from "./pages/Events";
import BookEvent from "./pages/BookEvent";
import PerformHere from "./pages/PerformHere";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
      <main className="site">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/book-event" element={<BookEvent />} />
          <Route path="/perform" element={<PerformHere />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/performers" element={<AdminPerformers />}/>
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/events" element={<AdminEvents />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;