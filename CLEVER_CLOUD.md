# Clever Cloud deployment

## Setup

### Clever Cloud interface

Create 1 Docker application with the `XS` plan and a dedicated build instance `XL`.

And 1 PostgreSQL database (version 15+) bound to the app.

Set these options:
* Zero downtime deployment
* Cancel ongoing deployment on new push
* Force HTTPS

### Environment variables

* `CC_CACHE_DEPENDENCIES`: `true`
* `CC_CUSTOM_BUILD_TOOL`: `DATABASE_URL="" bash -c 'yarn install && yarn run build --filter=@calcom/web'`
* `CC_NODE_BUILD_TOOL`: `custom`
* `CC_PRE_RUN_HOOK`: `yarn run db-deploy`
* `DATABASE_URL`: [GENERATED] _(provided by the interface, add `?sslmode=prefer` as query parameter)_
* `NEXTAUTH_URL`: `https://${YOUR_DOMAIN}`
* `NEXTAUTH_SECRET`: [SECRET] _(`openssl rand -base64 32`)_
* `CALENDSO_ENCRYPTION_KEY`: [SECRET] _(`openssl rand -hex 16`)_
* `NEXT_PUBLIC_WEBAPP_URL`: `https://${YOUR_DOMAIN}`
* `NEXT_PUBLIC_APP_NAME`: `RDV Incubateur ADEME`
* `NEXT_PUBLIC_COMPANY_NAME`: `Incubateur ADEME`
* `NEXT_PUBLIC_SENDER_ID`: `Incubateur ADEME`
* `NEXT_PUBLIC_SUPPORT_MAIL_ADDRESS`: `support@incubateur.ademe.fr`
* `NEXT_PUBLIC_DISABLE_SIGNUP`: `true`
* `NEXT_PUBLIC_LICENSE_CONSENT`: `agree`
* `CALCOM_TELEMETRY_DISABLED`: `1`
* `NODE_ENV`: `production`
* `EMAIL_FROM`: `RDV Incubateur ADEME <noreply@incubateur.ademe.fr>`
* `EMAIL_FROM_NAME`: `RDV Incubateur ADEME`
* `EMAIL_SERVER_HOST`: [SECRET]
* `EMAIL_SERVER_PORT`: [SECRET]
* `EMAIL_SERVER_USER`: [SECRET]
* `EMAIL_SERVER_PASSWORD`: [SECRET]

### GitHub Actions secrets

* `CLEVER_APP_ID_PRODUCTION`: [GENERATED] _(format `app_{uuid}`)_
* `CLEVER_TOKEN`: [GENERATED] _(from `clever login`)_
* `CLEVER_SECRET`: [GENERATED] _(from `clever login`)_

## Deployment

Push to the `deploy-clever-cloud` branch triggers the GitHub Action which pushes the `deploy` branch code to Clever Cloud.

## Upgrading

1. Rebase `deploy` on the new upstream tag
2. Push `deploy` (triggers Docker image build for Coolify)
3. Push to `deploy-clever-cloud` (triggers CC deployment)
