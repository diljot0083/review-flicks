import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Review from "./components/reviewForm/Review";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <>
      <NavBar />

      <div style={{ minHeight: "80vh", paddingTop: "2px", maxWidth: "1200px", margin: "0 auto" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/review/:id" element={<Review />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default App;
