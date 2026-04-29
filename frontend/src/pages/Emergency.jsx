
import React, { useState, useEffect, useRef } from 'react';
import './Emergency.css';

const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

const Emergency = () => {
    const [selectedService, setSelectedService] = useState(null);
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [userCoords, setUserCoords] = useState(null);
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const locationMarkerRef = useRef(null);
    const locationMapRef = useRef(null);
    const locationMapInstanceRef = useRef(null);

    const initLocationMap = () => {
        if (!locationMapRef.current || !window.google) return;
        const defaultCenter = { lat: 7.8731, lng: 80.7718 };

        const map = new window.google.maps.Map(locationMapRef.current, {
            zoom: 15,
            center: defaultCenter,
            styles: darkMapStyle,
            mapTypeControl: false,
            streetViewControl: false,
            zoomControl: true,
        });
        locationMapInstanceRef.current = map;

        const marker = new window.google.maps.Marker({
            position: defaultCenter,
            map,
            draggable: true,
            title: 'Your Location',
            animation: window.google.maps.Animation.DROP,
            icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 12,
                fillColor: '#e74c3c',
                fillOpacity: 1,
                strokeColor: '#fff',
                strokeWeight: 3,
            },
        });
        locationMarkerRef.current = marker;

        const geocoder = new window.google.maps.Geocoder();

        const updateLocation = (latLng) => {
            geocoder.geocode({ location: latLng }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    setLocation(results[0].formatted_address);
                } else {
                    setLocation(`${latLng.lat().toFixed(5)}, ${latLng.lng().toFixed(5)}`);
                }
            });
        };

        // Get current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                map.setCenter(userLoc);
                marker.setPosition(userLoc);
                updateLocation(new window.google.maps.LatLng(userLoc.lat, userLoc.lng));
            });
        }

        // Drag marker to change location
        marker.addListener('dragend', () => {
            updateLocation(marker.getPosition());
        });

        // Click map to move marker
        map.addListener('click', (e) => {
            marker.setPosition(e.latLng);
            updateLocation(e.latLng);
        });
    };

    const services = [
        {
            id: 'hospital',
            icon: '🚑',
            title: 'Ambulance / Hospital',
            desc: 'Request immediate ambulance from the nearest hospital',
            color: '#e74c3c',
            hotline: '1990',
            keyword: 'hospital'
        },
        {
            id: 'fire',
            icon: '🚒',
            title: 'Fire Brigade',
            desc: 'Report fire emergencies and request fire rescue services',
            color: '#e67e22',
            hotline: '111',
            keyword: 'fire station'
        },
        {
            id: 'police',
            icon: '🚔',
            title: 'Police Emergency',
            desc: 'Request immediate police assistance for urgent situations',
            color: '#042C53',
            hotline: '119',
            keyword: 'police station'
        },
    ];

    useEffect(() => {
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
    useEffect(() => {
        document.title = 'Emergency - Public Problem Reporting System';
    }, []);
    useEffect(() => {
        if (!selectedService) return;
        loadMap(selectedService.keyword);
        // Load location picker map
        const scriptId = 'gmap-script';
        if (window.google && window.google.maps) {
            setTimeout(() => initLocationMap(), 300);
        } else {
            window.initEmMap = () => {
                initMap(selectedService.keyword);
                initLocationMap();
            };
        }
    }, [selectedService]);

    const loadMap = (keyword) => {
        const scriptId = 'gmap-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initEmMap`;
            script.async = true;
            document.head.appendChild(script);
        }
        window.initEmMap = () => initMap(keyword);
        if (window.google && window.google.maps) initMap(keyword);
    };

    const initMap = (keyword) => {
        if (!mapRef.current || !window.google) return;
        const defaultCenter = { lat: 7.8731, lng: 80.7718 };
        const map = new window.google.maps.Map(mapRef.current, {
            zoom: 13,
            center: defaultCenter,
            styles: darkMapStyle,
            mapTypeControl: false,
            streetViewControl: false,
        });
        mapInstanceRef.current = map;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    setUserCoords(userLoc);
                    map.setCenter(userLoc);

                    new window.google.maps.Marker({
                        position: userLoc,
                        map,
                        title: 'Your Location',
                        icon: {
                            path: window.google.maps.SymbolPath.CIRCLE,
                            scale: 10,
                            fillColor: '#1D9E75',
                            fillOpacity: 1,
                            strokeColor: '#fff',
                            strokeWeight: 3,
                        },
                    });

                    const service = new window.google.maps.places.PlacesService(map);
                    service.nearbySearch(
                        { location: userLoc, radius: 10000, keyword },
                        (results, status) => {
                            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                                results.slice(0, 5).forEach((place) => {
                                    const marker = new window.google.maps.Marker({
                                        position: place.geometry.location,
                                        map,
                                        title: place.name,
                                        icon: { url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' },
                                    });
                                    const info = new window.google.maps.InfoWindow({
                                        content: `<div style="font-family:sans-serif;padding:4px"><strong>${place.name}</strong><br/>${place.vicinity}</div>`,
                                    });
                                    marker.addListener('click', () => info.open(map, marker));
                                });
                            }
                        }
                    );
                },
                () => {}
            );
        }
    };

    const handleSubmit = () => {
        if (!phone || !location) return;
        // TODO: Connect to backend API
        // await axios.post('/api/emergency', { service: selectedService.id, phone, location, coords: userCoords });
        setSubmitted(true);
    };

    const refNum = `EM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

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
                        {services.map((s) => (
                            <div
                                className="em-service-card"
                                key={s.id}
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

                        <button className="em-back-btn" onClick={() => setSelectedService(null)}>
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
                                <label>📞 Your Phone Number *</label>
                                <input
                                    type="tel"
                                    placeholder="e.g. 0711234567"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>

                            <div className="em-field">
                                <label>📍 Your Location *</label>
                                <div ref={locationMapRef} className="em-location-map">
                                    <div className="em-map-fallback">
                                        <p>🗺️ Loading your location…</p>
                                    </div>
                                </div>
                                {location && (
                                    <div className="em-location-text">
                                        📍 {location}
                                    </div>
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

                        {/* MAP */}
                        <div className="em-map-wrap">
                            <h3>Nearest {selectedService.title} Locations</h3>
                            <div ref={mapRef} className="em-map">
                                <div className="em-map-fallback">
                                    <p>🗺️ Map loading…</p>
                                    <p>Add Google Maps API key in Emergency.jsx</p>
                                </div>
                            </div>
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
                        <div className="em-ref">{refNum}</div>
                        <p className="em-ref-note">
                            Help is on the way. Keep your phone on. If urgent, call <strong>{selectedService.hotline}</strong> directly.
                        </p>
                        <button className="em-submit-btn" style={{ background: selectedService.color }} onClick={() => { setSubmitted(false); setSelectedService(null); setPhone(''); setLocation(''); }}>
                            Back to Emergency
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

export default Emergency;