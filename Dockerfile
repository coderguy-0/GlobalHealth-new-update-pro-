# syntax=docker/dockerfile:1

# =============================================================================
# GlobalHealth — production container image
#
# Multi-stage so the runtime image carries only the bundled server and the
# built SPA, never the toolchain or the 10MB+ clinical source datasets.
#
#   docker build -t globalhealth .
#   docker run -p 3000:3000 --env-file .env -v gh-data:/app/data globalhealth
#
# The /app/data volume is REQUIRED in production: it holds the account and
# domain state written by the runtime persistence layer. Without a volume that
# state is lost on every container replacement.
# =============================================================================

# ---------- Stage 1: dependencies (cached independently of source) ----------
FROM node:22-alpine AS deps
WORKDIR /app

# Install exactly what the lockfile pins so builds are reproducible.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---------- Stage 2: build the SPA + bundle the server ----------------------
FROM node:22-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
# Vite needs headroom for the large clinical datasets.
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN npm run build

# ---------- Stage 3: minimal runtime --------------------------------------
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
# Persisted, volume-backed runtime state directory.
ENV GH_RUNTIME_DIR=/app/data

# tini reaps zombies and forwards signals, so `docker stop` is graceful and
# the container exits cleanly instead of waiting for the SIGKILL timeout.
RUN apk add --no-cache tini

# Production dependencies only — the esbuild/vite toolchain stays in stage 2.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund \
    && npm cache clean --force

# Built artifacts + the production entrypoint.
COPY --from=build /app/dist ./dist
COPY scripts/start.mjs ./scripts/start.mjs

# Writable state directory owned by the unprivileged runtime user.
RUN mkdir -p /app/data && chown -R node:node /app/data /app/dist

USER node

EXPOSE 3000

# Orchestrators read this; matches the root-level probe the server exposes.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "scripts/start.mjs"]
