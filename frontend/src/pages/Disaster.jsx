import React, { useState, useEffect, useRef } from 'react';
import './Disaster.css';

const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

// AUTH CHECK — uncomment when backend is ready
// import { useAuth } from '../context/AuthContext';

const disasterTypes = [
    { id: 'flood', icon: '🌊', label: 'Flood', color: '#185FA5' },
    { id: 'landslide', icon: '⛰️', label: 'Landslide', color: '#6c4e27' },
    { id: 'fire', icon: '🔥', label: 'Wildfire', color: '#e74c3c' },
    { id: 'drought', icon: '☀️', label: 'Drought', color: '#e67e22' },
    { id: 'cyclone', icon: '🌀', label: 'Cyclone', color: '#8e44ad' },
    { id: 'earthquake', icon: '🏚️', label: 'Earthquake', color: '#7f8c8d' },
    { id: 'tsunami', icon: '🌋', label: 'Tsunami', color: '#042C53' },
    { id: 'other', icon: '⚠️', label: 'Other', color: '#c0392b' },
];

const severityLevels = [
    { level: 'Low', color: '#1D9E75', desc: 'Minor impact, monitoring required' },
    { level: 'Medium', color: '#e6a817', desc: 'Moderate impact, intervention needed' },
    { level: 'High', color: '#e67e22', desc: 'Severe impact, immediate action required' },
    { level: 'Critical', color: '#e74c3c', desc: 'Life-threatening, evacuate immediately' },
];

const Disaster = () => {
    // AUTH — uncomment when backend is ready
    // const { user } = useAuth();
    // if (!user) return <Navigate to="/login" />;

    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [selectedType, setSelectedType] = useState(null);
    const [severity, setSeverity] = useState('Medium');
    const [markedLocation, setMarkedLocation] = useState(null);
    const [form, setForm] = useState({
        name: '',
        phone: '',
        description: '',
        affectedPeople: '',
        isRedZone: false,
    });

    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        const els = document.querySelectorAll('.dis-animate');
        els.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(28px)';
            setTimeout(() => {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, i * 120);
        });
    }, []);

    useEffect(() => {
        if (step === 2) {
            setTimeout(() => initMap(), 300);
        }
    }, [step]);

    const initMap = () => {
        const scriptId = 'gmap-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initDisMap`;
            script.async = true;
            document.head.appendChild(script);
        }
        window.initDisMap = () => setupMap();
        if (window.google && window.google.maps) setupMap();
    };

    useEffect(() => {
        document.title = 'Disaster Management - Public Problem Reporting System';
    }, []);

    const setupMap = () => {
        if (!mapRef.current || !window.google) return;
        const defaultCenter = { lat: 7.8731, lng: 80.7718 };

        const map = new window.google.maps.Map(mapRef.current, {
            zoom: 8,
            center: defaultCenter,
            styles: darkMapStyle,
            mapTypeControl: false,
            streetViewControl: false,
        });
        mapInstanceRef.current = map;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                map.setCenter(userLoc);
                map.setZoom(13);
            });
        }

        map.addListener('click', (e) => {
            const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
            setMarkedLocation(coords);

            if (markerRef.current) markerRef.current.setMap(null);

            markerRef.current = new window.google.maps.Marker({
                position: coords,
                map,
                title: 'Disaster Location',
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 14,
                    fillColor: '#e74c3c',
                    fillOpacity: 0.9,
                    strokeColor: '#fff',
                    strokeWeight: 3,
                },
                animation: window.google.maps.Animation.DROP,
            });

            const info = new window.google.maps.InfoWindow({
                content: `<div style="font-family:sans-serif;padding:6px"><strong>📍 Disaster Location Marked</strong><br/>Lat: ${coords.lat.toFixed(4)}, Lng: ${coords.lng.toFixed(4)}</div>`,
            });
            info.open(map, markerRef.current);
        });
    };

    const handleChange = (e) => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm({ ...form, [e.target.name]: val });
    };

    const handleSubmit = () => {
        // TODO: Connect to backend
        // await axios.post('/api/disaster', { ...form, type: selectedType, severity, location: markedLocation });
        setSubmitted(true);
    };

    const refNum = `DIS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return (
        <div className="dis-root">

            {/* HERO */}
            <section className="dis-hero dis-animate">
                <div className="dis-hero-overlay" />
                <div className="dis-hero-content">
                    <span className="dis-tag">Disaster Management</span>
                    <h1>Report a Disaster<br />or Emergency Zone</h1>
                    <p>Alert authorities, mark affected areas, and request immediate disaster response</p>
                    <div className="dis-hotlines">
                        <span>🌊 DMC Hotline: <strong>117</strong></span>
                        <span>🚨 Emergency: <strong>119</strong></span>
                        <span>🏥 Ambulance: <strong>1990</strong></span>
                    </div>
                </div>
            </section>

            {!submitted ? (
                <section className="dis-body dis-animate">
                    <div className="dis-wrap">

                        {/* STEP INDICATOR */}
                        <div className="dis-steps">
                            {['Disaster Type', 'Mark Location', 'Details & Submit'].map((s, i) => (
                                <div key={i} className={`dis-step ${step >= i + 1 ? 'active' : ''} ${step === i + 1 ? 'current' : ''}`}>
                                    <div className="dis-step-num">{i + 1}</div>
                                    <span>{s}</span>
                                </div>
                            ))}
                        </div>

                        {/* STEP 1 — DISASTER TYPE */}
                        {step === 1 && (
                            <div className="dis-card">
                                <h2>Select Disaster Type</h2>
                                <p>What type of disaster are you reporting?</p>
                                <div className="dis-type-grid">
                                    {disasterTypes.map((t) => (
                                        <div
                                            key={t.id}
                                            className={`dis-type-card ${selectedType?.id === t.id ? 'selected' : ''}`}
                                            style={{ '--dis-color': t.color }}
                                            onClick={() => setSelectedType(t)}
                                        >
                                            <span className="dis-type-icon">{t.icon}</span>
                                            <span className="dis-type-label">{t.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="dis-severity">
                                    <h3>Severity Level</h3>
                                    <div className="dis-severity-grid">
                                        {severityLevels.map((s) => (
                                            <div
                                                key={s.level}
                                                className={`dis-severity-card ${severity === s.level ? 'selected' : ''}`}
                                                style={{ '--sev-color': s.color }}
                                                onClick={() => setSeverity(s.level)}
                                            >
                                                <span className="sev-level">{s.level}</span>
                                                <span className="sev-desc">{s.desc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    className="dis-btn-primary"
                                    onClick={() => setStep(2)}
                                    disabled={!selectedType}
                                >
                                    Next: Mark Location →
                                </button>
                            </div>
                        )}

                        {/* STEP 2 — MARK LOCATION */}
                        {step === 2 && (
                            <div className="dis-card">
                                <h2>Mark Disaster Location</h2>
                                <p>Click on the map to pin the exact disaster location</p>

                                <div ref={mapRef} className="dis-map">
                                    <div className="dis-map-fallback">
                                        <p>🗺️ Map loading…</p>
                                        <p>Add Google Maps API key in Disaster.jsx</p>
                                    </div>
                                </div>

                                {markedLocation && (
                                    <div className="dis-coords">
                                        📍 Location marked: {markedLocation.lat.toFixed(4)}, {markedLocation.lng.toFixed(4)}
                                    </div>
                                )}

                                <div className="dis-btn-row">
                                    <button className="dis-btn-ghost" onClick={() => setStep(1)}>← Back</button>
                                    <button
                                        className="dis-btn-primary"
                                        onClick={() => setStep(3)}
                                        disabled={!markedLocation}
                                    >
                                        Next: Add Details →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3 — DETAILS */}
                        {step === 3 && (
                            <div className="dis-card">
                                <h2>Disaster Details</h2>
                                <p>Provide more information to help authorities respond effectively</p>

                                <div className="dis-form-grid">
                                    <div className="dis-field">
                                        <label>Your Name *</label>
                                        <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" />
                                    </div>
                                    <div className="dis-field">
                                        <label>Phone Number *</label>
                                        <input name="phone" value={form.phone} onChange={handleChange} placeholder="0711234567" />
                                    </div>
                                </div>

                                <div className="dis-field">
                                    <label>Estimated People Affected</label>
                                    <input name="affectedPeople" value={form.affectedPeople} onChange={handleChange} placeholder="e.g. 50 families" />
                                </div>

                                <div className="dis-field">
                                    <label>Description *</label>
                                    <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe the situation in detail — water level, damage, injuries, etc." />
                                </div>

                                <div className="dis-redzone">
                                    <input type="checkbox" id="redzone" name="isRedZone" checked={form.isRedZone} onChange={handleChange} />
                                    <label htmlFor="redzone">
                                        <span className="redzone-badge">🔴 Mark as Red Zone</span>
                                        <span>This area is extremely dangerous and requires immediate evacuation</span>
                                    </label>
                                </div>

                                <div className="dis-review">
                                    <div className="dis-review-row"><span>Disaster Type</span><strong>{selectedType?.icon} {selectedType?.label}</strong></div>
                                    <div className="dis-review-row"><span>Severity</span><strong>{severity}</strong></div>
                                    <div className="dis-review-row"><span>Location</span><strong>{markedLocation ? `${markedLocation.lat.toFixed(4)}, ${markedLocation.lng.toFixed(4)}` : 'Not marked'}</strong></div>
                                </div>

                                <div className="dis-btn-row">
                                    <button className="dis-btn-ghost" onClick={() => setStep(2)}>← Back</button>
                                    <button
                                        className="dis-btn-primary"
                                        onClick={handleSubmit}
                                        disabled={!form.name || !form.phone || !form.description}
                                    >
                                        🚨 Submit Disaster Report
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </section>
            ) : (
                <section className="dis-success dis-animate">
                    <div className="dis-success-card">
                        <div className="dis-success-icon">✅</div>
                        <h2>Report Submitted!</h2>
                        <p>Your disaster report reference number:</p>
                        <div className="dis-ref">{refNum}</div>
                        {form.isRedZone && (
                            <div className="dis-redzone-alert">
                                🔴 Red Zone alert has been sent to DMC authorities
                            </div>
                        )}
                        <p className="dis-ref-note">
                            Authorities have been notified. For immediate danger call <strong>117</strong>.
                        </p>
                        <button className="dis-btn-primary" onClick={() => { setSubmitted(false); setStep(1); setSelectedType(null); setMarkedLocation(null); setForm({ name: '', phone: '', description: '', affectedPeople: '', isRedZone: false }); }}>
                            Submit Another Report
                        </button>
                    </div>
                </section>
            )}

        </div>
    );
};

const darkMapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#0e1a2b' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#0e1a2b' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a2d44' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#185FA5' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#042C53' }] },
];

export default Disaster;