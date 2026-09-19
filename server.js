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

app.get(/.*/,_req=>res.sendFile(path.join(root,"index.html")));

app.listen(port,()=>console.log("NEXUS running at http://127.0.0.1:"+port));
