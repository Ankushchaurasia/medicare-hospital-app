
// export default App;
import { Routes, Route, useLocation } from 'react-router-dom'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import DoctorLogin from './pages/DoctorLogin';
import Contact from './pages/Contact';
import Doctors from './pages/Doctors';
import DoctorProfile from './pages/DoctorProfile';
import Services from './pages/Services';
import ServiceBooking from './pages/ServiceBooking';
import DoctorDashboard from './pages/DoctorDashboard';

// 👇 Ye dono import hona bahut zaroori hai 👇
import Appointment from './pages/Appointment';
import MyBookings from './pages/MyBookings';

function App() {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === '/doctor-admin/login' || location.pathname === '/doctor-dashboard';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!hideHeaderFooter && <Navbar />}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctor-admin/login" element={<DoctorLogin />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctor/:id" element={<DoctorProfile />} /> 
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceBooking />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          
          {/* 👇 YAHAN FIX HUA HAI (Sahi routes lagaye hain) 👇 */}
          <Route path="/appointments" element={<Appointment />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </main>

      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

export default App;