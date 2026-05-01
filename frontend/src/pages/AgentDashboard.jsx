import { useState, useEffect, useRef } from "react";
import "./AgentDashboard.css";
import { useUser } from "@clerk/clerk-react";

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
        reports:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
        dashboard:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
        close:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
        send:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9 22,2"/></svg>,
        check:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>,
        search:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
        calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
        location: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
        reply:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9,17 4,12 9,7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>,
        upload:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
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
                    <div>
                        <h4>💬 Respond to Citizen</h4>
                        <p>{report.complaintId} · {report.title}</p>
                    </div>
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
                <textarea
                    className="response-textarea"
                    placeholder="Type your response to the citizen…"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    rows={4}
                />

                <div className="response-modal-footer" style={{marginTop:16}}>
                    <button className="btn btn-sm" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={handleSend} disabled={!text.trim() || saving}>
                        <Icon name="send" size={12}/>
                        {saving ? 'Sending…' : 'Send to Citizen'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── RESOLVE MODAL ── */
function ResolveModal({ report, onClose, onResolved }) {
    const [note, setNote] = useState('');
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [saving, setSaving] = useState(false);
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

            const res = await fetch(`${API}/complaints/${report.complaintId}/status`, {
                method: 'PATCH',
                body: formData
            });
            if (res.ok) { onResolved(); onClose(); }
            else console.error('Failed to resolve:', await res.json());
        } catch (e) { console.error(e); }
        setSaving(false);
    };

    return (
        <div className="overlay show" onClick={onClose}>
            <div className="response-modal" onClick={e => e.stopPropagation()}>
                <div className="response-modal-header">
                    <div>
                        <h4>✅ Mark as Resolved</h4>
                        <p>{report.complaintId} · {report.title}</p>
                    </div>
                    <button className="btn btn-sm btn-icon" onClick={onClose}><Icon name="close" size={14}/></button>
                </div>

                <div className="response-issue-box">
                    <div className="response-issue-label">Complaint</div>
                    <div className="response-issue-title">📍 {report.location}</div>
                    <div className="response-issue-meta">{report.category} · Priority: {report.priorityLevel}</div>
                </div>

                <div className="response-quick-label" style={{marginTop:16}}>Resolution Note</div>
                <textarea
                    className="response-textarea"
                    placeholder="Describe what was done to resolve this issue…"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    rows={4}
                />

                <div className="response-quick-label" style={{marginTop:14}}>
                    Upload Resolved Photos <span style={{color:'#4a5568',fontWeight:400,textTransform:'none'}}>(optional)</span>
                </div>
                <div style={{border:'2px dashed rgba(255,255,255,0.1)',borderRadius:8,padding:20,textAlign:'center',cursor:'pointer',background:'rgba(255,255,255,0.02)',marginTop:8}} onClick={() => fileRef.current.click()}>
                    {previews.length > 0 ? (
                        <div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center'}}>
                            {previews.map((src,i) => <img key={i} src={src} alt="" style={{width:85,height:85,objectFit:'cover',borderRadius:6,border:'1px solid rgba(16,185,129,0.4)'}} />)}
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
                <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImages} style={{display:'none'}} />

                <div className="response-modal-footer" style={{marginTop:20}}>
                    <button className="btn btn-sm" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={handleResolve} disabled={saving}>
                        <Icon name="check" size={12}/>
                        {saving ? 'Resolving…' : 'Mark as Resolved'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── REPORT CARD ── */
function ReportCard({ report, selected, onSelect, onOpenResolve, onOpenRespond }) {
    const statusClass = {
        'Pending': 'status-pending',
        'In Progress': 'status-active',
        'Resolved': 'status-resolved',
        'Rejected': 'status-escalated',
        'Under Review': 'status-pending'
    };

    return (
        <div className={`report-card animate-in ${selected ? "selected" : ""}`} onClick={() => onSelect(report)}>
            <div className="report-card-top">
                <div className={`severity-bar ${sevClass[report.priorityLevel] || 'sev-medium'}`} />
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
                                <img key={i} src={`http://localhost:5000${url}`} alt="" style={{width:'100%',aspectRatio:'1',objectFit:'cover',borderRadius:6,cursor:'pointer',border:'1px solid rgba(255,255,255,0.07)'}} onClick={() => window.open(`http://localhost:5000${url}`)} />
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

                {/* ACTIVITY TIMELINE */}
                <div className="section-divider">Activity Timeline</div>
                <div className="timeline">
                    <div className="tl-item">
                        <div className="tl-dot blue">📋</div>
                        <div className="tl-content">
                            <div className="tl-title">Complaint Filed</div>
                            <div className="tl-time">{new Date(report.createdAt).toLocaleString()}</div>
                        </div>
                    </div>
                    {report.assignedAgentName && (
                        <div className="tl-item">
                            <div className="tl-dot amber">👤</div>
                            <div className="tl-content">
                                <div className="tl-title">Assigned to {report.assignedAgentName}</div>
                                <div className="tl-time">By Admin</div>
                            </div>
                        </div>
                    )}
                    {report.agentResponse && (
                        <div className="tl-item">
                            <div className="tl-dot blue">💬</div>
                            <div className="tl-content">
                                <div className="tl-title">Agent Responded</div>
                                <div className="tl-time" style={{color:'var(--text-secondary)',fontSize:11.5,marginTop:4,lineHeight:1.5,background:'rgba(96,165,250,0.07)',border:'1px solid rgba(96,165,250,0.15)',borderRadius:6,padding:'6px 10px'}}>
                                    "{report.agentResponse}"
                                </div>
                            </div>
                        </div>
                    )}
                    {report.status === 'Resolved' && (
                        <div className="tl-item">
                            <div className="tl-dot green">✓</div>
                            <div className="tl-content">
                                <div className="tl-title" style={{color:'#10b981'}}>Resolved</div>
                                {report.resolvedDate && <div className="tl-time">{new Date(report.resolvedDate).toLocaleString()}</div>}
                                {report.resolutionNote && (
                                    <div style={{fontSize:11.5,color:'var(--text-secondary)',marginTop:4,lineHeight:1.5,background:'rgba(16,185,129,0.07)',border:'1px solid rgba(16,185,129,0.15)',borderRadius:6,padding:'6px 10px'}}>
                                        "{report.resolutionNote}"
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {report.resolvedImageUrls?.length > 0 && (
                    <>
                        <div className="section-divider" style={{color:'#10b981'}}>✅ Resolved Photos</div>
                        <div className="photo-grid">
                            {report.resolvedImageUrls.map((url,i) => (
                                <img key={i} src={`http://localhost:5000${url}`} alt="" style={{width:'100%',aspectRatio:'1',objectFit:'cover',borderRadius:6,cursor:'pointer',border:'1px solid rgba(16,185,129,0.3)'}} onClick={() => window.open(`http://localhost:5000${url}`)} />
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

/* ── MAIN ── */
export default function AgentDashboard() {
    const { user, isLoaded } = useUser();
    const [page, setPage]         = useState("reports");
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [selected, setSelected] = useState(null);
    const [filter, setFilter]     = useState("All");
    const [search, setSearch]     = useState("");
    const [resolveTarget, setResolveTarget] = useState(null);
    const [respondTarget, setRespondTarget] = useState(null);
    const { toast, show: showToast } = useToast();

    const agentName     = user?.fullName || user?.firstName || 'Agent';
    const agentDept     = user?.publicMetadata?.department || 'Department';
    const agentInitials = agentName.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);

    const fetchComplaints = async () => {
        if (!isLoaded || !user) return;
        try {
            const res = await fetch(`${API}/admin/complaints?category=${encodeURIComponent(agentDept)}`);
            if (res.ok) {
                const data = await res.json();
                const myComplaints = data.filter(c =>
                    c.status === 'In Progress' ||
                    c.status === 'Resolved' ||
                    c.status === 'Rejected' ||
                    c.assignedAgentName === agentName
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

    const handleRefresh = () => {
        fetchComplaints();
        // Update selected if open
        if (selected) {
            setSelected(prev => complaints.find(c => c._id === prev._id) || prev);
        }
    };

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div className="logo-mark">SL</div>
                    <div className="logo-text">GovServe Lanka<span>Agent Portal</span></div>
                </div>
                <nav className="sidebar-nav">
                    <div className="nav-section-label">Main</div>
                    {[
                        { key:"dashboard", label:"Overview",      icon:"dashboard" },
                        { key:"reports",   label:"My Complaints", icon:"reports",  badge: stats.inProgress },
                    ].map(n=>(
                        <div key={n.key} className={`nav-item ${page===n.key?"active":""}`} onClick={()=>setPage(n.key)}>
                            <Icon name={n.icon} size={16}/>
                            {n.label}
                            {n.badge>0 && <span className="nav-badge">{n.badge}</span>}
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
                            {page === "dashboard" && "Overview Dashboard"}
                            {page === "reports"   && "My Assigned Complaints"}
                        </div>
                        <div className="topbar-sub">
                            {page === "reports"   && `${filtered.length} of ${complaints.length} complaints · ${agentDept}`}
                            {page === "dashboard" && `${agentDept} · ${new Date().toLocaleDateString('en-LK',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}`}
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
                                        <ReportCard
                                            key={c._id}
                                            report={c}
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
                </div>
            </main>

            <DetailPanel
                report={selected}
                onClose={() => setSelected(null)}
                onResolve={() => setResolveTarget(selected)}
                onRespond={() => setRespondTarget(selected)}
            />

            {respondTarget && (
                <RespondModal
                    report={respondTarget}
                    onClose={() => setRespondTarget(null)}
                    onSent={() => {
                        handleRefresh();
                        setRespondTarget(null);
                        showToast('Response sent to citizen!', 'success');
                    }}
                />
            )}

            {resolveTarget && (
                <ResolveModal
                    report={resolveTarget}
                    onClose={() => setResolveTarget(null)}
                    onResolved={() => {
                        handleRefresh();
                        setSelected(null);
                        setResolveTarget(null);
                        showToast('Complaint marked as resolved!', 'success');
                    }}
                />
            )}

            <div className={`toast ${toast.show?"show":""} ${toast.type}`}>
                <span className="toast-icon">{toast.icon}</span>
                <span>{toast.msg}</span>
            </div>
        </div>
    );
}