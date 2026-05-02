import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import './DepartmentPage.css';
import { requestNotificationPermission, showNotification } from '../services/notifications';


/* ─────────────────────────────────────────────
   DEPARTMENT DATA
───────────────────────────────────────────── */
const DEPT_DATA = {
  water: {
    key: 'water', icon: '💧',
    title: 'National Water Supply & Drainage Board',
    shortTitle: 'Water Supply',
    tagline: 'Safe Water for Every Home',
    accentColor: '#185FA5', lightColor: '#B5D4F4',
    description: 'The National Water Supply & Drainage Board (NWSDB) is the apex body responsible for providing potable water and sanitation services across Sri Lanka. Established under Act No. 2 of 1974, NWSDB serves over 6 million connections island-wide ensuring safe drinking water and proper wastewater management.',
    services: ['Pipe breaks & leakages', 'Water shortages & supply interruptions', 'Contamination & quality issues', 'New connection requests', 'Meter reading disputes', 'Drainage blockages'],
    hotline: '1954', email: 'info@waterboard.lk', website: 'www.waterboard.lk',
    address: 'Galle Road, Ratmalana, Sri Lanka',
    workingHours: 'Mon – Fri: 8:30 AM – 4:30 PM | Emergency: 24/7',
    osmQuery: 'water supply board',
    stats: [{ label: 'Connections', value: '6M+' }, { label: 'Coverage', value: '85%' }, { label: 'Staff', value: '14,500+' }],
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&q=80',
  },
  electricity: {
    key: 'electricity', icon: '⚡',
    title: 'Ceylon Electricity Board',
    shortTitle: 'Electricity',
    tagline: 'Powering the Nation Forward',
    accentColor: '#e6a817', lightColor: '#fff3cd',
    description: 'The Ceylon Electricity Board (CEB) is the state electricity utility of Sri Lanka, responsible for generation, transmission and distribution of electricity throughout the island.',
    services: ['Power outages & blackouts', 'Electrical faults & sparks', 'Transformer failures', 'Street light repairs', 'High voltage line hazards', 'Billing & meter disputes'],
    hotline: '1987', email: 'ceb@ceb.lk', website: 'www.ceb.lk',
    address: 'No. 50, Sir Chittampalam A. Gardiner Mawatha, Colombo 2',
    workingHours: 'Mon – Fri: 8:00 AM – 5:00 PM | Emergency: 24/7',
    osmQuery: 'Ceylon Electricity Board',
    stats: [{ label: 'MW Capacity', value: '4,000+' }, { label: 'Consumers', value: '7.2M' }, { label: 'Coverage', value: '99%' }],
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80',
  },
  garbage: {
    key: 'garbage', icon: '🗑️',
    title: 'Local Municipal Council – Sanitation',
    shortTitle: 'Garbage & Sanitation',
    tagline: 'Clean Cities, Healthy Lives',
    accentColor: '#1D9E75', lightColor: '#d4f5ec',
    description: 'Municipal Councils across Sri Lanka manage solid waste collection, disposal and urban sanitation.',
    services: ['Uncollected household waste', 'Illegal dumping sites', 'Blocked storm drains', 'Overflowing public bins', 'Medical waste disposal', 'Recycling centre requests'],
    hotline: '1920', email: 'sanitation@municipal.lk', website: 'www.mc.lk',
    address: 'Town Hall, Colombo 7',
    workingHours: 'Mon – Sat: 7:00 AM – 5:00 PM',
    osmQuery: 'municipal council',
    stats: [{ label: 'Daily Tonnes', value: '6,700' }, { label: 'Vehicles', value: '1,200+' }, { label: 'Workers', value: '18,000' }],
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
  },
  health: {
    key: 'health', icon: '🏥',
    title: 'Ministry of Health',
    shortTitle: 'Health',
    tagline: 'A Healthier Sri Lanka for All',
    accentColor: '#e63946', lightColor: '#fde8ea',
    description: 'The Ministry of Health oversees the national health system, coordinating government hospitals, district health services and preventive health programmes island-wide.',
    services: ['Public health hazards', 'Unsanitary food stalls', 'Disease outbreak alerts', 'Hospital facility complaints', 'Ambulance service issues', 'Illegal medical practices'],
    hotline: '1926', email: 'info@health.gov.lk', website: 'www.health.gov.lk',
    address: 'Suwasiripaya, 385 Rev. Baddegama Wimalawansa Thero Mw, Colombo 10',
    workingHours: 'Mon – Fri: 8:30 AM – 4:30 PM | Emergency: 24/7',
    osmQuery: 'hospital',
    stats: [{ label: 'Hospitals', value: '620+' }, { label: 'Beds', value: '75,000' }, { label: 'Doctors', value: '22,000+' }],
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
  },
  police: {
    key: 'police', icon: '👮',
    title: 'Sri Lanka Police',
    shortTitle: 'Police',
    tagline: 'Serving & Protecting Every Citizen',
    accentColor: '#042C53', lightColor: '#ccd6e0',
    description: 'Sri Lanka Police is the national law enforcement agency responsible for maintaining law and order.',
    services: ['Crimes & theft reports', 'Suspicious activity', 'Traffic violations', 'Domestic violence', 'Missing persons', 'Public disturbances'],
    hotline: '119', email: 'info@police.lk', website: 'www.police.lk',
    address: 'Police Headquarters, Colombo 1',
    workingHours: '24 Hours / 7 Days',
    osmQuery: 'police station',
    stats: [{ label: 'Officers', value: '85,000+' }, { label: 'Stations', value: '500+' }, { label: 'Districts', value: '25' }],
    image: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800&q=80',
  },
  fire: {
    key: 'fire', icon: '🚒',
    title: 'Sri Lanka Fire & Rescue Services',
    shortTitle: 'Fire & Rescue',
    tagline: 'Protecting Lives & Property',
    accentColor: '#f97316', lightColor: '#ffe8d6',
    description: 'The Sri Lanka Fire & Rescue Services responds to fire emergencies, rescue operations, hazardous material incidents and disaster relief operations across the island. Operating under the Ministry of Public Security, fire stations are maintained in all major districts.',
    services: ['Fire outbreaks & structural fires', 'Road accident rescues', 'Chemical & gas leak emergencies', 'Flood & disaster rescue', 'Collapsed building rescues', 'Forest & wildfire control'],
    hotline: '111', email: 'info@fire.gov.lk', website: 'www.firerescue.gov.lk',
    address: 'Fire Brigade Headquarters, Colombo 2',
    workingHours: '24 Hours / 7 Days',
    osmQuery: 'fire station Sri Lanka',
    stats: [{ label: 'Fire Stations', value: '200+' }, { label: 'Districts', value: '25' }, { label: 'Response', value: '<8 min' }],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  },
  agriculture: {
    key: 'agriculture', icon: '🌾',
    title: 'Ministry of Agriculture',
    shortTitle: 'Agriculture',
    tagline: 'Growing a Prosperous Nation',
    accentColor: '#5a8a3c', lightColor: '#dff0d8',
    description: "The Ministry of Agriculture formulates and implements national agricultural policies to ensure food security.",
    services: ['Crop disease & pest outbreaks', 'Irrigation failures', 'Fertiliser supply issues', 'Farming infrastructure damage', 'Market price complaints', 'Agricultural subsidy queries'],
    hotline: '1920', email: 'info@agrimin.gov.lk', website: 'www.agrimin.gov.lk',
    address: 'Govijana Mandiraya, 80/5 Rajamalwatta Road, Battaramulla',
    workingHours: 'Mon – Fri: 8:30 AM – 4:30 PM',
    osmQuery: 'agriculture department',
    stats: [{ label: 'Farm Families', value: '1.8M' }, { label: 'Arable Land', value: '2.2M ha' }, { label: 'Crops', value: '200+' }],
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80',
  },
  education: {
    key: 'education', icon: '🎓',
    title: 'Ministry of Education',
    shortTitle: 'Education',
    tagline: 'Knowledge Builds the Future',
    accentColor: '#7b2d8b', lightColor: '#ede0f5',
    description: "The Ministry of Education governs Sri Lanka's school education system.",
    services: ['School infrastructure damage', 'Teacher shortage reports', 'Examination irregularities', 'Scholarship grievances', 'School transportation issues', 'Facility sanitation problems'],
    hotline: '1979', email: 'info@moe.gov.lk', website: 'www.moe.gov.lk',
    address: 'Isurupaya, Battaramulla',
    workingHours: 'Mon – Fri: 8:30 AM – 4:30 PM',
    osmQuery: 'school',
    stats: [{ label: 'Schools', value: '10,000+' }, { label: 'Students', value: '4.2M' }, { label: 'Literacy', value: '92%' }],
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
  },
  roads: {
    key: 'roads', icon: '🛣️',
    title: 'Road Development Authority',
    shortTitle: 'Roads & Highways',
    tagline: 'Connecting Communities Across Sri Lanka',
    accentColor: '#6c4e27', lightColor: '#f2e8de',
    description: 'The Road Development Authority (RDA) is responsible for planning, design, construction and maintenance of the national road network.',
    services: ['Potholes & road damage', 'Broken streetlights', 'Highway safety hazards', 'Bridge structural issues', 'Road marking complaints', 'Unauthorized road excavations'],
    hotline: '1955', email: 'info@rda.gov.lk', website: 'www.rda.gov.lk',
    address: 'P.O. Box 1533, 8th Floor, Sethsiripaya, Battaramulla',
    workingHours: 'Mon – Fri: 8:30 AM – 4:30 PM | Emergency: 24/7',
    osmQuery: 'road development authority',
    stats: [{ label: 'Road Network', value: '12,000 km' }, { label: 'Expressways', value: '340 km' }, { label: 'Bridges', value: '4,200+' }],
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
  },
};

/* ─────────────────────────────────────────────
   LEAFLET MAP (Department offices - using window.L to avoid react-leaflet conflict)
───────────────────────────────────────────── */
async function searchNominatim(map, L, osmQuery, accentColor, officeIcon, center) {
  const bbox = center
      ? `&viewbox=${center[1] - 0.3},${center[0] + 0.3},${center[1] + 0.3},${center[0] - 0.3}&bounded=0`
      : '';
  try {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(osmQuery + ' Sri Lanka')}&format=json&limit=8&countrycodes=lk${bbox}`,
        { headers: { 'Accept-Language': 'en' } }
    );
    const places = await res.json();
    if (!places.length) return;
    places.forEach(p => {
      L.marker([+p.lat, +p.lon], { icon: officeIcon(accentColor) })
          .addTo(map)
          .bindPopup(
              `<div style="font-family:sans-serif;min-width:140px">
            <strong style="font-size:.85rem">${p.display_name.split(',')[0]}</strong><br/>
            <span style="font-size:.72rem;color:#555">${p.display_name.split(',').slice(1,3).join(',')}</span>
          </div>`
          );
    });
    const bounds = L.latLngBounds([
      ...(center ? [center] : []),
      ...places.map(p => [+p.lat, +p.lon]),
    ]);
    map.fitBounds(bounds, { padding: [24, 24] });
  } catch (e) { console.warn('Nominatim error', e); }
}

const LeafletMap = ({ osmQuery, accentColor }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const boot = () => {
      if (!containerRef.current) return;
      const wL = window.L;
      if (!wL) return;

      // Destroy existing map if any
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      // Clear leaflet internal id
      delete containerRef.current._leaflet_id;

      const map = wL.map(containerRef.current, {
        center: [7.8731, 80.7718], zoom: 8,
        zoomControl: true, scrollWheelZoom: false,
      });
      mapRef.current = map;

      wL.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OSM contributors © CARTO',
        subdomains: 'abcd', maxZoom: 19,
      }).addTo(map);

      const userIcon = wL.divIcon({
        html: `<div style="width:14px;height:14px;background:#1D9E75;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 4px rgba(29,158,117,.3)"></div>`,
        className: '', iconSize: [14, 14], iconAnchor: [7, 7],
      });
      const officeIcon = c => wL.divIcon({
        html: `<div style="width:26px;height:26px;background:${c};border:2px solid rgba(255,255,255,.85);border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 3px 10px rgba(0,0,0,.45)"></div>`,
        className: '', iconSize: [26, 26], iconAnchor: [13, 26],
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async pos => {
              const c = [pos.coords.latitude, pos.coords.longitude];
              map.setView(c, 13);
              wL.marker(c, { icon: userIcon }).addTo(map).bindPopup('<b>📍 Your Location</b>').openPopup();
              await searchNominatim(map, wL, osmQuery, accentColor, officeIcon, c);
              setStatus('ready');
            },
            async () => {
              await searchNominatim(map, wL, osmQuery, accentColor, officeIcon, null);
              setStatus('ready');
            }
        );
      } else {
        searchNominatim(map, wL, osmQuery, accentColor, officeIcon, null).then(() => setStatus('ready'));
      }
    };

    const timer = setTimeout(() => {
      if (window.L) {
        boot();
        return;
      }

      const existing = document.getElementById('dept-leaflet-js');
      if (existing) {
        const t = setInterval(() => { if (window.L) { clearInterval(t); boot(); } }, 80);
        return;
      }

      if (!document.getElementById('dept-leaflet-css')) {
        const l = document.createElement('link');
        l.id = 'dept-leaflet-css'; l.rel = 'stylesheet';
        l.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(l);
      }

      const s = document.createElement('script');
      s.id = 'dept-leaflet-js';
      s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      s.onload = () => setTimeout(boot, 100);
      document.head.appendChild(s);
    }, 150);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [osmQuery, accentColor]);

  return (
      <div style={{ position: 'relative', height: 220 }}>
        {status === 'loading' && (
            <div className="dp-map-fallback">
              <div className="dp-map-spinner" />
              <p style={{ marginTop: 8, fontSize: '.78rem', color: '#aaa' }}>Loading map…</p>
            </div>
        )}
        <div ref={containerRef} style={{ height: 220, width: '100%', opacity: status === 'loading' ? 0 : 1, transition: 'opacity .4s' }} />
      </div>
  );
};

/* ─────────────────────────────────────────────
   LOCATION PICKER for complaint modal
───────────────────────────────────────────── */
const ComplaintMapPicker = ({ onSelect }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const boot = () => {
      if (!containerRef.current || !window.L) return;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      delete containerRef.current._leaflet_id;

      const L = window.L;
      const map = L.map(containerRef.current, {
        center: [7.8731, 80.7718], zoom: 8, scrollWheelZoom: false
      });
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      let marker = null;
      map.on('click', async (e) => {
        if (marker) marker.remove();
        marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
        onSelect(e.latlng);
      });
    };

    const timer = setTimeout(() => {
      if (window.L) { boot(); }
      else {
        const t = setInterval(() => { if (window.L) { clearInterval(t); boot(); } }, 100);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  return (
      <div
          ref={containerRef}
          style={{ height: '220px', width: '100%', borderRadius: '8px', border: '1.5px solid #d0dae6' }}
      />
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const DepartmentPage = () => {
  const { dept } = useParams();
  const navigate = useNavigate();
  const { user, isSignedIn, isLoaded } = useUser();
  const data = DEPT_DATA[dept];
  const [showComplaint, setShowComplaint] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Auth guard — redirect if not signed in as citizen
  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) { navigate('/login'); return; }
    const role = user?.publicMetadata?.role;
    if (role && role !== 'citizen') return; // agents/admins can view
  }, [isLoaded, isSignedIn, user, navigate]);

  // Fetch citizen profile
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/profile/${user.id}`);
        if (res.ok) setProfile(await res.json());
      } catch (e) { console.error(e); }
      finally { setProfileLoading(false); }
    };
    fetchProfile();
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const els = document.querySelectorAll('.dp-animate');
    els.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      setTimeout(() => {
        el.style.transition = 'opacity .6s ease, transform .6s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, i * 100);
    });
  }, [dept]);

  if (!isLoaded || profileLoading) return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="dp-map-spinner" />
      </div>
  );

  if (!data) return (
      <div className="dp-not-found">
        <h2>Department not found</h2>
        <button onClick={() => navigate('/departments')}>← Back to Departments</button>
      </div>
  );

  const statusColor = s =>
      s === 'Resolved' ? '#1D9E75' : s === 'In Progress' ? '#185FA5' : s === 'Under Review' ? '#e6a817' : s === 'Rejected' ? '#e63946' : '#888';

  return (
      <div className="dp-root" style={{ '--accent': data.accentColor, '--light': data.lightColor }}>

        {/* HERO */}
        <section className="dp-hero dp-animate">
          <div className="dp-hero-overlay" />
          <img src={data.image} alt={data.title} className="dp-hero-bg" />
          <div className="dp-hero-content">
            <button className="dp-back-btn" onClick={() => navigate('/departments')}>← All Departments</button>
            <div className="dp-hero-icon">{data.icon}</div>
            <h1 className="dp-hero-title">{data.title}</h1>
            <p className="dp-hero-tagline">{data.tagline}</p>
            <div className="dp-hero-stats">
              {data.stats.map((s, i) => (
                  <div className="dp-stat-chip" key={i}>
                    <span className="dp-stat-val">{s.value}</span>
                    <span className="dp-stat-label">{s.label}</span>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* TABS */}
        <nav className="dp-tab-nav dp-animate">
          {['overview', 'services', 'contact'].map(tab => (
              <button key={tab} className={`dp-tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
          ))}
        </nav>

        {/* BODY */}
        <main className="dp-body">
          {activeTab === 'overview' && (
              <div className="dp-tab-panel dp-animate">
                <div className="dp-card">
                  <h2 className="dp-section-title">About the Department</h2>
                  <p className="dp-description">{data.description}</p>
                </div>
                <div className="dp-card dp-contact-strip">
                  {[
                    { icon: '📞', label: 'Hotline', val: data.hotline },
                    { icon: '✉️', label: 'Email', val: data.email },
                    { icon: '🕐', label: 'Hours', val: data.workingHours },
                  ].map((c, i) => (
                      <div className="dp-contact-item" key={i}>
                        <span className="dp-contact-icon">{c.icon}</span>
                        <div>
                          <span className="dp-contact-label">{c.label}</span>
                          <span className="dp-contact-val">{c.val}</span>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
          )}

          {activeTab === 'services' && (
              <div className="dp-tab-panel dp-animate">
                <div className="dp-card">
                  <h2 className="dp-section-title">Reportable Issues</h2>
                  <div className="dp-services-grid">
                    {data.services.map((svc, i) => (
                        <div className="dp-service-item" key={i}>
                          <span className="dp-service-dot" />{svc}
                        </div>
                    ))}
                  </div>
                </div>
              </div>
          )}

          {activeTab === 'contact' && (
              <div className="dp-tab-panel dp-animate">
                <div className="dp-card">
                  <h2 className="dp-section-title">Contact Information</h2>
                  <div className="dp-contact-list">
                    {[
                      ['📞 Hotline', data.hotline],
                      ['✉️ Email', data.email],
                      ['🌐 Website', data.website],
                      ['📍 Address', data.address],
                      ['🕐 Hours', data.workingHours],
                    ].map(([label, val]) => (
                        <div className="dp-contact-row" key={label}>
                          <span>{label}</span><strong>{val}</strong>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
          )}

          <div className="dp-actions dp-animate">
            <button className="dp-btn dp-btn-primary" onClick={() => setShowComplaint(true)}>📋 File a Complaint</button>
            <button className="dp-btn dp-btn-secondary" onClick={() => setShowStatus(true)}>🔍 Track Complaint Status</button>
          </div>
        </main>

        {/* MAP */}
        <div className="dp-map-container dp-animate">
          <div className="dp-map-header">
            <span className="dp-map-icon">{data.icon}</span>
            <div>
              <p className="dp-map-title">Nearest {data.shortTitle} Offices</p>
              <p className="dp-map-sub">📍 Your location · OpenStreetMap</p>
            </div>
          </div>
          <LeafletMap osmQuery={data.osmQuery} accentColor={data.accentColor} />
        </div>

        {showComplaint && (
            <ComplaintModal
                data={data}
                profile={profile}
                user={user}
                onClose={() => setShowComplaint(false)}
                onProfileRedirect={() => { setShowComplaint(false); navigate('/profile'); }}
            />
        )}
        {showStatus && (
            <StatusModal
                user={user}
                category={data.shortTitle}
                deptIcon={data.icon}
                statusColor={statusColor}
                onClose={() => setShowStatus(false)}
            />
        )}
      </div>
  );
};

/* ─────────────────────────────────────────────
   COMPLAINT MODAL
───────────────────────────────────────────── */
const ComplaintModal = ({ data, profile, user, onClose, onProfileRedirect }) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [refNum, setRefNum] = useState('');
  const [locationMode, setLocationMode] = useState('profile'); // 'profile' | 'manual'
  const [mapPosition, setMapPosition] = useState(null);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileRef = useRef();
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: profile?.location || '',
    priorityLevel: 'Medium',
  });

  // No profile — show error
  if (!profile) {
    return (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ textAlign: 'center', padding: '40px 32px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚠️</div>
            <h2 style={{ color: '#2c3e50', marginBottom: 8 }}>Profile Incomplete</h2>
            <p style={{ color: '#6b7a8d', marginBottom: 24 }}>
              Please update your profile details before filing a complaint.
            </p>
            <button className="dp-btn dp-btn-primary" onClick={onProfileRedirect}>
              Go to Profile
            </button>
            <button className="dp-btn dp-btn-ghost" onClick={onClose} style={{ marginLeft: 12 }}>
              Cancel
            </button>
          </div>
        </div>
    );
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleLocationSelect = async (latlng) => {
    setMapPosition(latlng);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`);
      const d = await res.json();
      setForm(prev => ({ ...prev, location: d.display_name || `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}` }));
    } catch {
      setForm(prev => ({ ...prev, location: `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}` }));
    }
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const useProfileLocation = () => {
    setLocationMode('profile');
    setForm(prev => ({ ...prev, location: profile.location }));
    setMapPosition(null);
  };

  const validate1 = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    return e;
  };

  const validate2 = () => {
    const e = {};
    if (!form.location.trim()) e.location = 'Please select or confirm a location';
    return e;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('clerkId', user.id);
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('category', data.shortTitle);
      formData.append('location', form.location);
      formData.append('priorityLevel', form.priorityLevel);
      images.forEach(img => formData.append('images', img));

      const res = await fetch('http://localhost:5000/api/complaints', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to submit complaint');
      const result = await res.json();
      setRefNum(result.complaintId);
      setSubmitted(true);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>✕</button>

          {submitted ? (
              <div className="modal-success">
                <div className="modal-success-icon">✅</div>
                <h2>Complaint Submitted!</h2>
                <p>Your reference number:</p>
                <div className="modal-ref">{refNum}</div>
                <p className="modal-ref-note">Save this to track your complaint status.</p>
                <button className="dp-btn dp-btn-primary" onClick={onClose}>Done</button>
              </div>
          ) : (
              <>
                <div className="modal-header">
                  <span className="modal-dept-icon">{data.icon}</span>
                  <div><h2>File a Complaint</h2><p>{data.shortTitle} Department</p></div>
                </div>

                {/* Auto-filled info banner */}
                <div className="modal-autofill-banner">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Details auto-filled from your profile: <strong>{profile.fullName}</strong> · {profile.phone}
                </div>

                <div className="modal-steps">
                  {[1,2,3].map(s => <div key={s} className={`modal-step ${step >= s ? 'active' : ''}`}><span>{s}</span></div>)}
                </div>

                {/* STEP 1 — Complaint Details */}
                {step === 1 && (
                    <div className="modal-form-section">
                      <h3>Complaint Details</h3>
                      <div className={`modal-field ${errors.title ? 'modal-field--error' : ''}`}>
                        <label>Title <span>*</span></label>
                        <input name="title" value={form.title} onChange={handleChange} placeholder="Brief title of the issue" />
                        {errors.title && <span className="modal-error">{errors.title}</span>}
                      </div>
                      <div className={`modal-field ${errors.description ? 'modal-field--error' : ''}`}>
                        <label>Description <span>*</span></label>
                        <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe the issue in detail…" />
                        {errors.description && <span className="modal-error">{errors.description}</span>}
                      </div>
                      <div className="modal-field">
                        <label>Priority Level</label>
                        <select name="priorityLevel" value={form.priorityLevel} onChange={handleChange}>
                          {['Low', 'Medium', 'High', 'Critical'].map(p => <option key={p}>{p}</option>)}
                        </select>
                      </div>
                      <button className="dp-btn dp-btn-primary" onClick={() => {
                        const e = validate1();
                        if (Object.keys(e).length > 0) { setErrors(e); return; }
                        setStep(2);
                      }}>Next →</button>
                    </div>
                )}

                {/* STEP 2 — Location & Images */}
                {step === 2 && (
                    <div className="modal-form-section">
                      <h3>Location & Images</h3>

                      <div className={`modal-field ${errors.location ? 'modal-field--error' : ''}`}>
                        <label>Location <span>*</span></label>
                        <div className="modal-location-btns">
                          <button
                              className={`modal-loc-btn ${locationMode === 'profile' ? 'active' : ''}`}
                              onClick={useProfileLocation}
                          >
                            📍 Use Profile Location
                          </button>
                          <button
                              className={`modal-loc-btn ${locationMode === 'manual' ? 'active' : ''}`}
                              onClick={() => setLocationMode('manual')}
                          >
                            🗺️ Pick on Map
                          </button>
                        </div>

                        {locationMode === 'profile' ? (
                            <div className="modal-location-display">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                              </svg>
                              {form.location}
                            </div>
                        ) : (
                            <div className="modal-map-wrap">
                              {form.location && (
                                  <div className="modal-location-display" style={{ marginBottom: 8 }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2">
                                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                                    </svg>
                                    {form.location}
                                  </div>
                              )}
                              <ComplaintMapPicker onSelect={handleLocationSelect} />
                            </div>
                        )}
                        {errors.location && <span className="modal-error">{errors.location}</span>}
                      </div>

                      <div className="modal-field">
                        <label>Images <small>(optional, max 5)</small></label>
                        <div className="modal-upload" onClick={() => fileRef.current.click()}>
                          {imagePreviews.length > 0 ? (
                              <div className="modal-image-previews">
                                {imagePreviews.map((src, i) => (
                                    <img key={i} src={src} alt={`img-${i}`} className="modal-img-thumb" />
                                ))}
                              </div>
                          ) : (
                              <>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.5">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                  <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                                </svg>
                                <p>Click to upload photos</p>
                                <small>JPG, PNG accepted</small>
                              </>
                          )}
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImages} style={{ display: 'none' }} />
                      </div>

                      <div className="modal-btn-row">
                        <button className="dp-btn dp-btn-ghost" onClick={() => setStep(1)}>← Back</button>
                        <button className="dp-btn dp-btn-primary" onClick={() => {
                          const e = validate2();
                          if (Object.keys(e).length > 0) { setErrors(e); return; }
                          setStep(3);
                        }}>Next →</button>
                      </div>
                    </div>
                )}

                {/* STEP 3 — Review */}
                {step === 3 && (
                    <div className="modal-form-section">
                      <h3>Review & Submit</h3>
                      <div className="modal-review">
                        {[
                          ['Name', profile.fullName],
                          ['Phone', profile.phone],
                          ['Department', data.shortTitle],
                          ['Title', form.title],
                          ['Priority', form.priorityLevel],
                          ['Location', form.location],
                          ['Description', form.description],
                          ['Images', images.length > 0 ? `${images.length} image(s) attached` : 'None'],
                        ].map(([k, v]) => (
                            <div className="modal-review-row" key={k}><span>{k}</span><strong>{v}</strong></div>
                        ))}
                      </div>
                      {errors.submit && <div className="modal-submit-error">{errors.submit}</div>}
                      <div className="modal-btn-row">
                        <button className="dp-btn dp-btn-ghost" onClick={() => setStep(2)}>← Back</button>
                        <button className="dp-btn dp-btn-primary" onClick={handleSubmit} disabled={submitting}>
                          {submitting ? 'Submitting…' : '✅ Submit Complaint'}
                        </button>
                      </div>
                    </div>
                )}
              </>
          )}
        </div>
      </div>
  );
};

/* ─────────────────────────────────────────────
   STATUS TRACKER MODAL — real data from backend
───────────────────────────────────────────── */
const StatusModal = ({ user, category, deptIcon, statusColor, onClose }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [prevStatuses, setPrevStatuses] = useState({});

  // Request notification permission on open
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const showNotification = (title, body) => {
    if (Notification.permission !== 'granted') return;
    const n = new Notification(title, {
      body,
      icon: '/logo192.png',
    });
    n.onclick = () => { window.focus(); n.close(); };
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch(
            `http://localhost:5000/api/complaints/user/${user.id}/category/${encodeURIComponent(category)}`
        );
        if (res.ok) {
          const data = await res.json();

          // Check for status changes and fire notifications
          data.forEach(c => {
            const prev = prevStatuses[c._id];
            if (prev && prev !== c.status) {
              showNotification(
                  `Complaint Updated — ${c.complaintId}`,
                  `"${c.title}" is now ${c.status}`
              );
            }
          });

          // Save current statuses
          const statMap = {};
          data.forEach(c => { statMap[c._id] = c.status; });
          setPrevStatuses(statMap);

          setComplaints(data);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };

    fetchComplaints();
    const interval = setInterval(fetchComplaints, 15000);
    return () => clearInterval(interval);
  }, [user.id, category]);

  const filtered = complaints.filter(c =>
      c.complaintId?.toLowerCase().includes(search.toLowerCase()) ||
      c.title?.toLowerCase().includes(search.toLowerCase())
  );

  const progressWidth = s =>
      s === 'Resolved' ? '100%' : s === 'In Progress' ? '65%' : s === 'Under Review' ? '40%' : s === 'Rejected' ? '100%' : '15%';

  return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>✕</button>
          <div className="modal-header">
            <span style={{ fontSize: '1.6rem' }}>{deptIcon}</span>
            <div><h2>My Complaints</h2><p>{category} Department</p></div>
          </div>

          <div className="modal-field" style={{ marginBottom: 16 }}>
            <input placeholder="Search by ID or title…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="status-list">
            {loading ? (
                <div style={{ textAlign: 'center', padding: 32 }}><div className="dp-map-spinner" style={{ margin: '0 auto' }} /></div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#888', padding: 32 }}>
                  <p style={{ fontSize: '2rem' }}>📭</p>
                  <p>No complaints found for this department.</p>
                </div>
            ) : (
                filtered.map(c => (
                    <div className="status-card" key={c._id}>
                      <div className="status-card-top">
                        <span className="status-id">{c.complaintId}</span>
                        <span className="status-badge" style={{ background: statusColor(c.status) }}>{c.status}</span>
                      </div>
                      <p className="status-title">{c.title}</p>
                      <p className="status-location">📍 {c.location}</p>
                      <div className="status-card-bottom">
                        <span className="status-date">Filed: {new Date(c.createdAt).toLocaleDateString()}</span>
                        <span className={`status-priority priority-${c.priorityLevel?.toLowerCase()}`}>{c.priorityLevel}</span>
                      </div>
                      <div className="status-progress-bar">
                        <div className="status-progress-fill" style={{
                          width: progressWidth(c.status),
                          background: c.status === 'Rejected' ? '#e63946' : statusColor(c.status),
                        }} />
                      </div>

                      {/* Agent Response */}
                      {c.agentResponse && (
                          <div style={{marginTop:10,background:'rgba(24,95,165,0.12)',border:'1px solid rgba(24,95,165,0.3)',borderRadius:8,padding:'10px 14px'}}>
                            <p style={{fontSize:'0.68rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'#B5D4F4',marginBottom:5}}>💬 Agent Response</p>
                            <p style={{fontSize:'0.85rem',color:'rgba(241,239,232,0.88)',lineHeight:1.6,margin:0}}>{c.agentResponse}</p>
                          </div>
                      )}

                      {/* Resolved */}
                      {c.status === 'Resolved' && (
                          <div style={{marginTop:8,background:'rgba(29,158,117,0.12)',border:'1px solid rgba(29,158,117,0.3)',borderRadius:8,padding:'10px 14px'}}>
                            <p style={{fontSize:'0.68rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'#34d399',marginBottom:5}}>✅ Resolved</p>
                            <p style={{fontSize:'0.82rem',color:'rgba(241,239,232,0.7)',margin:0}}>
                              {c.resolvedDate ? `Resolved on ${new Date(c.resolvedDate).toLocaleDateString()}` : 'Issue resolved'}
                            </p>
                            {c.resolvedImageUrls?.length > 0 && (
                                <div style={{display:'flex',gap:6,marginTop:8,flexWrap:'wrap'}}>
                                  {c.resolvedImageUrls.map((url,i) => (
                                      <img key={i} src={`http://localhost:5000${url}`} alt="" style={{width:64,height:64,objectFit:'cover',borderRadius:6,cursor:'pointer',border:'1px solid rgba(29,158,117,0.3)'}} onClick={()=>window.open(`http://localhost:5000${url}`)} />
                                  ))}
                                </div>
                            )}
                          </div>
                      )}

                      {/* Rejected */}
                      {c.status === 'Rejected' && c.adminNote && (
                          <div style={{marginTop:8,background:'rgba(220,38,38,0.1)',border:'1px solid rgba(220,38,38,0.3)',borderRadius:8,padding:'10px 14px'}}>
                            <p style={{fontSize:'0.68rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'#f87171',marginBottom:5}}>❌ Rejected</p>
                            <p style={{fontSize:'0.82rem',color:'rgba(241,239,232,0.7)',margin:0}}>{c.adminNote}</p>
                          </div>
                      )}
                    </div>
                ))
            )}
          </div>

          <p style={{fontSize:11,color:'#4a5568',textAlign:'center',marginTop:12}}>
            🔄 Auto-refreshes every 15 seconds
          </p>
        </div>
      </div>
  );
};

export default DepartmentPage;