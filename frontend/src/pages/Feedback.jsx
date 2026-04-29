import React, { useState, useEffect, useRef } from 'react';
import './Feedback.css';

const Feedback = () => {
    const [form, setForm] = useState({ name: '', email: '', category: '', message: '', rating: 0 });
    const [submitted, setSubmitted] = useState(false);
    const [heroVisible, setHeroVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const formRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        setTimeout(() => setHeroVisible(true), 100);

        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setFormVisible(true); },
            { threshold: 0.1 }
        );
        if (formRef.current) observer.observe(formRef.current);
        return () => observer.disconnect();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="feedback-page">

            {/* HERO */}
            <div className={`feedback-hero ${heroVisible ? 'visible' : ''}`}>
                <div className="feedback-hero-content">
                    <span className="feedback-badge">💬 Feedback</span>
                    <h1>Share Your Experience</h1>
                    <p>Help us improve the Public Problem Reporting System for all Sri Lankan citizens.</p>
                </div>
            </div>

            {/* FORM */}
            <div className="feedback-body">
                <div
                    ref={formRef}
                    className={`feedback-container ${formVisible ? 'visible' : ''}`}
                >
                    {submitted ? (
                        <div className="feedback-success">
                            <div className="success-icon">✅</div>
                            <h2>Thank You!</h2>
                            <p>Your feedback has been submitted successfully. We appreciate your time and will use it to improve our system.</p>
                            <button
                                className="feedback-again-btn"
                                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', category: '', message: '', rating: 0 }); }}
                            >
                                Submit Another
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="feedback-form-header">
                                <h2>We'd love to hear from you</h2>
                                <p>Your feedback helps us serve citizens better</p>
                            </div>

                            <form onSubmit={handleSubmit} className="feedback-form">

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Your Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Enter your name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        <option value="general">General Feedback</option>
                                        <option value="complaint">Complaint Resolution</option>
                                        <option value="ui">Website Experience</option>
                                        <option value="suggestion">Suggestion</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Rate Your Experience</label>
                                    <div className="star-rating">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                className={`star ${form.rating >= star ? 'active' : ''}`}
                                                onClick={() => setForm({ ...form, rating: star })}
                                            >★</span>
                                        ))}
                                        <span className="rating-label">
                                            {form.rating === 1 && 'Poor'}
                                            {form.rating === 2 && 'Fair'}
                                            {form.rating === 3 && 'Good'}
                                            {form.rating === 4 && 'Very Good'}
                                            {form.rating === 5 && 'Excellent!'}
                                        </span>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Your Message</label>
                                    <textarea
                                        name="message"
                                        placeholder="Tell us about your experience..."
                                        value={form.message}
                                        onChange={handleChange}
                                        rows={5}
                                        required
                                    />
                                </div>

                                <button type="submit" className="feedback-submit">
                                    Submit Feedback →
                                </button>

                            </form>
                        </>
                    )}
                </div>

                {/* SIDE INFO */}
                <div className={`feedback-info ${formVisible ? 'visible' : ''}`}>
                    {[
                        { icon: '⚡', title: 'Quick Response', desc: 'We review all feedback within 24 hours' },
                        { icon: '🔒', title: 'Confidential', desc: 'Your feedback is kept private and secure' },
                        { icon: '🎯', title: 'Actionable', desc: 'Every suggestion is reviewed by our team' },
                        { icon: '🌍', title: 'Make a Difference', desc: 'Your input shapes public services in Sri Lanka' },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="info-card"
                            style={{ transitionDelay: `${i * 0.1 + 0.3}s` }}
                        >
                            <span className="info-icon">{item.icon}</span>
                            <div>
                                <h4>{item.title}</h4>
                                <p>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Feedback;