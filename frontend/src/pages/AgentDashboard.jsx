import { useState, useEffect, useRef } from "react";
import "./AgentDashboard.css";

// ── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_REPORTS = [
    {
        id: "RPT-2024-0041",
        title: "Main water pipe burst near Galle Road junction",
        category: "Water", severity: "critical", status: "pending",
        submittedAt: "2024-06-12 08:23", location: "Galle Road, Colombo 03", postalCode: "00300",
        description: "A major water pipe has burst at the junction of Galle Road and Bauddhaloka Mawatha. Water is flooding the road and causing traffic issues. Multiple households in the surrounding area have no water supply since 6 AM.",
        citizen: { id:"CIT-19847", name:"Nuwan Perera", email:"nuwan.perera@gmail.com", phone1:"+94 77 234 5678", phone2:"+94 11 223 3445", address:"45/B, Colombo 03", postalCode:"00300", billRef:"WB-2024-COL-004412", initials:"NP" },
        photos: ["💧","🚧","📍"],
        timeline: [
            { label:"Report submitted", time:"08:23, Jun 12", type:"blue" },
            { label:"Assigned to Water Dept.", time:"08:31, Jun 12", type:"amber" },
        ],
        solution:"", solutionFrom:"", solutionTo:"", isRenewed:false, agentResponse:"",
    },
    {
        id: "RPT-2024-0039",
        title: "Power outage affecting 3 streets in Nugegoda",
        category: "Electricity", severity: "high", status: "active",
        submittedAt: "2024-06-11 19:45", location: "Nugegoda, Colombo", postalCode: "10250",
        description: "Complete power outage since 7 PM affecting Colombo Street, Perera Mawatha and Lake Road. No prior notice was given. Several businesses and families affected.",
        citizen: { id:"CIT-20034", name:"Dilani Jayawardena", email:"dilani.j@yahoo.com", phone1:"+94 71 987 6543", phone2:"", address:"12, Lake Road, Nugegoda", postalCode:"10250", billRef:"EB-2024-NUG-009871", initials:"DJ" },
        photos: ["⚡","🌑"],
        timeline: [
            { label:"Report submitted", time:"19:45, Jun 11", type:"blue" },
            { label:"Acknowledged by CEB", time:"20:10, Jun 11", type:"amber" },
            { label:"Team dispatched", time:"21:00, Jun 11", type:"green" },
        ],
        solution:"Our technical team has been dispatched to identify the fault. Expected resolution by 11 PM tonight.",
        solutionFrom:"2024-06-11", solutionTo:"2024-06-12", isRenewed:false, agentResponse:"",
    },
    {
        id: "RPT-2024-0037",
        title: "Uncollected garbage pile for over 12 days – Dehiwala",
        category: "Garbage", severity: "high", status: "escalated",
        submittedAt: "2024-06-10 10:05", location: "Station Road, Dehiwala", postalCode: "10350",
        description: "Garbage has not been collected for 12+ days on Station Road. The pile is attracting animals and causing a health hazard. Residents have complained multiple times with no response.",
        citizen: { id:"CIT-18922", name:"Ranjith Fernando", email:"ranjith.f@hotmail.com", phone1:"+94 76 112 2334", phone2:"+94 11 276 4432", address:"78, Station Road, Dehiwala", postalCode:"10350", billRef:"CMC-2024-DEH-003341", initials:"RF" },
        photos: ["🗑️","⚠️","📸"],
        timeline: [
            { label:"Report submitted", time:"10:05, Jun 10", type:"blue" },
            { label:"Escalated – deadline missed", time:"10:05, Jun 12", type:"amber" },
        ],
        solution:"", solutionFrom:"", solutionTo:"", isRenewed:true, agentResponse:"",
    },
    {
        id: "RPT-2024-0035",
        title: "Flooding risk – low-lying area in Ratmalana",
        category: "Disaster", severity: "critical", status: "active",
        submittedAt: "2024-06-10 06:30", location: "Wellawatte, Ratmalana", postalCode: "10390",
        description: "Heavy rains have caused water levels to rise significantly near the canal. At least 15 families may need to be evacuated. The area has flooded before in 2017.",
        citizen: { id:"CIT-21100", name:"Saman Wickramasinghe", email:"saman.w@sltnet.lk", phone1:"+94 70 456 7890", phone2:"", address:"3, Canal Road, Ratmalana", postalCode:"10390", billRef:"DMC-2024-RAT-000211", initials:"SW" },
        photos: ["🌊","🏠","🚨"],
        timeline: [
            { label:"Report submitted", time:"06:30, Jun 10", type:"blue" },
            { label:"Alert sent to DMC", time:"06:45, Jun 10", type:"amber" },
            { label:"Assessment team deployed", time:"08:00, Jun 10", type:"green" },
        ],
        solution:"Emergency assessment team has been deployed. Evacuation plan is on standby.",
        solutionFrom:"2024-06-10", solutionTo:"2024-06-14", isRenewed:false, agentResponse:"",
    },
    {
        id: "RPT-2024-0032",
        title: "Street lights non-functional – Pannipitiya Road",
        category: "Electricity", severity: "medium", status: "resolved",
        submittedAt: "2024-06-08 22:10", location: "Pannipitiya Road, Battaramulla", postalCode: "10120",
        description: "All street lights on a 400m stretch of Pannipitiya Road have been out for 5 days. This is causing safety concerns especially at night.",
        citizen: { id:"CIT-17443", name:"Chamari Silva", email:"chamari.s@gmail.com", phone1:"+94 77 891 0234", phone2:"", address:"22A, Pannipitiya Rd, Battaramulla", postalCode:"10120", billRef:"EB-2024-BAT-007723", initials:"CS" },
        photos: ["💡","🌃"],
        timeline: [
            { label:"Report submitted", time:"22:10, Jun 8", type:"blue" },
            { label:"Work order created", time:"09:00, Jun 9", type:"amber" },
            { label:"Resolved – lights restored", time:"16:30, Jun 9", type:"green" },
        ],
        solution:"All street lights have been repaired and restored. A faulty distribution box was replaced.",
        solutionFrom:"2024-06-09", solutionTo:"2024-06-09", isRenewed:false, agentResponse:"",
    },
    {
        id: "RPT-2024-0028",
        title: "Road crack posing danger near school, Kandy",
        category: "Roads", severity: "low", status: "pending",
        submittedAt: "2024-06-07 14:22", location: "Peradeniya Road, Kandy", postalCode: "20000",
        description: "A large crack has appeared on Peradeniya Road right in front of Dharmaraja College. Students and vehicles are at risk. The crack is widening after the recent rains.",
        citizen: { id:"CIT-15567", name:"Kasun Bandara", email:"kasun.b@live.com", phone1:"+94 72 567 8901", phone2:"+94 81 223 4567", address:"11, Temple Road, Kandy", postalCode:"20000", billRef:"RDA-2024-KAN-002213", initials:"KB" },
        photos: ["🛣️","⚠️"],
        timeline: [{ label:"Report submitted", time:"14:22, Jun 7", type:"blue" }],
        solution:"", solutionFrom:"", solutionTo:"", isRenewed:false, agentResponse:"",
    },
];

const CHAT_CONVERSATIONS = [
    {
        id:1, name:"Nuwan Perera", initials:"NP", reportId:"RPT-2024-0041",
        unread:true, lastTime:"08:45",
        messages:[
            { id:1, from:"citizen", text:"Hello, I reported a water pipe burst on Galle Road. Can someone please look into it urgently? My whole street has no water.", time:"08:25" },
            { id:2, from:"agent",   text:"Good morning Mr. Perera. We have received your report and it has been assigned as a critical priority. A team will be dispatched shortly.", time:"08:31" },
            { id:3, from:"citizen", text:"Thank you. The water is still flowing onto the road and causing traffic. Is there any ETA?", time:"08:44" },
            { id:4, from:"citizen", text:"Also the flooding is reaching nearby houses now.", time:"08:45" },
        ]
    },
    {
        id:2, name:"Ranjith Fernando", initials:"RF", reportId:"RPT-2024-0037",
        unread:true, lastTime:"11:02",
        messages:[
            { id:1, from:"citizen", text:"This garbage has not been collected for over 12 days! I reported this before and got no reply. This is unacceptable.", time:"10:05" },
            { id:2, from:"agent",   text:"We sincerely apologize for the delay Mr. Fernando. I can see this report has been escalated. Our supervisor has been notified.", time:"10:50" },
            { id:3, from:"citizen", text:"I need a definite date when this will be cleared. The smell is unbearable and there are health risks.", time:"11:02" },
        ]
    },
    {
        id:3, name:"Dilani Jayawardena", initials:"DJ", reportId:"RPT-2024-0039",
        unread:false, lastTime:"21:15",
        messages:[
            { id:1, from:"citizen", text:"Power has been out since 7 PM. Can you tell me what's happening?", time:"19:45" },
            { id:2, from:"agent",   text:"Hello Ms. Jayawardena. Our team is already aware and a fault finding crew has been dispatched.", time:"20:12" },
            { id:3, from:"citizen", text:"Thank you for the update.", time:"21:15" },
        ]
    },
    {
        id:4, name:"Saman Wickramasinghe", initials:"SW", reportId:"RPT-2024-0035",
        unread:false, lastTime:"08:55",
        messages:[
            { id:1, from:"citizen", text:"Water level is rising near our homes. We may need evacuation assistance.", time:"06:32" },
            { id:2, from:"agent",   text:"Mr. Wickramasinghe, please stay calm. Our disaster assessment team has been deployed to your location. Please keep your phone available.", time:"06:50" },
            { id:3, from:"citizen", text:"Okay, thank you. Some elderly neighbours need help.", time:"08:55" },
        ]
    },
];

// ── Quick response templates ───────────────────────────────────────────────
const QUICK_RESPONSES = [
    "We will fix this issue within the next week.",
    "Our team has been notified and will visit the site within 48 hours.",
    "This issue has been escalated to the relevant department.",
    "We are currently investigating the problem and will update you shortly.",
    "A technician has been scheduled to assess and resolve this issue.",
    "Thank you for reporting. This will be resolved within 3–5 working days.",
];

// ── Icons ──────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16, style = {} }) => {
    const icons = {
        reports:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>,
        chat:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
        dashboard: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
        close:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
        trash:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14a2,2 0 0 1-2,2H8a2,2 0 0 1-2-2L5,6"/><path d="M10,11v6M14,11v6"/><path d="M9,6V4a1,1 0 0 1,1-1h4a1,1 0 0 1,1,1v2"/></svg>,
        send:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9 22,2"/></svg>,
        check:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>,
        search:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
        calendar:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
        location:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
        reply:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9,17 4,12 9,7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>,
    };
    return <span className="nav-icon" style={style}>{icons[name]}</span>;
};

// ── Helpers ────────────────────────────────────────────────────────────────
const catColor = { Water:"#3b82f6", Electricity:"#f59e0b", Garbage:"#10b981", Disaster:"#ef4444", Police:"#8b5cf6", Roads:"#6b7280", Health:"#ec4899", Agriculture:"#84cc16" };
const sevClass  = { critical:"sev-critical", high:"sev-high", medium:"sev-medium", low:"sev-low" };

// ── Toast ──────────────────────────────────────────────────────────────────
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

// ── Response Modal ─────────────────────────────────────────────────────────
function ResponseModal({ report, onClose, onSend }) {
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        if (!text.trim()) return;
        setSending(true);
        await new Promise(r => setTimeout(r, 600));
        onSend(report.id, text.trim());
        setSending(false);
        onClose();
    };

    return (
        <div className="overlay show" onClick={onClose}>
            <div className="response-modal" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="response-modal-header">
                    <div>
                        <h4>💬 Send Response</h4>
                        <p>{report.id} · {report.citizen.name}</p>
                    </div>
                    <button className="btn btn-sm btn-icon" onClick={onClose}>
                        <Icon name="close" size={14} />
                    </button>
                </div>

                {/* Issue summary */}
                <div className="response-issue-box">
                    <div className="response-issue-label">Issue</div>
                    <div className="response-issue-title">{report.title}</div>
                    <div className="response-issue-meta">📍 {report.location} · {report.submittedAt}</div>
                </div>

                {/* Quick responses */}
                <div className="response-quick-label">Quick Responses</div>
                <div className="response-quick-list">
                    {QUICK_RESPONSES.map((q, i) => (
                        <button key={i} className="response-quick-btn" onClick={() => setText(q)}>
                            {q}
                        </button>
                    ))}
                </div>

                {/* Text area */}
                <div className="response-quick-label" style={{ marginTop: 14 }}>Your Response</div>
                <textarea
                    className="response-textarea"
                    placeholder="Type a custom response to the citizen…"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    rows={4}
                />

                {/* Previous response */}
                {report.agentResponse && (
                    <div className="response-prev">
                        <span className="response-prev-label">Previous response</span>
                        <p>{report.agentResponse}</p>
                    </div>
                )}

                {/* Footer */}
                <div className="response-modal-footer">
                    <button className="btn btn-sm" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={handleSend} disabled={!text.trim() || sending}>
                        <Icon name="send" size={12} />
                        {sending ? "Sending…" : "Send to Citizen"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Report Card ────────────────────────────────────────────────────────────
function ReportCard({ report, selected, onSelect, onDelete, onOpenResponse }) {
    const stopProp = fn => e => { e.stopPropagation(); fn(); };
    return (
        <div className={`report-card animate-in ${selected ? "selected" : ""}`} onClick={() => onSelect(report)}>
            <div className="report-card-top">
                <div className={`severity-bar ${sevClass[report.severity]}`} />
                <div style={{ width:32, height:32, borderRadius:"50%", background:`${catColor[report.category]||"#6b7280"}22`, border:`1px solid ${catColor[report.category]||"#6b7280"}44`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:13, fontWeight:600, color:catColor[report.category]||"#6b7280" }}>
                    {report.citizen.initials}
                </div>
                <div className="report-main">
                    <div className="report-id">{report.id} · {report.category}</div>
                    <div className="report-title">{report.title}</div>
                    <div className="report-meta">
                        <span className="report-meta-item"><Icon name="location" size={11}/>{report.location}</span>
                        <span className="report-meta-item"><Icon name="calendar" size={11}/>{report.submittedAt}</span>
                        {report.agentResponse && (
                            <span className="tag" style={{ color:"#10b981", borderColor:"rgba(16,185,129,0.3)", background:"rgba(16,185,129,0.08)" }}>
                ✓ Responded
              </span>
                        )}
                        {report.isRenewed && (
                            <span className="tag" style={{ color:"#f59e0b", borderColor:"rgba(245,158,11,0.3)", background:"rgba(245,158,11,0.08)" }}>
                ↻ Renewed
              </span>
                        )}
                    </div>
                </div>
                <div className="report-actions" onClick={e => e.stopPropagation()}>
                    <span className={`status-pill status-${report.status}`}><span className="status-dot"/>{report.status}</span>

                    {/* ── RESPONSE BUTTON ── */}
                    <button
                        className="btn btn-sm response-btn"
                        title="Send response to citizen"
                        onClick={stopProp(onOpenResponse)}
                    >
                        <Icon name="reply" size={12} />
                        Respond
                    </button>

                    <button className="btn btn-sm btn-icon btn-danger" title="Delete" onClick={stopProp(onDelete)}>
                        <Icon name="trash" size={13} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Detail Panel ───────────────────────────────────────────────────────────
function DetailPanel({ report, onClose, onSolutionSave, onStatusChange }) {
    const [solutionText, setSolutionText] = useState(report?.solution || "");
    const [fromDate, setFromDate]         = useState(report?.solutionFrom || "");
    const [toDate, setToDate]             = useState(report?.solutionTo || "");
    const [saving, setSaving]             = useState(false);

    useEffect(() => {
        if (report) {
            setSolutionText(report.solution || "");
            setFromDate(report.solutionFrom || "");
            setToDate(report.solutionTo || "");
        }
    }, [report?.id]);

    if (!report) return null;

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 700));
        onSolutionSave(report.id, solutionText, fromDate, toDate);
        setSaving(false);
    };

    return (
        <div className={`detail-panel ${report ? "open" : ""}`}>
            <div className="panel-header">
                <span className="report-id" style={{ fontFamily:"var(--font-mono)", fontSize:12 }}>{report.id}</span>
                <h3 style={{ flex:1, marginLeft:8 }}>{report.category} Report</h3>
                <button className="btn btn-sm btn-icon" onClick={onClose}><Icon name="close" size={14}/></button>
            </div>

            <div className="panel-body">
                <div className="section-divider">Citizen Information</div>
                <div className="citizen-card">
                    <div className="citizen-header">
                        <div className="citizen-avatar-lg">{report.citizen.initials}</div>
                        <div>
                            <div className="citizen-name">{report.citizen.name}</div>
                            <div className="citizen-id">{report.citizen.id}</div>
                        </div>
                        <span className={`status-pill status-${report.status}`} style={{ marginLeft:"auto" }}>
              <span className="status-dot"/>{report.status}
            </span>
                    </div>
                    <div className="info-grid">
                        <div className="info-item"><div className="info-label">Email</div><div className="info-value" style={{fontSize:12}}>{report.citizen.email}</div></div>
                        <div className="info-item"><div className="info-label">Phone 1</div><div className="info-value" style={{fontFamily:"var(--font-mono)",fontSize:12}}>{report.citizen.phone1}</div></div>
                        {report.citizen.phone2 && <div className="info-item"><div className="info-label">Phone 2</div><div className="info-value" style={{fontFamily:"var(--font-mono)",fontSize:12}}>{report.citizen.phone2}</div></div>}
                        <div className="info-item"><div className="info-label">Address</div><div className="info-value" style={{fontSize:12}}>{report.citizen.address}</div></div>
                        <div className="info-item"><div className="info-label">Postal Code</div><div className="info-value" style={{fontFamily:"var(--font-mono)"}}>{report.citizen.postalCode}</div></div>
                        <div className="info-item"><div className="info-label">Bill Ref</div><div className="info-value" style={{fontFamily:"var(--font-mono)",fontSize:11}}>{report.citizen.billRef}</div></div>
                    </div>
                </div>

                <div className="section-divider">Report Details</div>
                <div className="report-detail-card">
                    <div className="info-grid" style={{ marginBottom:12 }}>
                        <div className="info-item"><div className="info-label">Category</div><div className="info-value" style={{color:catColor[report.category]||"#6b7280",fontWeight:500}}>{report.category}</div></div>
                        <div className="info-item"><div className="info-label">Severity</div><div className="info-value" style={{textTransform:"capitalize",fontWeight:500}}>{report.severity}</div></div>
                        <div className="info-item"><div className="info-label">Location</div><div className="info-value" style={{fontSize:12}}>{report.location}</div></div>
                        <div className="info-item"><div className="info-label">Submitted</div><div className="info-value" style={{fontFamily:"var(--font-mono)",fontSize:12}}>{report.submittedAt}</div></div>
                    </div>
                    <div className="info-label" style={{ marginBottom:6 }}>Description</div>
                    <div style={{ fontSize:12.5, color:"var(--text-secondary)", lineHeight:1.65 }}>{report.description}</div>
                    {report.photos.length > 0 && (
                        <>
                            <div className="info-label" style={{ marginTop:12, marginBottom:6 }}>Attached Photos</div>
                            <div className="photo-grid">{report.photos.map((p,i)=><div key={i} className="photo-thumb">{p}</div>)}</div>
                        </>
                    )}
                </div>

                {/* Agent Response display */}
                {report.agentResponse && (
                    <>
                        <div className="section-divider">Agent Response Sent</div>
                        <div className="response-sent-box">
                            <div className="response-sent-meta">✓ Sent to {report.citizen.name}</div>
                            <p>{report.agentResponse}</p>
                        </div>
                    </>
                )}

                <div className="section-divider">Give Solution</div>
                <div className="solution-box">
                    <div style={{ fontSize:12.5, color:"var(--text-secondary)", marginBottom:4 }}>Write the official resolution response to the citizen:</div>
                    <textarea className="solution-textarea" placeholder="Describe the solution, action taken, and expected outcome..." value={solutionText} onChange={e=>setSolutionText(e.target.value)}/>
                    <div style={{ fontSize:11.5, color:"var(--text-muted)", margin:"10px 0 4px" }}>Resolution date range:</div>
                    <div className="date-range-row">
                        <input type="date" className="date-input" value={fromDate} onChange={e=>setFromDate(e.target.value)}/>
                        <input type="date" className="date-input" value={toDate}   onChange={e=>setToDate(e.target.value)}/>
                    </div>
                    <div style={{ marginTop:12, display:"flex", gap:8 }}>
                        <button className="btn btn-success btn-sm" onClick={handleSave} disabled={saving} style={{opacity:saving?0.7:1}}>
                            <Icon name="check" size={12}/>{saving?"Sending...":"Send Solution"}
                        </button>
                        <button className="btn btn-sm" onClick={()=>onStatusChange(report.id,"resolved")} style={{fontSize:11.5}}>Mark Resolved</button>
                        <button className="btn btn-sm" onClick={()=>onStatusChange(report.id,"active")}   style={{fontSize:11.5}}>Mark Active</button>
                    </div>
                </div>

                <div className="section-divider">Activity Timeline</div>
                <div className="timeline">
                    {report.timeline.map((t,i)=>(
                        <div className="tl-item" key={i}>
                            <div className={`tl-dot ${t.type}`}>●</div>
                            <div className="tl-content"><div className="tl-title">{t.label}</div><div className="tl-time">{t.time}</div></div>
                        </div>
                    ))}
                    {report.solution && (
                        <div className="tl-item">
                            <div className="tl-dot green">✓</div>
                            <div className="tl-content">
                                <div className="tl-title">Solution provided by agent</div>
                                <div className="tl-time" style={{color:"var(--text-secondary)",fontSize:11.5,marginTop:4,lineHeight:1.5}}>{report.solution.slice(0,80)}…</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="panel-footer">
                <button className="btn btn-sm" style={{ flex:1 }} onClick={onClose}><Icon name="close" size={12}/>Close</button>
            </div>
        </div>
    );
}

// ── Chat Page ──────────────────────────────────────────────────────────────
function ChatPage() {
    const [convs, setConvs]         = useState(CHAT_CONVERSATIONS);
    const [activeConv, setActiveConv] = useState(null);
    const [input, setInput]         = useState("");
    const msgsEndRef                = useRef(null);
    const prevMsgCount              = useRef(0);

    const scrollToBottom = () => msgsEndRef.current?.scrollIntoView({ behavior:"smooth" });

    useEffect(() => {
        if (!activeConv?.messages) return;
        const currentCount = activeConv.messages.length;
        if (currentCount > prevMsgCount.current) scrollToBottom();
        prevMsgCount.current = currentCount;
    }, [activeConv?.messages]);

    const selectConv = conv => {
        setConvs(cs => cs.map(c => c.id===conv.id ? {...c,unread:false} : c));
        const found    = convs.find(c => c.id===conv.id);
        const selected = found ? {...conv,unread:false} : conv;
        prevMsgCount.current = selected.messages?.length || 0;
        setActiveConv(selected);
    };

    const sendMsg = () => {
        if (!input.trim() || !activeConv) return;
        const msg = { id:Date.now(), from:"agent", text:input.trim(), time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) };
        const updated = convs.map(c => c.id===activeConv.id ? {...c,messages:[...c.messages,msg],lastTime:msg.time} : c);
        setConvs(updated);
        setActiveConv(prev => ({...prev,messages:[...prev.messages,msg]}));
        setInput("");
        setTimeout(scrollToBottom, 50);
    };

    const handleKey    = e => { if (e.key==="Enter"&&!e.shiftKey) { e.preventDefault(); sendMsg(); } };
    const unreadCount  = convs.filter(c=>c.unread).length;

    return (
        <div className="chat-layout">
            <div className="chat-sidebar">
                <div className="chat-sidebar-header">
                    <h4>Conversations {unreadCount>0 && <span className="nav-badge blue" style={{marginLeft:6}}>{unreadCount}</span>}</h4>
                </div>
                <div className="conv-list">
                    {convs.map(conv=>(
                        <div key={conv.id} className={`conv-item ${activeConv?.id===conv.id?"active":""}`} onClick={()=>selectConv(conv)}>
                            <div className="conv-avatar">{conv.initials}</div>
                            <div className="conv-info">
                                <div className="conv-name">{conv.name}</div>
                                <div className="conv-preview">{conv.messages[conv.messages.length-1]?.text}</div>
                            </div>
                            <div className="conv-time">{conv.lastTime}</div>
                            {conv.unread && <span className="unread-dot"/>}
                        </div>
                    ))}
                </div>
            </div>

            {activeConv ? (
                <div className="chat-main">
                    <div className="chat-header">
                        <div className="conv-avatar">{activeConv.initials}</div>
                        <div>
                            <div style={{fontSize:13.5,fontWeight:500}}>{activeConv.name}</div>
                            <div style={{fontSize:11,color:"var(--text-muted)",fontFamily:"var(--font-mono)"}}>{activeConv.reportId}</div>
                        </div>
                        <span className="status-pill status-active" style={{marginLeft:"auto"}}><span className="status-dot"/>Online</span>
                    </div>
                    <div className="chat-messages">
                        {activeConv.messages.map(msg=>(
                            <div key={msg.id} className={`msg ${msg.from}`}>
                                <div className="msg-avatar">{msg.from==="agent"?"AG":activeConv.initials}</div>
                                <div>
                                    <div className="msg-bubble">{msg.text}</div>
                                    <div className="msg-time">{msg.time}</div>
                                </div>
                            </div>
                        ))}
                        <div ref={msgsEndRef}/>
                    </div>
                    <div className="chat-input-area">
                        <textarea className="chat-input" placeholder="Type a message..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey} rows={1}/>
                        <button className="btn btn-primary btn-icon" onClick={sendMsg} disabled={!input.trim()}>
                            <Icon name="send" size={14}/>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="chat-main">
                    <div className="no-chat-selected">
                        <Icon name="chat" size={40}/>
                        <p>Select a conversation to start</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function AgentDashboard() {
    const [page, setPage]           = useState("reports");
    const [reports, setReports]     = useState(MOCK_REPORTS);
    const [selected, setSelected]   = useState(null);
    const [filter, setFilter]       = useState("all");
    const [search, setSearch]       = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [responseTarget, setResponseTarget] = useState(null);
    const { toast, show: showToast }  = useToast();

    const totalUnread = CHAT_CONVERSATIONS.filter(c=>c.unread).length;

    const filteredReports = reports.filter(r => {
        const matchFilter = filter==="all" || r.status===filter;
        const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.citizen.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    const stats = {
        total:    reports.length,
        pending:  reports.filter(r=>r.status==="pending").length,
        active:   reports.filter(r=>r.status==="active").length,
        resolved: reports.filter(r=>r.status==="resolved").length,
    };

    const handleDelete = id => {
        setReports(r=>r.filter(x=>x.id!==id));
        if (selected?.id===id) setSelected(null);
        setDeleteTarget(null);
        showToast("Report deleted successfully.","danger");
    };

    const handleSendResponse = (id, responseText) => {
        setReports(r => r.map(x => x.id===id
            ? { ...x, agentResponse:responseText, timeline:[...x.timeline,{ label:`Response sent: "${responseText.slice(0,50)}…"`, time:new Date().toLocaleString(), type:"green" }] }
            : x
        ));
        if (selected?.id===id) setSelected(prev=>({...prev, agentResponse:responseText}));
        showToast("Response sent to citizen successfully.","success");
    };

    const handleSolutionSave = (id, solution, from, to) => {
        setReports(r=>r.map(x=>x.id===id?{...x,solution,solutionFrom:from,solutionTo:to,status:"active",timeline:[...x.timeline,{label:"Solution provided to citizen",time:new Date().toLocaleString(),type:"green"}]}:x));
        if (selected?.id===id) setSelected(prev=>({...prev,solution,solutionFrom:from,solutionTo:to}));
        showToast("Solution sent to citizen successfully.","success");
    };

    const handleStatusChange = (id, status) => {
        setReports(r=>r.map(x=>x.id===id?{...x,status}:x));
        if (selected?.id===id) setSelected(prev=>({...prev,status}));
        showToast(`Status updated to ${status}.`,"info");
    };

    const FILTERS = ["all","pending","active","resolved","escalated"];

    return (
        <div className="layout">

            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div className="logo-mark">SL</div>
                    <div className="logo-text">GovServe Lanka<span>Agent Portal · Beta</span></div>
                </div>
                <nav className="sidebar-nav">
                    <div className="nav-section-label">Main</div>
                    {[
                        { key:"dashboard", label:"Overview",     icon:"dashboard" },
                        { key:"reports",   label:"Reports",      icon:"reports",  badge:reports.filter(r=>r.status==="pending").length },
                        { key:"chat",      label:"Citizen Chat", icon:"chat",     badge:totalUnread, badgeColor:"blue" },
                    ].map(n=>(
                        <div key={n.key} className={`nav-item ${page===n.key?"active":""}`} onClick={()=>setPage(n.key)}>
                            <Icon name={n.icon} size={16}/>
                            {n.label}
                            {n.badge>0 && <span className={`nav-badge ${n.badgeColor||""}`}>{n.badge}</span>}
                        </div>
                    ))}
                </nav>
                <div className="sidebar-agent">
                    <div className="agent-avatar">KR</div>
                    <div className="agent-info">
                        <div className="agent-name">K. Ranasinghe</div>
                        <div className="agent-dept">Water Department</div>
                    </div>
                    <div className="online-dot"/>
                </div>
            </aside>

            {/* Main */}
            <main className="main">
                <div className="topbar">
                    <div>
                        <div className="topbar-title">
                            {page==="dashboard" && "Overview Dashboard"}
                            {page==="reports"   && "Citizen Reports"}
                            {page==="chat"      && "Citizen Conversations"}
                        </div>
                        <div className="topbar-sub">
                            {page==="reports"   && `${filteredReports.length} of ${reports.length} reports`}
                            {page==="chat"      && `${totalUnread} unread messages`}
                            {page==="dashboard" && "Water Department · Colombo Region"}
                        </div>
                    </div>
                    <div className="topbar-actions">
            <span style={{fontSize:11.5,color:"var(--text-muted)",fontFamily:"var(--font-mono)"}}>
              {new Date().toLocaleDateString("en-LK",{weekday:"short",year:"numeric",month:"short",day:"numeric"})}
            </span>
                    </div>
                </div>

                <div className="content">

                    {/* Dashboard */}
                    {page==="dashboard" && (
                        <div className="page active">
                            <div className="stats-row">
                                <div className="stat-card blue animate-in"><div className="stat-label">Total Reports</div><div className="stat-value blue">{stats.total}</div><div className="stat-delta">All categories</div></div>
                                <div className="stat-card amber animate-in"><div className="stat-label">Pending</div><div className="stat-value amber">{stats.pending}</div><div className="stat-delta">Awaiting action</div></div>
                                <div className="stat-card blue animate-in"><div className="stat-label">Active</div><div className="stat-value blue">{stats.active}</div><div className="stat-delta">In progress</div></div>
                                <div className="stat-card green animate-in"><div className="stat-label">Resolved</div><div className="stat-value green">{stats.resolved}</div><div className="stat-delta">Completed</div></div>
                            </div>
                            <div style={{background:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:"var(--radius-md)",padding:20}}>
                                <div className="section-title" style={{marginBottom:14}}>Recent Activity</div>
                                {reports.slice(0,4).map(r=>(
                                    <div key={r.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                                        <div className={`severity-bar ${sevClass[r.severity]}`} style={{height:32,width:3,borderRadius:99}}/>
                                        <div style={{flex:1}}>
                                            <div style={{fontSize:12.5,fontWeight:500}}>{r.title}</div>
                                            <div style={{fontSize:11,color:"var(--text-muted)",marginTop:2,fontFamily:"var(--font-mono)"}}>{r.id} · {r.citizen.name}</div>
                                        </div>
                                        <span className={`status-pill status-${r.status}`}><span className="status-dot"/>{r.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reports */}
                    {page==="reports" && (
                        <div className="page active">
                            <div className="stats-row">
                                <div className="stat-card blue animate-in"><div className="stat-label">Total</div><div className="stat-value blue">{stats.total}</div></div>
                                <div className="stat-card amber animate-in"><div className="stat-label">Pending</div><div className="stat-value amber">{stats.pending}</div></div>
                                <div className="stat-card blue animate-in"><div className="stat-label">Active</div><div className="stat-value blue">{stats.active}</div></div>
                                <div className="stat-card green animate-in"><div className="stat-label">Resolved</div><div className="stat-value green">{stats.resolved}</div></div>
                            </div>
                            <div className="section-header"><div className="section-title">All Reports</div></div>
                            <div className="filter-row">
                                {FILTERS.map(f=>(
                                    <button key={f} className={`filter-chip ${filter===f?"active":""}`} onClick={()=>setFilter(f)}>
                                        {f.charAt(0).toUpperCase()+f.slice(1)}
                                    </button>
                                ))}
                                <div className="search-input-wrap">
                                    <Icon name="search" size={14}/>
                                    <input className="search-input" placeholder="Search reports…" value={search} onChange={e=>setSearch(e.target.value)}/>
                                </div>
                            </div>
                            <div className="reports-list">
                                {filteredReports.length===0
                                    ? <div className="empty-state"><Icon name="reports" size={40}/><p>No reports found</p></div>
                                    : filteredReports.map(r=>(
                                        <ReportCard
                                            key={r.id}
                                            report={r}
                                            selected={selected?.id===r.id}
                                            onSelect={setSelected}
                                            onDelete={()=>setDeleteTarget(r)}
                                            onOpenResponse={()=>setResponseTarget(r)}
                                        />
                                    ))
                                }
                            </div>
                        </div>
                    )}

                    {/* Chat */}
                    {page==="chat" && (
                        <div className="page active"><ChatPage/></div>
                    )}
                </div>
            </main>

            {/* Detail Panel */}
            <DetailPanel
                report={selected}
                onClose={()=>setSelected(null)}
                onSolutionSave={handleSolutionSave}
                onStatusChange={handleStatusChange}
            />

            {/* Response Modal */}
            {responseTarget && (
                <ResponseModal
                    report={responseTarget}
                    onClose={()=>setResponseTarget(null)}
                    onSend={handleSendResponse}
                />
            )}

            {/* Delete Dialog */}
            <div className={`overlay ${deleteTarget?"show":""}`} onClick={()=>setDeleteTarget(null)}>
                <div className="dialog" onClick={e=>e.stopPropagation()}>
                    <h4>Delete Report?</h4>
                    <p>Are you sure you want to permanently delete <strong>{deleteTarget?.id}</strong>? This action cannot be undone.</p>
                    <div className="dialog-actions">
                        <button className="btn btn-sm" onClick={()=>setDeleteTarget(null)}>Cancel</button>
                        <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(deleteTarget?.id)}>
                            <Icon name="trash" size={12}/>Delete
                        </button>
                    </div>
                </div>
            </div>


            {/* Toast */}
            <div className={`toast ${toast.show?"show":""} ${toast.type}`}>
                <span className="toast-icon">{toast.icon}</span>
                <span>{toast.msg}</span>
            </div>
        </div>
    );
}