import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
<<<<<<< HEAD
=======
import Services from './pages/Services';
import Departments from './pages/Departments';

>>>>>>> 341ed2973c5840a1da28078cd41bca5a5a1771e9

function App() {
    return (
        <Router>
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
<<<<<<< HEAD
=======
                    <Route path="/departments" element={<Departments />} />
                    <Route path="/services" element={<Services />} />
>>>>>>> 341ed2973c5840a1da28078cd41bca5a5a1771e9
                </Routes>
            </main>
            <Footer />
        </Router>
    );
}

export default App;