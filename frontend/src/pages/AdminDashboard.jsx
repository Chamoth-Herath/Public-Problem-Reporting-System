import React, { useState, useEffect, useRef } from 'react';
import './AdminDashboard.css';

const API = 'http://localhost:5000/api';

/* ═══════════════════════════════════════════════
   SHARED UI COMPONENTS
═══════════════════════════════════════════════ */
const Badge = ({ label, type = 'gray' }) => {
    const styles = {
        green:  { bg:'rgba(29,158,117,0.18)',  color:'#34d399' },
        blue:   { bg:'rgba(24,95,165,0.22)',   color:'#60a5fa' },
        yellow: { bg:'rgba(230,168,23,0.18)',  color:'#fbbf24' },
        red:    { bg:'rgba(231,76,60,0.18)',   color:'#f87171' },
        gray:   { bg:'rgba(181,212,244,0.10)', color:'rgba(241,239,232,0.55)' },
    };
    const s = styles[type] || styles.gray;
    return <span style={{display:'inline-block',padding:'3px 10px',borderRadius:50,fontSize:'0.68rem',fontWeight:700,letterSpacing:'0.05em',textTransform:'uppercase',background:s.bg,color:s.color}}>{label}</span>;
};

const priorityBadge = p => <Badge label={p} type={p==='Critical'?'red':p==='High'?'yellow':p==='Medium'?'blue':'gray'} />;
const statusBadge = s => <Badge label={s} type={s==='Resolved'||s==='Active'?'green':s==='Pending'||s==='Pending Review'?'yellow':s==='In Progress'||s==='Assigned'?'blue':s==='Rejected'||s==='Suspended'||s==='Inactive'?'red':'gray'} />;

const Btn = ({ children, variant='secondary', size='', onClick, disabled, style={} }) => {
    const v = {
        primary:   {background:'#1D9E75',color:'#fff',border:'none',boxShadow:'0 3px 12px rgba(29,158,117,0.28)'},
        secondary: {background:'rgba(181,212,244,0.08)',color:'#60a5fa',border:'1px solid rgba(255,255,255,0.12)'},
        danger:    {background:'rgba(231,76,60,0.12)',color:'#f87171',border:'1px solid rgba(231,76,60,0.25)'},
        warn:      {background:'rgba(230,168,23,0.12)',color:'#fbbf24',border:'1px solid rgba(230,168,23,0.25)'},
        ghost:     {background:'transparent',color:'#8892a4',border:'1px solid rgba(255,255,255,0.07)'},
    };
    return (
        <button onClick={onClick} disabled={disabled}
                style={{display:'inline-flex',alignItems:'center',gap:6,padding:size==='sm'?'6px 12px':'9px 18px',borderRadius:6,fontFamily:'IBM Plex Sans,sans-serif',fontSize:size==='sm'?'0.78rem':'0.85rem',fontWeight:600,cursor:disabled?'not-allowed':'pointer',opacity:disabled?0.45:1,transition:'all .2s',letterSpacing:'0.01em',whiteSpace:'nowrap',...v[variant],...style}}>
            {children}
        </button>
    );
};

const Modal = ({ onClose, children, wide }) => (
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(4,44,83,0.72)',backdropFilter:'blur(8px)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
        <div onClick={e=>e.stopPropagation()} style={{background:'#13161e',border:'1px solid rgba(255,255,255,0.1)',borderRadius:14,width:'100%',maxWidth:wide?720:540,maxHeight:'88vh',overflowY:'auto',padding:32,position:'relative',scrollbarWidth:'thin'}}>
            <button onClick={onClose} style={{position:'absolute',top:16,right:16,background:'rgba(181,212,244,0.08)',border:'1px solid rgba(255,255,255,0.07)',color:'#8892a4',width:32,height:32,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:'0.9rem'}}>✕</button>
            {children}
        </div>
    </div>
);

const Field = ({ label, children }) => (
    <div style={{marginBottom:14}}>
        <label style={{display:'block',fontSize:'0.72rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.07em',color:'#8892a4',marginBottom:6}}>{label}</label>
        {children}
    </div>
);

const Row2 = ({ children }) => <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>{children}</div>;

const DetailRow = ({ k, v }) => (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0',borderBottom:'1px solid rgba(255,255,255,0.07)',fontSize:'0.875rem'}}>
        <span style={{color:'#8892a4'}}>{k}</span>
        <strong style={{color:'#e8eaf0',textAlign:'right',maxWidth:'60%'}}>{v}</strong>
    </div>
);

const EmptyState = ({ icon, text }) => (
    <div style={{textAlign:'center',padding:'52px 20px',color:'#4a5568'}}>
        <div style={{fontSize:'2.2rem',marginBottom:10}}>{icon}</div>
        <p style={{fontSize:'0.88rem'}}>{text}</p>
    </div>
);

const FilterTabs = ({ tabs, active, setActive, counts, accent='#3b82f6' }) => (
    <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
        {tabs.map(t => (
            <button key={t} onClick={() => setActive(t)}
                    style={{padding:'6px 15px',borderRadius:50,border:'none',background:active===t?accent:'rgba(181,212,244,0.07)',color:active===t?'#fff':'#8892a4',cursor:'pointer',fontSize:'0.8rem',fontWeight:600,fontFamily:'IBM Plex Sans,sans-serif',transition:'all .2s',display:'flex',alignItems:'center',gap:5}}>
                {t}
                <span style={{background:active===t?'rgba(255,255,255,0.22)':'rgba(181,212,244,0.14)',borderRadius:50,padding:'1px 7px',fontSize:'0.7rem'}}>{counts[t]??0}</span>
            </button>
        ))}
    </div>
);

const Table = ({ cols, rows, empty }) => (
    <div style={{overflowX:'auto',borderRadius:10,border:'1px solid rgba(255,255,255,0.07)'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.855rem'}}>
            <thead>
            <tr>{cols.map(c=><th key={c} style={{textAlign:'left',padding:'12px 15px',fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:'#4a5568',background:'#1a1e28',borderBottom:'1px solid rgba(255,255,255,0.07)',whiteSpace:'nowrap'}}>{c}</th>)}</tr>
            </thead>
            <tbody>
            {rows.length===0
                ? <tr><td colSpan={cols.length} style={{textAlign:'center',padding:40,color:'#4a5568'}}>{empty||'No data'}</td></tr>
                : rows}
            </tbody>
        </table>
    </div>
);

const TD = ({ children, mono, nowrap }) => (
    <td style={{padding:'12px 15px',borderBottom:'1px solid rgba(255,255,255,0.07)',color:'#8892a4',verticalAlign:'middle',fontFamily:mono?'IBM Plex Mono,monospace':undefined,fontSize:mono?'0.75rem':undefined,whiteSpace:nowrap?'nowrap':undefined}}>{children}</td>
);

const PageHeader = ({ title, sub }) => (
    <div style={{marginBottom:28}}>
        <h1 style={{fontSize:'1.75rem',fontWeight:700,letterSpacing:'-0.02em',color:'#e8eaf0'}}>{title}</h1>
        {sub && <p style={{color:'#8892a4',fontSize:'0.875rem',marginTop:3}}>{sub}</p>}
    </div>
);

const ConfirmDelete = ({ title, body, onCancel, onConfirm }) => (
    <div style={{textAlign:'center',padding:'8px 0'}}>
        <div style={{fontSize:'2.8rem',marginBottom:12}}>⚠️</div>
        <h2 style={{marginBottom:8,color:'#e8eaf0'}}>{title}</h2>
        <p style={{color:'#8892a4',marginBottom:24,fontSize:'0.9rem'}}>{body}</p>
        <div style={{display:'flex',gap:10}}>
            <Btn variant="ghost" onClick={onCancel} style={{flex:1}}>Cancel</Btn>
            <Btn variant="danger" onClick={onConfirm} style={{flex:1}}>Confirm Delete</Btn>
        </div>
    </div>
);

/* ═══════════════════════════════════════════════
   OVERVIEW
═══════════════════════════════════════════════ */
const Overview = ({ stats, complaints, setPage }) => {
    const pending = complaints.filter(c=>c.status==='Pending').length;

    return (
        <div>
            <PageHeader title="Dashboard Overview" sub="Welcome back, Admin — here's what needs your attention today" />
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:14,marginBottom:28}}>
                {[
                    {icon:'📋',val:stats?.complaints?.total||0,label:'Total Complaints',color:'#fbbf24'},
                    {icon:'🔴',val:stats?.complaints?.pending||0,label:'Pending Review',color:'#f87171'},
                    {icon:'⚙️',val:stats?.complaints?.inProgress||0,label:'In Progress',color:'#60a5fa'},
                    {icon:'✅',val:stats?.complaints?.resolved||0,label:'Resolved',color:'#34d399'},
                    {icon:'👥',val:stats?.users?.total||0,label:'Total Users',color:'#c4b5fd'},
                    {icon:'🤝',val:stats?.users?.agents||0,label:'Agents',color:'#2dd4bf'},
                ].map((s,i)=>(
                    <div key={i} style={{background:'#1a1e28',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10,padding:'18px 20px',display:'flex',alignItems:'center',gap:14}}>
                        <div style={{width:44,height:44,borderRadius:11,background:s.color+'22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem'}}>{s.icon}</div>
                        <div>
                            <div style={{fontSize:'1.8rem',fontWeight:700,color:s.color,lineHeight:1,fontFamily:'IBM Plex Mono,monospace'}}>{s.val}</div>
                            <div style={{fontSize:'0.72rem',color:'#4a5568',textTransform:'uppercase',letterSpacing:'0.06em',marginTop:3}}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{background:'#1a1e28',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10,padding:'20px 22px'}}>
                <h3 style={{fontSize:'0.95rem',marginBottom:16,color:'#e8eaf0'}}>🔴 Pending Complaints ({pending})</h3>
                {complaints.filter(c=>c.status==='Pending').slice(0,5).map(c=>(
                    <div key={c._id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 13px',background:'rgba(181,212,244,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:6,marginBottom:8,gap:10}}>
                        <div>
                            <p style={{fontSize:'0.82rem',color:'#e8eaf0',fontWeight:500}}>{c.title}</p>
                            <p style={{fontSize:'0.7rem',color:'#4a5568',marginTop:2}}>{c.complaintId} · {c.category}</p>
                        </div>
                        {priorityBadge(c.priorityLevel)}
                    </div>
                ))}
                {pending === 0 && <EmptyState icon="🎉" text="All caught up!" />}
                <button onClick={()=>setPage('complaints')} style={{marginTop:12,width:'100%',padding:'8px',background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:6,color:'#60a5fa',cursor:'pointer',fontSize:'0.82rem',fontWeight:600}}>
                    View All Complaints →
                </button>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════
   USERS PAGE
═══════════════════════════════════════════════ */
const EMPTY_USER = { name:'', email:'', password:'', role:'agent', department:'', phone:'', status:'Active' };
const DEPT_NAMES = ['Water Supply','Electricity','Garbage & Sanitation','Health','Police','Fire & Rescue','Agriculture','Education','Roads & Highways'];

const Users = ({ departments }) => {
    const [users, setUsers]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [modal, setModal]   = useState(null);
    const [sel, setSel]       = useState(null);
    const [form, setForm]     = useState(EMPTY_USER);
    const [showPass, setShowPass] = useState(false);
    const [error, setError]   = useState('');
    const set = e => setForm(f=>({...f,[e.target.name]:e.target.value}));
    const close = () => { setModal(null); setSel(null); setError(''); };

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API}/users`);
            const data = await res.json();
            setUsers(data);
        } catch { }
        setLoading(false);
    };

    useEffect(() => { fetchUsers(); }, []);

    const filtered = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.role?.toLowerCase().includes(search.toLowerCase())
    );

    const save = async () => {
        try {
            // 1. Save to MongoDB
            const url = modal==='add' ? `${API}/users` : `${API}/users/${sel._id}`;
            const method = modal==='add' ? 'POST' : 'PUT';
            const body = { ...form };
            if (modal==='edit' && !body.password) delete body.password;

            const res = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
            const data = await res.json();
            if (!res.ok) { setError(data.message); return; }

            // 2. If adding new user, also create in Clerk
            if (modal === 'add') {
                const clerkRes = await fetch(`${API}/setup/create-clerk-user`, {
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({
                        email: form.email,
                        password: form.password,
                        name: form.name,
                        role: form.role,
                        department: form.department
                    })
                });
                const clerkData = await clerkRes.json();
                if (!clerkRes.ok) {
                    setError(`MongoDB saved but Clerk failed: ${clerkData.message}. Try a stronger password.`);
                    fetchUsers();
                    return;
                }
            }

            fetchUsers();
            close();
        } catch (err) {
            setError('Server error: ' + err.message);
        }
    };

    const del = async () => {
        await fetch(`${API}/users/${sel._id}`, { method: 'DELETE' });
        fetchUsers();
        close();
    };

    const deptOptions = departments.length > 0
        ? departments.map(d => d.name)
        : DEPT_NAMES;

    return (
        <div>
            <PageHeader title="User Management" sub="Manage admin and agent accounts" />
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap',marginBottom:18}}>
                <input style={{width:260,background:'#0f1117',border:'1px solid rgba(255,255,255,0.07)',borderRadius:6,padding:'7px 12px',color:'#e8eaf0',fontSize:'0.875rem'}} placeholder="Search name, email or role…" value={search} onChange={e=>setSearch(e.target.value)} />
                <Btn variant="primary" onClick={()=>{setForm(EMPTY_USER);setModal('add')}}>＋ Add User</Btn>
            </div>

            {loading ? <EmptyState icon="⏳" text="Loading users…" /> :
                <Table cols={['Name','Email','Role','Department','Phone','Status','Actions']}
                       rows={filtered.map(u=>(
                           <tr key={u._id}>
                               <TD><strong style={{color:'#e8eaf0',fontWeight:500}}>{u.name}</strong></TD>
                               <TD>{u.email}</TD>
                               <TD><Badge label={u.role} type={u.role==='citizen'?'green':'blue'} /></TD>
                               <TD>{u.department || '—'}</TD>
                               <TD>{u.phone || '—'}</TD>
                               <TD>{statusBadge(u.status)}</TD>
                               <TD nowrap>
                                   <div style={{display:'flex',gap:5}}>
                                       <Btn size="sm" variant="secondary" onClick={()=>{setSel(u);setForm({...u,password:''});setModal('edit')}}>Edit</Btn>
                                       <Btn size="sm" variant="danger" onClick={()=>{setSel(u);setModal('delete')}}>Delete</Btn>
                                   </div>
                               </TD>
                           </tr>
                       ))}
                       empty="No users found"
                />}

            {(modal==='add'||modal==='edit') && (
                <Modal onClose={close}>
                    <h2 style={{color:'#e8eaf0',marginBottom:4}}>{modal==='add'?'＋ Add User':'✏️ Edit User'}</h2>
                    <p style={{color:'#8892a4',fontSize:'0.85rem',marginBottom:22}}>{modal==='add'?'Create new admin or agent account':'Editing '+sel?.name}</p>
                    {error && <div style={{background:'rgba(231,76,60,0.1)',border:'1px solid rgba(231,76,60,0.3)',borderRadius:6,padding:'8px 12px',color:'#f87171',fontSize:'0.82rem',marginBottom:14}}>{error}</div>}
                    <Row2>
                        <Field label="Full Name *"><input name="name" value={form.name} onChange={set} placeholder="Full name" style={{background:'#0f1117',border:'1px solid rgba(255,255,255,0.07)',borderRadius:6,padding:'8px 12px',color:'#e8eaf0',width:'100%',fontSize:'0.875rem'}} /></Field>
                        <Field label="Email *"><input name="email" value={form.email} onChange={set} placeholder="email@example.com" style={{background:'#0f1117',border:'1px solid rgba(255,255,255,0.07)',borderRadius:6,padding:'8px 12px',color:'#e8eaf0',width:'100%',fontSize:'0.875rem'}} /></Field>
                    </Row2>
                    <Field label={modal==='edit'?'New Password (blank = keep)':'Password *'}>
                        <div style={{position:'relative'}}>
                            <input name="password" type={showPass?'text':'password'} value={form.password} onChange={set} placeholder="Min 8 characters" style={{background:'#0f1117',border:'1px solid rgba(255,255,255,0.07)',borderRadius:6,padding:'8px 40px 8px 12px',color:'#e8eaf0',width:'100%',fontSize:'0.875rem'}} />
                            <button type="button" onClick={()=>setShowPass(!showPass)} style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'#8892a4',cursor:'pointer'}}>{showPass?'🙈':'👁️'}</button>
                        </div>
                    </Field>
                    <Row2>
                        <Field label="Role *">
                            <select name="role" value={form.role} onChange={set} style={{background:'#0f1117',border:'1px solid rgba(255,255,255,0.07)',borderRadius:6,padding:'8px 12px',color:'#e8eaf0',width:'100%',fontSize:'0.875rem'}}>
                                <option value="agent">Agent</option>
                                <option value="citizen">Citizen</option>
                            </select>
                        </Field>
                        <Field label="Status">
                            <select name="status" value={form.status} onChange={set} style={{background:'#0f1117',border:'1px solid rgba(255,255,255,0.07)',borderRadius:6,padding:'8px 12px',color:'#e8eaf0',width:'100%',fontSize:'0.875rem'}}>
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                        </Field>
                    </Row2>
                    {form.role === 'agent' && (
                        <Row2>
                            <Field label="Department">
                                <select name="department" value={form.department} onChange={set} style={{background:'#0f1117',border:'1px solid rgba(255,255,255,0.07)',borderRadius:6,padding:'8px 12px',color:'#e8eaf0',width:'100%',fontSize:'0.875rem'}}>
                                    <option value="">Select department…</option>
                                    {deptOptions.map(d=><option key={d}>{d}</option>)}
                                </select>
                            </Field>
                            <Field label="Phone">
                                <input name="phone" value={form.phone} onChange={set} placeholder="07XXXXXXXX" style={{background:'#0f1117',border:'1px solid rgba(255,255,255,0.07)',borderRadius:6,padding:'8px 12px',color:'#e8eaf0',width:'100%',fontSize:'0.875rem'}} />
                            </Field>
                        </Row2>
                    )}
                    <div style={{display:'flex',gap:10,marginTop:8}}>
                        <Btn variant="ghost" onClick={close} style={{flex:1}}>Cancel</Btn>
                        <Btn variant="primary" onClick={save} disabled={!form.name||!form.email||(modal==='add'&&!form.password)} style={{flex:1}}>{modal==='add'?'Create User':'Save Changes'}</Btn>
                    </div>
                </Modal>
            )}

            {modal==='delete' && sel && (
                <Modal onClose={close}>
                    <ConfirmDelete title="Delete User?" body={<>Delete <strong style={{color:'#e8eaf0'}}>{sel.name}</strong>? This cannot be undone.</>} onCancel={close} onConfirm={del} />
                </Modal>
            )}
        </div>
    );
};

/* ═══════════════════════════════════════════════
   DEPARTMENTS PAGE
═══════════════════════════════════════════════ */
const EMPTY_DEPT = {name:'',icon:'🏛️',description:'',hotline:'',email:'',status:'Active'};

const Departments = ({ depts, fetchDepts }) => {
    const [modal, setModal] = useState(null);
    const [sel, setSel]     = useState(null);
    const [form, setForm]   = useState(EMPTY_DEPT);
    const [agents, setAgents] = useState([]);
    const [error, setError] = useState('');
    const set = e => setForm(f=>({...f,[e.target.name]:e.target.value}));
    const close = () => { setModal(null); setSel(null); setError(''); };

    const fetchAgents = async (deptName) => {
        try {
            const res = await fetch(`${API}/users?department=${encodeURIComponent(deptName)}`);
            const data = await res.json();
            setAgents(data);
        } catch { setAgents([]); }
    };

    const save = async () => {
        try {
            const url = modal==='add' ? `${API}/departments` : `${API}/departments/${sel._id}`;
            const method = modal==='add' ? 'POST' : 'PUT';
            const res = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
            const data = await res.json();
            if (!res.ok) { setError(data.message); return; }
            fetchDepts();
            close();
        } catch { setError('Server error'); }
    };

    const del = async () => {
        await fetch(`${API}/departments/${sel._id}`, { method: 'DELETE' });
        fetchDepts();
        close();
    };

    return (
        <div>
            <PageHeader title="Departments" sub="Manage government departments and view their agents" />
            <div style={{display:'flex',justifyContent:'flex-end',marginBottom:18}}>
                <Btn variant="primary" onClick={()=>{setForm(EMPTY_DEPT);setModal('add')}}>＋ Add Department</Btn>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:16}}>
                {depts.map(d=>(
                    <div key={d._id} style={{background:'#1a1e28',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10,padding:22,position:'relative',overflow:'hidden'}}>
                        <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,#1D9E75,transparent)'}}/>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                            <div style={{display:'flex',alignItems:'center',gap:10}}>
                                <span style={{fontSize:'1.7rem'}}>{d.icon}</span>
                                <div>
                                    <h3 style={{fontSize:'0.95rem',color:'#e8eaf0'}}>{d.name}</h3>
                                    <p style={{fontSize:'0.7rem',color:'#4a5568'}}>{d._id?.slice(-8)}</p>
                                </div>
                            </div>
                            {statusBadge(d.status)}
                        </div>
                        <p style={{fontSize:'0.8rem',color:'#8892a4',marginBottom:14,lineHeight:1.5}}>{d.description}</p>
                        <div style={{display:'flex',gap:18,marginBottom:14}}>
                            {[['Total',d.totalComplaints||0,'#60a5fa'],['Resolved',d.resolvedComplaints||0,'#34d399'],['Agents',d.agentCount||0,'#fbbf24']].map(([l,v,c])=>(
                                <div key={l} style={{textAlign:'center'}}>
                                    <div style={{fontSize:'1.25rem',fontWeight:700,color:c,fontFamily:'IBM Plex Mono,monospace'}}>{v}</div>
                                    <div style={{fontSize:'0.65rem',color:'#4a5568',textTransform:'uppercase',letterSpacing:'0.05em'}}>{l}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{display:'flex',gap:7}}>
                            <Btn size="sm" variant="primary" onClick={()=>{setSel(d);fetchAgents(d.name);setModal('view')}} style={{flex:1}}>View Agents</Btn>
                            <Btn size="sm" variant="secondary" onClick={()=>{setSel(d);setForm({name:d.name,icon:d.icon,description:d.description,hotline:d.hotline,email:d.email,status:d.status});setModal('edit')}}>Edit</Btn>
                            <Btn size="sm" variant="danger" onClick={()=>{setSel(d);setModal('delete')}}>Del</Btn>
                        </div>
                    </div>
                ))}
            </div>

            {(modal==='add'||modal==='edit') && (
                <Modal onClose={close}>
                    <h2 style={{color:'#e8eaf0',marginBottom:4}}>{modal==='add'?'＋ Add Department':'✏️ Edit Department'}</h2>
                    <p style={{color:'#8892a4',fontSize:'0.85rem',marginBottom:22}}>Department details</p>
                    {error && <div style={{background:'rgba(231,76,60,0.1)',border:'1px solid rgba(231,76,60,0.3)',borderRadius:6,padding:'8px 12px',color:'#f87171',fontSize:'0.82rem',marginBottom:14}}>{error}</div>}
                    <Row2>
                        <Field label="Name *"><input name="name" value={form.name} onChange={set} placeholder="e.g. Water Supply" style={{background:'#0f1117',border:'1px solid rgba(255,255,255,0.07)',borderRadius:6,padding:'8px 12px',color:'#e8eaf0',width:'100%',fontSize:'0.875rem'}} /></Field>
                        <Field label="Icon (emoji)"><input name="icon" value={form.icon} onChange={set} placeholder="💧" style={{background:'#0f1117',border:'1px solid rgba(255,255,255,0.07)',borderRadius:6,padding:'8px 12px',color:'#e8eaf0',width:'100%',fontSize:'0.875rem'}} /></Field>
                    </Row2>
                    <Field label="Description"><textarea name="description" value={form.description} onChange={set} rows={2} placeholder="Brief description" style={{background:'#0f1117',border:'1px solid rgba(255,255,255,0.07)',borderRadius:6,padding:'8px 12px',color:'#e8eaf0',width:'100%',fontSize:'0.875rem',resize:'vertical'}} /></Field>
                    <Row2>
                        <Field label="Hotline"><input name="hotline" value={form.hotline} onChange={set} placeholder="1954" style={{background:'#0f1117',border:'1px solid rgba(255,255,255,0.07)',borderRadius:6,padding:'8px 12px',color:'#e8eaf0',width:'100%',fontSize:'0.875rem'}} /></Field>
                        <Field label="Email"><input name="email" value={form.email} onChange={set} placeholder="dept@gov.lk" style={{background:'#0f1117',border:'1px solid rgba(255,255,255,0.07)',borderRadius:6,padding:'8px 12px',color:'#e8eaf0',width:'100%',fontSize:'0.875rem'}} /></Field>
                    </Row2>
                    <Field label="Status">
                        <select name="status" value={form.status} onChange={set} style={{background:'#0f1117',border:'1px solid rgba(255,255,255,0.07)',borderRadius:6,padding:'8px 12px',color:'#e8eaf0',width:'100%',fontSize:'0.875rem'}}>
                            <option>Active</option><option>Inactive</option>
                        </select>
                    </Field>
                    <div style={{display:'flex',gap:10,marginTop:8}}>
                        <Btn variant="ghost" onClick={close} style={{flex:1}}>Cancel</Btn>
                        <Btn variant="primary" onClick={save} disabled={!form.name} style={{flex:1}}>{modal==='add'?'Create':'Save Changes'}</Btn>
                    </div>
                </Modal>
            )}

            {modal==='view' && sel && (
                <Modal onClose={close} wide>
                    <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
                        <span style={{fontSize:'2rem'}}>{sel.icon}</span>
                        <div>
                            <h2 style={{color:'#e8eaf0'}}>{sel.name}</h2>
                            <p style={{color:'#8892a4',fontSize:'0.82rem'}}>{sel.description}</p>
                        </div>
                    </div>
                    <div style={{marginBottom:12}}>
                        <h3 style={{fontSize:'0.9rem',color:'#e8eaf0',marginBottom:12}}>Agents ({agents.length})</h3>
                        {agents.length === 0
                            ? <EmptyState icon="👤" text="No agents assigned to this department yet. Add agents via User Management." />
                            : <Table cols={['Name','Email','Phone','Status']}
                                     rows={agents.map(a=>(
                                         <tr key={a._id}>
                                             <TD><strong style={{color:'#e8eaf0',fontWeight:500}}>{a.name}</strong></TD>
                                             <TD>{a.email}</TD>
                                             <TD>{a.phone||'—'}</TD>
                                             <TD>{statusBadge(a.status)}</TD>
                                         </tr>
                                     ))} />
                        }
                    </div>
                    <Btn variant="ghost" onClick={close} style={{width:'100%',marginTop:8}}>Close</Btn>
                </Modal>
            )}

            {modal==='delete' && sel && (
                <Modal onClose={close}>
                    <ConfirmDelete title="Delete Department?" body={<>Delete <strong style={{color:'#e8eaf0'}}>{sel.name}</strong>? This cannot be undone.</>} onCancel={close} onConfirm={del} />
                </Modal>
            )}
        </div>
    );
};

/* ═══════════════════════════════════════════════
   COMPLAINTS PAGE — Real backend
═══════════════════════════════════════════════ */
const Complaints = ({ depts }) => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [filter, setFilter]         = useState('All');
    const [search, setSearch]         = useState('');
    const [sel, setSel]               = useState(null);
    const [agents, setAgents]         = useState([]);
    const [assignTo, setAssignTo]     = useState('');
    const [assignId, setAssignId]     = useState('');
    const [note, setNote]             = useState('');
    const [saving, setSaving]         = useState(false);

    const fetchComplaints = async () => {
        try {
            const res = await fetch(`${API}/admin/complaints`);
            const data = await res.json();
            setComplaints(data);
        } catch { }
        setLoading(false);
    };

    useEffect(() => { fetchComplaints(); }, []);

    const fetchAgentsForDept = async (category) => {
        try {
            const res = await fetch(`${API}/users?department=${encodeURIComponent(category)}`);
            const data = await res.json();
            setAgents(data.filter(a => a.status === 'Active'));
        } catch { setAgents([]); }
    };

    const tabs = ['All','Pending','In Progress','Resolved','Rejected'];
    const counts = Object.fromEntries(tabs.map(t=>[t, t==='All'?complaints.length:complaints.filter(c=>c.status===t).length]));

    const filtered = complaints.filter(c => {
        const ms = filter==='All' || c.status===filter;
        const mq = c.complaintId?.toLowerCase().includes(search.toLowerCase()) ||
            c.title?.toLowerCase().includes(search.toLowerCase()) ||
            c.category?.toLowerCase().includes(search.toLowerCase());
        return ms && mq;
    });

    const assign = async () => {
        if (!assignId) return;
        setSaving(true);
        try {
            const res = await fetch(`${API}/admin/complaints/${sel.complaintId}/assign`, {
                method: 'PATCH',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({ agentId: assignId, agentName: assignTo, adminNote: note })
            });
            if (res.ok) { fetchComplaints(); close(); }
        } catch { }
        setSaving(false);
    };

    const reject = async () => {
        setSaving(true);
        try {
            await fetch(`${API}/admin/complaints/${sel.complaintId}/reject`, {
                method: 'PATCH',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({ reason: note })
            });
            fetchComplaints();
            close();
        } catch { }
        setSaving(false);
    };

    const close = () => { setSel(null); setAssignTo(''); setAssignId(''); setNote(''); setAgents([]); };

    return (
        <div>
            <PageHeader title="Complaint Management" sub="Review citizen complaints and assign to department agents" />
            <FilterTabs tabs={tabs} active={filter} setActive={setFilter} counts={counts} />
            <div style={{marginBottom:18}}>
                <input style={{width:320,background:'#0f1117',border:'1px solid rgba(255,255,255,0.07)',borderRadius:6,padding:'7px 12px',color:'#e8eaf0',fontSize:'0.875rem'}} placeholder="Search ID, title or department…" value={search} onChange={e=>setSearch(e.target.value)} />
            </div>

            {loading ? <EmptyState icon="⏳" text="Loading complaints…" /> :
                <Table cols={['ID','Title','Category','Location','Priority','Status','Date','Action']}
                       rows={filtered.map(c=>(
                           <tr key={c._id}>
                               <TD mono>{c.complaintId}</TD>
                               <TD><span style={{display:'block',maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:'#e8eaf0'}}>{c.title}</span></TD>
                               <TD>{c.category}</TD>
                               <TD><span style={{fontSize:'0.8rem'}}>{c.location?.substring(0,40)}{c.location?.length>40?'…':''}</span></TD>
                               <TD>{priorityBadge(c.priorityLevel)}</TD>
                               <TD>{statusBadge(c.status)}</TD>
                               <TD nowrap><span style={{fontSize:'0.78rem'}}>{new Date(c.createdAt).toLocaleDateString()}</span></TD>
                               <TD><Btn size="sm" variant="primary" onClick={()=>{setSel(c);fetchAgentsForDept(c.category);}}>Review</Btn></TD>
                           </tr>
                       ))}
                       empty="No complaints found"
                />}

            {sel && (
                <Modal onClose={close} wide>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:4}}>
                        <h2 style={{color:'#e8eaf0'}}>📋 Complaint Review</h2>
                        {statusBadge(sel.status)}
                    </div>
                    <p style={{color:'#8892a4',fontSize:'0.82rem',marginBottom:18}}>{sel.complaintId} · Filed {new Date(sel.createdAt).toLocaleDateString()}</p>

                    <div style={{background:'#0f1117',borderRadius:6,padding:14,marginBottom:16}}>
                        {[
                            ['Department', sel.category],
                            ['Title', sel.title],
                            ['Location', sel.location],
                            ['Priority', sel.priorityLevel],
                            ['Province', sel.province],
                            sel.assignedAgentName && ['Assigned To', sel.assignedAgentName],
                            sel.adminNote && ['Admin Note', sel.adminNote],
                        ].filter(Boolean).map(([k,v])=><DetailRow key={k} k={k} v={v}/>)}
                    </div>

                    <p style={{fontSize:'0.72rem',color:'#4a5568',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:8}}>Description</p>
                    <div style={{background:'rgba(181,212,244,0.05)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:6,padding:14,fontSize:'0.875rem',color:'#e8eaf0',lineHeight:1.75,marginBottom:16}}>{sel.description}</div>

                    {sel.imageUrls?.length > 0 && (
                        <div style={{marginBottom:16}}>
                            <p style={{fontSize:'0.72rem',color:'#4a5568',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:8}}>Attached Images ({sel.imageUrls.length})</p>
                            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                                {sel.imageUrls.map((url,i) => (
                                    <img key={i} src={`http://localhost:5000${url}`} alt={`img-${i}`} style={{width:100,height:100,objectFit:'cover',borderRadius:6,border:'1px solid rgba(255,255,255,0.07)',cursor:'pointer'}} onClick={()=>window.open(`http://localhost:5000${url}`)} />
                                ))}
                            </div>
                        </div>
                    )}

                    {sel.status === 'Pending' && (
                        <div style={{borderTop:'1px solid rgba(255,255,255,0.07)',paddingTop:18,marginTop:18}}>
                            <p style={{fontSize:'0.85rem',fontWeight:600,color:'#e8eaf0',marginBottom:14}}>🎯 Assign to Agent</p>
                            <Field label={`Select agent from ${sel.category} department`}>
                                <select value={assignId} onChange={e=>{setAssignId(e.target.value);setAssignTo(agents.find(a=>a._id===e.target.value)?.name||'')}} style={{background:'#0f1117',border:'1px solid rgba(255,255,255,0.07)',borderRadius:6,padding:'8px 12px',color:'#e8eaf0',width:'100%',fontSize:'0.875rem'}}>
                                    <option value="">— Select agent —</option>
                                    {agents.map(a=><option key={a._id} value={a._id}>{a.name} ({a.email})</option>)}
                                </select>
                            </Field>
                            {agents.length === 0 && <p style={{fontSize:'0.78rem',color:'#f87171',marginBottom:12}}>⚠️ No active agents found for {sel.category}. Add agents in User Management.</p>}
                            <Field label="Admin note (optional)">
                                <textarea value={note} onChange={e=>setNote(e.target.value)} rows={3} placeholder="Note for the agent…" style={{background:'#0f1117',border:'1px solid rgba(255,255,255,0.07)',borderRadius:6,padding:'8px 12px',color:'#e8eaf0',width:'100%',fontSize:'0.875rem',resize:'vertical'}} />
                            </Field>
                            <div style={{display:'flex',gap:10,marginTop:8}}>
                                <Btn variant="ghost" onClick={close} style={{flex:1}}>Close</Btn>
                                <Btn variant="danger" size="sm" onClick={reject} disabled={saving}>Reject</Btn>
                                <Btn variant="primary" onClick={assign} disabled={!assignId||saving} style={{flex:1}}>{saving?'Assigning…':'➤ Assign to Agent'}</Btn>
                            </div>
                        </div>
                    )}
                    {sel.status !== 'Pending' && <Btn variant="ghost" onClick={close} style={{width:'100%',marginTop:14}}>Close</Btn>}
                </Modal>
            )}
        </div>
    );
};

/* ═══════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════ */
const NAV = [
    {id:'overview',     icon:'▦',  label:'Overview'},
    {id:'users',        icon:'👥', label:'Users'},
    {id:'departments',  icon:'🏛️', label:'Departments'},
    {id:'complaints',   icon:'📋', label:'Complaints'},
];

const Sidebar = ({ page, setPage, open, setOpen }) => (
    <aside style={{position:'fixed',left:0,top:0,bottom:0,width:open?240:64,background:'#13161e',borderRight:'1px solid rgba(255,255,255,0.07)',display:'flex',flexDirection:'column',zIndex:100,transition:'width .3s ease',overflow:'hidden'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'22px 18px 18px',borderBottom:'1px solid rgba(255,255,255,0.07)',flexShrink:0}}>
            <div style={{width:34,height:34,borderRadius:9,background:'linear-gradient(135deg,#1D9E75,#185FA5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.9rem',flexShrink:0}}>⚡</div>
            {open&&<span style={{fontSize:'1rem',fontWeight:700,color:'#e8eaf0',whiteSpace:'nowrap'}}>AdminPanel</span>}
        </div>

        <button onClick={()=>setOpen(!open)} style={{position:'absolute',top:26,right:-11,width:22,height:22,background:'#1a1e28',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#8892a4',fontSize:'0.55rem',zIndex:10}}>
            {open?'◀':'▶'}
        </button>

        <nav style={{flex:1,padding:'14px 8px',display:'flex',flexDirection:'column',gap:3,overflowY:'auto',overflowX:'hidden'}}>
            {NAV.map(n=>(
                <button key={n.id} onClick={()=>setPage(n.id)} title={!open?n.label:undefined}
                        style={{display:'flex',alignItems:'center',gap:11,padding:'10px 11px',borderRadius:9,border:'none',background:page===n.id?'rgba(29,158,117,0.15)':'transparent',color:page===n.id?'#e8eaf0':'#8892a4',cursor:'pointer',fontFamily:'IBM Plex Sans,sans-serif',fontSize:'0.855rem',fontWeight:500,textAlign:'left',whiteSpace:'nowrap',transition:'all .2s',width:'100%',position:'relative'}}
                        onMouseEnter={e=>{if(page!==n.id)e.currentTarget.style.background='rgba(181,212,244,0.07)'}}
                        onMouseLeave={e=>{if(page!==n.id)e.currentTarget.style.background='transparent'}}>
                    <span style={{fontSize:'1rem',flexShrink:0}}>{n.icon}</span>
                    {open&&<span style={{flex:1,overflow:'hidden',textOverflow:'ellipsis'}}>{n.label}</span>}
                    {page===n.id&&<span style={{position:'absolute',right:0,top:'50%',transform:'translateY(-50%)',width:3,height:18,background:'#1D9E75',borderRadius:'2px 0 0 2px'}}/>}
                </button>
            ))}
        </nav>

        {open&&(
            <div style={{display:'flex',alignItems:'center',gap:10,padding:'14px 13px',borderTop:'1px solid rgba(255,255,255,0.07)',flexShrink:0}}>
                <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#185FA5,#1D9E75)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'0.8rem',color:'#fff',flexShrink:0}}>A</div>
                <div>
                    <p style={{fontSize:'0.82rem',fontWeight:600,color:'#e8eaf0'}}>Admin</p>
                    <p style={{fontSize:'0.7rem',color:'#4a5568'}}>Super Admin</p>
                </div>
            </div>
        )}
    </aside>
);

/* ═══════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════ */
export default function AdminDashboard() {
    const [page, setPage]   = useState('overview');
    const [open, setOpen]   = useState(true);
    const [stats, setStats] = useState(null);
    const [depts, setDepts] = useState([]);
    const [complaints, setComplaints] = useState([]);

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API}/admin/complaints/stats`);
            const data = await res.json();
            setStats(data);
        } catch { }
    };

    const fetchDepts = async () => {
        try {
            const res = await fetch(`${API}/departments`);
            const data = await res.json();
            setDepts(data);
        } catch { }
    };

    const fetchComplaints = async () => {
        try {
            const res = await fetch(`${API}/admin/complaints`);
            const data = await res.json();
            setComplaints(data);
        } catch { }
    };

    useEffect(() => {
        fetchStats();
        fetchDepts();
        fetchComplaints();
    }, []);

    const PAGES = {
        overview:    <Overview stats={stats} complaints={complaints} setPage={setPage} />,
        users:       <Users departments={depts} />,
        departments: <Departments depts={depts} fetchDepts={fetchDepts} />,
        complaints:  <Complaints depts={depts} />,
    };

    return (
        <div style={{display:'flex',minHeight:'100vh'}}>
            <Sidebar page={page} setPage={setPage} open={open} setOpen={setOpen} />
            <main style={{flex:1,marginLeft:open?240:64,transition:'margin-left .3s ease',padding:'30px 34px',minHeight:'100vh',background:'#0d0f14'}}>
                {PAGES[page]}
            </main>
        </div>
    );
}