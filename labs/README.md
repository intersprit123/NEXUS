# NEXUS Real Labs

NEXUS uses a **real-lab adapter** model.

## Start all local labs

```bash
docker compose up -d
```

## Local targets

- Juice Shop: http://127.0.0.1:3000
- WebGoat: http://127.0.0.1:8081/WebGoat/
- WebWolf: http://127.0.0.1:9091/WebWolf/
- DVWA: http://127.0.0.1:4280

These services are deliberately vulnerable training applications. Keep them bound to localhost unless you intentionally understand and configure isolation/networking.

## Why HTB is not copied into the repository

NEXUS does not mirror or redistribute Hack The Box rooms, machines, flags, walkthroughs, or other platform content. Instead, the registry contains an external link so users can launch HTB from its own platform/account.

The same pattern is used for other third-party platforms. This keeps the repository clean and respects upstream ownership and licensing.

## Future API adapter

The registry is deliberately API-shaped so a backend can later expose:

`GET /api/labs`
`GET /api/labs/:id`
`POST /api/labs/:id/start`
`POST /api/labs/:id/stop`
`GET /api/progress`
`POST /api/flags/verify`

No provider credentials are stored in the frontend repository.
