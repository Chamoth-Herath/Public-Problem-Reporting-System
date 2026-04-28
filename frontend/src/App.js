import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Departments from './pages/Departments';
import About from './pages/About';

function App() {
    return (
        <Router>
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/departments" element={<Departments />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    );
}

export default App;