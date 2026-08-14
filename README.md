# Pax Autocratica Wiki

Generated static wiki for Pax Autocratica.

## Local development

```bash
npm install
npm run dev
```

The production build is generated from the run artifacts in the parent `run` directory.

## Optional measurement integrations

Set these public build-time variables in Vercel (or `.env.local` for local testing). Leave a variable unset until its platform project is actually created and the ID has been verified.

```text
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=paxautocratica.vip
NEXT_PUBLIC_PLAUSIBLE_SCRIPT=https://plausible.io/js/script.js
NEXT_PUBLIC_CLARITY_ID=XXXXXXXXXX
```

The site emits only the scripts whose variables are present. No account password, OAuth token, payout data, or other secret belongs in the repository or these variables.
