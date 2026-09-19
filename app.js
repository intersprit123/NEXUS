const saved = JSON.parse(localStorage.getItem("nexus-progress") || "null");
const state = saved || { page: "dashboard", xp: 0, solved: 0, streak: 0, done: false, courses: {}, course: 0 };

function levelFromXp(xp) { return Math.floor(xp / 1000) + 1; }
function coursePct(i) { return Number(state.courses[i] || 0); }
function save() {
  localStorage.setItem("nexus-progress", JSON.stringify({
    xp: state.xp, solved: state.solved, streak: state.streak, done: state.done, courses: state.courses
  }));
}
function resetProgress() {
  localStorage.removeItem("nexus-progress");
  location.reload();
}
const missions = [
  ["The Stolen Server","Web • Hard","Find the compromised account in a fictional ACME incident."],
  ["Packet Storm","Networking • Medium","Trace suspicious traffic and reconstruct the timeline."],
  ["Ghost File","Forensics • Hard","Analyze evidence and recover the hidden artifact."]
];
const courses = [
  ["🐧","Linux Foundations","7 lessons","Terminal basics, files, permissions and processes"],
  ["🌐","Networking","9 lessons","TCP/IP, DNS, HTTP, ports, routing and packet thinking"],
  ["🕸️","Web Security","12 lessons","HTTP, authentication, sessions, input validation and safe lab practice"],
  ["🐍","Python for Security","8 lessons","Automation, parsing, requests, logs and defensive tooling"],
  ["🔐","Cryptography","10 lessons","Hashes, encoding, symmetric crypto, public-key concepts and signatures"],
  ["🕵️","Digital Forensics","11 lessons","Evidence handling, metadata, logs, timelines and analysis"],
  ["🧬","Reverse Engineering","10 lessons","Binaries, strings, control flow and analysis workflows"],
  ["🛡️","Blue Team / SOC","9 lessons","Detection, triage, incident response and hardening"]
];
const labs = [
  ["🛒","OWASP Juice Shop","Web • Beginner → Expert","http://127.0.0.1:3000"],
  ["🐐","OWASP WebGoat","Web • Beginner → Advanced","http://127.0.0.1:8081/WebGoat/"],
  ["💉","DVWA","Web • Beginner → Advanced","http://127.0.0.1:4280"]
];
const external = [
  ["Hack The Box","https://www.hackthebox.com/"],
  ["PortSwigger Web Security Academy","https://portswigger.net/web-security"],
  ["TryHackMe","https://tryhackme.com/"]
];
const tools = [
  ["🔎","Hash Analyzer"],["🧩","Codec Lab"],["📄","Metadata"],
  ["📝","Log Analyzer"],["🔤","Hex Viewer"],["📊","JWT Decoder"]
];

function navButton(label, target, primary=false) {
  return '<button class="btn ' + (primary ? "primary" : "") + '" data-page="' + target + '">' + label + '</button>';
}
function shell() {
  const nav = [
    ["dashboard","⌂","Dashboard"],["learn","🎓","Learn"],["missions","🎯","Missions"],
    ["labs","🧪","Real Labs"],["terminal","💻","Terminal"],["tools","🧰","Toolkit"],
    ["ctf","🚩","CTF Arena"],["ai","🤖","Gemini AI"],["help","❓","Help"]
  ];
  return '<div class="shell"><aside class="sidebar"><div class="brand"><div class="brand-mark">N</div>NEXUS</div><nav>' +
    nav.map(x => '<button class="nav-btn ' + (state.page===x[0] ? "active" : "") + '" data-page="' + x[0] + '">' + x[1] + '&nbsp; ' + x[2] + '</button>').join("") +
    '</nav><button class="nav-btn" id="reset">↻ Reset Progress</button><div class="footer-note">Real labs • Gemini-ready • API-backed</div></aside>' +
    '<main class="main"><div class="topbar"><div class="crumb">NEXUS / ' + state.page.toUpperCase() +
    '</div><div class="profile"><div class="avatar">N</div><div><b>New Operator</b><div class="muted">Level ' + levelFromXp(state.xp) +
    '</div></div></div></div><div id="view">' + page() + '</div></main></div>';
}
function dashboard() {
  const skills = [["Linux",0],["Web Security",2],["Networking",1],["Forensics",5]];
  return '<div class="hero"><section class="card hero-card"><div class="eyebrow">CYBER COMMAND CENTER</div>' +
    '<div class="title">Learn. Investigate.<br>Break the case.</div>' +
    '<div class="sub">A fresh NEXUS account starts at zero. XP, levels, cases and course progress are earned from actual activity.</div>' +
    '<div class="actions">' + navButton("Start Learning →","learn",true) + navButton("Launch Real Labs","labs") + navButton("Ask Gemini","ai") + '</div></section>' +
    '<section class="card section"><div class="section-head"><h2>⚡ Operator status</h2><span class="tag">NEW</span></div>' +
    '<div class="notice">Level <b>' + levelFromXp(state.xp) + '</b> • ' + state.xp + ' XP • ' + state.solved + ' cases solved</div>' +
    skills.map(s => { const p = coursePct(s[1]); return '<div class="skill"><div class="skill-row"><span>' + s[0] + '</span><b>' + p + '%</b></div><div class="progress"><i style="width:' + p + '%"></i></div></div>'; }).join("") +
    '</section></div><div class="stats">' +
    [["XP",state.xp.toLocaleString()],["LEVEL",levelFromXp(state.xp)],["CASES SOLVED",state.solved],["STREAK",state.streak+" days"]].map(s =>
      '<div class="card stat"><div class="k">' + s[0] + '</div><div class="v">' + s[1] + '</div></div>').join("") +
    '</div><div class="layout"><section class="card section"><div class="section-head"><h2>🎯 Missions</h2><span class="muted">Earn XP</span></div>' +
    missions.map((m,i) => '<div class="mission"><div><span class="tag">' + m[1] + '</span><h3>' + m[0] + '</h3><div class="muted">' + m[2] + '</div></div>' + navButton(i===0 ? "Open" : "Preview","missions",i===0) + '</div>').join("") +
    '</section><section class="card section"><div class="section-head"><h2>🤖 Gemini</h2><span class="tag">API</span></div><p class="muted">Tutor and explain your authorized lab work through the backend.</p>' + navButton("Open Gemini Tutor","ai",true) + '</section></div>';
}
function learn() {
  return '<div class="layout"><section class="card section"><div class="section-head"><div><h2>🎓 Learn</h2><div class="muted">Real progress only — no seeded scores.</div></div><span class="tag">' + courses.length + ' tracks</span></div>' +
    courses.map((c,i) => {
      const p = coursePct(i);
      return '<div class="mission"><div><div style="font-size:24px">' + c[0] + '</div><span class="tag">' + c[3] + '</span><h3>' +
      String(i+1).padStart(2,"0") + ' • ' + c[1] + '</h3><div class="muted">' + c[2] + ' • Progress ' + p + '%</div><div class="progress" style="margin-top:9px"><i style="width:' + p + '%"></i></div></div><button class="btn" data-course="' + i + '">Open</button></div>';
    }).join("") +
    '</section><section class="card section"><div class="section-head"><h2>🧠 How NEXUS tracks you</h2></div><div class="notice">Nothing is pre-completed. Finish modules or solve missions to change the numbers.</div>' +
    '<div class="mission"><div><h3>Lesson</h3><div class="muted">Learn the concept.</div></div></div>' +
    '<div class="mission"><div><h3>Interactive module</h3><div class="muted">Click Complete to advance your course.</div></div></div>' +
    '<div class="mission"><div><h3>Real lab</h3><div class="muted">Practice against local vulnerable applications.</div></div></div></section></div>';
}
function courseView(i) {
  const c = courses[i] || courses[0];
  const p = coursePct(i);
  const completed = Math.floor(p / 20);
  return '<section class="card challenge"><div class="eyebrow">LEARN / ' + c[1].toUpperCase() + '</div><h1>' + c[1] + '</h1><p class="sub">' + c[3] +
    '</p><div class="notice">Progress: <b>' + p + '%</b> • Complete each module to earn 100 XP and 20% progress.</div>' +
    '<div class="layout"><div><h2 style="margin-top:20px">Module roadmap</h2>' +
    ["Core concepts","Interactive examples","Knowledge check","Lab preparation","Hands-on practice"].map((name,n) =>
      '<div class="mission"><div><h3>' + String(n+1).padStart(2,"0") + ' • ' + name + '</h3><div class="muted">' +
      (n < completed ? "Completed" : "Not completed yet") + '</div></div><button class="btn" data-module="' + n + '">' +
      (n < completed ? "Done" : "Complete +20%") + '</button></div>').join("") +
    '</div><div><div class="card section"><h2>🤖 Gemini tutor</h2><p class="muted">Ask about this track.</p>' + navButton("Ask Gemini","ai",true) +
    '</div><div class="card section" style="margin-top:12px"><h2>🧪 Practice</h2><p class="muted">Launch a real local vulnerable lab.</p>' + navButton("Open Real Labs","labs") + '</div></div></div></section>';
}
function missionsPage() {
  return '<div class="layout"><section class="card section"><div class="section-head"><div><h2>🎯 Mission Control</h2><div class="muted">Fictional, sandboxed challenges.</div></div></div>' +
    missions.map((m,i) => '<div class="mission"><div><span class="tag">' + m[1] + '</span><h3>' + m[0] + '</h3><div class="muted">' + m[2] + '</div></div><button class="btn ' +
    (i===0 ? "primary" : "") + '" data-challenge="' + i + '">' + (i===0 ? "Launch" : "Preview") + '</button></div>').join("") +
    '</section><section class="card section"><h2>🧠 Case file</h2><p class="muted">Complete the first case to earn XP.</p><div class="notice">Your case count is currently ' + state.solved + '.</div></section></div>';
}
function labsPage() {
  return '<div class="layout"><section class="card section"><div class="section-head"><div><h2>🧪 Real Labs</h2><div class="muted">Actual deliberately vulnerable apps running locally.</div></div><span class="tag">DOCKER</span></div>' +
    '<div class="notice">Start them with <code>docker compose up -d</code> from the repo.</div>' +
    labs.map(l => '<div class="mission"><div><div style="font-size:24px">' + l[0] + '</div><span class="tag">' + l[2] + '</span><h3>' + l[1] + '</h3><div class="muted">' + l[3] + '</div></div><a class="btn primary" href="' + l[3] + '" target="_blank" rel="noopener">Launch ↗</a></div>').join("") +
    '</section><section class="card section"><div class="section-head"><h2>🌍 External platforms</h2><span class="muted">Provider-owned</span></div>' +
    external.map(x => '<div class="mission"><div><h3>' + x[0] + '</h3><div class="muted">External link — NEXUS does not mirror proprietary content.</div></div><a class="btn" href="' + x[1] + '" target="_blank" rel="noopener">Visit ↗</a></div>').join("") +
    '</section></div>';
}
function terminal() {
  return '<section class="card section"><div class="section-head"><div><h2>💻 NEXUS Terminal</h2><div class="muted">Simulated filesystem — your machine is untouched.</div></div></div>' +
    '<div id="console" class="console">$ whoami\nnexus\n$ ls\nlogs  evidence  tools  secrets\n$ _</div>' +
    '<div class="command-row"><input id="cmd" placeholder="Try: help, ls, cat logs/access.log"><button class="btn primary" id="run">Run</button></div></section>';
}
function toolsPage() {
  return '<section class="card section"><div class="section-head"><div><h2>🧰 Toolkit</h2><div class="muted">Safe local analysis utilities.</div></div></div><div class="tool-grid">' +
    tools.map(t => '<div class="tool" data-tool="' + t[1] + '"><div style="font-size:26px">' + t[0] + '</div><strong>' + t[1] + '</strong><span class="muted">Launch</span></div>').join("") +
    '</div><div id="toolOut" style="margin-top:15px"></div></section>';
}
function challenge() {
  return '<section class="card challenge"><div class="eyebrow">MISSION 01 / THE STOLEN SERVER</div><h1>Identify the compromised account.</h1><p class="sub">A fictional ACME server reports failed logins followed by a successful login from 192.168.1.44.</p><div class="layout"><div><div class="console">[03:41:52] LOGIN_FAIL user=ops source=192.168.1.44\n[03:42:03] LOGIN_FAIL user=admin source=192.168.1.44\n[03:42:17] LOGIN_SUCCESS user=admin source=192.168.1.44\n[03:42:19] SESSION_OPEN user=admin\n[03:43:01] backup.zip accessed</div></div><div><p class="muted">Which account was compromised?</p><button class="btn choice" data-answer="ops">ops</button><button class="btn choice" data-answer="admin">admin</button><button class="btn choice" data-answer="backup">backup</button><div id="result" style="margin-top:12px"></div></div></div></section>';
}
function ctf() {
  return '<section class="card challenge"><div class="eyebrow">🚩 DAILY CTF</div><h1>Broken Authentication</h1><p class="sub">Use a mission, collect the flag, and earn XP.</p><div class="notice">No CTF XP is preloaded. Start with 0.</div><div class="actions"><button class="btn primary" data-challenge="0">Start Challenge</button></div></section>';
}
function helpPage() {
  const faqs = [
    ["How do I start the real labs?","Run docker compose up -d from the NEXUS repo, then open Real Labs."],
    ["Why does Gemini say ADD API KEY?","Copy .env.example to .env, add GEMINI_API_KEY, run npm install, then npm start."],
    ["Where is my progress stored?","The MVP stores learner progress in your browser localStorage. It is not a server account yet."],
    ["How do I start fresh?","Use Reset Progress in the left navigation. This removes the local NEXUS progress state."],
    ["Can I use Burp Suite?","Yes. Point Burp at your own NEXUS localhost labs or another system you are explicitly authorized to test."],
    ["Why don't HTB labs appear inside NEXUS?","NEXUS links to provider-owned platforms instead of copying their proprietary rooms, machines, flags, or walkthroughs."]
  ];
  return '<div class="layout"><section class="card section"><div class="section-head"><div><h2>❓ NEXUS Help Center</h2><div class="muted">Everything you need to get the platform running.</div></div><span class="tag">GUIDE</span></div>' +
    '<div class="notice">Start here: <b>Learn</b> for courses, <b>Real Labs</b> for Docker targets, <b>Gemini AI</b> for tutoring, and <b>CTF Arena</b> for missions.</div>' +
    faqs.map((q,i)=>'<div class="mission"><div><h3>'+String(i+1).padStart(2,"0")+' • '+q[0]+'</h3><div class="muted">'+q[1]+'</div></div></div>').join("") +
    '</section><section class="card section"><div class="section-head"><h2>🛠️ Quick setup</h2></div>' +
    '<div class="console">$ npm install\n$ cp .env.example .env\n$ npm start\n\nNEXUS → http://127.0.0.1:8787\n\n$ docker compose up -d\n\nJuice Shop → http://127.0.0.1:3000\nWebGoat → http://127.0.0.1:8081/WebGoat/\nDVWA → http://127.0.0.1:4280</div>' +
    '<div class="actions">'+navButton("Open Learn","learn",true)+navButton("Open Real Labs","labs")+navButton("Open Gemini","ai")+'</div></section></div>';
}
function aiPage() {
  return '<section class="card section"><div class="section-head"><div><h2>🤖 Gemini Tutor</h2><div class="muted">Key remains server-side.</div></div><span id="aiStatus" class="tag">CHECKING</span></div><div class="notice">Ask for explanations, hints, study plans or help understanding output from your authorized local labs.</div><div id="chat" class="console" style="min-height:260px;margin-top:14px">NEXUS AI ready.\n</div><div class="command-row"><input id="aiInput" placeholder="Ask Gemini about your lesson or lab..."><button class="btn primary" id="aiRun">Send</button></div></section>';
}
function page() {
  switch(state.page) {
    case "learn": return learn();
    case "course": return courseView(state.course);
    case "missions": return missionsPage();
    case "labs": return labsPage();
    case "terminal": return terminal();
    case "tools": return toolsPage();
    case "ctf": return ctf();
    case "challenge": return challenge();
    case "ai": return aiPage();
    case "help": return helpPage();
    default: return dashboard();
  }
}
async function aiSend() {
  const input=document.getElementById("aiInput");
  const chat=document.getElementById("chat");
  const msg=input.value.trim();
  if(!msg)return;
  chat.textContent += "\nYou: "+msg+"\nGemini: thinking...";
  input.value="";
  try {
    const r=await fetch("/api/ai/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
      message:msg,
      context:"NEXUS cybersecurity learning platform. User is working in authorized local training labs."
    })});
    const data=await r.json();
    chat.textContent=chat.textContent.replace(/Gemini: thinking\.\.\.$/,"Gemini: "+(data.text||data.error||"No response."));
  } catch {
    chat.textContent=chat.textContent.replace(/Gemini: thinking\.\.\.$/,"Gemini: Backend unavailable. Start NEXUS with npm start.");
  }
}
function bind() {
  document.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>{state.page=b.dataset.page;render()});
  document.getElementById("reset")?.addEventListener("click",resetProgress);
  document.querySelectorAll("[data-course]").forEach(b=>b.onclick=()=>{state.course=Number(b.dataset.course);state.page="course";render()});
  document.querySelectorAll("[data-module]").forEach(b=>b.onclick=()=>{
    const module=Number(b.dataset.module), idx=Number(state.course||0), current=coursePct(idx), needed=Math.floor(current/20);
    if(module===needed && current<100){state.courses[idx]=Math.min(100,current+20);state.xp+=100;save();render()}
  });
  document.querySelectorAll("[data-challenge]").forEach(b=>b.onclick=()=>{state.page="challenge";render()});
  document.querySelectorAll("[data-tool]").forEach(b=>b.onclick=()=>{state.page="tools";render();document.getElementById("toolOut").innerHTML='<div class="notice">Selected: <b>'+b.dataset.tool+'</b>. Ready for an isolated analysis engine.</div>'});
  if(state.page==="challenge")document.querySelectorAll("[data-answer]").forEach(b=>b.onclick=()=>{
    const r=document.getElementById("result");
    if(b.dataset.answer==="admin"){
      r.innerHTML='<div class="notice" style="border-color:var(--green)">✅ Correct — admin authenticated. +750 XP.</div>';
      if(!state.done){state.done=true;state.xp+=750;state.solved++;state.streak=Math.max(1,state.streak);save();setTimeout(render,650)}
    } else {
      r.innerHTML='<div class="notice" style="border-color:var(--red)">❌ Follow the LOGIN_SUCCESS event.</div>';
    }
  });
  if(state.page==="terminal"){
    const run=()=>{
      const i=document.getElementById("cmd"),c=document.getElementById("console"),cmd=i.value.trim();
      const out={
        help:"Commands: help, ls, cat logs/access.log, cat evidence/brief.txt, clear",
        ls:"logs  evidence  tools  secrets",
        "cat logs/access.log":"03:41:52 FAIL ops\n03:42:03 FAIL admin\n03:42:17 SUCCESS admin\n03:43:01 backup.zip accessed",
        "cat evidence/brief.txt":"ACME breach simulation. Correlate login activity with file access.",
        clear:""
      }[cmd] ?? "command not found";
      c.textContent=cmd==="clear"?"":c.textContent+"\n$ "+cmd+"\n"+out+"\n$ _";i.value="";i.focus();
    };
    document.getElementById("run").onclick=run;
    document.getElementById("cmd").onkeydown=e=>{if(e.key==="Enter")run()};
  }
  if(state.page==="ai"){
    fetch("/api/health").then(r=>r.json()).then(x=>{document.getElementById("aiStatus").textContent=x.geminiConfigured?"GEMINI ONLINE":"ADD API KEY"}).catch(()=>{document.getElementById("aiStatus").textContent="BACKEND OFFLINE"});
    document.getElementById("aiRun").onclick=aiSend;
    document.getElementById("aiInput").onkeydown=e=>{if(e.key==="Enter")aiSend()};
  }
}
function render(){document.getElementById("app").innerHTML=shell();bind()}
render();
