import React from 'react';
import DepartmentPage from './pages/DepartmentPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Services from './pages/Services';
import Departments from './pages/Departments';
import Emergency from './pages/Emergency';
import Disaster from './pages/Disaster';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Feedback from './pages/Feedback';
import AgentDashboard from "./pages/AgentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
    return (
        <Router>
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/departments" element={<Departments />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/report/:dept" element={<DepartmentPage />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/emergency" element={<Emergency />} />
                    <Route path="/disaster" element={<Disaster />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/feedback" element={<Feedback />} />
                    <Route path="/agent" element={<AgentDashboard />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    );
}

export default App;