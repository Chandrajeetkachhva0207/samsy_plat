import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Ecosystem from "./pages/Ecosystem.jsx";
import SMZToken from "./pages/SMZToken.jsx";
import SM9Project from "./pages/SM9Project.jsx";
import BlockchainExplorer from "./pages/BlockchainExplorer.jsx";
import Roadmap from "./pages/Roadmap.jsx";
import Whitepaper from "./pages/Whitepaper.jsx";
import News from "./pages/News.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/ecosystem" element={<Ecosystem />} />
          <Route path="/smz-token" element={<SMZToken />} />
          <Route path="/sm9-project" element={<SM9Project />} />
          <Route path="/blockchain-explorer" element={<BlockchainExplorer />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/whitepaper" element={<Whitepaper />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
