import React, { useState, useEffect, useRef } from 'react';
import './Disaster.css';

// AUTH CHECK — uncomment when backend is ready
// import { useAuth } from '../context/AuthContext';

const disasterTypes = [
    { id: 'flood',      icon: '🌊', label: 'Flood',       color: '#185FA5' },
    { id: 'landslide',  icon: '⛰️', label: 'Landslide',   color: '#6c4e27' },
    { id: 'fire',       icon: '🔥', label: 'Wildfire',    color: '#e74c3c' },
    { id: 'drought',    icon: '☀️', label: 'Drought',     color: '#e67e22' },
    { id: 'cyclone',    icon: '🌀', label: 'Cyclone',     color: '#8e44ad' },
    { id: 'earthquake', icon: '🏚️', label: 'Earthquake',  color: '#7f8c8d' },
    { id: 'tsunami',    icon: '🌋', label: 'Tsunami',     color: '#042C53' },
    { id: 'other',      icon: '⚠️', label: 'Other',       color: '#c0392b' },
];

const severityLevels = [
    { level: 'Low',      color: '#1D9E75', desc: 'Minor impact, monitoring required' },
    { level: 'Medium',   color: '#e6a817', desc: 'Moderate impact, intervention needed' },
    { level: 'High',     color: '#e67e22', desc: 'Severe impact, immediate action required' },
    { level: 'Critical', color: '#e74c3c', desc: 'Life-threatening, evacuate immediately' },
];

/* ─────────────────────────────────────────────
   LEAFLET CLICK-TO-PIN MAP
───────────────────────────────────────────── */
const DisasterMap = ({ onLocationSelect, selectedType }) => {
    const containerRef = useRef(null);
    const mapRef       = useRef(null);
    const markerRef    = useRef(null);
    const [mapStatus, setMapStatus] = useState('loading');
    const [address, setAddress]     = useState('');

    const accentColor = selectedType?.color || '#e74c3c';

    useEffect(() => {
        // ── Inject Leaflet CSS from Cloudflare CDN ──
        if (!document.getElementById('leaflet-css')) {
            const link = document.createElement('link');
            link.id  = 'leaflet-css';
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
            document.head.appendChild(link);
        }

        const boot = () => {
            if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
            if (!containerRef.current) return;
            delete containerRef.current._leaflet_id;

            const L = window.L;

            const map = L.map(containerRef.current, {
                center: [7.8731, 80.7718],
                zoom: 8,
                zoomControl: true,
                scrollWheelZoom: true,
            });
            mapRef.current = map;

            // CartoDB Dark Matter — free, no API key
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 19,
            }).addTo(map);

            // User location dot
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(pos => {
                    const c = [pos.coords.latitude, pos.coords.longitude];
                    map.setView(c, 13);

                    const userIcon = L.divIcon({
                        html: `<div style="
                            width:14px;height:14px;
                            background:#1D9E75;
                            border:3px solid #fff;
                            border-radius:50%;
                            box-shadow:0 0 0 5px rgba(29,158,117,.25)">
                        </div>`,
                        className: '',
                        iconSize: [14, 14],
                        iconAnchor: [7, 7],
                    });
                    L.marker(c, { icon: userIcon })
                        .addTo(map)
                        .bindPopup('<b>📍 Your Location</b>')
                        .openPopup();
                });
            }

            // Click to pin disaster location
            map.on('click', async (e) => {
                const { lat, lng } = e.latlng;

                if (markerRef.current) map.removeLayer(markerRef.current);

                const pinIcon = L.divIcon({
                    html: `
                        <div style="position:relative;width:36px;height:36px">
                            <div style="
                                position:absolute;top:0;left:0;
                                width:36px;height:36px;
                                background:${accentColor};
                                border-radius:50% 50% 50% 0;
                                transform:rotate(-45deg);
                                border:3px solid #fff;
                                box-shadow:0 4px 14px rgba(0,0,0,.5)">
                            </div>
                            <div style="
                                position:absolute;top:8px;left:8px;
                                font-size:14px;
                                transform:rotate(45deg)">
                                ${selectedType?.icon || '⚠️'}
                            </div>
                        </div>`,
                    className: '',
                    iconSize: [36, 36],
                    iconAnchor: [18, 36],
                });

                const marker = L.marker([lat, lng], { icon: pinIcon }).addTo(map);
                markerRef.current = marker;

                // Reverse geocode with Nominatim (free)
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
                        { headers: { 'Accept-Language': 'en' } }
                    );
                    const data = await res.json();
                    const addr = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
                    setAddress(addr);
                    marker.bindPopup(
                        `<div style="font-family:sans-serif;min-width:180px;padding:4px">
                            <strong style="color:#e74c3c">${selectedType?.icon || '⚠️'} Disaster Location</strong><br/>
                            <span style="font-size:.78rem;color:#555">${addr}</span>
                        </div>`
                    ).openPopup();
                    onLocationSelect({ lat, lng, address: addr });
                } catch {
                    const fallbackAddr = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
                    setAddress(fallbackAddr);
                    onLocationSelect({ lat, lng, address: fallbackAddr });
                }
            });

            // Instruction overlay
            const instructionDiv = L.control({ position: 'topright' });
            instructionDiv.onAdd = () => {
                const div = L.DomUtil.create('div');
                div.innerHTML = `
                    <div style="
                        background:rgba(7,15,26,.88);
                        border:1px solid rgba(181,212,244,.2);
                        border-radius:8px;
                        padding:8px 12px;
                        font-family:sans-serif;
                        font-size:.78rem;
                        color:#B5D4F4;
                        pointer-events:none">
                        🖱️ Click on map to pin location
                    </div>`;
                return div;
            };
            instructionDiv.addTo(map);

            setMapStatus('ready');
        };

        // ── Load Leaflet JS from Cloudflare CDN ──
        if (!window.L) {
            if (!document.getElementById('leaflet-js')) {
                const s = document.createElement('script');
                s.id          = 'leaflet-js';
                s.src         = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
                s.crossOrigin = 'anonymous';
                s.onload      = boot;
                document.head.appendChild(s);
            } else {
                const t = setInterval(() => {
                    if (window.L) { clearInterval(t); boot(); }
                }, 80);
            }
        } else {
            boot();
        }

        return () => {
            if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
        };
    }, []); // mount once only

    return (
        <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(181,212,244,.15)' }}>
            {mapStatus === 'loading' && (
                <div className="dis-map-loading">
                    <div className="dis-map-spinner" />
                    <p>Loading map…</p>
                </div>
            )}
            <div
                ref={containerRef}
                className="dis-map"
                style={{ opacity: mapStatus === 'loading' ? 0 : 1, transition: 'opacity .4s' }}
            />
            {address && (
                <div className="dis-coords">📍 {address}</div>
            )}
        </div>
    );
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const Disaster = () => {
    const [step, setStep]                     = useState(1);
    const [submitted, setSubmitted]           = useState(false);
    const [selectedType, setSelectedType]     = useState(null);
    const [severity, setSeverity]             = useState('Medium');
    const [markedLocation, setMarkedLocation] = useState(null);
    const [form, setForm] = useState({
        name: '', phone: '', description: '', affectedPeople: '', isRedZone: false,
    });

    useEffect(() => {
        document.title = 'Disaster Management - Public Problem Reporting System';
        const els = document.querySelectorAll('.dis-animate');
        els.forEach((el, i) => {
            el.style.opacity   = '0';
            el.style.transform = 'translateY(28px)';
            setTimeout(() => {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                el.style.opacity    = '1';
                el.style.transform  = 'translateY(0)';
            }, i * 120);
        });
    }, []);

    const handleChange = e => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm({ ...form, [e.target.name]: val });
    };

    const handleSubmit = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/disaster', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type:           selectedType,        // ← send the whole object, not selectedType.label
                    severity,
                    location:       markedLocation,
                    name:           form.name,           // ← name not reporterName
                    phone:          form.phone,
                    description:    form.description,
                    affectedPeople: form.affectedPeople,
                    isRedZone:      form.isRedZone,
                })
            });
            const data = await res.json();
            if (res.ok) {
                refNum.current = data.refNumber || refNum.current;
                setSubmitted(true);
            } else {
                alert('Failed: ' + data.message);
            }
        } catch (err) {
            alert('Server error. Is backend running?');
        }
    };

    const resetForm = () => {
        setSubmitted(false); setStep(1); setSelectedType(null);
        setMarkedLocation(null);
        setForm({ name: '', phone: '', description: '', affectedPeople: '', isRedZone: false });
    };

    const refNum = useRef(`DIS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);

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
                            <div className="dis-card dis-animate">
                                <h2>Select Disaster Type</h2>
                                <p>What type of disaster are you reporting?</p>
                                <div className="dis-type-grid">
                                    {disasterTypes.map(t => (
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
                                        {severityLevels.map(s => (
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
                            <div className="dis-card dis-animate">
                                <h2>📍 Mark Disaster Location</h2>
                                <p>Click anywhere on the map to pin the exact disaster location</p>

                                <DisasterMap
                                    onLocationSelect={setMarkedLocation}
                                    selectedType={selectedType}
                                />

                                {markedLocation && (
                                    <div className="dis-location-confirmed">
                                        ✅ Location confirmed — you can re-click to change it
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
                            <div className="dis-card dis-animate">
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
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Describe the situation — water level, damage, injuries, road access, etc."
                                    />
                                </div>

                                <div className="dis-redzone">
                                    <input type="checkbox" id="redzone" name="isRedZone" checked={form.isRedZone} onChange={handleChange} />
                                    <label htmlFor="redzone">
                                        <span className="redzone-badge">🔴 Mark as Red Zone</span>
                                        <span>This area is extremely dangerous and requires immediate evacuation</span>
                                    </label>
                                </div>

                                <div className="dis-review">
                                    <div className="dis-review-row">
                                        <span>Disaster Type</span>
                                        <strong>{selectedType?.icon} {selectedType?.label}</strong>
                                    </div>
                                    <div className="dis-review-row">
                                        <span>Severity</span>
                                        <strong>{severity}</strong>
                                    </div>
                                    <div className="dis-review-row">
                                        <span>Location</span>
                                        <strong style={{ maxWidth: '60%', textAlign: 'right', fontSize: '.82rem' }}>
                                            {markedLocation?.address || `${markedLocation?.lat?.toFixed(4)}, ${markedLocation?.lng?.toFixed(4)}`}
                                        </strong>
                                    </div>
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
                        <div className="dis-ref">{refNum.current}</div>
                        {form.isRedZone && (
                            <div className="dis-redzone-alert">
                                🔴 Red Zone alert has been sent to DMC authorities
                            </div>
                        )}
                        <p className="dis-ref-note">
                            Authorities have been notified. For immediate danger call <strong>117</strong>.
                        </p>
                        <button className="dis-btn-primary" onClick={resetForm}>
                            Submit Another Report
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Disaster;
