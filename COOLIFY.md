# Coolify deployment

## Setup

Deploy this branch as a Docker Compose service on Coolify. The image is pre-built on GitHub Actions and pulled from `ghcr.io/incubateur-ademe/cal.com`.

### Prerequisites

- Create a destination (Docker network) for Cal.com on the Coolify server
- Deploy the docker-compose from this branch (`deploy/docker`)

### Database migration

Cal.com runs Prisma migrations at startup via `scripts/start.sh`. On first deploy, the database schema is created automatically.

If migrating from an existing instance, restore the PG dump before the first start:

```bash
scp calcom.dump <server>:/tmp/
docker cp /tmp/calcom.dump <pg_container>:/tmp/
docker exec -it <pg_container> pg_restore --no-owner --clean --if-exists \
  -U calcom -d calcom /tmp/calcom.dump
```

### Environment variables

**Required:**
* `DATABASE_URL`: PostgreSQL connection string (internal Coolify URL)
* `NEXTAUTH_URL`: Public URL of the app (e.g. `https://calendso.incubateur.ademe.fr`)
* `NEXTAUTH_SECRET`: Random secret for NextAuth (`openssl rand -base64 32`)
* `CALENDSO_ENCRYPTION_KEY`: 32-char AES256 key (`openssl rand -hex 16`)
* `NEXT_PUBLIC_WEBAPP_URL`: Same as NEXTAUTH_URL

**Email (Brevo):**
* `EMAIL_FROM`: `RDV Incubateur ADEME <noreply@incubateur.ademe.fr>`
* `EMAIL_FROM_NAME`: `RDV Incubateur ADEME`
* `EMAIL_SERVER_HOST`: `smtp-relay.brevo.com`
* `EMAIL_SERVER_PORT`: `587`
* `EMAIL_SERVER_USER`: Brevo SMTP login
* `EMAIL_SERVER_PASSWORD`: Brevo SMTP key

**Optional (pre-configured with defaults):**
* `NEXT_PUBLIC_APP_NAME`: `RDV Incubateur ADEME`
* `NEXT_PUBLIC_COMPANY_NAME`: `Incubateur ADEME`
* `NEXT_PUBLIC_DISABLE_SIGNUP`: `true`
* `CALCOM_TELEMETRY_DISABLED`: `1`

### Domain & SSL

Configure the domain in the Cal.com service settings on Coolify. Traefik handles Let's Encrypt certificates automatically.

## Upgrading

1. Rebase the `deploy` branch on the new upstream tag
2. Push to trigger the GitHub Actions image build
3. Update the image tag in `docker-compose.yml` on this branch
4. Push to trigger redeployment on Coolify
