import React, { useState, useEffect, useRef } from 'react';
import './Emergency.css';

const services = [
    {
        id: 'hospital',
        icon: '🚑',
        title: 'Ambulance / Hospital',
        desc: 'Request immediate ambulance from the nearest hospital',
        color: '#e74c3c',
        hotline: '1990',
        osmQuery: 'hospital Sri Lanka',
    },
    {
        id: 'fire',
        icon: '🚒',
        title: 'Fire Brigade',
        desc: 'Report fire emergencies and request fire rescue services',
        color: '#e67e22',
        hotline: '111',
        osmQuery: 'fire station Sri Lanka',
    },
    {
        id: 'police',
        icon: '🚔',
        title: 'Police Emergency',
        desc: 'Request immediate police assistance for urgent situations',
        color: '#042C53',
        hotline: '119',
        osmQuery: 'police station Sri Lanka',
    },
];

/* ─────────────────────────────────────────────
   LEAFLET LOADER
───────────────────────────────────────────── */
function loadLeaflet(onReady) {
    if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
        document.head.appendChild(link);
    }
    if (window.L) { onReady(); return; }
    if (!document.getElementById('leaflet-js')) {
        const s = document.createElement('script');
        s.id = 'leaflet-js';
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
        s.crossOrigin = 'anonymous';
        s.onload = onReady;
        document.head.appendChild(s);
    } else {
        const t = setInterval(() => {
            if (window.L) { clearInterval(t); onReady(); }
        }, 80);
    }
}

/* ─────────────────────────────────────────────
   MAP 1 — NEARBY SERVICES
───────────────────────────────────────────── */
const NearbyMap = ({ service }) => {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        // ← KEY FIX: wait for DOM to fully paint before init
        const timer = setTimeout(() => {
            loadLeaflet(() => initMap());
        }, 200);

        return () => {
            clearTimeout(timer);
            if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
        };
    }, [service]);

    const initMap = () => {
        if (!containerRef.current) return;
        if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }

        const L = window.L;
        const map = L.map(containerRef.current, {
            center: [7.8731, 80.7718],
            zoom: 8,
            zoomControl: true,
            scrollWheelZoom: false,
        });
        mapRef.current = map;

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19,
        }).addTo(map);

        const userIcon = L.divIcon({
            html: '<div style="width:14px;height:14px;background:#1D9E75;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 4px rgba(29,158,117,.3)"></div>',
            className: '', iconSize: [14, 14], iconAnchor: [7, 7],
        });

        const serviceIcon = L.divIcon({
            html: `<div style="width:28px;height:28px;background:${service.color};border:2px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 3px 10px rgba(0,0,0,.4)"></div>`,
            className: '', iconSize: [28, 28], iconAnchor: [14, 28],
        });

        const searchNominatim = async (center) => {
            try {
                const bbox = center
                    ? `&viewbox=${center[1] - .3},${center[0] + .3},${center[1] + .3},${center[0] - .3}&bounded=0`
                    : '';
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(service.osmQuery)}&format=json&limit=6&countrycodes=lk${bbox}`,
                    { headers: { 'Accept-Language': 'en' } }
                );
                const places = await res.json();
                places.forEach(p => {
                    L.marker([+p.lat, +p.lon], { icon: serviceIcon })
                        .addTo(map)
                        .bindPopup(`<div style="font-family:sans-serif;min-width:150px">
                            <strong>${p.display_name.split(',')[0]}</strong><br/>
                            <span style="font-size:.75rem;color:#555">${p.display_name.split(',').slice(1, 3).join(',')}</span>
                        </div>`);
                });
                if (places.length > 0) {
                    const pts = [...(center ? [center] : []), ...places.map(p => [+p.lat, +p.lon])];
                    map.fitBounds(L.latLngBounds(pts), { padding: [24, 24] });
                }
            } catch (e) { console.warn('Nominatim error', e); }
            setStatus('ready');
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                pos => {
                    const c = [pos.coords.latitude, pos.coords.longitude];
                    map.setView(c, 13);
                    L.marker(c, { icon: userIcon }).addTo(map).bindPopup('<b>📍 Your Location</b>').openPopup();
                    searchNominatim(c);
                },
                () => searchNominatim(null)
            );
        } else {
            searchNominatim(null);
        }
    };

    return (
        <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden' }}>
            {status === 'loading' && (
                <div className="em-map-loading">
                    <div className="em-map-spinner" style={{ borderTopColor: service.color }} />
                    <p>Finding nearest {service.title}…</p>
                </div>
            )}
            <div
                ref={containerRef}
                className="em-map"
                style={{ opacity: status === 'loading' ? 0 : 1, transition: 'opacity .4s' }}
            />
        </div>
    );
};

/* ─────────────────────────────────────────────
   MAP 2 — DRAGGABLE LOCATION PICKER
───────────────────────────────────────────── */
const LocationPicker = ({ onLocationChange }) => {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        // ← KEY FIX: wait for DOM to fully paint
        const timer = setTimeout(() => {
            loadLeaflet(() => initMap());
        }, 200);

        return () => {
            clearTimeout(timer);
            if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
        };
    }, []);

    const reverseGeocode = async (lat, lng) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
                { headers: { 'Accept-Language': 'en' } }
            );
            const data = await res.json();
            onLocationChange(data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        } catch {
            onLocationChange(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        }
    };

    const initMap = () => {
        if (!containerRef.current) return;
        if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }

        const L = window.L;
        const map = L.map(containerRef.current, {
            center: [7.8731, 80.7718],
            zoom: 8,
            zoomControl: true,
            scrollWheelZoom: true,
        });
        mapRef.current = map;

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19,
        }).addTo(map);

        const markerIcon = L.divIcon({
            html: '<div style="width:32px;height:32px;background:#e74c3c;border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(0,0,0,.5)"></div>',
            className: '', iconSize: [32, 32], iconAnchor: [16, 32],
        });

        const placeMarker = (lat, lng) => {
            if (markerRef.current) map.removeLayer(markerRef.current);
            const marker = L.marker([lat, lng], { icon: markerIcon, draggable: true }).addTo(map);
            markerRef.current = marker;
            reverseGeocode(lat, lng);
            marker.on('dragend', () => {
                const pos = marker.getLatLng();
                reverseGeocode(pos.lat, pos.lng);
            });
        };

        map.on('click', e => placeMarker(e.latlng.lat, e.latlng.lng));

        // Instruction overlay
        const ctrl = L.control({ position: 'topright' });
        ctrl.onAdd = () => {
            const div = L.DomUtil.create('div');
            div.innerHTML = '<div style="background:rgba(7,15,26,.88);border:1px solid rgba(181,212,244,.2);border-radius:8px;padding:8px 12px;font-family:sans-serif;font-size:.75rem;color:#B5D4F4;pointer-events:none">🖱️ Click or drag pin to set location</div>';
            return div;
        };
        ctrl.addTo(map);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                pos => {
                    map.setView([pos.coords.latitude, pos.coords.longitude], 15);
                    placeMarker(pos.coords.latitude, pos.coords.longitude);
                },
                () => {}
            );
        }

        setStatus('ready');
    };

    return (
        <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
            {status === 'loading' && (
                <div className="em-map-loading">
                    <div className="em-map-spinner" />
                    <p>Loading location picker…</p>
                </div>
            )}
            <div
                ref={containerRef}
                className="em-location-map"
                style={{ opacity: status === 'loading' ? 0 : 1, transition: 'opacity .4s' }}
            />
        </div>
    );
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const Emergency = () => {
    const [selectedService, setSelectedService] = useState(null);
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        document.title = 'Emergency - Public Problem Reporting System';
        const els = document.querySelectorAll('.em-animate');
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

    const handleSubmit = () => {
        if (!phone || !location) return;
        // TODO: await axios.post('/api/emergency', { service: selectedService.id, phone, location });
        setSubmitted(true);
    };

    const refNum = useRef(`EM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);

    return (
        <div className="em-root">

            {/* HERO */}
            <section className="em-hero em-animate">
                <div className="em-hero-overlay" />
                <div className="em-hero-content">
                    <span className="em-tag">Emergency Services</span>
                    <h1>Request Emergency<br />Assistance</h1>
                    <p>No login required — immediate help at your fingertips</p>
                    <div className="em-hotlines">
                        <span>🚑 Ambulance: <strong>1990</strong></span>
                        <span>🚒 Fire: <strong>111</strong></span>
                        <span>🚔 Police: <strong>119</strong></span>
                    </div>
                </div>
            </section>

            {/* SERVICE SELECTION */}
            {!selectedService && (
                <section className="em-select em-animate">
                    <h2>Select Emergency Type</h2>
                    <p>Choose the service you need</p>
                    <div className="em-service-grid">
                        {services.map(s => (
                            <div
                                key={s.id}
                                className="em-service-card"
                                style={{ '--em-color': s.color }}
                                onClick={() => setSelectedService(s)}
                            >
                                <div className="em-service-icon">{s.icon}</div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                                <div className="em-hotline-chip">Hotline: {s.hotline}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* REQUEST FORM */}
            {selectedService && !submitted && (
                <section className="em-form-section em-animate">
                    <div className="em-form-wrap">

                        <button className="em-back-btn" onClick={() => { setSelectedService(null); setLocation(''); setPhone(''); }}>
                            ← Change Service
                        </button>

                        <div className="em-selected-badge" style={{ '--em-color': selectedService.color }}>
                            <span>{selectedService.icon}</span>
                            <div>
                                <h3>{selectedService.title}</h3>
                                <p>Hotline: {selectedService.hotline}</p>
                            </div>
                        </div>

                        <div className="em-form-card">
                            <h2>Emergency Request Form</h2>
                            <p className="em-form-note">
                                ⚠️ For life-threatening emergencies call <strong>{selectedService.hotline}</strong> directly.
                            </p>

                            <div className="em-field">
                                <label>Your Phone Number *</label>
                                <input
                                    type="tel"
                                    placeholder="e.g. 0711234567"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                />
                            </div>

                            <div className="em-field">
                                <label>Pin Your Location * <span style={{ fontWeight: 400, color: '#888' }}>(click map or drag pin)</span></label>
                                <LocationPicker onLocationChange={setLocation} />
                                {location && (
                                    <div className="em-location-text">📍 {location}</div>
                                )}
                            </div>

                            <button
                                className="em-submit-btn"
                                style={{ background: selectedService.color }}
                                onClick={handleSubmit}
                                disabled={!phone || !location}
                            >
                                {selectedService.icon} Send Emergency Request
                            </button>
                        </div>

                        <div className="em-map-wrap">
                            <h3>Nearest {selectedService.title} Locations</h3>
                            <NearbyMap service={selectedService} />
                        </div>

                    </div>
                </section>
            )}

            {/* SUCCESS */}
            {submitted && (
                <section className="em-success em-animate">
                    <div className="em-success-card">
                        <div className="em-success-icon">✅</div>
                        <h2>Request Sent!</h2>
                        <p>Your emergency reference number:</p>
                        <div className="em-ref">{refNum.current}</div>
                        <p className="em-ref-note">
                            Help is on the way. Keep your phone on. If urgent, call <strong>{selectedService.hotline}</strong> directly.
                        </p>
                        <button
                            className="em-submit-btn"
                            style={{ background: selectedService.color }}
                            onClick={() => { setSubmitted(false); setSelectedService(null); setPhone(''); setLocation(''); }}
                        >
                            Back to Emergency
                        </button>
                    </div>
                </section>
            )}

        </div>
    );
};

export default Emergency;
