import { BrowserRouter as Router, Routes, Route, HashRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import ShopPage from "./pages/Shop";
import ConsultationPage from "./pages/Consultation";

export default function App() {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/consultation" element={<ConsultationPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

      </Routes>
      <Footer/>
    </HashRouter>
  );
}
