import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const app=express();
const port=Number(process.env.PORT||8787);
const model=process.env.GEMINI_MODEL||"gemini-2.5-flash";
const root=path.dirname(fileURLToPath(import.meta.url));

app.use(express.json({limit:"1mb"}));
const TEST_TARGETS = [
  {id:"juice-shop",name:"OWASP Juice Shop",base:"http://127.0.0.1:3011"},
  {id:"webgoat",name:"OWASP WebGoat",base:"http://127.0.0.1:8081"},
  {id:"webwolf",name:"OWASP WebWolf",base:"http://127.0.0.1:9091"},
  {id:"dvwa",name:"DVWA",base:"http://127.0.0.1:4280"}
];
const ALLOWED_METHODS = new Set(["GET","HEAD","POST","PUT","PATCH","DELETE","OPTIONS"]);
function isAllowedLabUrl(raw) {
  let u;
  try { u = new URL(raw); } catch { return false; }
  if (u.protocol !== "http:") return false;
  if (!["127.0.0.1","localhost"].includes(u.hostname)) return false;
  return [3011,8081,9091,4280].includes(Number(u.port));
}
function cleanHeaders(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const out = {};
  for (const [key,value] of Object.entries(input).slice(0,30)) {
    if (!/^[A-Za-z0-9!#$%&'*+.^_\x60|~-]+$/.test(key)) continue;
    if (["host","connection","content-length"].includes(key.toLowerCase())) continue;
    if (typeof value !== "string" || value.length > 4096) continue;
    out[key] = value;
  }
  return out;
}


app.use(express.static(root));

function aiClient(){
  if(!process.env.GEMINI_API_KEY) return null;
  return new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});
}

app.get("/api/health",(_req,res)=>res.json({
  ok:true,
  geminiConfigured:Boolean(process.env.GEMINI_API_KEY),
  model
}));

app.post("/api/ai/chat",async(req,res)=>{
  const client=aiClient();
  if(!client) return res.status(503).json({
    error:"Gemini is not configured. Copy .env.example to .env and add GEMINI_API_KEY."
  });
  const message=String(req.body?.message||"").trim();
  const context=String(req.body?.context||"").slice(0,12000);
  if(!message) return res.status(400).json({error:"message is required"});

  const system=[
    "You are NEXUS AI Tutor, a cybersecurity learning assistant.",
    "Teach defensive and authorized security concepts clearly.",
    "When a user is working inside NEXUS labs, assume the target is a deliberately vulnerable local training environment.",
    "Prefer explanation, hints, methodology, and safe lab guidance over instructions for attacking unrelated real systems.",
    "Do not invent lab output. Ask for the relevant output when necessary."
  ].join(" ");

  try{
    const response=await client.models.generateContent({
      model,
      contents:context ? system+"\n\nLab context:\n"+context+"\n\nUser:\n"+message : system+"\n\nUser:\n"+message
    });
    res.json({text:response.text||"No response returned."});
  }catch(error){
    console.error(error);
    res.status(502).json({error:"Gemini request failed. Check the API key, model name, and network access."});
  }
});

app.get("/api/test/targets",(_req,res)=>res.json({targets:TEST_TARGETS}));

app.post("/api/test/request",async(req,res)=>{
  const method=String(req.body?.method||"GET").toUpperCase();
  const url=String(req.body?.url||"").trim();
  const body=req.body?.body==null ? "" : String(req.body.body);
  if(!ALLOWED_METHODS.has(method)) return res.status(400).json({error:"Unsupported HTTP method."});
  if(!isAllowedLabUrl(url)) return res.status(403).json({error:"Target must be one of the NEXUS localhost lab ports: 3011, 8081, 9091, 4280."});
  if(body.length>100000) return res.status(413).json({error:"Request body too large (100 KB max)."});
  const headers=cleanHeaders(req.body?.headers);
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),10000);
  const started=Date.now();
  try{
    const response=await fetch(url,{method,headers,body:["GET","HEAD"].includes(method)?undefined:body,redirect:"manual",signal:controller.signal});
    const text=await response.text();
    const outHeaders={};
    for(const [key,value] of response.headers.entries()) outHeaders[key]=value;
    res.json({ok:response.ok,status:response.status,statusText:response.statusText,durationMs:Date.now()-started,url,headers:outHeaders,body:text.slice(0,500000)});
  }catch(error){
    res.status(502).json({error:error.name==="AbortError"?"Request timed out after 10 seconds.":"Request failed: "+error.message});
  }finally{
    clearTimeout(timeout);
  }
});

app.get(/.*/,_req=>res.sendFile(path.join(root,"index.html")));

app.listen(port,"0.0.0.0",()=>console.log("NEXUS running on port "+port));
