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


## Real security workstation

NEXUS includes an optional Kali Linux workstation container for authorized lab work.

Build and start it:

    ./scripts/workstation.sh

Then enter the real shell:

    docker compose --profile workstation exec nexus-workstation bash

Inside the workstation, the vulnerable training services are reachable by their Docker service names:

    nmap juice-shop
    curl http://juice-shop:3000/
    curl http://webgoat:8080/WebGoat/
    curl http://dvwa/

The workstation is attached to the internal NEXUS lab network. The lab services remain published to localhost on the host for browser/Burp use.

For Burp Suite, run Burp on your Kali host and proxy traffic to the local NEXUS ports:

    Juice Shop: 127.0.0.1:3011
    WebGoat:    127.0.0.1:8081
    WebWolf:    127.0.0.1:9091
    DVWA:       127.0.0.1:4280

The workstation is intended for authorized testing of these training targets, not arbitrary public systems.
