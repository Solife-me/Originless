FROM node:22-bookworm-slim

ENV STORAGE_MAX=200GB
ENV FILE_LIMIT=5GB
ENV REMOTE_FILE_LIMIT=2GB
ENV IPFS_PATH=/data
ENV NODE_ENV=production

# Install dependencies (curl, tar, etc.)
RUN apt-get update && \
  apt-get install -y curl tar && \
  rm -rf /var/lib/apt/lists/*

# Install IPFS (Kubo)
RUN curl -fsSL "https://dist.ipfs.tech/kubo/v0.40.1/kubo_v0.40.1_linux-$(dpkg --print-architecture).tar.gz" | \
  tar -xz -C /tmp && \
  mv /tmp/kubo/ipfs /usr/local/bin/ipfs && \
  rm -rf /tmp/kubo

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install --omit=dev

COPY . .

# Create temp uploads directory and a fallback data directory for local runs
RUN chmod +x /app/docker_entrypoint.sh /app/healthcheck.sh && \
  mkdir -p /tmp/originless /data && \
  chown -R node:node /app /tmp/originless

EXPOSE 3232 4001/tcp 4001/udp

# Declare volume for IPFS data persistence
VOLUME ["/data"]

# Stop signal and grace period for clean shutdown
STOPSIGNAL SIGTERM
LABEL com.docker.compose.stop-grace-period="15s"

# Health check - wait 7m for IPFS to connect to peers
HEALTHCHECK --interval=30s --timeout=10s --start-period=7m --retries=5 \
  CMD curl -f http://localhost:3232/health || exit 1

ENTRYPOINT ["/app/docker_entrypoint.sh"]
