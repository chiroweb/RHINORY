# Security policy

## Reporting a vulnerability

Please do not open a public issue for a suspected security problem. Report it
privately through GitHub Security Advisories:

<https://github.com/chiroweb/RHINORY/security/advisories/new>

Include the affected URL or file, reproduction steps, impact, and any safe
mitigation you have identified.

## Secret handling

- Never commit `.env` files, database URLs, API keys, cookies, or uploaded credentials.
- Store runtime secrets only in Vercel Environment Variables or the relevant provider's secret store.
- Rotate any credential that has appeared in chat, screenshots, logs, or a public repository.
- Keep production and preview database credentials separate when the preview environment is connected.
