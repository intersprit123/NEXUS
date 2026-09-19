# NEXUS Architecture

NEXUS is split into four layers:

1. Web UI — current dependency-free dashboard.
2. Lab registry — labs/registry.json describes local and external targets.
3. Lab runtime — Docker Compose starts deliberately vulnerable training apps locally.
4. API — api/openapi.yaml defines the future backend contract.

## Provider integrations

Commercial and third-party platforms such as Hack The Box, PortSwigger Web Security Academy, and TryHackMe are represented as external providers. Their content is not mirrored into NEXUS.

## Safety boundary

Local vulnerable targets bind to 127.0.0.1 by default. A future hosted deployment should add authentication, per-user isolation, resource limits, network segmentation, audit logs, and automatic lab teardown before exposing runtimes remotely.
