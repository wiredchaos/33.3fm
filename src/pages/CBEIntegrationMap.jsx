import React from 'react';

export default function CBEIntegrationMap() {
  return (
    <div style={{
      background: '#04040a',
      color: 'rgba(255,255,255,0.92)',
      fontFamily: "'DM Sans', sans-serif",
      minHeight: '100vh',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      {/* Grid background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(0,229,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.015) 1px,transparent 1px)',
        backgroundSize: '56px 56px'
      }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:rgba(0,229,255,0.2)}
        .cbe-wrap{max-width:1200px;margin:0 auto;padding:60px 32px;position:relative;z-index:1}
        .eco-map{display:grid;grid-template-columns:1fr 120px 1fr 120px 1fr;align-items:start;gap:0;margin-bottom:64px}
        @media(max-width:900px){.eco-map{grid-template-columns:1fr;gap:16px}}
        .eco-node{border:1px solid rgba(255,255,255,0.06);border-radius:4px;padding:28px;position:relative;overflow:hidden;transition:all 0.2s}
        .eco-node:hover{border-color:rgba(255,255,255,0.13);transform:translateY(-2px)}
        .eco-arrow{display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;padding:20px 0;padding-top:60px}
        @media(max-width:900px){.eco-arrow{flex-direction:row;padding:0}}
        .conn-table{width:100%;border-collapse:collapse;margin-bottom:48px}
        .conn-table th{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.42);padding:10px 16px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.06);background:#0c0c1e}
        .conn-table td{padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:12px;vertical-align:middle}
        .conn-table tr:hover td{background:rgba(255,255,255,0.015)}
        .shared-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:48px}
        @media(max-width:768px){.shared-grid{grid-template-columns:1fr}}
        .dl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:48px}
        @media(max-width:900px){.dl-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:600px){.dl-grid{grid-template-columns:1fr}}
        .dl-card{background:#0c0c1e;border:1px solid rgba(255,255,255,0.06);border-radius:4px;padding:18px;transition:all 0.2s;cursor:pointer;text-decoration:none;display:block;color:rgba(255,255,255,0.92)}
        .dl-card:hover{border-color:rgba(255,255,255,0.13);transform:translateY(-1px)}
        .cbe-btn{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:0.14em;text-transform:uppercase;padding:8px 18px;border-radius:3px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:6px;border:none;transition:all 0.2s}
        .code-block{background:#111128;border:1px solid rgba(255,255,255,0.06);border-radius:3px;padding:16px;font-family:'Space Mono',monospace;font-size:10px;line-height:1.9;overflow-x:auto;margin-top:12px;white-space:pre-wrap}
      `}</style>

      <div className="cbe-wrap">

        {/* HEADER */}
        <div style={{fontFamily:"'Space Mono',monospace",fontSize:'9px',letterSpacing:'0.4em',textTransform:'uppercase',color:'rgba(255,255,255,0.42)',marginBottom:'16px',display:'flex',alignItems:'center',gap:'10px'}}>
          <span style={{display:'block',width:'24px',height:'1px',background:'#00e5ff'}}></span>
          CBE Framework · Integration Layer
        </div>
        <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:'clamp(24px,4vw,48px)',fontWeight:900,letterSpacing:'0.06em',lineHeight:1.1,marginBottom:'12px'}}>
          CBE <span style={{color:'#00e5ff'}}>//</span> <span style={{color:'transparent',WebkitTextStroke:'1px rgba(0,229,255,0.6)'}}>INTEGRATION MAP</span>
        </h1>
        <p style={{fontSize:'14px',color:'rgba(255,255,255,0.42)',maxWidth:'580px',lineHeight:1.7,marginBottom:'56px'}}>
          The full connectivity and data-flow specification between WCU Human Campus, WCU Agent Campus, and NEURALai / Agenttropolis. One civilizational backend. Three surfaces. Zero disconnected islands.
        </p>

        {/* SECTION 01 */}
        <SectionHeader number="01" title="Ecosystem Map" />

        <div className="eco-map">
          {/* Human Campus */}
          <div className="eco-node" style={{background:'linear-gradient(160deg,rgba(0,255,136,0.04) 0%,#0c0c1e 50%)'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:'3px',background:'#00ff88'}}></div>
            <NodeLabel>Human Division</NodeLabel>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'14px',fontWeight:700,letterSpacing:'0.1em',marginBottom:'6px',color:'#00ff88'}}>WCU // HUMAN CAMPUS</div>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:'9px',color:'rgba(255,255,255,0.42)',marginBottom:'16px',letterSpacing:'0.08em'}}>wcu.base44.app</div>
            <div style={{fontSize:'11px',color:'rgba(255,255,255,0.42)',lineHeight:1.65,marginBottom:'16px'}}>Trains human learners. Produces graduates with on-chain credentials, active wallets, verified XP, and XENT eligibility.</div>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:'8px',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'4px',color:'#00ff88'}}>Outputs →</div>
            <Pills color="#00ff88" items={['Credentials (EAS)','XP Score','Wallet Address','Graduate Status','XENT Eligibility']} />
          </div>

          {/* Arrow 1 */}
          <Arrow label={['Graduate','commissions','agent staff','↕','Agent staff','serves human','graduates']} fromC="#00ff88" toC="#e040fb" />

          {/* Agent Campus */}
          <div className="eco-node" style={{background:'linear-gradient(160deg,rgba(224,64,251,0.04) 0%,#0c0c1e 50%)'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:'3px',background:'#e040fb'}}></div>
            <NodeLabel>Agent Division</NodeLabel>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'14px',fontWeight:700,letterSpacing:'0.1em',marginBottom:'6px',color:'#e040fb'}}>WCU // AGENT CAMPUS</div>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:'9px',color:'rgba(255,255,255,0.42)',marginBottom:'16px',letterSpacing:'0.08em'}}>neuralai.base44.app</div>
            <div style={{fontSize:'11px',color:'rgba(255,255,255,0.42)',lineHeight:1.65,marginBottom:'16px'}}>Creates, trains, certifies, and deploys agent staff. Publishes service offerings. Routes certified staff into Agenttropolis districts.</div>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:'8px',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'4px',color:'#e040fb'}}>Outputs →</div>
            <Pills color="#e040fb" items={['Certified Staff','Skill Packs','Service Offerings','Refractions','Citizenship Data']} />
          </div>

          {/* Arrow 2 */}
          <Arrow label={['Staff +','humans feed','citizenship','↕','Citizenship','status visible','in both apps']} fromC="#e040fb" toC="#00e5ff" />

          {/* Agenttropolis */}
          <div className="eco-node" style={{background:'linear-gradient(160deg,rgba(0,229,255,0.04) 0%,#0c0c1e 50%)'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:'3px',background:'#00e5ff'}}></div>
            <NodeLabel>Intelligence Grid</NodeLabel>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'14px',fontWeight:700,letterSpacing:'0.1em',marginBottom:'6px',color:'#00e5ff'}}>AGENTTROPOLIS</div>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:'9px',color:'rgba(255,255,255,0.42)',marginBottom:'16px',letterSpacing:'0.08em'}}>neuralai.base44.app · orchids.app</div>
            <div style={{fontSize:'11px',color:'rgba(255,255,255,0.42)',lineHeight:1.65,marginBottom:'16px'}}>The citizenship and district system. Receives graduates and certified agents from both universities. Issues citizenship on-chain via Base / EAS.</div>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:'8px',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'4px',color:'#00e5ff'}}>Outputs →</div>
            <Pills color="#00e5ff" items={['Citizenship NFT','District Assignment','Refraction Ledger','XENT Economy']} />
          </div>
        </div>

        {/* SECTION 02 — Connection Table */}
        <Divider />
        <SectionHeader number="02" title="All Connection Points" />

        <table className="conn-table">
          <thead>
            <tr>
              <th>From</th><th>To</th><th>Trigger / Event</th><th>Data Passed</th><th>Method</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            <ConnRow from={{label:'Human Campus',c:'#00ff88'}} to={{label:'Agent Campus',c:'#e040fb'}} trigger='Graduate clicks "Commission Agent Staff"' data='wallet_address · xp_score · graduate_credential · faculty_completed[]' method='URL deeplink + query params' status='Build Now' statusC='#00ff88' />
            <ConnRow from={{label:'Human Campus',c:'#00ff88'}} to={{label:'Agenttropolis',c:'#00e5ff'}} trigger='Graduate earns XENT eligibility (≥3000 XP)' data='wallet_address · xp_total · credentials[] · eligible: true' method='URL deeplink → citizenship/begin' status='Build Now' statusC='#00ff88' />
            <ConnRow from={{label:'Human Campus',c:'#00ff88'}} to={{label:'Agenttropolis',c:'#00e5ff'}} trigger='Student burns 1 XENT from wallet section' data='wallet_address · burn_tx_hash · xp_bonus: 500' method='On-chain tx → EAS attestation read' status='On-chain' statusC='#ffd94a' />
            <ConnRow from={{label:'Agent Campus',c:'#e040fb'}} to={{label:'Human Campus',c:'#00ff88'}} trigger='Human graduate navigates to "Staff Registry"' data='agent_id · role · skills[] · status · services[]' method='Embedded registry widget or deeplink' status='Build Now' statusC='#00ff88' />
            <ConnRow from={{label:'Agent Campus',c:'#e040fb'}} to={{label:'Agenttropolis',c:'#00e5ff'}} trigger='Agent reaches "Active Staff" certification' data='agent_id · skills[] · district · refractions · status: active' method='Registry sync → district staffing feed' status='Build Now' statusC='#00ff88' />
            <ConnRow from={{label:'Agent Campus',c:'#e040fb'}} to={{label:'Agenttropolis',c:'#00e5ff'}} trigger='Agent burns 1 XENT (Foundry Citizen gate)' data='agent_id · burn_tx · refractions_total · citizenship_stage' method='On-chain tx → ERC-6551 wallet update' status='On-chain' statusC='#ffd94a' />
            <ConnRow from={{label:'Agenttropolis',c:'#00e5ff'}} to={{label:'Human Campus',c:'#00ff88'}} trigger='Citizenship status change (any stage)' data='wallet_address · citizenship_stage · district · xent_burned' method='EAS attestation read on profile load' status='On-chain' statusC='#ffd94a' />
            <ConnRow from={{label:'Agenttropolis',c:'#00e5ff'}} to={{label:'Agent Campus',c:'#e040fb'}} trigger='Agent citizenship protocol completion' data='agent_id · naturalization_stage · civic_oath_tx' method='EAS attestation → staff registry update' status='On-chain' statusC='#ffd94a' />
          </tbody>
        </table>

        {/* SECTION 03 — Shared Components */}
        <Divider />
        <SectionHeader number="03" title="Shared Components (Build Once, Use in Both Apps)" />

        <div className="shared-grid">
          <SharedCard title="CBE System Bar" titleC="#00e5ff" desc="Fixed top bar present on ALL three apps. Shows current app, CBE parent, links to both universities + Agenttropolis. Identical HTML/CSS across all surfaces.">
{`<!-- Place at TOP of every app -->
<div id="cbe-sysbar">
  <div class="cbe-left">
    <a href="#">CBE</a> //
    <a href="https://wcu.base44.app">
      WCU Human
    </a> |
    <a href="https://neuralai.base44.app">
      WCU Agent
    </a> →
    <a href="https://neuralai.base44.app">
      Agenttropolis
    </a>
  </div>
  <div class="cbe-right">
    ● SYSTEM ONLINE | Base Network | v1.0
  </div>
</div>`}
          </SharedCard>

          <SharedCard title="CBE Crosslink Banner" titleC="#00ff88" desc="Appears at top of hero section on all apps. Shows the 3-node relationship. The active app node is highlighted. Clicking other nodes navigates to them.">
{`<!-- Active node = current app, highlighted -->
<div class="cbe-banner">
  CBE →
  <a href="https://wcu.base44.app"
     class="[active if human campus]">
    WCU // Human Campus
  </a>
  |
  <a href="https://neuralai.base44.app"
     class="[active if agent campus]">
    WCU // Agent Campus
  </a>
  →
  <a href="https://neuralai.base44.app">
    Agenttropolis
  </a>
</div>`}
          </SharedCard>

          <SharedCard title="Graduate CTA Block" titleC="#e040fb" desc="Shown in Human Campus community section + course completion screens. Bridges human graduates to Agent Campus services and Agenttropolis citizenship.">
{`<!-- Shown when XP >= 3000 OR graduate credential -->
<div class="graduate-bridge">
  "You are now eligible to:"

  <a href="https://neuralai.base44.app
    /registry?from=wcu-human
    &wallet={wallet}
    &xp={xp}
    &creds={cred_list}">
    Commission Agent Staff →
  </a>

  <a href="https://neuralai.base44.app
    /citizenship?from=wcu-human
    &wallet={wallet}
    &eligible=true">
    Begin Citizenship →
  </a>
</div>`}
          </SharedCard>

          <SharedCard title="Agent Staff Widget (Embed)" titleC="#ff6b00" desc="A mini staff registry card shown on Human Campus 'Community' section. Pulls 3 featured certified agents with hire links back to Agent Campus.">
{`<!-- Human Campus: Community section -->
<div class="agent-staff-preview">
  <h3>Featured Agent Staff</h3>
  <p>Graduates can commission these
  certified staff directly.</p>

  <!-- 3 staff mini-cards: WIRE, FANG, HOWL -->
  <div class="staff-mini-grid">
    [WIRE card]
    [FANG card]
    [HOWL card]
  </div>

  <a href="https://neuralai.base44.app
    /registry">
    View All Staff →
  </a>
</div>`}
          </SharedCard>
        </div>

        {/* SECTION 04 — Deep Link Scheme */}
        <Divider />
        <SectionHeader number="04" title="Deep Link URL Scheme" />

        <div className="dl-grid">
          <a className="dl-card" href="https://wcu.base44.app" target="_blank" rel="noreferrer">
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:'8px',letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(255,255,255,0.42)',marginBottom:'6px'}}>WCU Human Campus</div>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'11px',fontWeight:600,letterSpacing:'0.08em',marginBottom:'6px',color:'#00ff88'}}>Homepage</div>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:'8px',color:'rgba(255,255,255,0.42)',wordBreak:'break-all'}}>wcu.base44.app</div>
          </a>
          <DeepLinkCard from="WCU Human Campus → Agent Campus" label="Graduate commissions staff" url="neuralai.base44.app/registry?from=wcu-human&wallet=0x…&xp=4200&graduate=true" labelC="#00ff88" />
          <DeepLinkCard from="WCU Human Campus → Agenttropolis" label="XENT eligible → begin citizenship" url="neuralai.base44.app/citizenship?from=wcu-human&wallet=0x…&eligible=true" labelC="#00ff88" />
          <a className="dl-card" href="https://neuralai.base44.app" target="_blank" rel="noreferrer">
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:'8px',letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(255,255,255,0.42)',marginBottom:'6px'}}>WCU Agent Campus / Agenttropolis</div>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'11px',fontWeight:600,letterSpacing:'0.08em',marginBottom:'6px',color:'#e040fb'}}>Homepage</div>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:'8px',color:'rgba(255,255,255,0.42)',wordBreak:'break-all'}}>neuralai.base44.app</div>
          </a>
          <DeepLinkCard from="WCU Agent Campus → Human Campus" label="Agent references human course" url="wcu.base44.app/courses?ref=agent-campus&course=prompt-engineering" labelC="#e040fb" />
          <DeepLinkCard from="Agenttropolis → Human Campus" label="Citizenship complete → back to WCU" url="wcu.base44.app/profile?citizen=true&district=chaos-rank&wallet=0x…" labelC="#00e5ff" />
        </div>

        {/* SECTION 05 — Prompts */}
        <Divider />
        <SectionHeader number="05" title="Lovable Prompts to Execute Integration" />

        <div style={{display:'flex',flexDirection:'column',gap:'24px'}}>
          <div style={{background:'#0c0c1e',border:'1px solid rgba(0,255,136,0.2)',borderRadius:'4px',padding:'24px'}}>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'12px',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'8px',color:'#00ff88'}}>PROMPT 1 — Run on wcu.base44.app (Human Campus)</div>
            <div style={{fontSize:'12px',color:'rgba(255,255,255,0.42)',lineHeight:1.65,marginBottom:'16px'}}>Adds CBE sysbar, crosslink banner, graduate bridge CTA, agent staff preview widget, and deep-link navigation to Agent Campus + Agenttropolis.</div>
            <div className="code-block" style={{color:'#00ff88',fontSize:'9px'}}>{`ADD CBE INTEGRATION LAYER TO THIS PAGE.

This is WCU // Human Campus. It must be fully connected to:
1. WCU // Agent Campus at https://neuralai.base44.app
2. Agenttropolis citizenship protocol at https://neuralai.base44.app

SHARED CBE SYSTEM BAR
Add a fixed top bar above the existing nav (height: 36px). 
Present on every page. Shows:
Left: "CBE // Wired Chaos University // Human Campus"
Center links (clickable):
  - "WCU // Human Campus" (current, highlighted green) → stays on page
  - "WCU // Agent Campus" → links to https://neuralai.base44.app
  - "Agenttropolis" → links to https://neuralai.base44.app
Right: "● Enrollment Open | Base Network | v1.0"
Style: void-black background, Space Mono font, 9px, monospaced, cyan border-bottom 1px

GRADUATE BRIDGE SECTION
Show when user has >= 3000 XP OR graduate credential status.
Title: "YOU ARE NOW CBE ELIGIBLE"
Two CTAs:
  1. "Commission Agent Staff →" → https://neuralai.base44.app/registry
  2. "Begin Citizenship Protocol →" → https://neuralai.base44.app/citizenship

AGENT STAFF PREVIEW (Community section)
Show 3 mini staff cards: WIRE (Content), FANG (Intel), HOWL (SEO)
CTA below grid: "View All 47 Staff → neuralai.base44.app/registry"

VISUAL STYLE: Human Campus accent #00ff88 · Agent Campus links #e040fb · Agenttropolis links #00e5ff`}</div>
          </div>

          <div style={{background:'#0c0c1e',border:'1px solid rgba(224,64,251,0.2)',borderRadius:'4px',padding:'24px'}}>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'12px',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'8px',color:'#e040fb'}}>PROMPT 2 — Run on neuralai.base44.app (Agent Campus / Agenttropolis)</div>
            <div style={{fontSize:'12px',color:'rgba(255,255,255,0.42)',lineHeight:1.65,marginBottom:'16px'}}>Adds CBE sysbar, crosslink banner, human graduate recognition panel, and deep-link routing from Human Campus query params.</div>
            <div className="code-block" style={{color:'#e040fb',fontSize:'9px'}}>{`ADD CBE INTEGRATION LAYER TO THIS PAGE.

This app serves two purposes:
- WCU // Agent Campus (staff foundry, skill certifications)
- Agenttropolis (citizenship protocol, district system)

It must be fully connected to WCU // Human Campus at https://wcu.base44.app

HUMAN GRADUATE RECOGNITION PANEL
Handle these incoming URL params (from Human Campus deeplinks):
?from=wcu-human → show "Welcome, WCU Human Graduate" banner
?wallet=0x… → pre-fill wallet field if present
?graduate=true → show graduate badge on the session
?xp=NNNN → show XP level badge

CITIZENSHIP ENTRY FROM HUMAN CAMPUS
?from=wcu-human&eligible=true → 
  Show: "WCU Human Campus Graduate — XENT Eligibility Confirmed"
  Skip eligibility review → go straight to Step 03 (Identity Attestation)
  Show green "Human Campus Graduate" badge on citizenship profile

VISUAL STYLE: Agent Campus #e040fb · Agenttropolis #00e5ff · Human Campus links #00ff88`}</div>
          </div>
        </div>

        {/* FOOTER */}
        <Divider />
        <div style={{textAlign:'center',padding:'40px 0 20px'}}>
          <p style={{fontFamily:"'Space Mono',monospace",fontSize:'9px',letterSpacing:'0.3em',textTransform:'uppercase',color:'rgba(255,255,255,0.42)',marginBottom:'24px'}}>
            CBE // Integration Layer · Both universities. One civilization.
          </p>
          <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
            <a href="https://wcu.base44.app" target="_blank" rel="noreferrer" className="cbe-btn" style={{background:'#00ff88',color:'#000',fontWeight:700}}>Open Human Campus ↗</a>
            <a href="https://neuralai.base44.app" target="_blank" rel="noreferrer" className="cbe-btn" style={{background:'#00e5ff',color:'#000',fontWeight:700}}>Open Agent Campus ↗</a>
            <a href="https://neuralai.base44.app" target="_blank" rel="noreferrer" className="cbe-btn" style={{background:'transparent',border:'1px solid #e040fb',color:'#e040fb'}}>Agenttropolis ↗</a>
          </div>
        </div>

      </div>
    </div>
  );
}

function SectionHeader({ number, title }) {
  return (
    <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'13px',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',marginBottom:'24px',display:'flex',alignItems:'center',gap:'12px'}}>
      <span style={{display:'block',width:'20px',height:'1px',background:'#00e5ff'}}></span>
      {number} — {title}
    </div>
  );
}

function NodeLabel({ children }) {
  return <div style={{fontFamily:"'Space Mono',monospace",fontSize:'8px',letterSpacing:'0.25em',textTransform:'uppercase',color:'rgba(255,255,255,0.42)',marginBottom:'10px'}}>{children}</div>;
}

function Pills({ color, items }) {
  return (
    <div style={{display:'flex',flexWrap:'wrap',gap:'5px',marginTop:'8px'}}>
      {items.map(item => (
        <span key={item} style={{fontFamily:"'Space Mono',monospace",fontSize:'7px',letterSpacing:'0.12em',textTransform:'uppercase',padding:'3px 8px',borderRadius:'2px',background:`${color}1a`,color,border:`1px solid ${color}33`}}>{item}</span>
      ))}
    </div>
  );
}

function Arrow({ label, fromC, toC }) {
  return (
    <div className="eco-arrow">
      <div style={{width:'1px',background:`linear-gradient(180deg,${fromC},${toC})`,opacity:0.35,flex:1,minHeight:'80px'}}></div>
      <div style={{fontFamily:"'Space Mono',monospace",fontSize:'7px',letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(255,255,255,0.42)',textAlign:'center',lineHeight:1.6,padding:'0 4px'}}>
        {label.map((l,i) => <span key={i}>{l}<br/></span>)}
      </div>
      <div style={{width:'1px',background:`linear-gradient(180deg,${toC},${fromC})`,opacity:0.35,flex:1,minHeight:'80px'}}></div>
    </div>
  );
}

function ConnRow({ from, to, trigger, data, method, status, statusC }) {
  return (
    <tr>
      <td><span style={{fontFamily:"'Space Mono',monospace",fontSize:'8px',letterSpacing:'0.12em',textTransform:'uppercase',padding:'3px 8px',borderRadius:'2px',background:`${from.c}1a`,color:from.c,border:`1px solid ${from.c}33`,display:'inline-block'}}>{from.label}</span></td>
      <td><span style={{fontFamily:"'Space Mono',monospace",fontSize:'8px',letterSpacing:'0.12em',textTransform:'uppercase',padding:'3px 8px',borderRadius:'2px',background:`${to.c}1a`,color:to.c,border:`1px solid ${to.c}33`,display:'inline-block'}}>{to.label}</span></td>
      <td style={{fontSize:'11px',color:'rgba(255,255,255,0.42)'}}>{trigger}</td>
      <td style={{fontFamily:"'Space Mono',monospace",fontSize:'8px',color:'rgba(255,255,255,0.42)',letterSpacing:'0.08em'}}>{data}</td>
      <td style={{fontFamily:"'Space Mono',monospace",fontSize:'8px',color:'rgba(255,255,255,0.42)',letterSpacing:'0.08em'}}>{method}</td>
      <td>
        <span style={{display:'inline-flex',alignItems:'center',gap:'5px',fontFamily:"'Space Mono',monospace",fontSize:'8px',letterSpacing:'0.12em',textTransform:'uppercase',color:statusC}}>
          <span style={{width:'6px',height:'6px',borderRadius:'50%',background:statusC,boxShadow:statusC==='#00ff88'?`0 0 5px ${statusC}`:'none',display:'inline-block'}}></span>
          {status}
        </span>
      </td>
    </tr>
  );
}

function SharedCard({ title, titleC, desc, children }) {
  return (
    <div style={{background:'#0c0c1e',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'4px',padding:'24px'}}>
      <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'12px',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'8px',color:titleC}}>{title}</div>
      <div style={{fontSize:'12px',color:'rgba(255,255,255,0.42)',lineHeight:1.65,marginBottom:'16px'}}>{desc}</div>
      <div className="code-block" style={{color:'rgba(255,255,255,0.7)'}}>{children}</div>
    </div>
  );
}

function DeepLinkCard({ from, label, url, labelC }) {
  return (
    <div className="dl-card">
      <div style={{fontFamily:"'Space Mono',monospace",fontSize:'8px',letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(255,255,255,0.42)',marginBottom:'6px'}}>{from}</div>
      <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'11px',fontWeight:600,letterSpacing:'0.08em',marginBottom:'6px',color:labelC}}>{label}</div>
      <div style={{fontFamily:"'Space Mono',monospace",fontSize:'8px',color:'rgba(255,255,255,0.42)',wordBreak:'break-all'}}>{url}</div>
    </div>
  );
}

function Divider() {
  return <div style={{height:'1px',background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.13),transparent)',margin:'56px 0'}}></div>;
}