# Deploying BEATEST on Vercel

This project is ready to deploy as a Vite frontend with a captured Express server. Import the extracted project folder into a new Vercel project or connect it to a Git repository. Vercel detects the included pnpm lockfile automatically; keep the Vercel **Install Command** unset and use the configured `pnpm run build` build command.

## Required environment variables

Set the following variables for **Production**, **Preview**, and **Development** in Vercel before deploying. The first four are essential for the full commerce and owner dashboard flow.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | MySQL/TiDB connection string for users, orders, products, inventory, and admin data. |
| `JWT_SECRET` | Long, random secret for signing user sessions. |
| `OAUTH_SERVER_URL` | OAuth provider base URL used by the existing Manus authentication flow. |
| `VITE_APP_ID` | OAuth application identifier available to the frontend. |
| `VITE_OAUTH_PORTAL_URL` | OAuth login portal URL used when a user signs in. |
| `OWNER_OPEN_ID` | OAuth open ID that should receive the `admin` role. |
| `BUILT_IN_FORGE_API_URL` | Optional. Enables existing Manus storage proxy and owner-notification integration. |
| `BUILT_IN_FORGE_API_KEY` | Optional. Enables existing Manus storage proxy and owner-notification integration. |

> The product and campaign images now use portable CDN URLs, so the storefront does not require the Manus storage proxy to render images on Vercel. If the optional Forge variables are omitted, customer checkout still saves orders; owner push alerts are skipped rather than blocking an order.

## OAuth callback

After Vercel assigns your domain, register this callback URL in your OAuth provider:

```text
https://YOUR-VERCEL-DOMAIN/api/oauth/callback
```

The current login helper derives the callback origin from the deployed domain. If the OAuth provider does not allow this Vercel callback, sign-in and owner dashboard access will not work until the provider configuration is updated.

## Deployment check

Run these commands locally before importing or pushing the project:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm run build
```

Use `vercel env pull` to create a local `.env` file from your Vercel project if required. Do not commit `.env` files or secret values.

## Notes

The included `server.ts` is a Vercel-recognized Express entrypoint. Vercel automatically selects the supported Node runtime for that entrypoint; no hard-coded runtime version is required. Vercel serves the built `dist/public` frontend output and rewrites client-side routes to `index.html`; API, OAuth, checkout, and admin requests are handled by the Express function through `/api/*`. The function skips filesystem static serving on Vercel because the platform serves the built frontend directly.

## References

- [Vercel: Express on Vercel](https://vercel.com/docs/frameworks/backend/express)
- [Vercel: Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite)
- [Vercel: Node.js Runtime](https://vercel.com/docs/functions/runtimes/node-js)
