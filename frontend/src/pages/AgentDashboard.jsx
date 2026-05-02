import { useState, useEffect, useRef } from "react";
import "./AgentDashboard.css";
import { useUser } from "@clerk/clerk-react";
import socket from '../services/socket';

const API = 'http://localhost:5000/api';

const QUICK_RESPONSES = [
    "We will fix this issue within the next week.",
    "Our team has been notified and will visit the site within 48 hours.",
    "This issue has been escalated to the relevant department.",
    "We are currently investigating the problem and will update you shortly.",
    "A technician has been scheduled to assess and resolve this issue.",
    "Thank you for reporting. This will be resolved within 3–5 working days.",
];

const catColor = { 'Water Supply':"#3b82f6", Electricity:"#f59e0b", 'Garbage & Sanitation':"#10b981", Disaster:"#ef4444", Police:"#8b5cf6", 'Roads & Highways':"#6b7280", Health:"#ec4899", Agriculture:"#84cc16" };
const sevClass = { Critical:"sev-critical", High:"sev-high", Medium:"sev-medium", Low:"sev-low" };

const Icon = ({ name, size = 16, style = {} }) => {
    const icons = {
        reports:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
        dashboard: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
        chat:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
        alert:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
        close:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
        send:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9 22,2"/></svg>,
        check:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>,
        search:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
        calendar:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
        location:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
        reply:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9,17 4,12 9,7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>,
        upload:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
    };
    return <span className="nav-icon" style={style}>{icons[name]}</span>;
};

let toastTimer = null;
function useToast() {
    const [toast, setToast] = useState({ show:false, msg:"", type:"info", icon:"✓" });
    const show = (msg, type="info") => {
        const icons = { success:"✓", danger:"✕", info:"ℹ" };
        if (toastTimer) clearTimeout(toastTimer);
        setToast({ show:true, msg, type, icon:icons[type] });
        toastTimer = setTimeout(() => setToast(t=>({...t,show:false})), 3200);
    };
    return { toast, show };
}

/* ── RESPOND MODAL ── */
function RespondModal({ report, onClose, onSent }) {
    const [text, setText] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSend = async () => {
        if (!text.trim()) return;
        setSaving(true);
        try {
            const res = await fetch(`${API}/complaints/${report.complaintId}/respond`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text.trim() })
            });
            if (res.ok) { onSent(); onClose(); }
        } catch (e) { console.error(e); }
        setSaving(false);
    };

    return (
        <div className="overlay show" onClick={onClose}>
            <div className="response-modal" onClick={e => e.stopPropagation()}>
                <div className="response-modal-header">
                    <div><h4>💬 Respond to Citizen</h4><p>{report.complaintId} · {report.title}</p></div>
                    <button className="btn btn-sm btn-icon" onClick={onClose}><Icon name="close" size={14}/></button>
                </div>
                <div className="response-issue-box">
                    <div className="response-issue-label">Complaint</div>
                    <div className="response-issue-title">📍 {report.location}</div>
                    <div className="response-issue-meta">{report.category} · Priority: {report.priorityLevel}</div>
                </div>
                {report.agentResponse && (
                    <div style={{background:'rgba(59,130,246,0.07)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:8,padding:12,marginBottom:14}}>
                        <p style={{fontSize:11,color:'#60a5fa',marginBottom:4,fontWeight:600}}>PREVIOUS RESPONSE</p>
                        <p style={{fontSize:12.5,color:'var(--text-secondary)'}}>{report.agentResponse}</p>
                    </div>
                )}
                <div className="response-quick-label">Quick Responses</div>
                <div className="response-quick-list">
                    {QUICK_RESPONSES.map((q, i) => (
                        <button key={i} className="response-quick-btn" onClick={() => setText(q)}>{q}</button>
                    ))}
                </div>
                <div className="response-quick-label" style={{marginTop:14}}>Your Response</div>
                <textarea className="response-textarea" placeholder="Type your response to the citizen…" value={text} onChange={e => setText(e.target.value)} rows={4}/>
                <div className="response-modal-footer" style={{marginTop:16}}>
                    <button className="btn btn-sm" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={handleSend} disabled={!text.trim() || saving}>
                        <Icon name="send" size={12}/>{saving ? 'Sending…' : 'Send to Citizen'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── RESOLVE MODAL ── */
function ResolveModal({ report, onClose, onResolved }) {
    const [note, setNote]         = useState('');
    const [images, setImages]     = useState([]);
    const [previews, setPreviews] = useState([]);
    const [saving, setSaving]     = useState(false);
    const fileRef = useRef();

    const handleImages = (e) => {
        const files = Array.from(e.target.files).slice(0, 5);
        setImages(files);
        setPreviews(files.map(f => URL.createObjectURL(f)));
    };

    const handleResolve = async () => {
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('status', 'Resolved');
            formData.append('note', note);
            images.forEach(img => formData.append('resolvedImages', img));
            const res = await fetch(`${API}/complaints/${report.complaintId}/status`, { method: 'PATCH', body: formData });
            if (res.ok) { onResolved(); onClose(); }
        } catch (e) { console.error(e); }
        setSaving(false);
    };

    return (
        <div className="overlay show" onClick={onClose}>
            <div className="response-modal" onClick={e => e.stopPropagation()}>
                <div className="response-modal-header">
                    <div><h4>✅ Mark as Resolved</h4><p>{report.complaintId} · {report.title}</p></div>
                    <button className="btn btn-sm btn-icon" onClick={onClose}><Icon name="close" size={14}/></button>
                </div>
                <div className="response-issue-box">
                    <div className="response-issue-label">Complaint</div>
                    <div className="response-issue-title">📍 {report.location}</div>
                    <div className="response-issue-meta">{report.category} · Priority: {report.priorityLevel}</div>
                </div>
                <div className="response-quick-label" style={{marginTop:16}}>Resolution Note</div>
                <textarea className="response-textarea" placeholder="Describe what was done to resolve this issue…" value={note} onChange={e => setNote(e.target.value)} rows={4}/>
                <div className="response-quick-label" style={{marginTop:14}}>
                    Upload Resolved Photos <span style={{color:'#4a5568',fontWeight:400,textTransform:'none'}}>(optional)</span>
                </div>
                <div style={{border:'2px dashed rgba(255,255,255,0.1)',borderRadius:8,padding:20,textAlign:'center',cursor:'pointer',background:'rgba(255,255,255,0.02)',marginTop:8}} onClick={() => fileRef.current.click()}>
                    {previews.length > 0 ? (
                        <div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center'}}>
                            {previews.map((src,i) => <img key={i} src={src} alt="" style={{width:85,height:85,objectFit:'cover',borderRadius:6,border:'1px solid rgba(16,185,129,0.4)'}}/>)}
                            <p style={{width:'100%',fontSize:11,color:'#4a5568',marginTop:4}}>Click to change</p>
                        </div>
                    ) : (
                        <>
                            <Icon name="upload" size={26} style={{color:'#4a5568'}}/>
                            <p style={{fontSize:12,color:'#4a5568',marginTop:8}}>Click to upload resolved photos</p>
                            <p style={{fontSize:11,color:'#374151',marginTop:3}}>JPG, PNG · Max 5 photos</p>
                        </>
                    )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImages} style={{display:'none'}}/>
                <div className="response-modal-footer" style={{marginTop:20}}>
                    <button className="btn btn-sm" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={handleResolve} disabled={saving}>
                        <Icon name="check" size={12}/>{saving ? 'Resolving…' : 'Mark as Resolved'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── REPORT CARD ── */
function ReportCard({ report, selected, onSelect, onOpenResolve, onOpenRespond }) {
    const statusClass = {
        'Pending':'status-pending','In Progress':'status-active',
        'Resolved':'status-resolved','Rejected':'status-escalated','Under Review':'status-pending'
    };
    return (
        <div className={`report-card animate-in ${selected ? "selected" : ""}`} onClick={() => onSelect(report)}>
            <div className="report-card-top">
                <div className={`severity-bar ${sevClass[report.priorityLevel] || 'sev-medium'}`}/>
                <div style={{width:32,height:32,borderRadius:'50%',background:`${catColor[report.category]||'#6b7280'}22`,border:`1px solid ${catColor[report.category]||'#6b7280'}44`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:13,fontWeight:600,color:catColor[report.category]||'#6b7280'}}>
                    {report.category?.[0] || '?'}
                </div>
                <div className="report-main">
                    <div className="report-id">{report.complaintId} · {report.category}</div>
                    <div className="report-title">{report.title}</div>
                    <div className="report-meta">
                        <span className="report-meta-item"><Icon name="location" size={11}/>{report.location?.substring(0,40)}</span>
                        <span className="report-meta-item"><Icon name="calendar" size={11}/>{new Date(report.createdAt).toLocaleDateString()}</span>
                        {report.priorityLevel === 'Critical' && <span className="tag" style={{color:'#ef4444',borderColor:'rgba(239,68,68,0.3)',background:'rgba(239,68,68,0.08)'}}>🔴 Critical</span>}
                        {report.agentResponse && <span className="tag" style={{color:'#60a5fa',borderColor:'rgba(96,165,250,0.3)',background:'rgba(96,165,250,0.08)'}}>💬 Responded</span>}
                        {report.status === 'Resolved' && <span className="tag" style={{color:'#10b981',borderColor:'rgba(16,185,129,0.3)',background:'rgba(16,185,129,0.08)'}}>✓ Resolved</span>}
                    </div>
                </div>
                <div className="report-actions" onClick={e => e.stopPropagation()}>
                    <span className={`status-pill ${statusClass[report.status] || 'status-pending'}`}>
                        <span className="status-dot"/>{report.status}
                    </span>
                    {report.status === 'In Progress' && (
                        <>
                            <button className="btn btn-sm response-btn" style={{background:'rgba(96,165,250,0.15)',color:'#60a5fa',border:'1px solid rgba(96,165,250,0.3)'}} onClick={e => { e.stopPropagation(); onOpenRespond(); }}>
                                <Icon name="reply" size={12}/>Respond
                            </button>
                            <button className="btn btn-sm response-btn" onClick={e => { e.stopPropagation(); onOpenResolve(); }}>
                                <Icon name="check" size={12}/>Resolve
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ── DETAIL PANEL ── */
function DetailPanel({ report, onClose, onResolve, onRespond }) {
    if (!report) return null;
    return (
        <div className={`detail-panel ${report ? "open" : ""}`}>
            <div className="panel-header">
                <span style={{fontFamily:'var(--font-mono)',fontSize:12,color:'var(--text-muted)'}}>{report.complaintId}</span>
                <h3 style={{flex:1,marginLeft:8}}>{report.category} Complaint</h3>
                <button className="btn btn-sm btn-icon" onClick={onClose}><Icon name="close" size={14}/></button>
            </div>
            <div className="panel-body">
                <div className="section-divider">Complaint Details</div>
                <div className="citizen-card">
                    <div className="info-grid">
                        <div className="info-item"><div className="info-label">Title</div><div className="info-value">{report.title}</div></div>
                        <div className="info-item"><div className="info-label">Status</div><div className="info-value">{report.status}</div></div>
                        <div className="info-item"><div className="info-label">Priority</div><div className="info-value">{report.priorityLevel}</div></div>
                        <div className="info-item"><div className="info-label">Province</div><div className="info-value">{report.province || '—'}</div></div>
                        <div className="info-item" style={{gridColumn:'1/-1'}}><div className="info-label">Location</div><div className="info-value" style={{fontSize:12}}>{report.location}</div></div>
                        <div className="info-item" style={{gridColumn:'1/-1'}}><div className="info-label">Filed On</div><div className="info-value" style={{fontFamily:'var(--font-mono)',fontSize:12}}>{new Date(report.createdAt).toLocaleString()}</div></div>
                        {report.resolvedDate && (
                            <div className="info-item" style={{gridColumn:'1/-1'}}>
                                <div className="info-label" style={{color:'#10b981'}}>Resolved On</div>
                                <div className="info-value" style={{fontFamily:'var(--font-mono)',fontSize:12,color:'#10b981'}}>{new Date(report.resolvedDate).toLocaleString()}</div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="section-divider">Description</div>
                <div style={{background:'rgba(181,212,244,0.05)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:8,padding:14,fontSize:12.5,color:'var(--text-secondary)',lineHeight:1.65,marginBottom:16}}>{report.description}</div>
                {report.imageUrls?.length > 0 && (
                    <>
                        <div className="section-divider">Problem Photos ({report.imageUrls.length})</div>
                        <div className="photo-grid">
                            {report.imageUrls.map((url,i) => (
                                <img key={i} src={`http://localhost:5000${url}`} alt="" style={{width:'100%',aspectRatio:'1',objectFit:'cover',borderRadius:6,cursor:'pointer',border:'1px solid rgba(255,255,255,0.07)'}} onClick={() => window.open(`http://localhost:5000${url}`)}/>
                            ))}
                        </div>
                    </>
                )}
                {report.adminNote && (
                    <>
                        <div className="section-divider">Admin Note</div>
                        <div style={{background:'rgba(245,158,11,0.07)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:8,padding:12,fontSize:12.5,color:'#fbbf24',lineHeight:1.6}}>{report.adminNote}</div>
                    </>
                )}
                <div className="section-divider">Activity Timeline</div>
                <div className="timeline">
                    <div className="tl-item">
                        <div className="tl-dot blue">📋</div>
                        <div className="tl-content"><div className="tl-title">Complaint Filed</div><div className="tl-time">{new Date(report.createdAt).toLocaleString()}</div></div>
                    </div>
                    {report.assignedAgentName && (
                        <div className="tl-item">
                            <div className="tl-dot amber">👤</div>
                            <div className="tl-content"><div className="tl-title">Assigned to {report.assignedAgentName}</div><div className="tl-time">By Admin</div></div>
                        </div>
                    )}
                    {report.agentResponse && (
                        <div className="tl-item">
                            <div className="tl-dot blue">💬</div>
                            <div className="tl-content">
                                <div className="tl-title">Agent Responded</div>
                                <div style={{fontSize:11.5,color:'var(--text-secondary)',marginTop:4,lineHeight:1.5,background:'rgba(96,165,250,0.07)',border:'1px solid rgba(96,165,250,0.15)',borderRadius:6,padding:'6px 10px'}}>"{report.agentResponse}"</div>
                            </div>
                        </div>
                    )}
                    {report.status === 'Resolved' && (
                        <div className="tl-item">
                            <div className="tl-dot green">✓</div>
                            <div className="tl-content">
                                <div className="tl-title" style={{color:'#10b981'}}>Resolved</div>
                                {report.resolvedDate && <div className="tl-time">{new Date(report.resolvedDate).toLocaleString()}</div>}
                            </div>
                        </div>
                    )}
                </div>
                {report.resolvedImageUrls?.length > 0 && (
                    <>
                        <div className="section-divider" style={{color:'#10b981'}}>✅ Resolved Photos</div>
                        <div className="photo-grid">
                            {report.resolvedImageUrls.map((url,i) => (
                                <img key={i} src={`http://localhost:5000${url}`} alt="" style={{width:'100%',aspectRatio:'1',objectFit:'cover',borderRadius:6,cursor:'pointer',border:'1px solid rgba(16,185,129,0.3)'}} onClick={() => window.open(`http://localhost:5000${url}`)}/>
                            ))}
                        </div>
                    </>
                )}
                {report.status === 'In Progress' && (
                    <div style={{marginTop:16,display:'flex',gap:8}}>
                        <button className="btn btn-sm" style={{flex:1,justifyContent:'center',background:'rgba(96,165,250,0.15)',color:'#60a5fa',border:'1px solid rgba(96,165,250,0.3)'}} onClick={onRespond}>
                            <Icon name="reply" size={14}/>Respond
                        </button>
                        <button className="btn btn-primary btn-sm" style={{flex:1,justifyContent:'center'}} onClick={onResolve}>
                            <Icon name="check" size={14}/>Resolve
                        </button>
                    </div>
                )}
            </div>
            <div className="panel-footer">
                <button className="btn btn-sm" style={{flex:1}} onClick={onClose}><Icon name="close" size={12}/>Close</button>
            </div>
        </div>
    );
}

/* ── EMERGENCY PAGE ── */
function EmergencyPage({ agentDept, agentName, user }) {
    const [emergencies, setEmergencies] = useState([]);
    const [loading, setLoading]         = useState(true);
    const [updating, setUpdating]       = useState(null);

    const SERVICE_MAP = {
        hospital: { label: 'Ambulance',    icon: '🚑', color: '#ef4444' },
        police:   { label: 'Police',       icon: '🚔', color: '#3b82f6' },
        fire:     { label: 'Fire Brigade', icon: '🚒', color: '#f97316' },
    };

    const STATUS_STEPS  = ['pending', 'accepted', 'on_the_way', 'arrived', 'resolved'];
    const STATUS_LABELS = {
        pending:    'Pending',
        accepted:   'Accepted',
        on_the_way: 'On the Way',
        arrived:    'Arrived',
        resolved:   'Resolved',
    };

    const fetchEmergencies = async () => {
        try {
            const res = await fetch(`${API}/emergency/department/${encodeURIComponent(agentDept)}`);
            if (res.ok) setEmergencies(await res.json());
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    useEffect(() => {
        fetchEmergencies();
        const interval = setInterval(fetchEmergencies, 10000);
        return () => clearInterval(interval);
    }, [agentDept]);

    const updateStatus = async (id, status) => {
        setUpdating(id);
        try {
            await fetch(`${API}/emergency/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, agentId: user?.id, agentName })
            });
            fetchEmergencies();
        } catch (e) { console.error(e); }
        setUpdating(null);
    };

    const nextStatus = (current) => {
        const idx = STATUS_STEPS.indexOf(current);
        return idx < STATUS_STEPS.length - 1 ? STATUS_STEPS[idx + 1] : null;
    };

    const pendingCount = emergencies.filter(e => e.status === 'pending').length;

    return (
        <div>
            <div style={{marginBottom:20,display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
                <div>
                    <h2 style={{fontSize:16,fontWeight:600,color:'var(--text-primary)'}}>Emergency Requests</h2>
                    <p style={{fontSize:12,color:'var(--text-muted)',marginTop:2}}>{agentDept} · Auto-refreshes every 10s</p>
                </div>
                {pendingCount > 0 && (
                    <div className="emergency-pulse-red" style={{marginLeft:'auto',background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.4)',borderRadius:50,padding:'5px 16px',fontSize:12,color:'#f87171',fontWeight:700}}>
                        🚨 {pendingCount} NEW REQUEST{pendingCount > 1 ? 'S' : ''}
                    </div>
                )}
            </div>

            {loading ? (
                <div className="empty-state"><p>Loading emergencies…</p></div>
            ) : emergencies.length === 0 ? (
                <div className="empty-state">
                    <p style={{fontSize:'2rem',marginBottom:8}}>✅</p>
                    <p>No active emergencies right now</p>
                </div>
            ) : (
                <div style={{display:'flex',flexDirection:'column',gap:14}}>
                    {emergencies.map(em => {
                        const svc      = SERVICE_MAP[em.serviceType] || { label: em.serviceType, icon: '🆘', color: '#ef4444' };
                        const isPending = em.status === 'pending';
                        const next     = nextStatus(em.status);
                        const currentStepIdx = STATUS_STEPS.indexOf(em.status);

                        return (
                            <div key={em._id} style={{background:'var(--bg-card)',border:`2px solid ${isPending ? 'rgba(239,68,68,0.6)' : 'var(--border)'}`,borderRadius:'var(--radius-md)',padding:20,position:'relative',overflow:'hidden',transition:'border-color .3s'}}>

                                {/* Urgent top bar */}
                                {isPending && (
                                    <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${svc.color},#f97316,${svc.color})`,backgroundSize:'200%',animation:'shimmer 1.5s infinite'}}/>
                                )}

                                <div style={{display:'flex',alignItems:'flex-start',gap:14}}>
                                    {/* Icon */}
                                    <div className={isPending ? 'emergency-pulse-red' : ''} style={{width:52,height:52,borderRadius:14,background:`${svc.color}22`,border:`2px solid ${svc.color}55`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.6rem',flexShrink:0}}>
                                        {svc.icon}
                                    </div>

                                    <div style={{flex:1,minWidth:0}}>
                                        {/* Header */}
                                        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8,flexWrap:'wrap'}}>
                                            <span style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text-muted)'}}>{em.referenceNumber}</span>
                                            <span style={{fontSize:13,fontWeight:700,color:svc.color}}>{svc.label} Emergency</span>
                                            {isPending && (
                                                <span className="emergency-pulse-red" style={{fontSize:10,background:'rgba(239,68,68,0.2)',color:'#f87171',border:'1px solid rgba(239,68,68,0.4)',borderRadius:50,padding:'2px 10px',fontWeight:700}}>
                                                    🔴 NEW
                                                </span>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div style={{display:'flex',gap:16,marginBottom:12,flexWrap:'wrap'}}>
                                            <span style={{fontSize:12,color:'var(--text-secondary)'}}>📞 <strong style={{color:'var(--text-primary)'}}>{em.phone}</strong></span>
                                            <span style={{fontSize:12,color:'var(--text-secondary)'}}>📍 {em.location?.substring(0,70)}{em.location?.length > 70 ? '…' : ''}</span>
                                            <span style={{fontSize:11,color:'var(--text-muted)',fontFamily:'var(--font-mono)'}}>
                                                {new Date(em.createdAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})} · {new Date(em.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        {/* Status stepper */}
                                        <div style={{display:'flex',alignItems:'center',gap:0,marginBottom:14}}>
                                            {STATUS_STEPS.filter(s => s !== 'resolved').map((step, i) => {
                                                const stepIdx = STATUS_STEPS.indexOf(step);
                                                const done    = stepIdx < currentStepIdx;
                                                const current = stepIdx === currentStepIdx;
                                                return (
                                                    <div key={step} style={{display:'flex',alignItems:'center'}}>
                                                        <div style={{width:24,height:24,borderRadius:'50%',background:done?svc.color:current?`${svc.color}33`:'rgba(255,255,255,0.06)',border:`2px solid ${done||current?svc.color:'rgba(255,255,255,0.12)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,color:done?'#fff':current?svc.color:'var(--text-muted)',fontWeight:700,transition:'all .3s',flexShrink:0}}>
                                                            {done ? '✓' : i + 1}
                                                        </div>
                                                        {i < 3 && (
                                                            <div style={{width:24,height:2,background:done?svc.color:'rgba(255,255,255,0.08)',transition:'background .3s'}}/>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                            <span style={{marginLeft:10,fontSize:11,color:svc.color,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em'}}>
                                                {STATUS_LABELS[em.status]}
                                            </span>
                                        </div>

                                        {/* Action buttons */}
                                        {next && (
                                            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                                                <button
                                                    onClick={() => updateStatus(em._id, next)}
                                                    disabled={updating === em._id}
                                                    style={{padding:'8px 18px',background:svc.color,border:'none',borderRadius:'var(--radius-sm)',color:'#fff',cursor:'pointer',fontSize:12.5,fontWeight:600,opacity:updating===em._id?0.6:1,transition:'opacity .2s'}}>
                                                    {updating === em._id ? 'Updating…' :
                                                        next === 'accepted'   ? '✅ Accept Request' :
                                                            next === 'on_the_way' ? '🚨 On the Way' :
                                                                next === 'arrived'    ? '📍 Mark Arrived' :
                                                                    next === 'resolved'   ? '✓ Mark Resolved' : 'Next Step'}
                                                </button>
                                                <a href={`tel:${em.phone}`}
                                                   style={{padding:'8px 14px',background:'rgba(255,255,255,0.06)',border:'1px solid var(--border)',borderRadius:'var(--radius-sm)',color:'var(--text-primary)',fontSize:12,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:4}}>
                                                    📞 Call {em.phone}
                                                </a>
                                            </div>
                                        )}
                                        {em.status === 'resolved' && (
                                            <span style={{fontSize:12,color:'#10b981',fontWeight:600}}>✅ Resolved</span>
                                        )}
                                        {em.assignedAgentName && (
                                            <p style={{fontSize:11,color:'var(--text-muted)',marginTop:8}}>Handled by: {em.assignedAgentName}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ── AGENT CHAT PAGE ── */
function AgentChatPage({ agentName, agentDept, agentInitials, user, unreadRooms, setUnreadRooms }) {
    const [rooms, setRooms]           = useState([]);
    const [activeRoom, setActiveRoom] = useState(null);
    const [messages, setMessages]     = useState([]);
    const [input, setInput]           = useState('');
    const messagesEndRef = useRef(null);

    const fetchRooms = async () => {
        try {
            const res = await fetch(`${API}/messages/department/${encodeURIComponent(agentDept)}`);
            if (res.ok) setRooms(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchMessages = async (roomId) => {
        try {
            const res = await fetch(`${API}/messages/room/${roomId}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data.map(m => ({
                    id: m._id, from: m.senderType === 'agent' ? 'agent' : 'citizen',
                    senderName: m.senderName, text: m.text, time: m.createdAt
                })));
            }
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchRooms();
        const interval = setInterval(fetchRooms, 5000);
        return () => clearInterval(interval);
    }, [agentDept]);

    useEffect(() => {
        const handleNewRequest = () => fetchRooms();
        const handleMessage = ({ roomId, message }) => {
            if (activeRoom && roomId === activeRoom.roomId && message.senderType === 'citizen') {
                setMessages(prev => [...prev, {
                    id: message.id, from: 'citizen',
                    senderName: message.senderName, text: message.text, time: message.time
                }]);
            }
            fetchRooms();
        };
        socket.on('chat:new_request', handleNewRequest);
        socket.on('chat:message', handleMessage);
        return () => {
            socket.off('chat:new_request', handleNewRequest);
            socket.off('chat:message', handleMessage);
        };
    }, [activeRoom]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const acceptChat = async (room) => {
        socket.emit('chat:accept', { roomId: room.roomId, agentId: user.id, agentName });
        setActiveRoom(room);
        setUnreadRooms(prev => ({ ...prev, [room.roomId]: false }));
        await fetchMessages(room.roomId);
        await fetch(`${API}/messages/room/${room.roomId}/read`, { method: 'PATCH' });
    };

    const sendMessage = () => {
        if (!input.trim() || !activeRoom) return;
        const text = input.trim();
        setInput('');
        setMessages(prev => [...prev, { id: Date.now(), from: 'agent', senderName: agentName, text, time: new Date() }]);
        socket.emit('chat:message', {
            roomId: activeRoom.roomId, senderId: user.id,
            senderName: agentName, text, senderType: 'agent'
        });
    };

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    return (
        <div style={{height:'calc(100vh - 130px)',display:'flex',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',overflow:'hidden'}}>
            <div style={{width:260,borderRight:'1px solid var(--border)',background:'var(--bg-card)',display:'flex',flexDirection:'column',flexShrink:0}}>
                <div style={{padding:'14px 16px',borderBottom:'1px solid var(--border)'}}>
                    <h4 style={{fontSize:13,fontWeight:600,color:'var(--text-primary)'}}>Citizen Chats</h4>
                    <p style={{fontSize:11,color:'var(--text-muted)',marginTop:2}}>{agentDept}</p>
                </div>
                <div style={{flex:1,overflowY:'auto'}}>
                    {rooms.length === 0 ? (
                        <div style={{padding:24,textAlign:'center',color:'var(--text-muted)'}}>
                            <p style={{fontSize:'1.5rem',marginBottom:8}}>💬</p>
                            <p style={{fontSize:12}}>No chats yet</p>
                        </div>
                    ) : rooms.map(room => (
                        <div key={room.roomId} onClick={() => acceptChat(room)}
                             style={{padding:'12px 16px',borderBottom:'1px solid var(--border)',cursor:'pointer',background:activeRoom?.roomId===room.roomId?'var(--accent-glow)':'transparent',borderLeft:activeRoom?.roomId===room.roomId?'3px solid var(--accent)':'3px solid transparent',transition:'all .2s'}}>
                            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                                <div style={{width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#3b82f6,#6366f1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:600,color:'#fff',flexShrink:0}}>
                                    {room.citizenName?.[0]?.toUpperCase()||'C'}
                                </div>
                                <div style={{flex:1,minWidth:0}}>
                                    <p style={{fontSize:12.5,fontWeight:500,color:'var(--text-primary)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{room.citizenName}</p>
                                    <p style={{fontSize:11,color:'var(--text-muted)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{room.lastMessage}</p>
                                </div>
                                {room.unread > 0 && (
                                    <span style={{width:8,height:8,borderRadius:'50%',background:'linear-gradient(135deg,#3b82f6,#6366f1)',boxShadow:'0 0 6px rgba(99,102,241,0.8)',flexShrink:0}}/>
                                )}
                            </div>
                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                                <span style={{fontSize:10,background:'rgba(245,158,11,0.15)',color:'#fbbf24',border:'1px solid rgba(245,158,11,0.3)',borderRadius:50,padding:'1px 8px'}}>
                                    {room.agentId ? 'Active' : 'Waiting'}
                                </span>
                                <span style={{fontSize:10,color:'var(--text-muted)',fontFamily:'var(--font-mono)'}}>
                                    {new Date(room.lastTime).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {activeRoom ? (
                <div style={{flex:1,display:'flex',flexDirection:'column',background:'var(--bg-panel)'}}>
                    <div style={{padding:'12px 18px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:10}}>
                        <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#3b82f6,#6366f1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:600,color:'#fff'}}>
                            {activeRoom.citizenName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <p style={{fontSize:13.5,fontWeight:500}}>{activeRoom.citizenName}</p>
                            <p style={{fontSize:11,color:'var(--text-muted)'}}>{activeRoom.department}</p>
                        </div>
                        <span style={{marginLeft:'auto',fontSize:11,background:'rgba(16,185,129,0.15)',color:'#34d399',border:'1px solid rgba(16,185,129,0.3)',borderRadius:50,padding:'3px 10px'}}>● Active</span>
                    </div>
                    <div style={{flex:1,overflowY:'auto',padding:16,display:'flex',flexDirection:'column',gap:10}}>
                        {messages.map(msg => (
                            <div key={msg.id} style={{display:'flex',gap:8,maxWidth:'75%',alignSelf:msg.from==='agent'?'flex-end':'flex-start',flexDirection:msg.from==='agent'?'row-reverse':'row'}}>
                                <div style={{width:26,height:26,borderRadius:'50%',background:msg.from==='agent'?'linear-gradient(135deg,#3b82f6,#6366f1)':'rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:600,color:'#fff',flexShrink:0,border:'1px solid var(--border)'}}>
                                    {msg.from==='agent'?agentInitials:msg.senderName?.[0]?.toUpperCase()||'C'}
                                </div>
                                <div>
                                    <div style={{background:msg.from==='agent'?'var(--accent)':'var(--bg-card)',border:'1px solid var(--border)',borderRadius:10,padding:'8px 12px',fontSize:13,lineHeight:1.55,color:msg.from==='agent'?'#fff':'var(--text-primary)'}}>
                                        {msg.text}
                                    </div>
                                    <p style={{fontSize:10,color:'var(--text-muted)',marginTop:3,textAlign:msg.from==='agent'?'right':'left',fontFamily:'var(--font-mono)'}}>
                                        {new Date(msg.time).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef}/>
                    </div>
                    <div style={{padding:'12px 16px',borderTop:'1px solid var(--border)',display:'flex',gap:8,alignItems:'flex-end'}}>
                        <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
                                  placeholder="Type a message…" rows={1}
                                  style={{flex:1,background:'var(--bg-input)',border:'1px solid var(--border)',borderRadius:'var(--radius-sm)',padding:'8px 12px',fontSize:13,color:'var(--text-primary)',fontFamily:'var(--font-ui)',resize:'none',outline:'none'}}/>
                        <button onClick={sendMessage} disabled={!input.trim()}
                                style={{padding:'8px 14px',background:'var(--accent)',border:'none',borderRadius:'var(--radius-sm)',color:'#fff',cursor:'pointer',fontSize:13,opacity:!input.trim()?0.5:1}}>➤</button>
                    </div>
                </div>
            ) : (
                <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:10,color:'var(--text-muted)'}}>
                    <p style={{fontSize:'2rem'}}>💬</p>
                    <p style={{fontSize:13}}>Select a chat to start responding</p>
                </div>
            )}
        </div>
    );
}

/* ── MAIN ── */
export default function AgentDashboard() {
    const { user, isLoaded }          = useUser();
    const [page, setPage]             = useState("reports");
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [selected, setSelected]     = useState(null);
    const [filter, setFilter]         = useState("All");
    const [search, setSearch]         = useState("");
    const [resolveTarget, setResolveTarget]   = useState(null);
    const [respondTarget, setRespondTarget]   = useState(null);
    const [chatUnread, setChatUnread]   = useState(0);
    const [emergencyCount, setEmergencyCount] = useState(0);
    const [chatRooms, setChatRooms]     = useState([]);
    const [unreadRooms, setUnreadRooms] = useState({});
    const { toast, show: showToast }   = useToast();

    const agentName     = user?.fullName || user?.firstName || 'Agent';
    const agentDept     = user?.publicMetadata?.department || 'Department';
    const agentInitials = agentName.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);

    // ── Socket + Emergency polling ──
    useEffect(() => {
        if (!isLoaded || !user) return;

        socket.connect();
        socket.emit('agent:online', { clerkId: user.id, name: agentName, department: agentDept });

        socket.on('chat:new_request', (data) => {
            setChatRooms(prev => {
                if (prev.find(r => r.roomId === data.roomId)) return prev;
                return [...prev, { ...data }];
            });
            setUnreadRooms(prev => ({ ...prev, [data.roomId]: true }));
            setChatUnread(prev => prev + 1);
        });

        socket.on('chat:message', ({ roomId, message }) => {
            if (message.senderType === 'citizen') {
                setUnreadRooms(prev => ({ ...prev, [roomId]: true }));
                if (page !== 'chat') setChatUnread(prev => prev + 1);
            }
        });

        // Poll emergency count
        const pollEmergency = async () => {
            try {
                const res = await fetch(`${API}/emergency/department/${encodeURIComponent(agentDept)}`);
                if (res.ok) {
                    const data = await res.json();
                    setEmergencyCount(data.filter(e => e.status === 'pending').length);
                }
            } catch(e) {}
        };
        pollEmergency();
        const emergencyInterval = setInterval(pollEmergency, 15000);

        return () => {
            socket.off('chat:new_request');
            socket.off('chat:message');
            socket.disconnect();
            clearInterval(emergencyInterval);
        };
    }, [isLoaded, user, agentName, agentDept]);

    const fetchComplaints = async () => {
        if (!isLoaded || !user) return;
        try {
            const res = await fetch(`${API}/admin/complaints?category=${encodeURIComponent(agentDept)}`);
            if (res.ok) {
                const data = await res.json();
                const myComplaints = data.filter(c =>
                    c.status === 'In Progress' || c.status === 'Resolved' ||
                    c.status === 'Rejected'    || c.assignedAgentName === agentName
                );
                setComplaints(myComplaints);
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    useEffect(() => { fetchComplaints(); }, [isLoaded, user]);

    const filtered = complaints.filter(c => {
        const ms = filter === 'All' || c.status === filter;
        const mq = !search ||
            c.title?.toLowerCase().includes(search.toLowerCase()) ||
            c.complaintId?.toLowerCase().includes(search.toLowerCase()) ||
            c.location?.toLowerCase().includes(search.toLowerCase());
        return ms && mq;
    });

    const stats = {
        total:      complaints.length,
        inProgress: complaints.filter(c => c.status === 'In Progress').length,
        resolved:   complaints.filter(c => c.status === 'Resolved').length,
        responded:  complaints.filter(c => c.agentResponse).length,
    };

    const FILTERS = ['All', 'In Progress', 'Resolved', 'Rejected'];

    const NAV = [
        { key:"dashboard",  label:"Overview",       icon:"dashboard" },
        { key:"reports",    label:"My Complaints",  icon:"reports",  badge: stats.inProgress },
        { key:"emergency",  label:"Emergencies",    icon:"alert",    badge: emergencyCount, badgeRed: true },
        { key:"chat",       label:"Citizen Chats",  icon:"chat",     badge: chatUnread },
    ];

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div className="logo-mark">SL</div>
                    <div className="logo-text">GovServe Lanka<span>Agent Portal</span></div>
                </div>
                <nav className="sidebar-nav">
                    <div className="nav-section-label">Main</div>
                    {NAV.map(n=>(
                        <div key={n.key} className={`nav-item ${page===n.key?"active":""}`}
                             onClick={()=>{ setPage(n.key); if(n.key==='chat') setChatUnread(0); if(n.key==='emergency') setEmergencyCount(0); }}>
                            <Icon name={n.icon} size={16}/>
                            {n.label}
                            {n.badge>0 && <span className={`nav-badge ${n.badgeRed?'':'blue'}`} style={n.badgeRed?{background:'#ef4444'}:{}}>{n.badge}</span>}
                        </div>
                    ))}
                </nav>
                <div className="sidebar-agent">
                    <div className="agent-avatar">{agentInitials}</div>
                    <div className="agent-info">
                        <div className="agent-name">{agentName}</div>
                        <div className="agent-dept">{agentDept}</div>
                    </div>
                    <div className="online-dot"/>
                </div>
            </aside>

            <main className="main">
                <div className="topbar">
                    <div>
                        <div className="topbar-title">
                            {page === "dashboard"  && "Overview Dashboard"}
                            {page === "reports"    && "My Assigned Complaints"}
                            {page === "emergency"  && "Emergency Requests"}
                            {page === "chat"       && "Citizen Chats"}
                        </div>
                        <div className="topbar-sub">
                            {page === "reports"   && `${filtered.length} of ${complaints.length} complaints · ${agentDept}`}
                            {page === "dashboard" && `${agentDept} · ${new Date().toLocaleDateString('en-LK',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}`}
                            {page === "emergency" && `${agentDept} · Live emergency requests`}
                            {page === "chat"      && `Live chat support · ${agentDept}`}
                        </div>
                    </div>
                </div>

                <div className="content">
                    {page === "dashboard" && (
                        <div className="page active">
                            <div className="stats-row">
                                <div className="stat-card blue animate-in"><div className="stat-label">Total Assigned</div><div className="stat-value blue">{stats.total}</div></div>
                                <div className="stat-card amber animate-in"><div className="stat-label">In Progress</div><div className="stat-value amber">{stats.inProgress}</div></div>
                                <div className="stat-card green animate-in"><div className="stat-label">Resolved</div><div className="stat-value green">{stats.resolved}</div></div>
                                <div className="stat-card blue animate-in"><div className="stat-label">Responded</div><div className="stat-value blue">{stats.responded}</div></div>
                            </div>
                            {emergencyCount > 0 && (
                                <div className="emergency-pulse-red" onClick={() => setPage('emergency')}
                                     style={{background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.4)',borderRadius:'var(--radius-md)',padding:'14px 18px',marginBottom:16,cursor:'pointer',display:'flex',alignItems:'center',gap:12}}>
                                    <span style={{fontSize:'1.5rem'}}>🚨</span>
                                    <div>
                                        <p style={{fontSize:13,fontWeight:700,color:'#f87171'}}>
                                            {emergencyCount} New Emergency Request{emergencyCount > 1 ? 's' : ''}!
                                        </p>
                                        <p style={{fontSize:11,color:'var(--text-muted)',marginTop:2}}>Click to view and respond →</p>
                                    </div>
                                </div>
                            )}
                            <div style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',padding:20}}>
                                <div className="section-title" style={{marginBottom:14}}>Recent Complaints</div>
                                {loading ? <p style={{color:'var(--text-muted)',fontSize:13}}>Loading…</p> :
                                    complaints.slice(0,5).map(c=>(
                                        <div key={c._id} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:'1px solid var(--border)',cursor:'pointer'}} onClick={()=>{setSelected(c);setPage('reports');}}>
                                            <div className={`severity-bar ${sevClass[c.priorityLevel]||'sev-medium'}`} style={{height:32,width:3,borderRadius:99,flexShrink:0}}/>
                                            <div style={{flex:1}}>
                                                <div style={{fontSize:12.5,fontWeight:500}}>{c.title}</div>
                                                <div style={{fontSize:11,color:'var(--text-muted)',marginTop:2,fontFamily:'var(--font-mono)'}}>{c.complaintId} · {new Date(c.createdAt).toLocaleDateString()}</div>
                                            </div>
                                            <div style={{display:'flex',gap:6,alignItems:'center'}}>
                                                {c.agentResponse && <span style={{fontSize:10,color:'#60a5fa'}}>💬</span>}
                                                <span className={`status-pill ${c.status==='In Progress'?'status-active':c.status==='Resolved'?'status-resolved':'status-pending'}`}>
                                                    <span className="status-dot"/>{c.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                }
                                {complaints.length === 0 && !loading && <div className="empty-state"><p>No complaints assigned yet</p></div>}
                            </div>
                        </div>
                    )}

                    {page === "reports" && (
                        <div className="page active">
                            <div className="stats-row">
                                <div className="stat-card blue animate-in"><div className="stat-label">Total</div><div className="stat-value blue">{stats.total}</div></div>
                                <div className="stat-card amber animate-in"><div className="stat-label">In Progress</div><div className="stat-value amber">{stats.inProgress}</div></div>
                                <div className="stat-card green animate-in"><div className="stat-label">Resolved</div><div className="stat-value green">{stats.resolved}</div></div>
                                <div className="stat-card blue animate-in"><div className="stat-label">Rate</div><div className="stat-value blue">{stats.total>0?Math.round((stats.resolved/stats.total)*100):0}%</div></div>
                            </div>
                            <div className="filter-row">
                                {FILTERS.map(f=>(
                                    <button key={f} className={`filter-chip ${filter===f?"active":""}`} onClick={()=>setFilter(f)}>{f}</button>
                                ))}
                                <div className="search-input-wrap">
                                    <Icon name="search" size={14}/>
                                    <input className="search-input" placeholder="Search complaints…" value={search} onChange={e=>setSearch(e.target.value)}/>
                                </div>
                            </div>
                            <div className="reports-list">
                                {loading ? (
                                    <div className="empty-state"><p>Loading complaints…</p></div>
                                ) : filtered.length === 0 ? (
                                    <div className="empty-state"><Icon name="reports" size={40}/><p>No complaints found</p></div>
                                ) : (
                                    filtered.map(c=>(
                                        <ReportCard key={c._id} report={c}
                                                    selected={selected?._id === c._id}
                                                    onSelect={setSelected}
                                                    onOpenResolve={() => setResolveTarget(c)}
                                                    onOpenRespond={() => setRespondTarget(c)}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {page === "emergency" && (
                        <div className="page active">
                            <EmergencyPage
                                agentDept={agentDept}
                                agentName={agentName}
                                user={user}
                            />
                        </div>
                    )}

                    {page === "chat" && (
                        <div className="page active">
                            <AgentChatPage
                                agentName={agentName}
                                agentDept={agentDept}
                                agentInitials={agentInitials}
                                user={user}
                                unreadRooms={unreadRooms}
                                setUnreadRooms={setUnreadRooms}
                            />
                        </div>
                    )}
                </div>
            </main>

            <DetailPanel
                report={selected}
                onClose={() => setSelected(null)}
                onResolve={() => setResolveTarget(selected)}
                onRespond={() => setRespondTarget(selected)}
            />

            {respondTarget && (
                <RespondModal report={respondTarget} onClose={() => setRespondTarget(null)}
                              onSent={() => { fetchComplaints(); setRespondTarget(null); showToast('Response sent!', 'success'); }}
                />
            )}

            {resolveTarget && (
                <ResolveModal report={resolveTarget} onClose={() => setResolveTarget(null)}
                              onResolved={() => { fetchComplaints(); setSelected(null); setResolveTarget(null); showToast('Complaint resolved!', 'success'); }}
                />
            )}

            <div className={`toast ${toast.show?"show":""} ${toast.type}`}>
                <span className="toast-icon">{toast.icon}</span>
                <span>{toast.msg}</span>
            </div>
        </div>
    );
}