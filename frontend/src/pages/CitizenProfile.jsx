import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import './CitizenProfile.css';

const ProfileMapPicker = ({ onSelect }) => {
    const containerRef = useRef(null);
    const mapRef = useRef(null);

    useEffect(() => {
        const boot = () => {
            if (!containerRef.current || !window.L) return;
            if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
            delete containerRef.current._leaflet_id;
            const L = window.L;
            const map = L.map(containerRef.current, { center: [7.8731, 80.7718], zoom: 8, scrollWheelZoom: true });
            mapRef.current = map;
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
            const markerIcon = L.divIcon({ html: '<div style="width:28px;height:28px;background:#185FA5;border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(0,0,0,.4)"></div>', className: '', iconSize: [28, 28], iconAnchor: [14, 28] });
            let marker = null;
            const placeMarker = (latlng) => {
                if (marker) marker.remove();
                marker = L.marker([latlng.lat, latlng.lng], { icon: markerIcon, draggable: true }).addTo(map);
                onSelect({ lat: latlng.lat, lng: latlng.lng });
                marker.on('dragend', () => { const pos = marker.getLatLng(); onSelect({ lat: pos.lat, lng: pos.lng }); });
            };
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => { const latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude }; map.setView([latlng.lat, latlng.lng], 15); placeMarker(latlng); },
                    () => { map.setView([7.8731, 80.7718], 8); }
                );
            }
            map.on('click', (e) => { placeMarker(e.latlng); });
        };

        const timer = setTimeout(() => {
            if (window.L) { boot(); }
            else {
                if (!document.getElementById('leaflet-css')) {
                    const link = document.createElement('link');
                    link.id = 'leaflet-css'; link.rel = 'stylesheet';
                    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
                    document.head.appendChild(link);
                }
                if (!document.getElementById('leaflet-js')) {
                    const script = document.createElement('script');
                    script.id = 'leaflet-js'; script.crossOrigin = 'anonymous';
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
                    script.onload = () => setTimeout(boot, 100);
                    document.head.appendChild(script);
                } else {
                    const t = setInterval(() => { if (window.L) { clearInterval(t); boot(); } }, 100);
                }
            }
        }, 100);

        return () => {
            clearTimeout(timer);
            if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
        };
    }, []);

    return <div ref={containerRef} style={{ height: '300px', width: '100%', borderRadius: '8px', border: '1.5px solid #d0dae6' }} />;
};

/* ── MY COMPLAINTS SECTION ── */
const MyComplaints = ({ userId }) => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [search, setSearch]         = useState('');
    const [filter, setFilter]         = useState('All');
    const [expanded, setExpanded]     = useState(null);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/complaints/user/${userId}`);
                if (res.ok) setComplaints(await res.json());
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetchComplaints();
        const interval = setInterval(fetchComplaints, 20000);
        return () => clearInterval(interval);
    }, [userId]);

    const statusColor = s =>
        s === 'Resolved'     ? '#1D9E75' :
            s === 'In Progress'  ? '#185FA5' :
                s === 'Rejected'     ? '#e63946' :
                    s === 'Under Review' ? '#e6a817' : '#888';

    const progressWidth = s =>
        s === 'Resolved'     ? '100%' :
            s === 'In Progress'  ? '65%'  :
                s === 'Under Review' ? '40%'  :
                    s === 'Rejected'     ? '100%' : '15%';

    const FILTERS = ['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'];

    const filtered = complaints.filter(c => {
        const matchFilter = filter === 'All' || c.status === filter;
        const matchSearch = !search ||
            c.complaintId?.toLowerCase().includes(search.toLowerCase()) ||
            c.title?.toLowerCase().includes(search.toLowerCase()) ||
            c.category?.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    return (
        <div className="cp-card">
            <div className="cp-header" style={{marginBottom:20}}>
                <div className="cp-header-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                </div>
                <div>
                    <h1>My Complaints</h1>
                    <p style={{color:'#64748b'}}>{complaints.length} total · auto-refreshes every 20s</p>
                </div>
            </div>

            <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap',alignItems:'center'}}>
                <input
                    placeholder="Search by ID, title or category…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{flex:1,minWidth:180,padding:'8px 14px',borderRadius:8,border:'1.5px solid #d0dae6',fontSize:13,outline:'none',background:'#f8fafc',color:'#1e293b'}}
                />
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                    {FILTERS.map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                                style={{padding:'6px 14px',borderRadius:50,border:'1.5px solid',fontSize:12,fontWeight:600,cursor:'pointer',
                                    borderColor: filter===f ? '#185FA5' : '#d0dae6',
                                    background:  filter===f ? '#185FA5' : 'transparent',
                                    color:       filter===f ? '#ffffff'  : '#6b7a8d'}}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div style={{textAlign:'center',padding:32}}>
                    <div className="cp-spinner" style={{margin:'0 auto'}}/>
                </div>
            ) : filtered.length === 0 ? (
                <div style={{textAlign:'center',padding:40,color:'#94a3b8'}}>
                    <p style={{fontSize:'2.5rem',marginBottom:8}}>📭</p>
                    <p style={{fontSize:14}}>{complaints.length === 0 ? 'No complaints filed yet.' : 'No complaints match your search.'}</p>
                </div>
            ) : (
                <div style={{display:'flex',flexDirection:'column',gap:12}}>
                    {filtered.map(c => (
                        <div key={c._id}
                             style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:12,padding:16,cursor:'pointer',transition:'all .2s'}}
                             onClick={() => setExpanded(expanded === c._id ? null : c._id)}>

                            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8,flexWrap:'wrap'}}>
                                <span style={{fontFamily:'monospace',fontSize:11,fontWeight:700,color:'#185FA5',letterSpacing:'0.06em'}}>{c.complaintId}</span>
                                <span style={{fontSize:11,background:statusColor(c.status),color:'#fff',borderRadius:50,padding:'2px 10px',fontWeight:700}}>
                                    {c.status}
                                </span>
                                <span style={{fontSize:11,color:'#94a3b8',marginLeft:'auto'}}>{new Date(c.createdAt).toLocaleDateString()}</span>
                                <span style={{fontSize:11,color:'#94a3b8'}}>{expanded === c._id ? '▲' : '▼'}</span>
                            </div>

                            <p style={{fontSize:13.5,fontWeight:600,color:'#1e293b',marginBottom:4}}>{c.title}</p>
                            <p style={{fontSize:12,color:'#64748b',marginBottom:10}}>
                                📁 {c.category} &nbsp;·&nbsp; 📍 {c.location?.substring(0,60)}{c.location?.length > 60 ? '…' : ''} &nbsp;·&nbsp;
                                <span style={{color: c.priorityLevel==='Critical'?'#ef4444':c.priorityLevel==='High'?'#f97316':'#64748b'}}>
                                    {c.priorityLevel} Priority
                                </span>
                            </p>

                            <div style={{height:4,background:'#e2e8f0',borderRadius:2,overflow:'hidden',marginBottom:expanded===c._id?16:0}}>
                                <div style={{height:'100%',width:progressWidth(c.status),background:c.status==='Rejected'?'#e63946':statusColor(c.status),borderRadius:2,transition:'width 0.8s ease'}}/>
                            </div>

                            {expanded === c._id && (
                                <div style={{borderTop:'1px solid #e2e8f0',paddingTop:14,marginTop:4}}>
                                    <p style={{fontSize:12.5,color:'#475569',lineHeight:1.65,marginBottom:14}}>{c.description}</p>

                                    {c.imageUrls?.length > 0 && (
                                        <div style={{marginBottom:14}}>
                                            <p style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'#94a3b8',marginBottom:8}}>Problem Photos</p>
                                            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                                                {c.imageUrls.map((url,i) => (
                                                    <img key={i} src={`http://localhost:5000${url}`} alt="" style={{width:72,height:72,objectFit:'cover',borderRadius:8,cursor:'pointer',border:'1px solid #e2e8f0'}} onClick={(e)=>{e.stopPropagation();window.open(`http://localhost:5000${url}`);}}/>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {c.agentResponse && (
                                        <div style={{background:'rgba(24,95,165,0.08)',border:'1px solid rgba(24,95,165,0.2)',borderRadius:8,padding:'10px 14px',marginBottom:10}}>
                                            <p style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'#185FA5',marginBottom:5}}>💬 Agent Response</p>
                                            <p style={{fontSize:13,color:'#334155',lineHeight:1.6,margin:0}}>{c.agentResponse}</p>
                                        </div>
                                    )}

                                    {c.status === 'Resolved' && (
                                        <div style={{background:'rgba(29,158,117,0.08)',border:'1px solid rgba(29,158,117,0.25)',borderRadius:8,padding:'10px 14px',marginBottom:10}}>
                                            <p style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'#1D9E75',marginBottom:5}}>✅ Resolved</p>
                                            <p style={{fontSize:12.5,color:'#475569',margin:0}}>
                                                {c.resolvedDate ? `Resolved on ${new Date(c.resolvedDate).toLocaleDateString()}` : 'Issue has been resolved'}
                                            </p>
                                            {c.resolvedImageUrls?.length > 0 && (
                                                <div style={{display:'flex',gap:8,marginTop:10,flexWrap:'wrap'}}>
                                                    {c.resolvedImageUrls.map((url,i) => (
                                                        <img key={i} src={`http://localhost:5000${url}`} alt="" style={{width:72,height:72,objectFit:'cover',borderRadius:8,cursor:'pointer',border:'1px solid rgba(29,158,117,0.3)'}} onClick={(e)=>{e.stopPropagation();window.open(`http://localhost:5000${url}`);}}/>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {c.status === 'Rejected' && c.adminNote && (
                                        <div style={{background:'rgba(230,57,70,0.08)',border:'1px solid rgba(230,57,70,0.25)',borderRadius:8,padding:'10px 14px'}}>
                                            <p style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'#e63946',marginBottom:5}}>❌ Rejected</p>
                                            <p style={{fontSize:12.5,color:'#475569',margin:0}}>{c.adminNote}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ── MAIN COMPONENT ── */
const CitizenProfile = () => {
    const { user, isSignedIn, isLoaded } = useUser();
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing]     = useState(false);
    const [loading, setLoading]         = useState(true);
    const [form, setForm]               = useState({ fullName:'', phone:'', location:'', postalCode:'', govProof:null });
    const [preview, setPreview]         = useState(null);
    const [errors, setErrors]           = useState({});
    const [submitting, setSubmitting]   = useState(false);
    const fileRef = useRef();

    useEffect(() => {
        if (isLoaded && !isSignedIn) navigate('/login');
    }, [isLoaded, isSignedIn, navigate]);

    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;
        const fetchProfile = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/profile/${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProfileData(data);
                    setForm({ fullName:data.fullName, phone:data.phone, location:data.location, postalCode:data.postalCode, govProof:null });
                } else { setIsEditing(true); }
            } catch { setIsEditing(true); }
            finally { setLoading(false); }
        };
        fetchProfile();
    }, [isLoaded, isSignedIn, user]);

    useEffect(() => {
        if (profileData || !isEditing) return;
        const handlePopState = () => window.history.pushState(null, '', window.location.href);
        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [profileData, isEditing]);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm(prev => ({ ...prev, govProof: file }));
            setPreview(URL.createObjectURL(file));
            setErrors(prev => ({ ...prev, govProof: '' }));
        }
    };

    const handleLocationSelect = async (latlng) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`);
            const data = await res.json();
            setForm(prev => ({ ...prev, location: data.display_name || `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}` }));
            setErrors(prev => ({ ...prev, location: '' }));
        } catch {
            setForm(prev => ({ ...prev, location: `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}` }));
        }
    };

    const validate = () => {
        const e = {};
        if (!form.fullName.trim()) e.fullName = 'Full name is required';
        if (!form.phone.trim()) e.phone = 'Phone number is required';
        else if (!/^\d{9,15}$/.test(form.phone.replace(/\s/g,''))) e.phone = 'Enter a valid phone number';
        if (!form.location) e.location = 'Please select your location on the map';
        if (!form.postalCode.trim()) e.postalCode = 'Postal code is required';
        if (!profileData && !form.govProof) e.govProof = 'Government Bill Proof is required';
        return e;
    };

    const handleSubmit = async () => {
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('fullName', form.fullName);
            formData.append('phone', form.phone);
            formData.append('location', form.location);
            formData.append('postalCode', form.postalCode);
            formData.append('clerkId', user.id);
            if (form.govProof) formData.append('govProof', form.govProof);
            const isUpdate = !!profileData;
            const res = await fetch(
                isUpdate ? `http://localhost:5000/api/profile/${user.id}` : 'http://localhost:5000/api/profile',
                { method: isUpdate ? 'PUT' : 'POST', body: formData }
            );
            if (!res.ok) throw new Error('Failed to save profile');
            const saved = await res.json();
            setProfileData(saved.data);
            setIsEditing(false);
            setPreview(null);
        } catch (err) {
            setErrors({ submit: err.message || 'Something went wrong.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (!isLoaded || loading) return (
        <div className="cp-loading"><div className="cp-spinner" /><p>Loading...</p></div>
    );

    // ── VIEW MODE ──
    if (profileData && !isEditing) return (
        <div className="cp-root-wrapper">
            <div className="cp-page">
                <div className="cp-card">
                    <div className="cp-header">
                        <div className="cp-header-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                            </svg>
                        </div>
                        <div><h1>My Profile</h1><p>Your saved details</p></div>
                        <button className="cp-edit-btn" onClick={() => setIsEditing(true)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Edit
                        </button>
                    </div>
                    <div className="cp-view-grid">
                        <div className="cp-view-field"><label>FULL NAME</label><p>{profileData.fullName}</p></div>
                        <div className="cp-view-field"><label>PHONE NUMBER</label><p>{profileData.phone}</p></div>
                        <div className="cp-view-field"><label>POSTAL CODE</label><p>{profileData.postalCode}</p></div>
                        <div className="cp-view-field cp-view-field--full">
                            <label>LOCATION</label>
                            <p>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" style={{marginRight:6,verticalAlign:'middle'}}>
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                                </svg>
                                {profileData.location}
                            </p>
                        </div>
                        <div className="cp-view-field cp-view-field--full">
                            <label>GOVERNMENT BILL PROOF</label>
                            {profileData.govProofUrl ? (
                                profileData.govProofUrl.endsWith('.pdf') ? (
                                    <a href={`http://localhost:5000${profileData.govProofUrl}`} target="_blank" rel="noreferrer" className="cp-doc-link">View Document</a>
                                ) : (
                                    <img src={`http://localhost:5000${profileData.govProofUrl}`} alt="Government Bill Proof" className="cp-id-preview" onError={(e)=>{e.target.style.display='none';}}/>
                                )
                            ) : (
                                <p style={{color:'#8a9ab0'}}>No document uploaded</p>
                            )}
                        </div>
                    </div>
                </div>

                <MyComplaints userId={user.id} />
            </div>
        </div>
    );

    // ── FORM MODE ──
    return (
        <div className="cp-root-wrapper">
            <div className="cp-page">
                <div className="cp-card">
                    <div className="cp-header">
                        <div className="cp-header-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                            </svg>
                        </div>
                        <div>
                            <h1>{profileData ? 'Edit Profile' : 'Complete Your Profile'}</h1>
                            <p>{profileData ? 'Update your details' : 'Please fill in all details before continuing'}</p>
                        </div>
                        {profileData && (
                            <button className="cp-cancel-btn" onClick={()=>{setIsEditing(false);setErrors({});setPreview(null);}}>Cancel</button>
                        )}
                    </div>

                    {!profileData && (
                        <div className="cp-notice">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            You must complete your profile to use the system.
                        </div>
                    )}

                    <div className="cp-form">
                        <div className={`cp-field ${errors.fullName?'cp-field--error':''}`}>
                            <label>Full Name <span>*</span></label>
                            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Enter your full name"/>
                            {errors.fullName && <span className="cp-error">{errors.fullName}</span>}
                        </div>
                        <div className={`cp-field ${errors.phone?'cp-field--error':''}`}>
                            <label>Phone Number <span>*</span></label>
                            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 0771234567"/>
                            {errors.phone && <span className="cp-error">{errors.phone}</span>}
                        </div>
                        <div className={`cp-field ${errors.postalCode?'cp-field--error':''}`}>
                            <label>Postal Code <span>*</span></label>
                            <input type="text" name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="e.g. 10100"/>
                            {errors.postalCode && <span className="cp-error">{errors.postalCode}</span>}
                        </div>
                        <div className={`cp-field cp-field--full ${errors.location?'cp-field--error':''}`}>
                            <label>Location <span>*</span> <small>Click on the map to select</small></label>
                            {form.location && (
                                <div className="cp-location-text">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                                    </svg>
                                    {form.location}
                                </div>
                            )}
                            <div className="cp-map-wrap">
                                <ProfileMapPicker onSelect={handleLocationSelect}/>
                            </div>
                            {errors.location && <span className="cp-error">{errors.location}</span>}
                        </div>
                        <div className={`cp-field cp-field--full ${errors.govProof?'cp-field--error':''}`}>
                            <label>
                                Government Bill Proof {!profileData && <span>*</span>}
                                <small>{profileData ? 'Upload new to replace' : 'Utility bill or bank statement'}</small>
                            </label>
                            <div className="cp-upload" onClick={() => fileRef.current.click()}>
                                {preview ? (
                                    <img src={preview} alt="Preview" className="cp-preview"/>
                                ) : profileData?.govProofUrl && !profileData.govProofUrl.endsWith('.pdf') ? (
                                    <img src={`http://localhost:5000${profileData.govProofUrl}`} alt="Current Bill" className="cp-preview" onError={(e)=>{e.target.style.display='none';}}/>
                                ) : (
                                    <div className="cp-upload-placeholder">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.5">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                            <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                                        </svg>
                                        <p>{profileData ? 'Click to replace' : 'Click to upload'}</p>
                                        <small>JPG, PNG, PDF accepted</small>
                                    </div>
                                )}
                            </div>
                            <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={handleFile} style={{display:'none'}}/>
                            {errors.govProof && <span className="cp-error">{errors.govProof}</span>}
                        </div>
                    </div>

                    {errors.submit && <div className="cp-submit-error">{errors.submit}</div>}

                    <button className="cp-submit" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? <><div className="cp-btn-spinner"/> Saving...</> : profileData ? 'Update Profile' : 'Save Profile & Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CitizenProfile;