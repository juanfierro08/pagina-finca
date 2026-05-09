import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import PropertyDetails from './pages/PropertyDetails';
import CreateProperty from './pages/CreateProperty';
import Checkout from './pages/Checkout';
import BookingCheckout from './pages/BookingCheckout';
import Messages from './pages/Messages';
import HostDashboard from './pages/HostDashboard';
import GuestDashboard from './pages/GuestDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Success from './pages/Success';
import BoostCheckout from './pages/BoostCheckout';
import './index.css'; // Global styles

const initialOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || "sb", // "sb" es el sandbox por defecto
    currency: "USD",
    intent: "capture",
};

function App() {
  return (
    <PayPalScriptProvider options={initialOptions}>
      <AuthProvider>
        <CurrencyProvider>
          <Router>
        <div className="app-wrapper">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/host-dashboard" element={<HostDashboard />} />
            <Route path="/guest-dashboard" element={<GuestDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/create-listing" element={<CreateProperty />} />
            <Route path="/checkout/:id" element={<Checkout />} />
            <Route path="/book/:id" element={<BookingCheckout />} />
            <Route path="/boost/:id" element={<BoostCheckout />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        </div>
      </Router>
        </CurrencyProvider>
      </AuthProvider>
    </PayPalScriptProvider>
  );
}

export default App;
