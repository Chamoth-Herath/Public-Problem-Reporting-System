import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Emergency.css';

const services = [
    { id: 'hospital', icon: '🚑', title: 'Ambulance / Hospital', desc: 'Request immediate ambulance from the nearest hospital', color: '#e74c3c', hotline: '1990', osmQuery: 'hospital Sri Lanka' },
    { id: 'fire',     icon: '🚒', title: 'Fire Brigade',         desc: 'Report fire emergencies and request fire rescue services', color: '#e67e22', hotline: '111',  osmQuery: 'fire station Sri Lanka' },
    { id: 'police',   icon: '🚔', title: 'Police Emergency',     desc: 'Request immediate police assistance for urgent situations', color: '#042C53', hotline: '119',  osmQuery: 'police station Sri Lanka' },
];

const STATUS_STEPS = [
    { key: 'pending',     label: 'Request Received', icon: '📋' },
    { key: 'accepted',    label: 'Accepted',          icon: '✅' },
    { key: 'on_the_way',  label: 'On the Way',        icon: '🚨' },
    { key: 'arrived',     label: 'Arrived',           icon: '📍' },
    { key: 'resolved',    label: 'Done',              icon: '🎉' },
];

const STORAGE_KEY = 'em_active_request';

/* ─── LEAFLET LOADER ─── */
function loadLeaflet(onReady) {
    if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css'; link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
    }
    if (window.L) { onReady(); return; }
    if (!document.getElementById('leaflet-js')) {
        const s = document.createElement('script');
        s.id = 'leaflet-js';
        s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        s.onload = onReady;
        document.head.appendChild(s);
    } else {
        const t = setInterval(() => { if (window.L) { clearInterval(t); onReady(); } }, 80);
    }
}

/* ─── MAP 1 — NEARBY SERVICES ─── */
const NearbyMap = ({ service }) => {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        const timer = setTimeout(() => { loadLeaflet(() => initMap()); }, 200);
        return () => { clearTimeout(timer); if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
    }, [service]);

    const initMap = () => {
        if (!containerRef.current) return;
        if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
        const L = window.L;
        const map = L.map(containerRef.current, { center: [7.8731, 80.7718], zoom: 8, zoomControl: true, scrollWheelZoom: false });
        mapRef.current = map;
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '© OSM © CARTO', subdomains: 'abcd', maxZoom: 19 }).addTo(map);
        const userIcon = L.divIcon({ html: '<div style="width:14px;height:14px;background:#1D9E75;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 4px rgba(29,158,117,.3)"></div>', className: '', iconSize: [14,14], iconAnchor: [7,7] });
        const serviceIcon = L.divIcon({ html: `<div style="width:28px;height:28px;background:${service.color};border:2px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 3px 10px rgba(0,0,0,.4)"></div>`, className: '', iconSize: [28,28], iconAnchor: [14,28] });
        const searchNominatim = async (center) => {
            try {
                const bbox = center ? `&viewbox=${center[1]-.3},${center[0]+.3},${center[1]+.3},${center[0]-.3}&bounded=0` : '';
                const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(service.osmQuery)}&format=json&limit=6&countrycodes=lk${bbox}`, { headers: { 'Accept-Language': 'en' } });
                const places = await res.json();
                places.forEach(p => {
                    L.marker([+p.lat, +p.lon], { icon: serviceIcon }).addTo(map).bindPopup(`<div style="font-family:sans-serif;min-width:150px"><strong>${p.display_name.split(',')[0]}</strong><br/><span style="font-size:.75rem;color:#555">${p.display_name.split(',').slice(1,3).join(',')}</span></div>`);
                });
                if (places.length > 0) { const pts = [...(center ? [center] : []), ...places.map(p => [+p.lat, +p.lon])]; map.fitBounds(L.latLngBounds(pts), { padding: [24,24] }); }
            } catch(e) { console.warn('Nominatim error', e); }
            setStatus('ready');
        };
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                pos => { const c = [pos.coords.latitude, pos.coords.longitude]; map.setView(c, 13); L.marker(c, { icon: userIcon }).addTo(map).bindPopup('<b>📍 Your Location</b>').openPopup(); searchNominatim(c); },
                () => searchNominatim(null)
            );
        } else searchNominatim(null);
    };

    return (
        <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden' }}>
            {status === 'loading' && (<div className="em-map-loading"><div className="em-map-spinner" style={{ borderTopColor: service.color }} /><p>Finding nearest {service.title}…</p></div>)}
            <div ref={containerRef} className="em-map" style={{ opacity: status === 'loading' ? 0 : 1, transition: 'opacity .4s' }} />
        </div>
    );
};

/* ─── MAP 2 — DRAGGABLE LOCATION PICKER ─── */
const LocationPicker = React.memo(({ onLocationChange }) => {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        const timer = setTimeout(() => { loadLeaflet(() => initMap()); }, 200);
        return () => { clearTimeout(timer); if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
    }, []);

    const reverseGeocode = async (lat, lng) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, { headers: { 'Accept-Language': 'en' } });
            const data = await res.json();
            onLocationChange(data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        } catch { onLocationChange(`${lat.toFixed(5)}, ${lng.toFixed(5)}`); }
    };

    const initMap = () => {
        if (!containerRef.current) return;
        if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
        const L = window.L;
        const map = L.map(containerRef.current, { center: [7.8731, 80.7718], zoom: 8, zoomControl: true, scrollWheelZoom: true });
        mapRef.current = map;
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '© OSM © CARTO', subdomains: 'abcd', maxZoom: 19 }).addTo(map);
        const markerIcon = L.divIcon({ html: '<div style="width:32px;height:32px;background:#e74c3c;border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(0,0,0,.5)"></div>', className: '', iconSize: [32,32], iconAnchor: [16,32] });
        const placeMarker = (lat, lng) => {
            if (markerRef.current) map.removeLayer(markerRef.current);
            const marker = L.marker([lat, lng], { icon: markerIcon, draggable: true }).addTo(map);
            markerRef.current = marker;
            reverseGeocode(lat, lng);
            marker.on('dragend', () => { const pos = marker.getLatLng(); reverseGeocode(pos.lat, pos.lng); });
        };
        map.on('click', e => placeMarker(e.latlng.lat, e.latlng.lng));
        const ctrl = L.control({ position: 'topright' });
        ctrl.onAdd = () => { const div = L.DomUtil.create('div'); div.innerHTML = '<div style="background:rgba(7,15,26,.88);border:1px solid rgba(181,212,244,.2);border-radius:8px;padding:8px 12px;font-family:sans-serif;font-size:.75rem;color:#B5D4F4;pointer-events:none">🖱️ Click or drag pin to set location</div>'; return div; };
        ctrl.addTo(map);
        if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(pos => { map.setView([pos.coords.latitude, pos.coords.longitude], 15); placeMarker(pos.coords.latitude, pos.coords.longitude); }, () => {}); }
        setStatus('ready');
    };

    return (
        <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
            {status === 'loading' && (<div className="em-map-loading"><div className="em-map-spinner" /><p>Loading location picker…</p></div>)}
            <div ref={containerRef} className="em-location-map" style={{ opacity: status === 'loading' ? 0 : 1, transition: 'opacity .4s' }} />
        </div>
    );
});
/* ─────────────────────────────────────────────
   STATUS TRACKER COMPONENT
───────────────────────────────────────────── */
const StatusTracker = ({ request, onDismiss, onCancel }) => {
    const service = services.find(s => s.id === request.serviceType) || services[0];
    const currentIndex = STATUS_STEPS.findIndex(s => s.key === request.status);
    const isDone = request.status === 'resolved';
    const isPending = request.status === 'pending';
    const [cancelling, setCancelling] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    const handleCancelRequest = async () => {
        setCancelling(true);
        try {
            try {
                const res = await fetch(`http://localhost:5000/api/emergency/${request.id}`, { method: 'DELETE' });
                if (!res.ok) throw new Error();
            } catch {
                try {
                    await fetch(`http://localhost:5000/api/emergency/${request.id}/status`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'cancelled' }),
                    });
                } catch { }
            }
        } catch { }
        setCancelling(false);
        setShowCancelConfirm(false);
        onCancel();
    };

    return (
        <section className="em-tracking em-animate">
            <div className="em-tracking-card">
                <div className="em-tracking-header" style={{ borderColor: service.color }}>
                    <span style={{ fontSize: 32 }}>{service.icon}</span>
                    <div>
                        <h2>{service.title}</h2>
                        <p className="em-tracking-ref">Ref: <strong>{request.referenceNumber}</strong></p>
                    </div>
                    <div className={`em-status-badge ${isDone ? 'done' : 'active'}`}>
                        {isDone ? '✓ Completed' : '● Active'}
                    </div>
                </div>
                <div className="em-tracking-info">
                    <span>📞 {request.phone}</span>
                    <span>📍 {request.location?.substring(0, 60)}{request.location?.length > 60 ? '…' : ''}</span>
                </div>
                <div className="em-stepper">
                    {STATUS_STEPS.map((step, i) => {
                        const isCompleted = i < currentIndex;
                        const isCurrent = i === currentIndex;
                        return (
                            <div key={step.key} className="em-step">
                                <div className={`em-step-dot ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                                     style={isCurrent ? { background: service.color, boxShadow: `0 0 0 4px ${service.color}33` } : {}}>
                                    {isCompleted ? '✓' : step.icon}
                                </div>
                                {i < STATUS_STEPS.length - 1 && (
                                    <div className={`em-step-line ${isCompleted ? 'completed' : ''}`}
                                         style={isCompleted ? { background: service.color } : {}} />
                                )}
                                <span className={`em-step-label ${isCurrent ? 'current' : ''}`}
                                      style={isCurrent ? { color: service.color } : {}}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
                <div className="em-status-msg" style={{ borderColor: service.color + '44', background: service.color + '11' }}>
                    {request.status === 'pending'    && '⏳ Your request has been received. Help is being dispatched…'}
                    {request.status === 'accepted'   && '✅ Your request has been accepted by the emergency service.'}
                    {request.status === 'on_the_way' && '🚨 Emergency unit is on the way to your location!'}
                    {request.status === 'arrived'    && '📍 Emergency unit has arrived at your location.'}
                    {request.status === 'resolved'   && '🎉 Your emergency has been resolved. Stay safe!'}
                </div>
                {showCancelConfirm && (
                    <div className="em-cancel-confirm">
                        <div className="em-cancel-confirm-icon">⚠️</div>
                        <p className="em-cancel-confirm-text">
                            Are you sure you want to cancel this emergency request?<br />
                            <span>Only cancel if the situation is no longer an emergency.</span>
                        </p>
                        <div className="em-cancel-confirm-actions">
                            <button className="em-cancel-confirm-yes" onClick={handleCancelRequest} disabled={cancelling}>
                                {cancelling ? 'Cancelling…' : 'Yes, Cancel Request'}
                            </button>
                            <button className="em-cancel-confirm-no" onClick={() => setShowCancelConfirm(false)} disabled={cancelling}>
                                No, Keep Active
                            </button>
                        </div>
                    </div>
                )}
                {isDone ? (
                    <button className="em-submit-btn" style={{ background: '#1D9E75' }} onClick={onDismiss}>Back to Emergency Services</button>
                ) : (
                    <>
                        <p className="em-polling-note">
                            🔄 Status updates automatically every 5 seconds<br />
                            <span>For urgent help call <strong>{service.hotline}</strong> directly</span>
                        </p>
                        {isPending && !showCancelConfirm && (
                            <button className="em-cancel-btn" onClick={() => setShowCancelConfirm(true)}>✕ Cancel Request</button>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

/* ─────────────────────────────────────────────
   ANTI-MISUSE WARNING
───────────────────────────────────────────── */
const MisuseWarning = ({ onAccept }) => (
    <section className="em-warning em-animate">
        <div className="em-warning-card">
            <div className="em-warning-icon">⚠️</div>
            <h2>Emergency Services Only</h2>
            <div className="em-warning-body">
                <p>This system is reserved for <strong>genuine emergency situations</strong> only.</p>
                <div className="em-warning-list">
                    <div className="em-warning-item danger">
                        <span>🚫</span>
                        <div><strong>Misuse is a serious criminal offence</strong><p>Prank calls, false reports, or testing this system diverts real resources from people in danger.</p></div>
                    </div>
                    <div className="em-warning-item danger">
                        <span>⚖️</span>
                        <div><strong>Legal consequences</strong><p>False emergency reports can result in arrest, prosecution, heavy fines, and imprisonment under Sri Lankan law.</p></div>
                    </div>
                    <div className="em-warning-item danger">
                        <span>📍</span>
                        <div><strong>You are being tracked</strong><p>All requests are logged with your phone number, location, and timestamp. Misuse will be reported to authorities.</p></div>
                    </div>
                </div>
                <p className="em-warning-confirm">By continuing, you confirm this is a <strong>real emergency</strong>.</p>
            </div>
            <button className="em-submit-btn" style={{ background: '#e74c3c' }} onClick={onAccept}>
                I Understand — This is a Real Emergency
            </button>
        </div>
    </section>
);

/* ─────────────────────────────────────────────
   CROSS-DEVICE LOOKUP
───────────────────────────────────────────── */
const RequestLookup = ({ onFound, onBack }) => {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLookup = async () => {
        if (!input.trim()) return;
        setLoading(true); setError('');
        try {
            const isRef = input.trim().startsWith('EM-');
            const url = isRef
                ? `http://localhost:5000/api/emergency/ref/${input.trim()}`
                : `http://localhost:5000/api/emergency/phone/${input.trim()}`;
            const res = await fetch(url);
            if (!res.ok) { setError('No active emergency request found.'); setLoading(false); return; }
            const data = await res.json();
            if (data.status === 'resolved') { setError('That request is already resolved.'); setLoading(false); return; }
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: data._id, referenceNumber: data.referenceNumber, serviceType: data.serviceType, phone: data.phone, location: data.location, status: data.status }));
            onFound(data);
        } catch { setError('Could not connect to server. Is the backend running?'); }
        setLoading(false);
    };

    return (
        <section className="em-lookup em-animate">
            <div className="em-lookup-card">
                <button className="em-back-btn" onClick={onBack}>← Back</button>
                <h2>Track Existing Request</h2>
                <p>Enter your phone number or reference number to track an existing emergency request from any device.</p>
                <div className="em-field">
                    <label>Phone number or Reference (e.g. EM-2025-123456)</label>
                    <input type="text" placeholder="0711234567 or EM-2025-123456" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLookup()} />
                </div>
                {error && <p className="em-error">{error}</p>}
                <button className="em-submit-btn" style={{ background: '#042C53' }} onClick={handleLookup} disabled={loading || !input.trim()}>
                    {loading ? 'Searching…' : '🔍 Find My Request'}
                </button>
            </div>
        </section>
    );
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const Emergency = () => {
    const [view, setView] = useState('loading');
    const [activeRequest, setActiveRequest] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const handleLocationChange = useCallback((val) => setLocation(val), []);
    const pollRef = useRef(null);

    useEffect(() => {
        document.title = 'Emergency - Public Problem Reporting System';
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const req = JSON.parse(saved);
                if (req.status === 'resolved') { localStorage.removeItem(STORAGE_KEY); setView('warning'); }
                else { setActiveRequest(req); setView('tracking'); }
            } catch { localStorage.removeItem(STORAGE_KEY); setView('warning'); }
        } else {
            setView('warning');
        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            document.querySelectorAll('.em-animate').forEach((el, i) => {
                el.style.opacity = '0'; el.style.transform = 'translateY(24px)';
                setTimeout(() => { el.style.transition = 'opacity 0.5s ease, transform 0.5s ease'; el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, i * 100);
            });
        }, 50);
    }, [view]);

    const fetchStatus = useCallback(async () => {
        if (!activeRequest?.id) return;
        try {
            const res = await fetch(`http://localhost:5000/api/emergency/${activeRequest.id}`);
            if (!res.ok) return;
            const data = await res.json();
            const updated = { ...activeRequest, status: data.status };
            setActiveRequest(updated);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            if (data.status === 'resolved') clearInterval(pollRef.current);
        } catch { }
    }, [activeRequest]);

    useEffect(() => {
        if (view === 'tracking' && activeRequest?.status !== 'resolved') {
            fetchStatus();
            pollRef.current = setInterval(fetchStatus, 5000);
        }
        return () => clearInterval(pollRef.current);
    }, [view, activeRequest?.id]);

    const handleSubmit = async () => {
        if (!phone || !location) return;
        try {
            const res = await fetch('http://localhost:5000/api/emergency', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serviceType: selectedService.id, phone, location, coordinates: null })
            });
            const data = await res.json();
            if (res.ok) {
                const req = { id: data.data._id, referenceNumber: data.referenceNumber, serviceType: selectedService.id, phone, location, status: 'pending' };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(req));
                setActiveRequest(req);
                setView('tracking');
            } else {
                alert('Failed to submit: ' + data.message);
            }
        } catch { alert('Server error. Please try again.'); }
    };

    const handleDismiss = () => {
        localStorage.removeItem(STORAGE_KEY);
        clearInterval(pollRef.current);
        setActiveRequest(null); setSelectedService(null);
        setPhone(''); setLocation('');
        setView('warning');
    };

    const handleCancel = () => {
        localStorage.removeItem(STORAGE_KEY);
        clearInterval(pollRef.current);
        setActiveRequest(null); setSelectedService(null);
        setPhone(''); setLocation('');
        setView('warning');
    };

    return (
        <div className="em-root">
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

            {view === 'warning' && (
                <>
                    <MisuseWarning onAccept={() => setView('select')} />
                    <div style={{ textAlign: 'center', padding: '8px 0 24px' }}>
                        <button className="em-text-btn" onClick={() => setView('lookup')}>
                            Already submitted a request? Track it here →
                        </button>
                    </div>
                </>
            )}

            {view === 'lookup' && (
                <RequestLookup
                    onFound={req => { setActiveRequest({ id: req._id, referenceNumber: req.referenceNumber, serviceType: req.serviceType, phone: req.phone, location: req.location, status: req.status }); setView('tracking'); }}
                    onBack={() => setView('warning')}
                />
            )}

            {view === 'select' && (
                <section className="em-select em-animate">
                    <h2>Select Emergency Type</h2>
                    <p>Choose the service you need</p>
                    <div className="em-service-grid">
                        {services.map(s => (
                            <div key={s.id} className="em-service-card" style={{ '--em-color': s.color }} onClick={() => { setSelectedService(s); setView('form'); }}>
                                <div className="em-service-icon">{s.icon}</div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                                <div className="em-hotline-chip">Hotline: {s.hotline}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {view === 'form' && selectedService && (
                <section className="em-form-section em-animate">
                    <div className="em-form-wrap">
                        <button className="em-back-btn" onClick={() => { setSelectedService(null); setLocation(''); setPhone(''); setView('select'); }}>← Change Service</button>
                        <div className="em-selected-badge" style={{ '--em-color': selectedService.color }}>
                            <span>{selectedService.icon}</span>
                            <div><h3>{selectedService.title}</h3><p>Hotline: {selectedService.hotline}</p></div>
                        </div>
                        <div className="em-form-card">
                            <h2>Emergency Request Form</h2>
                            <p className="em-form-note">⚠️ For life-threatening emergencies call <strong>{selectedService.hotline}</strong> directly.</p>
                            <div className="em-field">
                                <label>Your Phone Number *</label>
                                <input type="tel" placeholder="e.g. 0711234567" value={phone} onChange={e => setPhone(e.target.value)} />
                            </div>
                            <div className="em-field">
                                <label>Pin Your Location * <span style={{ fontWeight: 400, color: '#888' }}>(click map or drag pin)</span></label>
                                <LocationPicker onLocationChange={handleLocationChange} />
                                {location && <div className="em-location-text">📍 {location}</div>}
                            </div>
                            <button className="em-submit-btn" style={{ background: selectedService.color }} onClick={handleSubmit} disabled={!phone || !location}>
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

            {view === 'tracking' && activeRequest && (
                <StatusTracker request={activeRequest} onDismiss={handleDismiss} onCancel={handleCancel} />
            )}
        </div>
    );
};

export default Emergency;