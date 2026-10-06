FROM node:20-alpine AS builder
# Set working directory
WORKDIR /app
RUN npm install -g turbo

# Copy monorepo contents
COPY . .

# Prune the workspace for the api package
RUN turbo prune --scope=@codearena/api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:20-alpine AS installer
WORKDIR /app

# First install dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
# Generate Prisma Client
RUN cd packages/database && npx prisma generate
RUN npm run build --workspace=@codearena/api

# Final production image
FROM node:20-alpine AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=installer /app .

USER nestjs
EXPOSE 4000

CMD ["node", "apps/api/dist/main"]
