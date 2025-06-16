import { BrowserRouter as Router, Routes, Route, HashRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";

export default function App() {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} />
        {/* You can add more routes here later */}
      </Routes>
      <Footer/>
    </HashRouter>
  );
}
