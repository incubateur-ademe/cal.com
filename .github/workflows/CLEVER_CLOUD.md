# Clever Cloud deploymentAdd commentMore actions

## Setup

### Clever Cloud interface

Create 1 Node.js applications with the `XS` plan:
* `calcom`

And 1 PostgreSQL databases (version 15) with any plan that you will binding to each app accordingly:
* `calcom`

_(depending on when you created those addonds, don't forget to bind them to the appropriate application)_

Now set for both apps these options:
* Zero downtime deployment
* Enable dedicated build instance: `XL`
* Cancel ongoing deployment on new push
* Force HTTPS

Adjust the domain names as you want, and configure the environment variables as follow:
* `CALENDSO_ENCRYPTION_KEY`: [SECRET] _(Application Key for symmetric encryption and decryption. Must be 32 bytes for AES256 encryption algorithm. `openssl rand -base64 24`)_
* `CC_CACHE_DEPENDENCIES`: `true`
* `CC_PRE_BUILD_HOOK`: `yarn workspace @calcom/prisma db-deploy`
* `CRON_API_KEY`: [SECRET] _(`openssl rand -base64 32`)_
* `DATABASE_URL`: [GENERATED] _(provided by the interface, but you must add as query parameter `sslmode=prefer`)_
* `DATABASE_DIRECT_URL`: [GENERATED] _(Use the same one as `DATABASE_URL`)_
* `EMAIL_FROM`: [SECRET]
* `EMAIL_SERVER_HOST`: [SECRET]
* `EMAIL_SERVER_PASSWORD`: [SECRET]
* `EMAIL_SERVER_PORT`: [SECRET]
* `EMAIL_SERVER_USER`: [SECRET]
* `GOOGLE_API_CREDENTIALS`: [SECRET]
* `NEXT_PUBLIC_LICENSE_CONSENT`: `agree`
* `NEXT_PUBLIC_WEBAPP_URL`: `https://${YOUR_DOMAIN}`
* `NEXT_PUBLIC_WEBSITE_URL`: `https://${YOUR_DOMAIN}`
* `NEXT_TELEMETRY_DISABLED`: `1`
* `NEXTAUTH_SECRET`: [SECRET] _(`openssl rand -base64 32`)_
* `NEXTAUTH_URL`: `https://${YOUR_DOMAIN}`
* `NODE_ENV`: `production`
* `NPM_CONFIG_PRODUCTION`: `true`

### GitHub interface

#### GitHub Actions

Configure the following repository secrets (not environment ones):

- `CLEVER_APP_ID`: [GENERATED] _(format `app_{uuid}`, can be retrieved into the Clever Cloud interface)_
- `CLEVER_TOKEN`: [GENERATED] _(can be retrieved from `clever login`, but be warned it gives wide access)_
- `CLEVER_SECRET`: [GENERATED] _(can be retrieved from `clever login`, but be warned it gives wide access)_

## Upgrade cal.com version

1. Synchronize your fork with the original repository
2. Search for the specific commit representing the wanted version
3. Rebase your `deploy` branches to it while making sure to not take third-party files into `.github`
4. Force-push the branch

or
```sh
# Ensure you are on the deploy branch and have upstream remote set
git fetch upstream
git pull upstream <tag> # Replace <tag> with the desired version tag, e.g., v1.27.0. Branch can be used instead of tag but it is not recommended.
# Resolve any conflicts that arise, like deleted files on our side in .github/workflows
git add --all
git commit -sm "chore(update): <tag>" # Replace <tag> with chosen tag
git push origin deploy
```
