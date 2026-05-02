import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Home.css';
import WeatherSection from '../components/WeatherCard';
import { useNavigate } from 'react-router-dom';
import Chat from '../components/Chat';

gsap.registerPlugin(ScrollTrigger);

/* ── Count-up hook ── */
const useCountUp = (target, duration = 2000) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                const isFloat = target % 1 !== 0;
                const startTime = performance.now();
                const animate = (now) => {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    setCount(isFloat ? parseFloat((eased * target).toFixed(1)) : Math.floor(eased * target));
                    if (progress < 1) requestAnimationFrame(animate);
                };
                requestAnimationFrame(animate);
            }
        }, { threshold: 0.4 });
        observer.observe(el);
        return () => observer.disconnect();
    }, [target, duration]);

    return { count, ref };
};

const parseStatValue = (str) => {
    const num = parseFloat(str.replace(/[^0-9.]/g, ''));
    const prefix = str.match(/^[^0-9]*/)?.[0] || '';
    const suffix = str.match(/[^0-9.]+$/)?.[0] || '';
    return { num, prefix, suffix };
};

const StatItem = ({ number, label }) => {
    const { num, prefix, suffix } = parseStatValue(number);
    const { count, ref } = useCountUp(num, 2000);
    return (
        <div className="stat-item" ref={ref}>
            <h3>{prefix}{count}{suffix}</h3>
            <p>{label}</p>
        </div>
    );
};

const Home = () => {
    const heroRef       = useRef(null);
    const titleRef      = useRef(null);
    const subtitleRef   = useRef(null);
    const searchRef     = useRef(null);
    const servicesRef   = useRef(null);
    const hiwRef        = useRef(null);
    const searchWrapRef = useRef(null);
    const navigate      = useNavigate();

    const [chatOpen, setChatOpen]       = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setResults]   = useState([]);
    const [searchLoading, setSearchLoad]= useState(false);
    const [searchFocused, setFocused]   = useState(false);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
                setFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Search handler
    const handleSearch = async (val) => {
        setSearchQuery(val);
        if (val.trim().length < 2) { setResults([]); return; }
        setSearchLoad(true);
        try {
            const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(val)}`);
            if (res.ok) setResults(await res.json());
        } catch(e) {}
        setSearchLoad(false);
    };

    // GSAP animations
    useEffect(() => {
        gsap.set([titleRef.current, subtitleRef.current, searchRef.current], { opacity: 0, y: 30 });

        const tl = gsap.timeline({ delay: 0.1 });
        tl.to(titleRef.current,    { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' })
            .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
            .to(searchRef.current,   { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');

        gsap.fromTo('.service-card',
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.55, stagger: 0.09, ease: 'power3.out',
                scrollTrigger: { trigger: servicesRef.current, start: 'top 85%', once: true } }
        );
        gsap.fromTo('.services-section .section-header h2',
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
                scrollTrigger: { trigger: '.services-section .section-header', start: 'top 88%', once: true } }
        );
        gsap.fromTo('.services-section .section-header p',
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.5, delay: 0.15, ease: 'power3.out',
                scrollTrigger: { trigger: '.services-section .section-header', start: 'top 88%', once: true } }
        );
        gsap.fromTo('.hiw-left .hiw-tag, .hiw-left h2, .hiw-left p, .hiw-buttons',
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
                scrollTrigger: { trigger: hiwRef.current, start: 'top 80%', once: true } }
        );
        gsap.fromTo('.hiw-step',
            { opacity: 0, x: 40 },
            { opacity: 1, x: 0, duration: 0.5, stagger: 0.18, ease: 'power3.out',
                scrollTrigger: { trigger: hiwRef.current, start: 'top 80%', once: true } }
        );
        gsap.fromTo('.weather-section',
            { opacity: 0, y: 40, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: '.weather-section', start: 'top 88%', once: true } }
        );
        gsap.fromTo('.weather-card',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power3.out',
                scrollTrigger: { trigger: '.weather-section', start: 'top 85%', once: true } }
        );
        gsap.fromTo('.cta-section h2, .cta-section p, .cta-buttons',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out',
                scrollTrigger: { trigger: '.cta-section', start: 'top 85%', once: true } }
        );

        const t = setTimeout(() => ScrollTrigger.refresh(), 300);
        return () => {
            clearTimeout(t);
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, []);

    const services = [
        { icon: '💧', title: 'Water Supply',   desc: 'Report pipe breaks, water shortages and supply issues',        color: '#185FA5', path: '/report/water' },
        { icon: '⚡', title: 'Electricity',    desc: 'Report power outages, electrical faults and breakdowns',        color: '#1D9E75', path: '/report/electricity' },
        { icon: '🗑️', title: 'Garbage',        desc: 'Report uncollected waste, illegal dumps and sanitation issues', color: '#042C53', path: '/report/garbage' },
        { icon: '🏥', title: 'Health',         desc: 'Report health hazards and request medical assistance',          color: '#185FA5', path: '/report/health' },
        { icon: '👮', title: 'Police',         desc: 'Report crimes, suspicious activity and public safety issues',   color: '#1D9E75', path: '/report/police' },
        { icon: '🚒', title: 'Fire & Rescue',  desc: 'Report fire emergencies, rescue situations and fire hazards',   color: '#f97316', path: '/report/fire' },
        { icon: '🌾', title: 'Agriculture',    desc: 'Report crop diseases, irrigation issues and farming problems',  color: '#185FA5', path: '/report/agriculture' },
        { icon: '🎓', title: 'Education',      desc: 'Report school infrastructure and educational service issues',   color: '#1D9E75', path: '/report/education' },
    ];

    const stats = [
        { number: '12450+', label: 'Complaints Resolved' },
        { number: '9',      label: 'Provinces Covered' },
        { number: '8+',     label: 'Government Departments' },
        { number: '24/7',   label: 'Emergency Support' },
    ];

    const TYPE_LABELS = {
        department: 'Departments',
        emergency:  'Emergency Services',
        about:      'About',
        page:       'Pages',
        chatbot:    'Chat & Support',
        gallery:    'Gallery',
    };

    return (
        <div className="home">

            {/* ── HERO ── */}
            <section className="hero" ref={heroRef}>
                <div className="hero-content">
                    <h1 ref={titleRef}>
                        Public Problem Reporting<br />System Sri Lanka
                    </h1>
                    <p ref={subtitleRef}>
                        A unified platform connecting citizens with government departments.
                        Report issues, track resolutions, and help build a better Sri Lanka.
                    </p>

                    {/* SEARCH */}
                    <div ref={searchRef} style={{width:'100%',maxWidth:620,margin:'0 auto'}}>
                        <div ref={searchWrapRef} style={{position:'relative',display:'flex',gap:0}}>
                            <input
                                type="text"
                                className="hero-search-input"
                                placeholder="Search departments, emergency services, complaints…"
                                value={searchQuery}
                                onChange={e => handleSearch(e.target.value)}
                                onFocus={() => setFocused(true)}
                                autoComplete="off"
                                style={{
                                    flex:1,padding:'14px 20px',fontSize:'0.95rem',
                                    border:'none',borderRadius:'12px 0 0 12px',outline:'none',
                                    background:'rgba(255,255,255,0.15)',
                                    backdropFilter:'blur(10px)',
                                    color:'#fff',
                                }}
                            />
                            <button
                                onClick={() => handleSearch(searchQuery)}
                                style={{
                                    padding:'14px 24px',border:'none',cursor:'pointer',
                                    borderRadius:'0 12px 12px 0',fontSize:'0.95rem',fontWeight:700,
                                    background:'#1D9E75',color:'#fff',flexShrink:0,
                                    transition:'background .2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background='#17855f'}
                                onMouseLeave={e => e.currentTarget.style.background='#1D9E75'}
                            >
                                {searchLoading ? '⏳' : '🔍 Search'}
                            </button>

                            {/* DROPDOWN */}
                            {searchFocused && (searchResults.length > 0 || (searchQuery.length >= 2 && !searchLoading)) && (
                                <div style={{
                                    position:'absolute',top:'calc(100% + 8px)',left:0,right:0,
                                    background:'#fff',borderRadius:14,
                                    boxShadow:'0 20px 60px rgba(4,44,83,0.22)',
                                    border:'1px solid rgba(24,95,165,0.12)',
                                    zIndex:1000,overflow:'hidden',maxHeight:440,overflowY:'auto'
                                }}>
                                    {searchLoading ? (
                                        <div style={{padding:'20px',textAlign:'center',color:'#185FA5',fontSize:13}}>
                                            Searching…
                                        </div>
                                    ) : searchResults.length === 0 ? (
                                        <div style={{padding:'24px',textAlign:'center',color:'#94a3b8'}}>
                                            <p style={{fontSize:'1.5rem',marginBottom:6}}>🔍</p>
                                            <p style={{fontSize:13}}>No results for "<strong>{searchQuery}</strong>"</p>
                                        </div>
                                    ) : (
                                        <>
                                            {['department','emergency','chatbot','page','about','gallery'].map(type => {
                                                const group = searchResults.filter(r => r.type === type);
                                                if (!group.length) return null;
                                                return (
                                                    <div key={type}>
                                                        <div style={{padding:'7px 16px 4px',fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.09em',color:'#94a3b8',background:'#f8fafc',borderBottom:'1px solid #f1f5f9'}}>
                                                            {TYPE_LABELS[type]}
                                                        </div>
                                                        {group.map((item, i) => (
                                                            <div key={i}
                                                                 onClick={() => {
                                                                     setFocused(false);
                                                                     setSearchQuery('');
                                                                     setResults([]);
                                                                     if (item.action === 'openChat') {
                                                                         setChatOpen(true);
                                                                     } else if (item.url) {
                                                                         navigate(item.url);
                                                                     }
                                                                 }}
                                                                 style={{display:'flex',alignItems:'center',gap:12,padding:'11px 16px',cursor:'pointer',borderBottom:'1px solid #f8fafc',transition:'background .15s',background:'transparent'}}
                                                                 onMouseEnter={e => e.currentTarget.style.background='#f0f7ff'}
                                                                 onMouseLeave={e => e.currentTarget.style.background='transparent'}
                                                            >
                                                                <span style={{fontSize:'1.4rem',flexShrink:0}}>{item.icon}</span>
                                                                <div style={{flex:1,minWidth:0}}>
                                                                    <p style={{margin:0,fontSize:13.5,fontWeight:600,color:'#0d2d4f'}}>{item.title}</p>
                                                                    <p style={{margin:0,fontSize:11.5,color:'#64748b',marginTop:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{item.desc}</p>
                                                                </div>
                                                                <span style={{fontSize:12,color:'#94a3b8',flexShrink:0}}>→</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            })}
                                            <div style={{padding:'8px 16px',fontSize:11,color:'#94a3b8',textAlign:'center',borderTop:'1px solid #f1f5f9',background:'#f8fafc'}}>
                                                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="hero-badges">
                        <span>🚨 Emergency Services</span>
                        <span>📍 Track Your Complaint</span>
                        <span>🔔 Real-time Updates</span>
                    </div>
                </div>
            </section>

            {/* ── FLOATING ACTIONS ── */}
            <div className="floating-actions">
                <button className="fab emergency" onClick={() => navigate('/emergency')}>
                    🚑<span>Emergency</span>
                </button>
                <button className="fab chat" onClick={() => setChatOpen(prev => !prev)}>
                    💬<span>Live Chat</span>
                </button>
            </div>

            {/* ── HOW IT WORKS ── */}
            <section className="how-it-works" ref={hiwRef}>
                <div className="hiw-left">
                    <span className="hiw-tag">How It Works</span>
                    <h2>How Our Complaint<br />System Works</h2>
                    <p>
                        From burst water pipes to power outages — report any public infrastructure
                        issue directly to the relevant government department. Upload photos, track
                        your complaint, and get a resolution timeline. Simple, transparent, and
                        built for every Sri Lankan citizen.
                    </p>
                    <div className="hiw-buttons">
                        <button className="hiw-primary" onClick={() => navigate('/departments')}>File Complaint</button>
                        <button className="hiw-secondary" onClick={() => navigate('/about')}>Learn More</button>
                    </div>
                </div>
                <div className="hiw-right">
                    {[
                        { n: '01', h: 'Submit Your Report',  p: 'Fill the complaint form with photos and your location details' },
                        { n: '02', h: 'Department Reviews',  p: 'The relevant department inspects and analyses your complaint' },
                        { n: '03', h: 'Get Resolution',      p: 'Receive a timeline for when your issue will be fixed' },
                        { n: '04', h: 'Follow Up',           p: "Still unresolved? Escalate with proof and we'll push it further" },
                    ].map(step => (
                        <div className="hiw-step" key={step.n}>
                            <div className="step-badge">{step.n}</div>
                            <div className="step-content">
                                <h4>{step.h}</h4>
                                <p>{step.p}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── STATS ── */}
            <section className="stats-section">
                {stats.map((stat, i) => (
                    <StatItem key={i} number={stat.number} label={stat.label} />
                ))}
            </section>

            {/* ── SERVICES ── */}
            <section className="services-section" ref={servicesRef}>
                <div className="section-header">
                    <h2>Report to the Right Department</h2>
                    <p>Select a department to file your complaint directly</p>
                </div>
                <div className="services-grid">
                    {services.map((service, index) => (
                        <div className="service-card" key={index}
                             style={{ '--accent': service.color }}
                             onClick={() => navigate(service.path)}>
                            <div className="service-icon">{service.icon}</div>
                            <div className="service-card-body">
                                <h3>{service.title}</h3>
                                <p>{service.desc}</p>
                                <button>Report Now →</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── WEATHER ── */}
            <WeatherSection />

            {/* ── CTA ── */}
            <section className="cta-section">
                <h2>Have an Issue to Report?</h2>
                <p>Join thousands of Sri Lankan citizens making their communities better</p>
                <div className="cta-buttons">
                    <button className="cta-primary" onClick={() => navigate('/departments')}>File a Complaint</button>
                    <button className="cta-secondary" onClick={() => navigate('/about')}>Learn More</button>
                </div>
            </section>

            {chatOpen && <Chat onClose={() => setChatOpen(false)} />}
        </div>
    );
};

export default Home;