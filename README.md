# NEXUS ⚡

NEXUS is an all-in-one interactive cyber-learning platform with learning tracks, real local labs, HTTP testing, missions, CTFs, toolkit modules, and Gemini AI tutoring.

## Run locally

    npm install
    cp .env.example .env
    npm start

Open http://127.0.0.1:8787

## Real labs

    docker compose up -d

Local targets:
- Juice Shop: http://127.0.0.1:3011
- WebGoat: http://127.0.0.1:8081/WebGoat/
- WebWolf: http://127.0.0.1:9091/WebWolf/
- DVWA: http://127.0.0.1:4280

## Cloud deployment

The NEXUS app + Gemini backend can be deployed as a web service. A Render Blueprint is included in render.yaml, and a Dockerfile is included for Docker-capable hosts.

See docs/DEPLOYMENT.md.

Do not expose the deliberately vulnerable lab containers directly to the public internet. Keep the lab runtime isolated until authentication and per-user sandboxing are implemented.

## Third-party platforms

NEXUS links to provider-owned services such as Hack The Box, PortSwigger Web Security Academy, and TryHackMe rather than mirroring proprietary content.

## Security

- Never commit .env.
- Keep GEMINI_API_KEY server-side.
- Add authentication and rate limiting before making write/API actions public.
