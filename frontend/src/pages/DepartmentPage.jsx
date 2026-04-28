import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DepartmentPage.css';

/* ─────────────────────────────────────────────
   DEPARTMENT DATA
───────────────────────────────────────────── */
const DEPT_DATA = {
  water: {
    key: 'water',
    icon: '💧',
    title: 'National Water Supply & Drainage Board',
    shortTitle: 'Water Supply',
    tagline: 'Safe Water for Every Home',
    accentColor: '#185FA5',
    lightColor: '#B5D4F4',
    description:
      'The National Water Supply & Drainage Board (NWSDB) is the apex body responsible for providing potable water and sanitation services across Sri Lanka. Established under Act No. 2 of 1974, NWSDB serves over 6 million connections island-wide ensuring safe drinking water and proper wastewater management.',
    services: [
      'Pipe breaks & leakages',
      'Water shortages & supply interruptions',
      'Contamination & quality issues',
      'New connection requests',
      'Meter reading disputes',
      'Drainage blockages',
    ],
    hotline: '1954',
    email: 'info@waterboard.lk',
    website: 'www.waterboard.lk',
    address: 'Galle Road, Ratmalana, Sri Lanka',
    workingHours: 'Mon – Fri: 8:30 AM – 4:30 PM | Emergency: 24/7',
    mapKeyword: 'water supply board',
    stats: [{ label: 'Connections', value: '6M+' }, { label: 'Coverage', value: '85%' }, { label: 'Staff', value: '14,500+' }],
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&q=80',
  },
  electricity: {
    key: 'electricity',
    icon: '⚡',
    title: 'Ceylon Electricity Board',
    shortTitle: 'Electricity',
    tagline: 'Powering the Nation Forward',
    accentColor: '#e6a817',
    lightColor: '#fff3cd',
    description:
      'The Ceylon Electricity Board (CEB) is the state electricity utility of Sri Lanka, responsible for generation, transmission and distribution of electricity throughout the island. Founded in 1969, CEB operates an installed capacity of over 4,000 MW serving millions of residential, commercial and industrial consumers.',
    services: [
      'Power outages & blackouts',
      'Electrical faults & sparks',
      'Transformer failures',
      'Street light repairs',
      'High voltage line hazards',
      'Billing & meter disputes',
    ],
    hotline: '1987',
    email: 'ceb@ceb.lk',
    website: 'www.ceb.lk',
    address: 'No. 50, Sir Chittampalam A. Gardiner Mawatha, Colombo 2',
    workingHours: 'Mon – Fri: 8:00 AM – 5:00 PM | Emergency: 24/7',
    mapKeyword: 'Ceylon Electricity Board',
    stats: [{ label: 'MW Capacity', value: '4,000+' }, { label: 'Consumers', value: '7.2M' }, { label: 'Coverage', value: '99%' }],
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80',
  },
  garbage: {
    key: 'garbage',
    icon: '🗑️',
    title: 'Local Municipal Council – Sanitation',
    shortTitle: 'Garbage & Sanitation',
    tagline: 'Clean Cities, Healthy Lives',
    accentColor: '#1D9E75',
    lightColor: '#d4f5ec',
    description:
      'Municipal Councils across Sri Lanka manage solid waste collection, disposal and urban sanitation. They coordinate garbage trucks, recycling initiatives and drain cleaning to maintain public hygiene. The Central Environmental Authority also oversees compliance with waste management regulations to ensure a clean environment for all citizens.',
    services: [
      'Uncollected household waste',
      'Illegal dumping sites',
      'Blocked storm drains',
      'Overflowing public bins',
      'Medical waste disposal',
      'Recycling centre requests',
    ],
    hotline: '1920',
    email: 'sanitation@municipal.lk',
    website: 'www.mc.lk',
    address: 'Town Hall, Colombo 7',
    workingHours: 'Mon – Sat: 7:00 AM – 5:00 PM',
    mapKeyword: 'municipal council waste management',
    stats: [{ label: 'Daily Tonnes', value: '6,700' }, { label: 'Vehicles', value: '1,200+' }, { label: 'Workers', value: '18,000' }],
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
  },
  health: {
    key: 'health',
    icon: '🏥',
    title: 'Ministry of Health',
    shortTitle: 'Health',
    tagline: 'A Healthier Sri Lanka for All',
    accentColor: '#e63946',
    lightColor: '#fde8ea',
    description:
      'The Ministry of Health oversees the national health system, coordinating government hospitals, district health services and preventive health programmes island-wide. Sri Lanka maintains one of the highest health outcomes in South Asia with a free public healthcare model covering all citizens.',
    services: [
      'Public health hazards',
      'Unsanitary food stalls',
      'Disease outbreak alerts',
      'Hospital facility complaints',
      'Ambulance service issues',
      'Illegal medical practices',
    ],
    hotline: '1926',
    email: 'info@health.gov.lk',
    website: 'www.health.gov.lk',
    address: 'Suwasiripaya, 385 Rev. Baddegama Wimalawansa Thero Mw, Colombo 10',
    workingHours: 'Mon – Fri: 8:30 AM – 4:30 PM | Emergency: 24/7',
    mapKeyword: 'government hospital',
    stats: [{ label: 'Hospitals', value: '620+' }, { label: 'Beds', value: '75,000' }, { label: 'Doctors', value: '22,000+' }],
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
  },
  police: {
    key: 'police',
    icon: '👮',
    title: 'Sri Lanka Police',
    shortTitle: 'Police',
    tagline: 'Serving & Protecting Every Citizen',
    accentColor: '#042C53',
    lightColor: '#ccd6e0',
    description:
      'Sri Lanka Police is the national law enforcement agency established in 1866, responsible for maintaining law and order, preventing and investigating crime, and protecting the public. With over 85,000 officers serving across 500+ police stations island-wide, the force upholds the rule of law and citizen safety.',
    services: [
      'Crimes & theft reports',
      'Suspicious activity',
      'Traffic violations',
      'Domestic violence',
      'Missing persons',
      'Public disturbances',
    ],
    hotline: '119',
    email: 'info@police.lk',
    website: 'www.police.lk',
    address: 'Police Headquarters, Colombo 1',
    workingHours: '24 Hours / 7 Days',
    mapKeyword: 'police station',
    stats: [{ label: 'Officers', value: '85,000+' }, { label: 'Stations', value: '500+' }, { label: 'Districts', value: '25' }],
    image: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800&q=80',
  },
  agriculture: {
    key: 'agriculture',
    icon: '🌾',
    title: 'Ministry of Agriculture',
    shortTitle: 'Agriculture',
    tagline: 'Growing a Prosperous Nation',
    accentColor: '#5a8a3c',
    lightColor: '#dff0d8',
    description:
      'The Ministry of Agriculture formulates and implements national agricultural policies to ensure food security and rural prosperity. It oversees paddy cultivation, vegetable farming, irrigation infrastructure, fertiliser distribution and research into sustainable farming practices for Sri Lanka\'s 1.8 million farming families.',
    services: [
      'Crop disease & pest outbreaks',
      'Irrigation failures',
      'Fertiliser supply issues',
      'Farming infrastructure damage',
      'Market price complaints',
      'Agricultural subsidy queries',
    ],
    hotline: '1920',
    email: 'info@agrimin.gov.lk',
    website: 'www.agrimin.gov.lk',
    address: 'Govijana Mandiraya, 80/5 Rajamalwatta Road, Battaramulla',
    workingHours: 'Mon – Fri: 8:30 AM – 4:30 PM',
    mapKeyword: 'Department of Agriculture',
    stats: [{ label: 'Farm Families', value: '1.8M' }, { label: 'Arable Land', value: '2.2M ha' }, { label: 'Crops', value: '200+' }],
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80',
  },
  education: {
    key: 'education',
    icon: '🎓',
    title: 'Ministry of Education',
    shortTitle: 'Education',
    tagline: 'Knowledge Builds the Future',
    accentColor: '#7b2d8b',
    lightColor: '#ede0f5',
    description:
      'The Ministry of Education governs Sri Lanka\'s school education system, one of the most progressive in South Asia with a 92%+ literacy rate. It manages over 10,000 government schools, curriculum development, teacher training, examinations and scholarship programmes ensuring quality education for every child.',
    services: [
      'School infrastructure damage',
      'Teacher shortage reports',
      'Examination irregularities',
      'Scholarship grievances',
      'School transportation issues',
      'Facility sanitation problems',
    ],
    hotline: '1979',
    email: 'info@moe.gov.lk',
    website: 'www.moe.gov.lk',
    address: 'Isurupaya, Battaramulla',
    workingHours: 'Mon – Fri: 8:30 AM – 4:30 PM',
    mapKeyword: 'Ministry of Education Sri Lanka',
    stats: [{ label: 'Schools', value: '10,000+' }, { label: 'Students', value: '4.2M' }, { label: 'Literacy', value: '92%' }],
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
  },
  roads: {
    key: 'roads',
    icon: '🛣️',
    title: 'Road Development Authority',
    shortTitle: 'Roads & Highways',
    tagline: 'Connecting Communities Across Sri Lanka',
    accentColor: '#6c4e27',
    lightColor: '#f2e8de',
    description:
      'The Road Development Authority (RDA) is responsible for the planning, design, construction and maintenance of the national road network spanning over 12,000 km of highways and expressways. Established under Act No. 73 of 1981, RDA ensures safe and efficient road infrastructure across the island.',
    services: [
      'Potholes & road damage',
      'Broken streetlights',
      'Highway safety hazards',
      'Bridge structural issues',
      'Road marking complaints',
      'Unauthorized road excavations',
    ],
    hotline: '1955',
    email: 'info@rda.gov.lk',
    website: 'www.rda.gov.lk',
    address: 'P.O. Box 1533, 8th Floor, Sethsiripaya, Battaramulla',
    workingHours: 'Mon – Fri: 8:30 AM – 4:30 PM | Emergency: 24/7',
    mapKeyword: 'Road Development Authority',
    stats: [{ label: 'Road Network', value: '12,000 km' }, { label: 'Expressways', value: '340 km' }, { label: 'Bridges', value: '4,200+' }],
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
  },
  environment: {
    key: 'environment',
    icon: '🌿',
    title: 'Central Environmental Authority',
    shortTitle: 'Environment',
    tagline: 'Protecting Nature, Sustaining Life',
    accentColor: '#1D9E75',
    lightColor: '#d4f5ec',
    description:
      'The Central Environmental Authority (CEA) is the national regulatory body for environmental protection in Sri Lanka, established under the National Environmental Act No. 47 of 1980. CEA enforces environmental standards, grants pollution control licences and investigates violations to safeguard Sri Lanka\'s rich biodiversity.',
    services: [
      'Illegal deforestation',
      'Industrial pollution',
      'Wildlife crime reports',
      'Coastal erosion issues',
      'Air & noise pollution',
      'Illegal mining activities',
    ],
    hotline: '1992',
    email: 'info@cea.lk',
    website: 'www.cea.lk',
    address: 'No. 104, Denzil Kobbekaduwa Mawatha, Battaramulla',
    workingHours: 'Mon – Fri: 8:30 AM – 4:30 PM',
    mapKeyword: 'Central Environmental Authority',
    stats: [{ label: 'Forest Cover', value: '33%' }, { label: 'Protected Areas', value: '22%' }, { label: 'Species', value: '3,500+' }],
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
  },
  transport: {
    key: 'transport',
    icon: '🚌',
    title: 'National Transport Commission',
    shortTitle: 'Transport',
    tagline: 'Moving Sri Lanka, Every Day',
    accentColor: '#185FA5',
    lightColor: '#B5D4F4',
    description:
      'The National Transport Commission (NTC) regulates public passenger transport services in Sri Lanka, licensing bus routes, setting fare structures and ensuring service quality standards. NTC coordinates with the Sri Lanka Transport Board and private operators to maintain a reliable island-wide bus network.',
    services: [
      'Bus route service failures',
      'Overcharging & fare disputes',
      'Unsafe vehicle conditions',
      'Driver misconduct',
      'Route schedule problems',
      'Bus stop infrastructure issues',
    ],
    hotline: '1955',
    email: 'info@ntc.gov.lk',
    website: 'www.ntc.gov.lk',
    address: 'Samagipaya, 178 Baseline Road, Colombo 9',
    workingHours: 'Mon – Fri: 8:30 AM – 4:30 PM',
    mapKeyword: 'National Transport Commission',
    stats: [{ label: 'Routes', value: '8,500+' }, { label: 'Passengers/Day', value: '5M+' }, { label: 'Operators', value: '12,000+' }],
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80',
  },
  municipal: {
    key: 'municipal',
    icon: '🏛️',
    title: 'Municipal Council',
    shortTitle: 'Municipal Council',
    tagline: 'Governance at the Heart of Your Community',
    accentColor: '#042C53',
    lightColor: '#ccd6e0',
    description:
      'Municipal Councils are the primary urban local government authorities in Sri Lanka, responsible for planning, infrastructure, public health, licensing and community development within their jurisdictions. They serve as the closest link between citizens and government, handling day-to-day civic needs at the grassroots level.',
    services: [
      'Building permit violations',
      'Noise & nuisance complaints',
      'Encroachment on public land',
      'Unauthorized constructions',
      'Public amenity maintenance',
      'Business licence violations',
    ],
    hotline: '1920',
    email: 'info@mc.lk',
    website: 'www.mc.lk',
    address: 'Town Hall, Colombo 7',
    workingHours: 'Mon – Fri: 8:30 AM – 4:30 PM',
    mapKeyword: 'municipal council',
    stats: [{ label: 'Councils', value: '23' }, { label: 'Urban Pop.', value: '18.2%' }, { label: 'Services', value: '50+' }],
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
  },
  labour: {
    key: 'labour',
    icon: '💼',
    title: 'Department of Labour',
    shortTitle: 'Labour & Employment',
    tagline: 'Protecting Workers\' Rights Nationwide',
    accentColor: '#c0392b',
    lightColor: '#fdecea',
    description:
      'The Department of Labour enforces labour laws and protects the rights of workers across all sectors in Sri Lanka. It investigates workplace violations, mediates industrial disputes, administers workmen\'s compensation and ensures compliance with Factories Ordinance and Employment of Women, Young Persons and Children Act.',
    services: [
      'Unfair dismissal complaints',
      'Workplace safety hazards',
      'Wage & overtime violations',
      'Child labour reports',
      'Maternity leave disputes',
      'Illegal working conditions',
    ],
    hotline: '1931',
    email: 'info@labourdept.gov.lk',
    website: 'www.labourdept.gov.lk',
    address: 'Narahenpita Labour Secretariat, Colombo 5',
    workingHours: 'Mon – Fri: 8:30 AM – 4:30 PM',
    mapKeyword: 'Department of Labour Sri Lanka',
    stats: [{ label: 'Workforce', value: '8.3M' }, { label: 'Inspectors', value: '500+' }, { label: 'Cases/Year', value: '15,000+' }],
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
  },
};

/* ─────────────────────────────────────────────
   MOCK COMPLAINT STATUS DATA
───────────────────────────────────────────── */
const MOCK_COMPLAINTS = [
  { id: 'CMP-2024-0041', title: 'Pipe burst near Kandy Road', status: 'In Progress', date: '2024-05-10', priority: 'High' },
  { id: 'CMP-2024-0038', title: 'No water supply for 3 days', status: 'Resolved', date: '2024-05-07', priority: 'Critical' },
  { id: 'CMP-2024-0029', title: 'Contaminated water smell', status: 'Under Review', date: '2024-04-29', priority: 'Medium' },
];

/* ─────────────────────────────────────────────
   GOOGLE MAPS CONFIG
───────────────────────────────────────────── */
// Replace with your actual Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const DepartmentPage = () => {
  const { dept } = useParams();
  const navigate = useNavigate();
  const data = DEPT_DATA[dept];

  const [showComplaint, setShowComplaint] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  /* ── Load Google Maps ── */
  useEffect(() => {
    if (!data) return;
    const scriptId = 'gmap-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initDeptMap`;
      script.async = true;
      document.head.appendChild(script);
    }

    window.initDeptMap = () => initMap(data.mapKeyword);

    if (window.google && window.google.maps) {
      initMap(data.mapKeyword);
    }

    return () => { /* cleanup */ };
    // eslint-disable-next-line
  }, [dept]);

  const initMap = (keyword) => {
    if (!mapRef.current || !window.google) return;

    const defaultCenter = { lat: 7.8731, lng: 80.7718 }; // Sri Lanka center

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: defaultCenter,
      styles: darkMapStyle,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });
    mapInstanceRef.current = map;

    // Try geolocation first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          map.setCenter(userLoc);
          map.setZoom(13);

          // User marker
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

          // Search for nearby department offices
          const service = new window.google.maps.places.PlacesService(map);
          service.nearbySearch(
            { location: userLoc, radius: 15000, keyword },
            (results, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                results.forEach((place) => {
                  const marker = new window.google.maps.Marker({
                    position: place.geometry.location,
                    map,
                    title: place.name,
                    icon: {
                      url: `https://maps.google.com/mapfiles/ms/icons/blue-dot.png`,
                    },
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
        () => {
          // Geolocation denied – show fallback Sri Lanka map
          showFallbackOffices(map, keyword);
        }
      );
    } else {
      showFallbackOffices(map, keyword);
    }
  };

  const showFallbackOffices = (map, keyword) => {
    if (!window.google) return;
    const service = new window.google.maps.places.PlacesService(map);
    service.textSearch({ query: `${keyword} Sri Lanka` }, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        map.setCenter(results[0].geometry.location);
        results.slice(0, 8).forEach((place) => {
          const marker = new window.google.maps.Marker({
            position: place.geometry.location,
            map,
            title: place.name,
          });
          const info = new window.google.maps.InfoWindow({
            content: `<div style="font-family:sans-serif;padding:4px"><strong>${place.name}</strong><br/>${place.formatted_address || ''}</div>`,
          });
          marker.addListener('click', () => info.open(map, marker));
        });
      }
    });
  };

  /* ── Animate on mount ── */
  useEffect(() => {
    const els = document.querySelectorAll('.dp-animate');
    els.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      setTimeout(() => {
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, i * 100);
    });
  }, [dept]);

  if (!data) {
    return (
      <div className="dp-not-found">
        <h2>Department not found</h2>
        <button onClick={() => navigate('/report')}>← Back to Departments</button>
      </div>
    );
  }

  const statusColor = (s) => {
    if (s === 'Resolved') return '#1D9E75';
    if (s === 'In Progress') return '#185FA5';
    if (s === 'Under Review') return '#e6a817';
    return '#888';
  };

  return (
    <div className="dp-root" style={{ '--accent': data.accentColor, '--light': data.lightColor }}>

      {/* ── HERO ── */}
      <section className="dp-hero dp-animate">
        <div className="dp-hero-overlay" />
        <img src={data.image} alt={data.title} className="dp-hero-bg" />
        <div className="dp-hero-content">
          <button className="dp-back-btn" onClick={() => navigate('/report')}>
            ← All Departments
          </button>
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

      {/* ── TAB NAV ── */}
      <nav className="dp-tab-nav dp-animate">
        {['overview', 'services', 'contact'].map(tab => (
          <button
            key={tab}
            className={`dp-tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* ── MAIN BODY ── */}
      <main className="dp-body">

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="dp-tab-panel dp-animate">
            <div className="dp-card dp-overview-card">
              <h2 className="dp-section-title">About the Department</h2>
              <p className="dp-description">{data.description}</p>
            </div>

            <div className="dp-card dp-contact-strip">
              <div className="dp-contact-item">
                <span className="dp-contact-icon">📞</span>
                <div>
                  <span className="dp-contact-label">Hotline</span>
                  <span className="dp-contact-val">{data.hotline}</span>
                </div>
              </div>
              <div className="dp-contact-item">
                <span className="dp-contact-icon">✉️</span>
                <div>
                  <span className="dp-contact-label">Email</span>
                  <span className="dp-contact-val">{data.email}</span>
                </div>
              </div>
              <div className="dp-contact-item">
                <span className="dp-contact-icon">🕐</span>
                <div>
                  <span className="dp-contact-label">Hours</span>
                  <span className="dp-contact-val">{data.workingHours}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SERVICES TAB */}
        {activeTab === 'services' && (
          <div className="dp-tab-panel dp-animate">
            <div className="dp-card">
              <h2 className="dp-section-title">Reportable Issues</h2>
              <div className="dp-services-grid">
                {data.services.map((svc, i) => (
                  <div className="dp-service-item" key={i}>
                    <span className="dp-service-dot" />
                    {svc}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CONTACT TAB */}
        {activeTab === 'contact' && (
          <div className="dp-tab-panel dp-animate">
            <div className="dp-card">
              <h2 className="dp-section-title">Contact Information</h2>
              <div className="dp-contact-list">
                <div className="dp-contact-row">
                  <span>📞 Hotline</span><strong>{data.hotline}</strong>
                </div>
                <div className="dp-contact-row">
                  <span>✉️ Email</span><strong>{data.email}</strong>
                </div>
                <div className="dp-contact-row">
                  <span>🌐 Website</span><strong>{data.website}</strong>
                </div>
                <div className="dp-contact-row">
                  <span>📍 Address</span><strong>{data.address}</strong>
                </div>
                <div className="dp-contact-row">
                  <span>🕐 Hours</span><strong>{data.workingHours}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ACTION BUTTONS ── */}
        <div className="dp-actions dp-animate">
          <button className="dp-btn dp-btn-primary" onClick={() => setShowComplaint(true)}>
            📋 File a Complaint
          </button>
          <button className="dp-btn dp-btn-secondary" onClick={() => setShowStatus(true)}>
            🔍 Track Complaint Status
          </button>
        </div>
      </main>

      {/* ── MAP (bottom-left) ── */}
      <div className="dp-map-container dp-animate">
        <div className="dp-map-header">
          <span className="dp-map-icon">{data.icon}</span>
          <div>
            <p className="dp-map-title">Nearest {data.shortTitle} Offices</p>
            <p className="dp-map-sub">Based on your location</p>
          </div>
        </div>
        <div ref={mapRef} className="dp-map" id="dept-map">
          {/* Fallback if Maps not loaded */}
          <div className="dp-map-fallback">
            <p>🗺️ Map loading…</p>
            <p style={{ fontSize: '0.75rem', color: '#aaa', marginTop: 6 }}>
              Add your Google Maps API key in DepartmentPage.jsx
            </p>
          </div>
        </div>
      </div>

      {/* ── COMPLAINT MODAL ── */}
      {showComplaint && (
        <ComplaintModal data={data} onClose={() => setShowComplaint(false)} />
      )}

      {/* ── STATUS MODAL ── */}
      {showStatus && (
        <StatusModal
          complaints={MOCK_COMPLAINTS}
          dept={data.shortTitle}
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
const ComplaintModal = ({ data, onClose }) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', nic: '', phone: '', email: '',
    issue: data.services[0], description: '', location: '', priority: 'Medium',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const refNum = `CMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

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
            <p className="modal-ref-note">Save this number to track your complaint status.</p>
            <button className="dp-btn dp-btn-primary" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <span className="modal-dept-icon">{data.icon}</span>
              <div>
                <h2>File a Complaint</h2>
                <p>{data.shortTitle} Department</p>
              </div>
            </div>

            <div className="modal-steps">
              {[1, 2, 3].map(s => (
                <div key={s} className={`modal-step ${step >= s ? 'active' : ''}`}>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            {step === 1 && (
              <div className="modal-form-section">
                <h3>Personal Information</h3>
                <div className="modal-field-row">
                  <div className="modal-field">
                    <label>Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Kamal Perera" />
                  </div>
                  <div className="modal-field">
                    <label>NIC Number *</label>
                    <input name="nic" value={form.nic} onChange={handleChange} placeholder="e.g. 199012345678" />
                  </div>
                </div>
                <div className="modal-field-row">
                  <div className="modal-field">
                    <label>Phone *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 0711234567" />
                  </div>
                  <div className="modal-field">
                    <label>Email</label>
                    <input name="email" value={form.email} onChange={handleChange} placeholder="optional" />
                  </div>
                </div>
                <button
                  className="dp-btn dp-btn-primary"
                  onClick={() => setStep(2)}
                  disabled={!form.name || !form.nic || !form.phone}
                >
                  Next →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="modal-form-section">
                <h3>Issue Details</h3>
                <div className="modal-field">
                  <label>Issue Type *</label>
                  <select name="issue" value={form.issue} onChange={handleChange}>
                    {data.services.map((s, i) => <option key={i}>{s}</option>)}
                  </select>
                </div>
                <div className="modal-field">
                  <label>Priority</label>
                  <select name="priority" value={form.priority} onChange={handleChange}>
                    {['Low', 'Medium', 'High', 'Critical'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="modal-field">
                  <label>Location *</label>
                  <input name="location" value={form.location} onChange={handleChange} placeholder="Street / City / District" />
                </div>
                <div className="modal-field">
                  <label>Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe the issue in detail..." />
                </div>
                <div className="modal-btn-row">
                  <button className="dp-btn dp-btn-ghost" onClick={() => setStep(1)}>← Back</button>
                  <button
                    className="dp-btn dp-btn-primary"
                    onClick={() => setStep(3)}
                    disabled={!form.issue || !form.location || !form.description}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="modal-form-section">
                <h3>Review & Submit</h3>
                <div className="modal-review">
                  <div className="modal-review-row"><span>Name</span><strong>{form.name}</strong></div>
                  <div className="modal-review-row"><span>NIC</span><strong>{form.nic}</strong></div>
                  <div className="modal-review-row"><span>Phone</span><strong>{form.phone}</strong></div>
                  <div className="modal-review-row"><span>Issue</span><strong>{form.issue}</strong></div>
                  <div className="modal-review-row"><span>Priority</span><strong>{form.priority}</strong></div>
                  <div className="modal-review-row"><span>Location</span><strong>{form.location}</strong></div>
                  <div className="modal-review-row"><span>Description</span><strong>{form.description}</strong></div>
                </div>
                <div className="modal-btn-row">
                  <button className="dp-btn dp-btn-ghost" onClick={() => setStep(2)}>← Back</button>
                  <button className="dp-btn dp-btn-primary" onClick={handleSubmit}>
                    ✅ Submit Complaint
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
   STATUS TRACKER MODAL
───────────────────────────────────────────── */
const StatusModal = ({ complaints, dept, statusColor, onClose }) => {
  const [search, setSearch] = useState('');
  const filtered = complaints.filter(c =>
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-header">
          <span style={{ fontSize: '1.6rem' }}>🔍</span>
          <div>
            <h2>Complaint Status</h2>
            <p>{dept} Department</p>
          </div>
        </div>

        <div className="modal-field" style={{ marginBottom: 16 }}>
          <input
            placeholder="Search by ID or title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="status-list">
          {filtered.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888', padding: 24 }}>No complaints found.</p>
          ) : (
            filtered.map(c => (
              <div className="status-card" key={c.id}>
                <div className="status-card-top">
                  <span className="status-id">{c.id}</span>
                  <span className="status-badge" style={{ background: statusColor(c.status) }}>
                    {c.status}
                  </span>
                </div>
                <p className="status-title">{c.title}</p>
                <div className="status-card-bottom">
                  <span className="status-date">Filed: {c.date}</span>
                  <span className={`status-priority priority-${c.priority.toLowerCase()}`}>{c.priority}</span>
                </div>
                <div className="status-progress-bar">
                  <div
                    className="status-progress-fill"
                    style={{
                      width: c.status === 'Resolved' ? '100%' : c.status === 'In Progress' ? '60%' : '30%',
                      background: statusColor(c.status),
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <p className="status-note">
          * Showing demo data. Connect to backend for live complaint tracking.
        </p>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   DARK MAP STYLE
───────────────────────────────────────────── */
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0e1a2b' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0e1a2b' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#132a13' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#3C7A5E' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a2d44' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#185FA5' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
  { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#042C53' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
  { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] },
];

export default DepartmentPage;
