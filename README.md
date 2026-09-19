# NEXUS ⚡

NEXUS is an all-in-one interactive cyber-learning platform.

## Current MVP

- Cyber command-center dashboard
- Learn hub with 8 learning tracks
- Interactive missions and CTF entry point
- Safe simulated terminal
- Real local vulnerable labs
- Toolkit interface
- Gemini Tutor API backend
- XP, levels, streaks and skill progress

## Run the web app

For the current static UI only:

    python3 -m http.server 8088

For the Gemini-backed app:

    npm install
    cp .env.example .env

Edit .env and add your Gemini API key:

    GEMINI_API_KEY=your_key_here
    GEMINI_MODEL=gemini-2.5-flash
    PORT=8787

Then:

    npm start

Open http://127.0.0.1:8787

The frontend calls /api/ai/chat; the API key stays server-side and is never stored in the browser bundle.

## Real labs

Start the local deliberately vulnerable training applications:

    docker compose up -d

Then open Real Labs in NEXUS.

- Juice Shop: http://127.0.0.1:3000
- WebGoat: http://127.0.0.1:8081/WebGoat/
- WebWolf: http://127.0.0.1:9091/WebWolf/
- DVWA: http://127.0.0.1:4280

These targets are intended for authorized security training. Keep them bound to localhost unless you intentionally configure an isolated environment.

## Third-party platforms

NEXUS links to provider-owned platforms such as Hack The Box, PortSwigger Web Security Academy, and TryHackMe. It does not bulk-copy or redistribute their proprietary rooms, machines, flags, walkthroughs, or course files.

Burp Suite can be used against NEXUS's own local labs or systems you are authorized to test. NEXUS does not include a scraper for bulk-downloading third-party platform content.

## API contract

The OpenAPI contract is in api/openapi.yaml.

Current planned endpoints:

- GET /api/health
- POST /api/ai/chat
- GET /api/labs
- GET /api/labs/:id
- POST /api/labs/:id/start
- POST /api/labs/:id/stop
- GET /api/progress
- POST /api/flags/verify

See docs/ARCHITECTURE.md for the planned backend layout.

## Security notes

- Never commit .env.
- Never put a Gemini API key in app.js.
- Add authentication, rate limiting, per-user lab isolation, resource limits, network segmentation, audit logs, and automatic teardown before hosting lab runtimes publicly.
