import React, { useState, useEffect, useRef, useCallback } from 'react';
import './AdminDashboard.css';
/* ═══════════════════════════════════════════════
   COLOUR PALETTE & GLOBAL STYLES
═══════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════ */
const INIT_CITIZENS = [
    {id:'CIT-001',name:'Kamal Perera',nic:'199012345678',phone:'0711234567',email:'kamal@email.com',district:'Colombo',status:'Active',joined:'2024-01-15',complaints:3},
    {id:'CIT-002',name:'Nimal Silva',nic:'198556789012',phone:'0772345678',email:'nimal@email.com',district:'Kandy',status:'Active',joined:'2024-02-20',complaints:1},
    {id:'CIT-003',name:'Sunethra Fernando',nic:'200134567890',phone:'0763456789',email:'sun@email.com',district:'Galle',status:'Suspended',joined:'2024-03-10',complaints:7},
    {id:'CIT-004',name:'Priya Jayawardena',nic:'199745678901',phone:'0754567890',email:'priya@email.com',district:'Colombo',status:'Active',joined:'2024-03-22',complaints:2},
    {id:'CIT-005',name:'Roshan Bandara',nic:'198867890123',phone:'0715678901',email:'roshan@email.com',district:'Matara',status:'Active',joined:'2024-04-05',complaints:0},
    {id:'CIT-006',name:'Dilani Rathnayake',nic:'200256789012',phone:'0726789012',email:'dilani@email.com',district:'Kurunegala',status:'Active',joined:'2024-04-18',complaints:4},
];

const INIT_DEPTS = [
    {id:'DEPT-001',name:'Water Supply',icon:'💧',description:'National Water Supply & Drainage Board',hotline:'1954',email:'info@waterboard.lk',status:'Active',totalComplaints:142,resolvedComplaints:118,
        agents:[{id:'AGT-001',name:'Suresh Wickrama',username:'suresh.w',email:'suresh@nwsdb.lk',phone:'0711001001',role:'Senior Agent',status:'Active'},{id:'AGT-002',name:'Malini Perera',username:'malini.p',email:'malini@nwsdb.lk',phone:'0712002002',role:'Agent',status:'Active'}]},
    {id:'DEPT-002',name:'Electricity',icon:'⚡',description:'Ceylon Electricity Board',hotline:'1987',email:'ceb@ceb.lk',status:'Active',totalComplaints:98,resolvedComplaints:76,
        agents:[{id:'AGT-003',name:'Chamara Dias',username:'chamara.d',email:'chamara@ceb.lk',phone:'0713003003',role:'Senior Agent',status:'Active'}]},
    {id:'DEPT-003',name:'Police',icon:'👮',description:'Sri Lanka Police',hotline:'119',email:'info@police.lk',status:'Active',totalComplaints:203,resolvedComplaints:189,
        agents:[{id:'AGT-004',name:'Rohan Fernando',username:'rohan.f',email:'rohan@police.lk',phone:'0714004004',role:'Agent',status:'Active'},{id:'AGT-005',name:'Shani Kumari',username:'shani.k',email:'shani@police.lk',phone:'0715005005',role:'Agent',status:'Inactive'}]},
    {id:'DEPT-004',name:'Health',icon:'🏥',description:'Ministry of Health',hotline:'1926',email:'info@health.gov.lk',status:'Active',totalComplaints:67,resolvedComplaints:52,
        agents:[{id:'AGT-006',name:'Nethra Jayasuriya',username:'nethra.j',email:'nethra@health.lk',phone:'0716006006',role:'Senior Agent',status:'Active'}]},
    {id:'DEPT-005',name:'Roads',icon:'🛣️',description:'Road Development Authority',hotline:'1955',email:'info@rda.gov.lk',status:'Active',totalComplaints:55,resolvedComplaints:40,
        agents:[{id:'AGT-007',name:'Kasun Rajapaksha',username:'kasun.r',email:'kasun@rda.lk',phone:'0717007007',role:'Agent',status:'Active'}]},
];

const INIT_COMPLAINTS = [
    {id:'CMP-2024-0041',citizen:'Kamal Perera',citizenNic:'199012345678',dept:'Water Supply',issue:'Pipe burst near Kandy Road',description:'A major pipe has burst at the junction of Kandy Road and Baseline Road. Water flooding the street for 3 days.',location:'Kandy Road, Colombo 10',priority:'High',status:'Pending Review',date:'2024-05-10',assignedTo:null},
    {id:'CMP-2024-0042',citizen:'Nimal Silva',citizenNic:'198556789012',dept:'Electricity',issue:'Power outage for 8 hours',description:'Complete power failure in our area since 6AM. No response from CEB hotline.',location:'Peradeniya, Kandy',priority:'Critical',status:'Assigned',date:'2024-05-11',assignedTo:'Chamara Dias'},
    {id:'CMP-2024-0043',citizen:'Priya Jayawardena',citizenNic:'199745678901',dept:'Police',issue:'Vehicle theft',description:'My motorcycle was stolen from the parking area near Pettah market at approximately 2PM yesterday.',location:'Pettah, Colombo 11',priority:'High',status:'In Progress',date:'2024-05-11',assignedTo:'Rohan Fernando'},
    {id:'CMP-2024-0044',citizen:'Dilani Rathnayake',citizenNic:'200256789012',dept:'Health',issue:'Unsanitary food stall',description:'A food stall near the school is selling spoiled food. Several children have fallen ill.',location:'Kurunegala Town',priority:'Medium',status:'Resolved',date:'2024-05-09',assignedTo:'Nethra Jayasuriya'},
    {id:'CMP-2024-0045',citizen:'Roshan Bandara',citizenNic:'198867890123',dept:'Roads',issue:'Large pothole on highway',description:'Dangerous pothole on the Southern Expressway near exit 4. At least 3 vehicles have been damaged.',location:'Southern Highway, Exit 4',priority:'High',status:'Pending Review',date:'2024-05-12',assignedTo:null},
    {id:'CMP-2024-0046',citizen:'Kamal Perera',citizenNic:'199012345678',dept:'Water Supply',issue:'No water supply 3 days',description:'Complete water cut for 3 consecutive days with no notice or alternative provided.',location:'Ratmalana',priority:'Critical',status:'Pending Review',date:'2024-05-12',assignedTo:null},
];

const INIT_DISASTERS = [
    {id:'DIS-2024-0011',citizen:'Sunethra Fernando',phone:'0763456789',type:'Flood',severity:'Critical',location:'Kelani River, Kaduwela',description:'River water level rising rapidly. Several houses already flooded. About 50 families affected. Evacuation needed immediately.',isRedZone:true,date:'2024-05-12',status:'Pending Review',assignedTo:null},
    {id:'DIS-2024-0010',citizen:'Kamal Perera',phone:'0711234567',type:'Landslide',severity:'High',location:'Nuwara Eliya Road, Kandy',description:'Landslide blocking main road. Trees and mud covering approximately 100m of the road. No casualties but road is impassable.',isRedZone:false,date:'2024-05-11',status:'Assigned',assignedTo:'DMC Officer Pradeep'},
    {id:'DIS-2024-0009',citizen:'Nimal Silva',phone:'0772345678',type:'Wildfire',severity:'High',location:'Knuckles Range Forest',description:'Forest fire spreading rapidly. Wind conditions making it worse. Wildlife sanctuary at risk.',isRedZone:false,date:'2024-05-10',status:'Resolved',assignedTo:'Fire Brigade Unit 3'},
];

const INIT_RESPONSES = [
    {id:'RES-2024-0005',originalComplaint:'CMP-2024-0041',citizen:'Kamal Perera',dept:'Water Supply',agent:'Suresh Wickrama',issue:'Problem not fixed after 2 weeks',description:'It has been 2 weeks since I filed complaint CMP-2024-0041. The pipe burst is still not repaired. No agent has visited the site.',date:'2024-05-24',status:'Pending Review',priority:'High',assignedTo:null},
    {id:'RES-2024-0004',originalComplaint:'CMP-2024-0042',citizen:'Nimal Silva',dept:'Electricity',agent:'Chamara Dias',issue:'Agent was rude and unhelpful',description:'The assigned agent called me and was dismissive. Said the issue was resolved but power still goes at night. No actual work done.',date:'2024-05-20',status:'Assigned',priority:'Medium',assignedTo:'Chamara Dias'},
];

const DMC_TEAMS = ['DMC Officer Pradeep','DMC Officer Nirosha','Fire Brigade Unit 1','Fire Brigade Unit 3','Army Relief Team Alpha','Army Relief Team Bravo','Coast Guard Unit 2'];

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
        teal:   { bg:'rgba(29,158,117,0.18)',  color:'#2dd4bf' },
        purple: { bg:'rgba(139,92,246,0.18)',  color:'#c4b5fd' },
    };
    const s = styles[type] || styles.gray;
    return <span style={{display:'inline-block',padding:'3px 10px',borderRadius:50,fontSize:'0.68rem',fontWeight:700,letterSpacing:'0.05em',textTransform:'uppercase',background:s.bg,color:s.color}}>{label}</span>;
};

const priorityBadge = p => <Badge label={p} type={p==='Critical'?'red':p==='High'?'yellow':p==='Medium'?'blue':'gray'} />;
const statusBadge   = s => <Badge label={s} type={s==='Resolved'||s==='Active'?'green':s==='Pending Review'?'yellow':s==='In Progress'||s==='Assigned'?'blue':s==='Rejected'||s==='Suspended'?'red':'gray'} />;

const Btn = ({ children, variant='secondary', size='', onClick, disabled, style={} }) => {
    const v = {
        primary:   {background:'var(--teal)',color:'#fff',border:'none',boxShadow:'0 3px 12px rgba(29,158,117,0.28)'},
        secondary: {background:'rgba(181,212,244,0.08)',color:'var(--sky)',border:'1px solid var(--border2)'},
        danger:    {background:'rgba(231,76,60,0.12)',color:'#f87171',border:'1px solid rgba(231,76,60,0.25)'},
        warn:      {background:'rgba(230,168,23,0.12)',color:'#fbbf24',border:'1px solid rgba(230,168,23,0.25)'},
        ghost:     {background:'transparent',color:'var(--t2)',border:'1px solid var(--border)'},
    };
    return (
        <button onClick={onClick} disabled={disabled}
                style={{display:'inline-flex',alignItems:'center',gap:6,padding:size==='sm'?'6px 12px':'9px 18px',borderRadius:'var(--rs)',fontFamily:'var(--fb)',fontSize:size==='sm'?'0.78rem':'0.85rem',fontWeight:600,cursor:disabled?'not-allowed':'pointer',opacity:disabled?.45:1,transition:'all .2s',letterSpacing:'0.01em',whiteSpace:'nowrap',...v[variant],...style}}>
            {children}
        </button>
    );
};

const Modal = ({ onClose, children, wide }) => (
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(4,44,83,0.72)',backdropFilter:'blur(8px)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20,animation:'fadeIn .18s ease'}}>
        <div onClick={e=>e.stopPropagation()} style={{background:'var(--bg2)',border:'1px solid var(--border2)',borderRadius:'var(--rl)',width:'100%',maxWidth:wide?720:540,maxHeight:'88vh',overflowY:'auto',padding:32,position:'relative',animation:'slideUp .25s ease',scrollbarWidth:'thin'}}>
            <button onClick={onClose} style={{position:'absolute',top:16,right:16,background:'rgba(181,212,244,0.08)',border:'1px solid var(--border)',color:'var(--t2)',width:32,height:32,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:'0.9rem',transition:'all .2s'}}>✕</button>
            {children}
        </div>
    </div>
);

const Field = ({ label, children }) => (
    <div style={{marginBottom:14}}>
        <label style={{display:'block',fontSize:'0.72rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.07em',color:'var(--t2)',marginBottom:6}}>{label}</label>
        {children}
    </div>
);

const Row2 = ({ children }) => <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>{children}</div>;

const DetailRow = ({ k, v }) => (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0',borderBottom:'1px solid var(--border)',fontSize:'0.875rem'}}>
        <span style={{color:'var(--t2)'}}>{k}</span>
        <strong style={{color:'var(--t1)',textAlign:'right',maxWidth:'60%'}}>{v}</strong>
    </div>
);

const DescBox = ({ text }) => (
    <div style={{background:'rgba(181,212,244,0.05)',border:'1px solid var(--border)',borderRadius:'var(--rs)',padding:14,fontSize:'0.875rem',color:'var(--t1)',lineHeight:1.75}}>{text}</div>
);

const ConfirmDelete = ({ title, body, onCancel, onConfirm }) => (
    <div style={{textAlign:'center',padding:'8px 0'}}>
        <div style={{fontSize:'2.8rem',marginBottom:12}}>⚠️</div>
        <h2 style={{fontFamily:'var(--ff)',marginBottom:8}}>{title}</h2>
        <p style={{color:'var(--t2)',marginBottom:24,fontSize:'0.9rem'}}>{body}</p>
        <div style={{display:'flex',gap:10}}>
            <Btn variant="ghost" onClick={onCancel} style={{flex:1}}>Cancel</Btn>
            <Btn variant="danger" onClick={onConfirm} style={{flex:1}}>Confirm Delete</Btn>
        </div>
    </div>
);

const EmptyState = ({ icon, text }) => (
    <div style={{textAlign:'center',padding:'52px 20px',color:'var(--t3)'}}>
        <div style={{fontSize:'2.2rem',marginBottom:10}}>{icon}</div>
        <p style={{fontSize:'0.88rem'}}>{text}</p>
    </div>
);

const FilterTabs = ({ tabs, active, setActive, counts, accent='var(--ocean)' }) => (
    <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
        {tabs.map(t => (
            <button key={t} onClick={() => setActive(t)}
                    style={{padding:'6px 15px',borderRadius:50,border:'none',background:active===t?accent:'rgba(181,212,244,0.07)',color:active===t?'#fff':'var(--t2)',cursor:'pointer',fontSize:'0.8rem',fontWeight:600,fontFamily:'var(--fb)',transition:'all .2s',display:'flex',alignItems:'center',gap:5}}>
                {t}
                <span style={{background:active===t?'rgba(255,255,255,0.22)':'rgba(181,212,244,0.14)',borderRadius:50,padding:'1px 7px',fontSize:'0.7rem'}}>{counts[t]??0}</span>
            </button>
        ))}
    </div>
);

const Table = ({ cols, rows, empty }) => (
    <div style={{overflowX:'auto',borderRadius:'var(--r)',border:'1px solid var(--border)'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.855rem'}}>
            <thead>
            <tr>{cols.map(c=><th key={c} style={{textAlign:'left',padding:'12px 15px',fontFamily:'var(--ff)',fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--t3)',background:'var(--bg3)',borderBottom:'1px solid var(--border)',whiteSpace:'nowrap'}}>{c}</th>)}</tr>
            </thead>
            <tbody>
            {rows.length===0
                ? <tr><td colSpan={cols.length} style={{textAlign:'center',padding:40,color:'var(--t3)'}}>{empty||'No data'}</td></tr>
                : rows}
            </tbody>
        </table>
    </div>
);

const TD = ({ children, mono, nowrap }) => (
    <td style={{padding:'12px 15px',borderBottom:'1px solid var(--border)',color:'var(--t2)',verticalAlign:'middle',fontFamily:mono?'monospace':undefined,fontSize:mono?'0.75rem':undefined,undefined,whiteSpace:nowrap?'nowrap':undefined}}>{children}</td>
);

/* ═══════════════════════════════════════════════
   PAGE HEADER
═══════════════════════════════════════════════ */
const PageHeader = ({ title, sub }) => (
    <div style={{marginBottom:28}}>
        <h1 style={{fontFamily:'var(--ff)',fontSize:'1.75rem',fontWeight:700,letterSpacing:'-0.02em',color:'var(--t1)'}}>{title}</h1>
        {sub && <p style={{color:'var(--t2)',fontSize:'0.875rem',marginTop:3}}>{sub}</p>}
    </div>
);

/* ═══════════════════════════════════════════════
   OVERVIEW PAGE
═══════════════════════════════════════════════ */
const Overview = ({ citizens, depts, complaints, disasters, responses, setPage }) => {
    const pending    = complaints.filter(c=>c.status==='Pending Review').length;
    const disPending = disasters.filter(d=>d.status==='Pending Review').length;
    const resPending = responses.filter(r=>r.status==='Pending Review').length;

    const stats = [
        {icon:'👤',val:citizens.length,  label:'Total Citizens',   color:'#60a5fa'},
        {icon:'🏛️',val:depts.length,     label:'Departments',      color:'#2dd4bf'},
        {icon:'📋',val:complaints.length,label:'Total Complaints', color:'#fbbf24'},
        {icon:'🔴',val:pending,          label:'Pending Review',   color:'#f87171'},
        {icon:'🌊',val:disasters.length, label:'Disaster Reports', color:'#c4b5fd'},
        {icon:'🔁',val:resPending,       label:'Response Reports', color:'#fb923c'},
    ];

    const urgent = [
        ...complaints.filter(c=>c.status==='Pending Review').map(c=>({...c,_type:'complaint'})),
        ...disasters.filter(d=>d.status==='Pending Review').map(d=>({...d,_type:'disaster'})),
        ...responses.filter(r=>r.status==='Pending Review').map(r=>({...r,_type:'response'})),
    ];

    const card = (bg, children) => (
        <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r)',padding:'20px 22px',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,var(--teal),transparent)',opacity:.5}}/>
            {children}
        </div>
    );

    return (
        <div style={{animation:'fadeUp .45s ease'}}>
            <PageHeader title="Dashboard Overview" sub="Welcome back, Admin — here's what needs your attention today" />

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:14,marginBottom:28}}>
                {stats.map((s,i)=>(
                    <div key={i} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r)',padding:'18px 20px',display:'flex',alignItems:'center',gap:14,transition:'transform .2s,border-color .2s',cursor:'default'}}
                         onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.borderColor=s.color+'55'}}
                         onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.borderColor='var(--border)'}}>
                        <div style={{width:44,height:44,borderRadius:11,background:s.color+'22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',flexShrink:0}}>{s.icon}</div>
                        <div>
                            <div style={{fontFamily:'var(--ff)',fontSize:'1.8rem',fontWeight:700,color:s.color,lineHeight:1}}>{s.val}</div>
                            <div style={{fontSize:'0.72rem',color:'var(--t3)',textTransform:'uppercase',letterSpacing:'0.06em',marginTop:3}}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:22}}>
                {card(null,
                    <>
                        <h3 style={{fontFamily:'var(--ff)',fontSize:'0.95rem',marginBottom:16,color:'var(--t1)'}}>🔴 Needs Your Review ({urgent.length})</h3>
                        {urgent.length===0
                            ? <EmptyState icon="🎉" text="All caught up!" />
                            : <div style={{display:'flex',flexDirection:'column',gap:8}}>
                                {urgent.slice(0,5).map(item=>(
                                    <div key={item.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 13px',background:'rgba(181,212,244,0.04)',border:'1px solid var(--border)',borderRadius:'var(--rs)',gap:10}}>
                                        <div>
                                            <p style={{fontSize:'0.82rem',color:'var(--t1)',fontWeight:500}}>{item.issue}</p>
                                            <p style={{fontSize:'0.7rem',color:'var(--t3)',marginTop:2}}>{item.id} · {item.citizen}</p>
                                        </div>
                                        {priorityBadge(item.priority||'High')}
                                    </div>
                                ))}
                            </div>
                        }
                    </>
                )}
                {card(null,
                    <>
                        <h3 style={{fontFamily:'var(--ff)',fontSize:'0.95rem',marginBottom:16,color:'var(--t1)'}}>⚡ Quick Actions</h3>
                        <div style={{display:'flex',flexDirection:'column',gap:8}}>
                            {[
                                {label:'Review Pending Complaints',count:pending,   page:'complaints',color:'#fbbf24'},
                                {label:'Review Disaster Reports',  count:disPending,page:'disasters', color:'#c4b5fd'},
                                {label:'Review Response Reports',  count:resPending,page:'responses', color:'#fb923c'},
                                {label:'Manage Citizens',          count:citizens.length,page:'citizens',  color:'#60a5fa'},
                                {label:'Manage Departments',       count:depts.length,   page:'departments',color:'#2dd4bf'},
                            ].map((q,i)=>(
                                <button key={i} onClick={()=>setPage(q.page)}
                                        style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 13px',background:'rgba(181,212,244,0.04)',border:'1px solid var(--border)',borderRadius:'var(--rs)',cursor:'pointer',color:'var(--t1)',fontFamily:'var(--fb)',fontSize:'0.855rem',fontWeight:500,textAlign:'left',transition:'all .2s'}}
                                        onMouseEnter={e=>e.currentTarget.style.borderColor=q.color}
                                        onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                                    <span>{q.label}</span>
                                    <span style={{background:q.color+'22',color:q.color,borderRadius:50,padding:'2px 10px',fontSize:'0.72rem',fontWeight:700}}>{q.count}</span>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════
   CITIZENS PAGE
═══════════════════════════════════════════════ */
const EMPTY_CIT = {name:'',nic:'',phone:'',email:'',district:'',status:'Active'};
const DISTRICTS = ['Colombo','Kandy','Galle','Matara','Kurunegala','Jaffna','Batticaloa','Anuradhapura','Ratnapura','Badulla'];

const Citizens = ({ citizens, setCitizens }) => {
    const [search, setSearch] = useState('');
    const [modal, setModal]   = useState(null);
    const [sel, setSel]       = useState(null);
    const [form, setForm]     = useState(EMPTY_CIT);
    const set = e => setForm(f=>({...f,[e.target.name]:e.target.value}));
    const close = () => { setModal(null); setSel(null); };

    const filtered = citizens.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.nic.includes(search) || c.phone.includes(search)
    );

    const save = () => {
        if (modal==='add') setCitizens([{...form,id:`CIT-${String(citizens.length+1).padStart(3,'0')}`,joined:new Date().toISOString().split('T')[0],complaints:0},...citizens]);
        else setCitizens(citizens.map(c=>c.id===sel.id?{...c,...form}:c));
        close();
    };

    return (
        <div style={{animation:'fadeUp .45s ease'}}>
            <PageHeader title="Citizens" sub="Manage registered citizen accounts" />

            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap',marginBottom:18}}>
                <input style={{width:260}} placeholder="Search name, NIC or phone…" value={search} onChange={e=>setSearch(e.target.value)} />
                <Btn variant="primary" onClick={()=>{setForm(EMPTY_CIT);setModal('add')}}>＋ Add Citizen</Btn>
            </div>

            <Table cols={['ID','Name','NIC','Phone','District','Complaints','Status','Actions']}
                   rows={filtered.map(c=>(
                       <tr key={c.id} onMouseEnter={e=>e.currentTarget.querySelectorAll('td').forEach(td=>td.style.background='rgba(181,212,244,0.03)')}
                           onMouseLeave={e=>e.currentTarget.querySelectorAll('td').forEach(td=>td.style.background='')}>
                           <TD mono>{c.id}</TD>
                           <TD><strong style={{color:'var(--t1)',fontWeight:500}}>{c.name}</strong></TD>
                           <TD>{c.nic}</TD><TD>{c.phone}</TD><TD>{c.district}</TD>
                           <TD><span style={{color:c.complaints>5?'#f87171':'var(--t2)'}}>{c.complaints}</span></TD>
                           <TD>{statusBadge(c.status)}</TD>
                           <TD nowrap>
                               <div style={{display:'flex',gap:5}}>
                                   <Btn size="sm" variant="secondary" onClick={()=>{setSel(c);setModal('view')}}>View</Btn>
                                   <Btn size="sm" variant="secondary" onClick={()=>{setSel(c);setForm({...c});setModal('edit')}}>Edit</Btn>
                                   <Btn size="sm" variant="danger"    onClick={()=>{setSel(c);setModal('delete')}}>Delete</Btn>
                               </div>
                           </TD>
                       </tr>
                   ))}
                   empty="No citizens found"
            />

            {(modal==='add'||modal==='edit') && (
                <Modal onClose={close}>
                    <h2 style={{fontFamily:'var(--ff)',marginBottom:4}}>{modal==='add'?'＋ Add Citizen':'✏️ Edit Citizen'}</h2>
                    <p style={{color:'var(--t2)',fontSize:'0.85rem',marginBottom:22}}>{modal==='add'?'Register a new citizen':'Editing '+sel?.name}</p>
                    <Row2><Field label="Full Name *"><input name="name" value={form.name} onChange={set} placeholder="e.g. Kamal Perera"/></Field>
                        <Field label="NIC Number *"><input name="nic" value={form.nic} onChange={set} placeholder="199012345678"/></Field></Row2>
                    <Row2><Field label="Phone *"><input name="phone" value={form.phone} onChange={set} placeholder="07XXXXXXXX"/></Field>
                        <Field label="Email"><input name="email" value={form.email} onChange={set} placeholder="email@example.com"/></Field></Row2>
                    <Row2>
                        <Field label="District"><select name="district" value={form.district} onChange={set}><option value="">Select…</option>{DISTRICTS.map(d=><option key={d}>{d}</option>)}</select></Field>
                        <Field label="Status"><select name="status" value={form.status} onChange={set}><option>Active</option><option>Suspended</option></select></Field>
                    </Row2>
                    <div style={{display:'flex',gap:10,marginTop:8}}>
                        <Btn variant="ghost" onClick={close} style={{flex:1}}>Cancel</Btn>
                        <Btn variant="primary" onClick={save} disabled={!form.name||!form.nic||!form.phone} style={{flex:1}}>{modal==='add'?'Create Account':'Save Changes'}</Btn>
                    </div>
                </Modal>
            )}

            {modal==='view' && sel && (
                <Modal onClose={close}>
                    <h2 style={{fontFamily:'var(--ff)',marginBottom:4}}>👤 Citizen Profile</h2>
                    <p style={{color:'var(--t2)',fontSize:'0.82rem',marginBottom:18}}>{sel.id}</p>
                    <div style={{background:'var(--bg3)',borderRadius:'var(--rs)',padding:14,marginBottom:18}}>
                        {[['Full Name',sel.name],['NIC',sel.nic],['Phone',sel.phone],['Email',sel.email],['District',sel.district],['Status',sel.status],['Joined',sel.joined],['Complaints',sel.complaints]].map(([k,v])=><DetailRow key={k} k={k} v={v}/>)}
                    </div>
                    <div style={{display:'flex',gap:10}}>
                        <Btn variant="ghost" onClick={close} style={{flex:1}}>Close</Btn>
                        <Btn variant="primary" onClick={()=>{close();setTimeout(()=>{setSel(sel);setForm({...sel});setModal('edit')},50)}} style={{flex:1}}>Edit</Btn>
                    </div>
                </Modal>
            )}

            {modal==='delete' && sel && (
                <Modal onClose={close}>
                    <ConfirmDelete title="Delete Citizen?" body={<>Permanently delete <strong style={{color:'var(--t1)'}}>{sel.name}</strong>'s account? This cannot be undone.</>}
                                   onCancel={close} onConfirm={()=>{setCitizens(citizens.filter(c=>c.id!==sel.id));close()}}/>
                </Modal>
            )}
        </div>
    );
};

/* ═══════════════════════════════════════════════
   DEPARTMENTS PAGE
═══════════════════════════════════════════════ */
const EMPTY_DEPT  = {name:'',icon:'🏛️',description:'',hotline:'',email:'',status:'Active'};
const EMPTY_AGENT = {name:'',username:'',email:'',phone:'',role:'Agent',status:'Active',password:''};

const Departments = ({ depts, setDepts }) => {
    const [modal, setModal]    = useState(null);
    const [sel, setSel]        = useState(null);
    const [form, setForm]      = useState(EMPTY_DEPT);
    const [aModal, setAModal]  = useState(null);
    const [aSel, setASel]      = useState(null);
    const [aForm, setAForm]    = useState(EMPTY_AGENT);
    const [showPass, setShowPass] = useState(false);
    const set  = e => setForm(f=>({...f,[e.target.name]:e.target.value}));
    const setA = e => setAForm(f=>({...f,[e.target.name]:e.target.value}));
    const close  = () => { setModal(null); setSel(null); };
    const closeA = () => { setAModal(null); setASel(null); };

    const saveDept = () => {
        if (modal==='add') setDepts([...depts,{...form,id:`DEPT-${String(depts.length+1).padStart(3,'0')}`,agents:[],totalComplaints:0,resolvedComplaints:0}]);
        else { setDepts(depts.map(d=>d.id===sel.id?{...d,...form}:d)); setSel(p=>({...p,...form})); }
        if (modal!=='edit') close(); else setModal(null);
    };

    const saveAgent = () => {
        const updated = {...sel};
        if (aModal==='add') updated.agents=[...(updated.agents||[]),{...aForm,id:`AGT-${Math.floor(Math.random()*9000+1000)}`}];
        else updated.agents=updated.agents.map(a=>a.id===aSel.id?{...a,...aForm}:a);
        setDepts(depts.map(d=>d.id===sel.id?updated:d));
        setSel(updated);
        closeA();
    };

    const delAgent = () => {
        const updated = {...sel,agents:sel.agents.filter(a=>a.id!==aSel.id)};
        setDepts(depts.map(d=>d.id===sel.id?updated:d));
        setSel(updated);
        closeA();
    };

    return (
        <div style={{animation:'fadeUp .45s ease'}}>
            <PageHeader title="Departments" sub="Manage departments and their assigned agents" />
            <div style={{display:'flex',justifyContent:'flex-end',marginBottom:18}}>
                <Btn variant="primary" onClick={()=>{setForm(EMPTY_DEPT);setModal('add')}}>＋ Add Department</Btn>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:16}}>
                {depts.map(d=>(
                    <div key={d.id} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r)',padding:22,position:'relative',overflow:'hidden',transition:'border-color .2s,transform .2s'}}
                         onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--border2)';e.currentTarget.style.transform='translateY(-2px)'}}
                         onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform=''}}>
                        <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,var(--teal),transparent)',opacity:.4}}/>

                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                            <div style={{display:'flex',alignItems:'center',gap:10}}>
                                <span style={{fontSize:'1.7rem'}}>{d.icon}</span>
                                <div>
                                    <h3 style={{fontFamily:'var(--ff)',fontSize:'0.95rem',color:'var(--t1)'}}>{d.name}</h3>
                                    <p style={{fontSize:'0.7rem',color:'var(--t3)'}}>{d.id}</p>
                                </div>
                            </div>
                            {statusBadge(d.status)}
                        </div>

                        <p style={{fontSize:'0.8rem',color:'var(--t2)',marginBottom:14,lineHeight:1.5}}>{d.description}</p>

                        <div style={{display:'flex',gap:18,marginBottom:14}}>
                            {[['Total',d.totalComplaints,'var(--sky)'],['Resolved',d.resolvedComplaints,'var(--teal)'],['Agents',d.agents?.length||0,'#fbbf24']].map(([l,v,c])=>(
                                <div key={l} style={{textAlign:'center'}}>
                                    <div style={{fontFamily:'var(--ff)',fontSize:'1.25rem',fontWeight:700,color:c}}>{v}</div>
                                    <div style={{fontSize:'0.65rem',color:'var(--t3)',textTransform:'uppercase',letterSpacing:'0.05em'}}>{l}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{display:'flex',gap:7}}>
                            <Btn size="sm" variant="primary" onClick={()=>{setSel(d);setModal('view')}} style={{flex:1}}>Manage Agents</Btn>
                            <Btn size="sm" variant="secondary" onClick={()=>{setSel(d);setForm({name:d.name,icon:d.icon,description:d.description,hotline:d.hotline,email:d.email,status:d.status});setModal('edit')}}>Edit</Btn>
                            <Btn size="sm" variant="danger" onClick={()=>{setSel(d);setModal('delete')}}>Del</Btn>
                        </div>
                    </div>
                ))}
            </div>

            {(modal==='add'||modal==='edit') && (
                <Modal onClose={close}>
                    <h2 style={{fontFamily:'var(--ff)',marginBottom:4}}>{modal==='add'?'＋ Add Department':'✏️ Edit Department'}</h2>
                    <p style={{color:'var(--t2)',fontSize:'0.85rem',marginBottom:22}}>Department details</p>
                    <Row2><Field label="Name *"><input name="name" value={form.name} onChange={set} placeholder="e.g. Water Supply"/></Field>
                        <Field label="Icon (emoji)"><input name="icon" value={form.icon} onChange={set} placeholder="💧"/></Field></Row2>
                    <Field label="Description"><textarea name="description" value={form.description} onChange={set} rows={2} placeholder="Brief description"/></Field>
                    <Row2><Field label="Hotline"><input name="hotline" value={form.hotline} onChange={set} placeholder="1954"/></Field>
                        <Field label="Email"><input name="email" value={form.email} onChange={set} placeholder="dept@gov.lk"/></Field></Row2>
                    <Field label="Status"><select name="status" value={form.status} onChange={set}><option>Active</option><option>Inactive</option></select></Field>
                    <div style={{display:'flex',gap:10,marginTop:8}}>
                        <Btn variant="ghost" onClick={close} style={{flex:1}}>Cancel</Btn>
                        <Btn variant="primary" onClick={saveDept} disabled={!form.name} style={{flex:1}}>{modal==='add'?'Create':'Save Changes'}</Btn>
                    </div>
                </Modal>
            )}

            {modal==='view' && sel && (
                <Modal onClose={close} wide>
                    <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
                        <span style={{fontSize:'2rem'}}>{sel.icon}</span>
                        <div>
                            <h2 style={{fontFamily:'var(--ff)'}}>{sel.name}</h2>
                            <p style={{color:'var(--t2)',fontSize:'0.82rem'}}>{sel.description}</p>
                        </div>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                        <h3 style={{fontFamily:'var(--ff)',fontSize:'0.9rem',color:'var(--t1)'}}>Agents ({sel.agents?.length||0})</h3>
                        <Btn size="sm" variant="primary" onClick={()=>{setAForm(EMPTY_AGENT);setAModal('add')}}>＋ Add Agent</Btn>
                    </div>
                    {sel.agents?.length===0
                        ? <EmptyState icon="👤" text="No agents assigned yet"/>
                        : <Table cols={['Name','Username','Email','Phone','Role','Status','Actions']}
                                 rows={sel.agents.map(a=>(
                                     <tr key={a.id}>
                                         <TD><strong style={{color:'var(--t1)',fontWeight:500}}>{a.name}</strong></TD>
                                         <TD mono>{a.username}</TD>
                                         <TD>{a.email}</TD><TD>{a.phone}</TD><TD>{a.role}</TD>
                                         <TD>{statusBadge(a.status)}</TD>
                                         <TD nowrap>
                                             <div style={{display:'flex',gap:5}}>
                                                 <Btn size="sm" variant="secondary" onClick={()=>{setASel(a);setAForm({...a,password:''});setAModal('edit')}}>Edit</Btn>
                                                 <Btn size="sm" variant="danger" onClick={()=>{setASel(a);setAModal('delete')}}>Remove</Btn>
                                             </div>
                                         </TD>
                                     </tr>
                                 ))}/>
                    }
                </Modal>
            )}

            {(aModal==='add'||aModal==='edit') && (
                <Modal onClose={closeA}>
                    <h2 style={{fontFamily:'var(--ff)',marginBottom:4}}>{aModal==='add'?'＋ Add Agent':'✏️ Edit Agent'}</h2>
                    <p style={{color:'var(--t2)',fontSize:'0.85rem',marginBottom:22}}>Agent for {sel?.name}</p>
                    <Row2><Field label="Full Name *"><input name="name" value={aForm.name} onChange={setA} placeholder="Agent full name"/></Field>
                        <Field label="Username *"><input name="username" value={aForm.username} onChange={setA} placeholder="john.doe"/></Field></Row2>
                    <Row2><Field label="Email *"><input name="email" value={aForm.email} onChange={setA} placeholder="agent@dept.lk"/></Field>
                        <Field label="Phone *"><input name="phone" value={aForm.phone} onChange={setA} placeholder="07XXXXXXXX"/></Field></Row2>
                    <Field label={aModal==='edit'?'New Password (blank = keep)':'Password *'}>
                        <div style={{position:'relative'}}>
                            <input name="password" type={showPass?'text':'password'} value={aForm.password} onChange={setA} placeholder="Min 8 characters" style={{paddingRight:44}}/>
                            <button type="button" onClick={()=>setShowPass(!showPass)} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'var(--t2)',cursor:'pointer',fontSize:'0.85rem'}}>{showPass?'🙈':'👁️'}</button>
                        </div>
                    </Field>
                    <Row2>
                        <Field label="Role"><select name="role" value={aForm.role} onChange={setA}><option>Agent</option><option>Senior Agent</option><option>Supervisor</option></select></Field>
                        <Field label="Status"><select name="status" value={aForm.status} onChange={setA}><option>Active</option><option>Inactive</option></select></Field>
                    </Row2>
                    <div style={{display:'flex',gap:10,marginTop:8}}>
                        <Btn variant="ghost" onClick={closeA} style={{flex:1}}>Cancel</Btn>
                        <Btn variant="primary" onClick={saveAgent} disabled={!aForm.name||!aForm.username||!aForm.email||(aModal==='add'&&!aForm.password)} style={{flex:1}}>{aModal==='add'?'Create Agent':'Save'}</Btn>
                    </div>
                </Modal>
            )}

            {aModal==='delete' && aSel && (
                <Modal onClose={closeA}>
                    <ConfirmDelete title="Remove Agent?" body={<>Remove <strong style={{color:'var(--t1)'}}>{aSel.name}</strong> from {sel?.name}?</>} onCancel={closeA} onConfirm={delAgent}/>
                </Modal>
            )}

            {modal==='delete' && sel && (
                <Modal onClose={close}>
                    <ConfirmDelete title="Delete Department?" body={<>Delete <strong style={{color:'var(--t1)'}}>{sel.name}</strong> and all {sel.agents?.length} agents?</>} onCancel={close} onConfirm={()=>{setDepts(depts.filter(d=>d.id!==sel.id));close()}}/>
                </Modal>
            )}
        </div>
    );
};

/* ═══════════════════════════════════════════════
   COMPLAINTS PAGE
═══════════════════════════════════════════════ */
const Complaints = ({ complaints, setComplaints, depts }) => {
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [sel, setSel]       = useState(null);
    const [assignTo, setAssignTo] = useState('');
    const [note, setNote]     = useState('');

    const tabs    = ['All','Pending Review','Assigned','In Progress','Resolved','Rejected'];
    const counts  = Object.fromEntries(tabs.map(t=>[t,t==='All'?complaints.length:complaints.filter(c=>c.status===t).length]));
    const agents  = depts.find(d=>d.name===sel?.dept)?.agents||[];

    const filtered = complaints.filter(c=>{
        const ms = filter==='All'||c.status===filter;
        const mq = c.id.toLowerCase().includes(search.toLowerCase())||c.citizen.toLowerCase().includes(search.toLowerCase())||c.issue.toLowerCase().includes(search.toLowerCase());
        return ms&&mq;
    });

    const update = (id, patch) => setComplaints(complaints.map(c=>c.id===id?{...c,...patch}:c));
    const close  = () => { setSel(null); setAssignTo(''); setNote(''); };

    return (
        <div style={{animation:'fadeUp .45s ease'}}>
            <PageHeader title="Complaint Management" sub="Review citizen complaints and assign to department agents" />
            <FilterTabs tabs={tabs} active={filter} setActive={setFilter} counts={counts} />
            <div style={{display:'flex',gap:10,marginBottom:18}}>
                <input style={{flex:1,maxWidth:320}} placeholder="Search ID, citizen or issue…" value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <Table cols={['ID','Citizen','Dept','Issue','Location','Priority','Status','Date','Action']}
                   rows={filtered.map(c=>(
                       <tr key={c.id}>
                           <TD mono>{c.id}</TD>
                           <TD><strong style={{color:'var(--t1)',fontWeight:500}}>{c.citizen}</strong></TD>
                           <TD>{c.dept}</TD>
                           <TD><span style={{display:'block',maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.issue}</span></TD>
                           <TD><span style={{fontSize:'0.8rem'}}>{c.location}</span></TD>
                           <TD>{priorityBadge(c.priority)}</TD>
                           <TD>{statusBadge(c.status)}</TD>
                           <TD nowrap><span style={{fontSize:'0.78rem'}}>{c.date}</span></TD>
                           <TD><Btn size="sm" variant="primary" onClick={()=>{setSel(c);setAssignTo(c.assignedTo||'');setNote('');}}>Review</Btn></TD>
                       </tr>
                   ))}
                   empty="No complaints found"
            />

            {sel && (
                <Modal onClose={close} wide>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:4}}>
                        <h2 style={{fontFamily:'var(--ff)'}}>📋 Complaint Review</h2>
                        {statusBadge(sel.status)}
                    </div>
                    <p style={{color:'var(--t2)',fontSize:'0.82rem',marginBottom:18}}>{sel.id} · Filed {sel.date}</p>

                    <div style={{background:'var(--bg3)',borderRadius:'var(--rs)',padding:14,marginBottom:16}}>
                        {[['Citizen',sel.citizen],['NIC',sel.citizenNic],['Department',sel.dept],['Issue',sel.issue],['Location',sel.location],['Priority',sel.priority],sel.assignedTo&&['Assigned To',sel.assignedTo]].filter(Boolean).map(([k,v])=><DetailRow key={k} k={k} v={v}/>)}
                    </div>

                    <p style={{fontSize:'0.72rem',color:'var(--t3)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:8}}>Description</p>
                    <DescBox text={sel.description}/>

                    {sel.status!=='Resolved'&&sel.status!=='Rejected' && (
                        <div style={{borderTop:'1px solid var(--border)',paddingTop:18,marginTop:18}}>
                            <p style={{fontSize:'0.85rem',fontWeight:600,color:'var(--t1)',marginBottom:14}}>🎯 Assign to Agent</p>
                            <Field label={`Select agent from ${sel.dept}`}>
                                <select value={assignTo} onChange={e=>setAssignTo(e.target.value)}>
                                    <option value="">— Select agent —</option>
                                    {agents.map(a=><option key={a.id} value={a.name}>{a.name} ({a.role}){a.status==='Inactive'?' — Inactive':''}</option>)}
                                </select>
                            </Field>
                            <Field label="Admin note (optional)">
                                <textarea value={note} onChange={e=>setNote(e.target.value)} rows={3} placeholder="Note for the agent…"/>
                            </Field>
                            <div style={{display:'flex',gap:10,marginTop:8}}>
                                <Btn variant="ghost" onClick={close} style={{flex:1}}>Close</Btn>
                                <Btn variant="danger" size="sm" onClick={()=>{update(sel.id,{status:'Rejected'});close();}}>Reject</Btn>
                                {(sel.status==='Assigned'||sel.status==='In Progress')&&<Btn variant="primary" size="sm" onClick={()=>{update(sel.id,{status:'Resolved'});close();}}>✅ Resolve</Btn>}
                                <Btn variant="primary" onClick={()=>{update(sel.id,{status:'Assigned',assignedTo:assignTo,adminNote:note});close();}} disabled={!assignTo} style={{flex:1}}>➤ Assign</Btn>
                            </div>
                        </div>
                    )}
                    {(sel.status==='Resolved'||sel.status==='Rejected')&&<Btn variant="ghost" onClick={close} style={{width:'100%',marginTop:14}}>Close</Btn>}
                </Modal>
            )}
        </div>
    );
};

/* ═══════════════════════════════════════════════
   DISASTER REPORTS PAGE
═══════════════════════════════════════════════ */
const DIS_ICONS = {Flood:'🌊',Landslide:'⛰️',Wildfire:'🔥',Drought:'☀️',Cyclone:'🌀',Earthquake:'🏚️',Tsunami:'🌋',Other:'⚠️'};

const Disasters = ({ disasters, setDisasters }) => {
    const [filter, setFilter] = useState('All');
    const [sel, setSel]       = useState(null);
    const [assignTo, setAssignTo] = useState('');
    const [custom, setCustom] = useState('');
    const [note, setNote]     = useState('');

    const tabs   = ['All','Pending Review','Assigned','Resolved'];
    const counts = Object.fromEntries(tabs.map(t=>[t,t==='All'?disasters.length:disasters.filter(d=>d.status===t).length]));
    const list   = filter==='All'?disasters:disasters.filter(d=>d.status===filter);

    const update = (id, patch) => setDisasters(disasters.map(d=>d.id===id?{...d,...patch}:d));
    const close  = () => { setSel(null); setAssignTo(''); setCustom(''); setNote(''); };
    const dispatch = () => { update(sel.id,{status:'Assigned',assignedTo:assignTo==='__custom__'?custom:assignTo}); close(); };

    return (
        <div style={{animation:'fadeUp .45s ease'}}>
            <PageHeader title="Disaster Reports" sub="Review citizen disaster reports and dispatch emergency response teams" />
            <FilterTabs tabs={tabs} active={filter} setActive={setFilter} counts={counts} accent="#8b5cf6" />

            <div style={{display:'flex',flexDirection:'column',gap:12}}>
                {list.length===0
                    ? <EmptyState icon="🌊" text="No disaster reports in this category"/>
                    : list.map(r=>(
                        <div key={r.id} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r)',padding:20,display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,flexWrap:'wrap',transition:'border-color .2s'}}
                             onMouseEnter={e=>e.currentTarget.style.borderColor='var(--border2)'}
                             onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                            <div style={{display:'flex',alignItems:'center',gap:14,flex:1,minWidth:0}}>
                                <div style={{width:50,height:50,borderRadius:11,background:r.isRedZone?'rgba(231,76,60,0.2)':'rgba(139,92,246,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',flexShrink:0}}>
                                    {DIS_ICONS[r.type]||'⚠️'}
                                </div>
                                <div style={{minWidth:0}}>
                                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4,flexWrap:'wrap'}}>
                                        <span style={{fontFamily:'var(--ff)',fontSize:'0.95rem',color:'var(--t1)'}}>{r.type}</span>
                                        <Badge label={r.severity} type={r.severity==='Critical'?'red':r.severity==='High'?'yellow':'blue'}/>
                                        {r.isRedZone&&<Badge label="🔴 Red Zone" type="red"/>}
                                    </div>
                                    <p style={{fontSize:'0.78rem',color:'var(--t2)',marginBottom:2}}>📍 {r.location}</p>
                                    <p style={{fontSize:'0.72rem',color:'var(--t3)'}}>{r.id} · {r.citizen} · {r.date}{r.assignedTo?` · Dispatched to: ${r.assignedTo}`:''}</p>
                                </div>
                            </div>
                            <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
                                {statusBadge(r.status)}
                                <Btn size="sm" variant="primary" onClick={()=>{setSel(r);setAssignTo(r.assignedTo||'');setNote('');}}>Review</Btn>
                            </div>
                        </div>
                    ))}
            </div>

            {sel && (
                <Modal onClose={close} wide>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:4}}>
                        <h2 style={{fontFamily:'var(--ff)'}}>🌊 Disaster Report Review</h2>
                        {statusBadge(sel.status)}
                    </div>
                    <p style={{color:'var(--t2)',fontSize:'0.82rem',marginBottom:14}}>{sel.id} · {sel.date}</p>
                    {sel.isRedZone&&<div style={{background:'rgba(231,76,60,0.12)',border:'1px solid rgba(231,76,60,0.3)',borderRadius:'var(--rs)',padding:'9px 14px',marginBottom:14,color:'#f87171',fontSize:'0.875rem',fontWeight:600}}>🔴 RED ZONE — Immediate evacuation required</div>}

                    <div style={{background:'var(--bg3)',borderRadius:'var(--rs)',padding:14,marginBottom:16}}>
                        {[['Type',sel.type],['Severity',sel.severity],['Reporter',`${sel.citizen} · ${sel.phone}`],['Location',sel.location],['Date',sel.date],sel.assignedTo&&['Dispatched To',sel.assignedTo]].filter(Boolean).map(([k,v])=><DetailRow key={k} k={k} v={v}/>)}
                    </div>

                    <p style={{fontSize:'0.72rem',color:'var(--t3)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:8}}>Situation Report</p>
                    <DescBox text={sel.description}/>

                    {sel.status!=='Resolved'&&(
                        <div style={{borderTop:'1px solid var(--border)',paddingTop:18,marginTop:18}}>
                            <p style={{fontSize:'0.85rem',fontWeight:600,color:'var(--t1)',marginBottom:14}}>🚨 Dispatch Response Team</p>
                            <Field label="Assign To">
                                <select value={assignTo} onChange={e=>setAssignTo(e.target.value)}>
                                    <option value="">— Select response team —</option>
                                    {DMC_TEAMS.map(t=><option key={t} value={t}>{t}</option>)}
                                    <option value="__custom__">Custom — enter manually…</option>
                                </select>
                            </Field>
                            {assignTo==='__custom__'&&<Field label="Enter team/officer name"><input value={custom} onChange={e=>setCustom(e.target.value)} placeholder="e.g. Police Unit 5, Galle"/></Field>}
                            <Field label="Dispatch note"><textarea value={note} onChange={e=>setNote(e.target.value)} rows={2} placeholder="Special instructions…"/></Field>
                            <div style={{display:'flex',gap:10,marginTop:8}}>
                                <Btn variant="ghost" onClick={close} style={{flex:1}}>Close</Btn>
                                {sel.status==='Assigned'&&<Btn variant="primary" size="sm" onClick={()=>{update(sel.id,{status:'Resolved'});close();}}>✅ Resolve</Btn>}
                                <Btn variant="danger" onClick={dispatch} disabled={!assignTo||(assignTo==='__custom__'&&!custom)} style={{flex:2,background:'rgba(231,76,60,0.75)'}}>🚨 Dispatch Now</Btn>
                            </div>
                        </div>
                    )}
                    {sel.status==='Resolved'&&<Btn variant="ghost" onClick={close} style={{width:'100%',marginTop:14}}>Close</Btn>}
                </Modal>
            )}
        </div>
    );
};

/* ═══════════════════════════════════════════════
   RESPONSE REPORTS PAGE
═══════════════════════════════════════════════ */
const Responses = ({ responses, setResponses, depts }) => {
    const [filter, setFilter] = useState('All');
    const [sel, setSel]       = useState(null);
    const [assignTo, setAssignTo] = useState('');
    const [note, setNote]     = useState('');

    const tabs   = ['All','Pending Review','Assigned','Resolved'];
    const counts = Object.fromEntries(tabs.map(t=>[t,t==='All'?responses.length:responses.filter(r=>r.status===t).length]));
    const list   = filter==='All'?responses:responses.filter(r=>r.status===filter);
    const agents = depts.find(d=>d.name===sel?.dept)?.agents||[];

    const update  = (id, patch) => setResponses(responses.map(r=>r.id===id?{...r,...patch}:r));
    const close   = () => { setSel(null); setAssignTo(''); setNote(''); };
    const reassign = () => { update(sel.id,{status:'Assigned',assignedTo:assignTo}); close(); };

    return (
        <div style={{animation:'fadeUp .45s ease'}}>
            <PageHeader title="Response Reports" sub="Citizen feedback on agent performance — review and escalate unresolved issues" />

            <div style={{background:'rgba(230,168,23,0.09)',border:'1px solid rgba(230,168,23,0.22)',borderRadius:'var(--rs)',padding:'11px 16px',marginBottom:22,display:'flex',gap:10,alignItems:'flex-start'}}>
                <span>ℹ️</span>
                <p style={{fontSize:'0.83rem',color:'var(--t2)',lineHeight:1.6}}>Filed by citizens when their complaint was not resolved satisfactorily. Review each report and re-assign to an appropriate agent.</p>
            </div>

            <FilterTabs tabs={tabs} active={filter} setActive={setFilter} counts={counts} accent="#fb923c" />

            <div style={{display:'flex',flexDirection:'column',gap:12}}>
                {list.length===0
                    ? <EmptyState icon="🎉" text="No response reports in this category"/>
                    : list.map(r=>(
                        <div key={r.id} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r)',padding:20,transition:'border-color .2s'}}
                             onMouseEnter={e=>e.currentTarget.style.borderColor='var(--border2)'}
                             onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10,gap:12}}>
                                <div>
                                    <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:4}}>
                                        <code style={{fontSize:'0.72rem',color:'var(--sky)'}}>{r.id}</code>
                                        <span style={{color:'var(--t3)',fontSize:'0.7rem'}}>→</span>
                                        <code style={{fontSize:'0.72rem',color:'var(--t3)'}}>{r.originalComplaint}</code>
                                    </div>
                                    <h3 style={{fontFamily:'var(--ff)',fontSize:'0.92rem',color:'var(--t1)',marginBottom:4}}>{r.issue}</h3>
                                    <p style={{fontSize:'0.78rem',color:'var(--t2)'}}>By <strong style={{color:'var(--t1)'}}>{r.citizen}</strong> · {r.dept} · {r.date}</p>
                                </div>
                                <div style={{display:'flex',gap:7,flexShrink:0}}>
                                    {priorityBadge(r.priority)}
                                    {statusBadge(r.status)}
                                </div>
                            </div>
                            <p style={{fontSize:'0.83rem',color:'var(--t2)',lineHeight:1.6,marginBottom:12}}>{r.description.slice(0,160)}{r.description.length>160?'…':''}</p>
                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                                <p style={{fontSize:'0.75rem',color:'var(--t3)'}}>Previous agent: <span style={{color:'#fbbf24'}}>{r.agent}</span></p>
                                <Btn size="sm" variant="warn" onClick={()=>{setSel(r);setAssignTo(r.assignedTo||'');setNote('');}}>🔁 Review & Re-assign</Btn>
                            </div>
                        </div>
                    ))}
            </div>

            {sel && (
                <Modal onClose={close} wide>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:4}}>
                        <h2 style={{fontFamily:'var(--ff)'}}>🔁 Response Report Review</h2>
                        {statusBadge(sel.status)}
                    </div>
                    <p style={{color:'var(--t2)',fontSize:'0.82rem',marginBottom:18}}>{sel.id} · Linked to {sel.originalComplaint}</p>

                    <div style={{background:'var(--bg3)',borderRadius:'var(--rs)',padding:14,marginBottom:16}}>
                        {[['Citizen',sel.citizen],['Department',sel.dept],['Original Complaint',sel.originalComplaint],['Previous Agent',sel.agent],['Priority',sel.priority],['Date',sel.date]].map(([k,v])=><DetailRow key={k} k={k} v={v}/>)}
                    </div>

                    <p style={{fontSize:'0.72rem',color:'var(--t3)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:8}}>Citizen's Report</p>
                    <div style={{background:'rgba(230,168,23,0.07)',border:'1px solid rgba(230,168,23,0.18)',borderRadius:'var(--rs)',padding:14,fontSize:'0.875rem',color:'var(--t1)',lineHeight:1.75,marginBottom:18}}>
                        {sel.description}
                    </div>

                    {sel.status!=='Resolved'&&(
                        <div style={{borderTop:'1px solid var(--border)',paddingTop:18}}>
                            <p style={{fontSize:'0.85rem',fontWeight:600,color:'var(--t1)',marginBottom:14}}>🎯 Re-assign to Agent</p>
                            <Field label={`Select agent from ${sel.dept}`}>
                                <select value={assignTo} onChange={e=>setAssignTo(e.target.value)}>
                                    <option value="">— Select agent —</option>
                                    {agents.filter(a=>a.name!==sel.agent).map(a=><option key={a.id} value={a.name}>{a.name} ({a.role})</option>)}
                                    <option value={sel.agent}>{sel.agent} (same agent)</option>
                                </select>
                            </Field>
                            <Field label="Admin note for agent">
                                <textarea value={note} onChange={e=>setNote(e.target.value)} rows={3} placeholder="Explain why escalating and what action is expected…"/>
                            </Field>
                            <div style={{display:'flex',gap:10,marginTop:8}}>
                                <Btn variant="ghost" onClick={close} style={{flex:1}}>Close</Btn>
                                <Btn variant="primary" size="sm" onClick={()=>{update(sel.id,{status:'Resolved'});close();}}>✅ Resolve</Btn>
                                <Btn variant="warn" onClick={reassign} disabled={!assignTo} style={{flex:1}}>🔁 Re-assign</Btn>
                            </div>
                        </div>
                    )}
                    {sel.status==='Resolved'&&<Btn variant="ghost" onClick={close} style={{width:'100%',marginTop:14}}>Close</Btn>}
                </Modal>
            )}
        </div>
    );
};

/* ═══════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════ */
const NAV = [
    {id:'overview',    icon:'▦',  label:'Overview'},
    {id:'citizens',   icon:'👤', label:'Citizens'},
    {id:'departments',icon:'🏛️', label:'Departments'},
    {id:'complaints', icon:'📋', label:'Complaints'},
    {id:'disasters',  icon:'🌊', label:'Disaster Reports'},
    {id:'responses',  icon:'🔁', label:'Response Reports'},
];

const Sidebar = ({ page, setPage, open, setOpen }) => (
    <aside style={{position:'fixed',left:0,top:0,bottom:0,width:open?'var(--sw)':'var(--swc)',background:'var(--bg2)',borderRight:'1px solid var(--border)',display:'flex',flexDirection:'column',zIndex:100,transition:'width .3s ease',overflow:'hidden'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'22px 18px 18px',borderBottom:'1px solid var(--border)',flexShrink:0}}>
            <div style={{width:34,height:34,borderRadius:9,background:'linear-gradient(135deg,var(--teal),var(--ocean))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.9rem',flexShrink:0}}>⚡</div>
            {open&&<span style={{fontFamily:'var(--ff)',fontSize:'1rem',fontWeight:700,color:'var(--t1)',whiteSpace:'nowrap'}}>AdminPanel</span>}
        </div>

        <button onClick={()=>setOpen(!open)} style={{position:'absolute',top:26,right:-11,width:22,height:22,background:'var(--surface)',border:'1px solid var(--border2)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'var(--t2)',fontSize:'0.55rem',zIndex:10,transition:'all .2s'}}>
            {open?'◀':'▶'}
        </button>

        <nav style={{flex:1,padding:'14px 8px',display:'flex',flexDirection:'column',gap:3,overflowY:'auto',overflowX:'hidden'}}>
            {NAV.map(n=>(
                <button key={n.id} onClick={()=>setPage(n.id)} title={!open?n.label:undefined}
                        style={{display:'flex',alignItems:'center',gap:11,padding:'10px 11px',borderRadius:9,border:'none',background:page===n.id?'rgba(29,158,117,0.15)':'transparent',color:page===n.id?'var(--t1)':'var(--t2)',cursor:'pointer',fontFamily:'var(--fb)',fontSize:'0.855rem',fontWeight:500,textAlign:'left',whiteSpace:'nowrap',transition:'all .2s',width:'100%',position:'relative'}}
                        onMouseEnter={e=>{if(page!==n.id)e.currentTarget.style.background='rgba(181,212,244,0.07)'}}
                        onMouseLeave={e=>{if(page!==n.id)e.currentTarget.style.background='transparent'}}>
                    <span style={{fontSize:'1rem',flexShrink:0}}>{n.icon}</span>
                    {open&&<span style={{flex:1,overflow:'hidden',textOverflow:'ellipsis'}}>{n.label}</span>}
                    {page===n.id&&<span style={{position:'absolute',right:0,top:'50%',transform:'translateY(-50%)',width:3,height:18,background:'var(--teal)',borderRadius:'2px 0 0 2px'}}/>}
                </button>
            ))}
        </nav>

        {open&&(
            <div style={{display:'flex',alignItems:'center',gap:10,padding:'14px 13px',borderTop:'1px solid var(--border)',flexShrink:0}}>
                <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,var(--ocean),var(--teal))',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'0.8rem',color:'#fff',flexShrink:0}}>A</div>
                <div>
                    <p style={{fontSize:'0.82rem',fontWeight:600,color:'var(--t1)'}}>Admin</p>
                    <p style={{fontSize:'0.7rem',color:'var(--t3)'}}>Super Admin</p>
                </div>
            </div>
        )}
    </aside>
);

/* ═══════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════ */
export default function AdminDashboard() {
    const [page, setPage]         = useState('overview');
    const [open, setOpen]         = useState(true);
    const [citizens, setCitizens] = useState(INIT_CITIZENS);
    const [depts, setDepts]       = useState(INIT_DEPTS);
    const [complaints, setComplaints] = useState(INIT_COMPLAINTS);
    const [disasters, setDisasters]   = useState(INIT_DISASTERS);
    const [responses, setResponses]   = useState(INIT_RESPONSES);

    const contentRef = useRef(null);
    const prevPage   = useRef(page);

    useEffect(() => {
        if (!contentRef.current || page === prevPage.current) return;
        prevPage.current = page;
        contentRef.current.style.animation = 'none';
        // Trigger reflow to restart animation
        void contentRef.current.offsetHeight;
        contentRef.current.style.animation = '';
    }, [page]);

    const PAGES = {
        overview:    <Overview    citizens={citizens} depts={depts} complaints={complaints} disasters={disasters} responses={responses} setPage={setPage}/>,
        citizens:    <Citizens    citizens={citizens} setCitizens={setCitizens}/>,
        departments: <Departments depts={depts} setDepts={setDepts}/>,
        complaints:  <Complaints  complaints={complaints} setComplaints={setComplaints} depts={depts}/>,
        disasters:   <Disasters   disasters={disasters} setDisasters={setDisasters}/>,
        responses:   <Responses   responses={responses} setResponses={setResponses} depts={depts}/>,
    };

    return (
        <>

            <div style={{display:'flex',minHeight:'100vh'}}>
                <Sidebar page={page} setPage={setPage} open={open} setOpen={setOpen}/>
                <main ref={contentRef} style={{flex:1,marginLeft:open?'var(--sw)':'var(--swc)',transition:'margin-left .3s ease',padding:'30px 34px',minHeight:'100vh',background:'var(--bg)',animation:'fadeUp .4s ease'}}>
                    {PAGES[page]}
                </main>
            </div>
        </>
    );
}
