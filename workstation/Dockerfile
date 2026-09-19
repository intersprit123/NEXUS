FROM kalilinux/kali-rolling:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    bash \
    ca-certificates \
    curl \
    dnsutils \
    git \
    iproute2 \
    jq \
    netcat-openbsd \
    nmap \
    python3 \
    python3-pip \
    unzip \
    vim-tiny \
    wget \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
CMD ["sleep","infinity"]
