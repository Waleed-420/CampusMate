import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import QuizPage from "./pages/QuizPage";
import Home from './pages/Home';
import UniversityPage from './pages/UniversityPage'; 
import ContactPage from "./pages/ContactPage";
import About from "./pages/About";
import FAQ from "./pages/Faq";
import HomePage from "./pages/HomePage";
import UniversityCompare from "./pages/UniversityCompare";
import AdminPanel from "./pages/AdminPanel";
import GlobalScholarshipAlert from "./components/GlobalScholarshipAlert"; 
import ScholarshipsPage from "./pages/ScholarshipsPage";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import UniversitySearch from "./pages/UniversitySearch";
import UniversityDetail from "./pages/UniversityDetail";
import HostelManagerPage from "./pages/HostelManagerPage";

function AppWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");
    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      setToken(tokenFromUrl);
      params.delete("token");
      const newSearch = params.toString();
      const newPath = location.pathname + (newSearch ? "?" + newSearch : "");
      navigate(newPath, { replace: true });
    }
  }, [location.search, location.pathname, navigate]);

  return (
    <>
      {location.pathname !== "/admin" && <GlobalScholarshipAlert />} 

      <Routes>
        <Route path="/" element={token ? <Navigate to="/home" /> : <Navigate to="/signin" />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/faqs" element={<FAQ />} />
        <Route path="/compare" element={<UniversityCompare />} />
        <Route path="/finder" element={< Home/>} />
        <Route path="/signin" element={<SignIn setToken={setToken} />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/home" element={token ? <HomePage /> : <Navigate to="/signin" />} />
        <Route path="/university/:id" element={<UniversityPage  />} />
        <Route path="/admin" element={<AdminPanel />} /> 
        <Route path="/hostelmanager" element={<HostelManagerPage />} />
        <Route path="/scholarships" element={<ScholarshipsPage />} /> 
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
