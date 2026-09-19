# NEXUS Deployment

## Render

NEXUS is an Express app with a Gemini API backend. Render supports Express web services and Git-based deployment. The repository contains a Render Blueprint in render.yaml.

### Deploy

1. Connect the NEXUS GitHub repository to Render.
2. Create the web service from render.yaml.
3. Add GEMINI_API_KEY as a secret in the Render dashboard.
4. Deploy and open the generated onrender.com URL.
5. Verify /api/health.

NEXUS listens on 0.0.0.0 and uses the PORT environment variable for cloud hosting.

### Gemini

Set:
- GEMINI_API_KEY — secret
- GEMINI_MODEL — optional; defaults to gemini-2.5-flash

Do not commit the key.

### Real labs

The deliberately vulnerable training targets remain local:
- Juice Shop: localhost:3011
- WebGoat: localhost:8081
- WebWolf: localhost:9091
- DVWA: localhost:4280

Do not expose these vulnerable services directly to the public internet. A future hosted-lab system should use authentication, per-user isolation, network segmentation, rate/resource limits, logging, and teardown.

The included Dockerfile deploys the NEXUS app only, not the vulnerable lab stack.
