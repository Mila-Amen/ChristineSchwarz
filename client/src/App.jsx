import {
  BrowserRouter as Router,
  Routes,
  Route,
  HashRouter,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import ShopPage from "./pages/Shop";
import ConsultationPage from "./pages/Consultation";
import ConsultationDetails from "./components/ConsultationDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import EbookDetailsPage from "./components/EbookDetails";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import CartPage from "./pages/CartPage";
import PaidEbookDetails from "./components/PaidEbookDetails";
import CheckoutPage from "./pages/CheckoutPage";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="/ebook-details" element={<EbookDetailsPage />} />
        <Route path="/ebook-details-paid" element={<PaidEbookDetails />} />
        <Route path="/consultation" element={<ConsultationPage />} />
        <Route path="/consultation/:id" element={<ConsultationDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
      <Footer />
    </>
  );
}
