@AGENTS.md

## Stripe

The Stripe API version is pinned in `src/lib/stripe.ts` and every request sends it.
Do not remove the pin. This account's rolling default is `2026-05-27.dahlia`, in which
creating a promotion code takes `promotion[type]=coupon` + `promotion[coupon]=<id>`,
NOT the older flat `coupon=<id>`. That change was found by calling the live API, so if
you bump the version, re-verify the promotion code shape before shipping.

We deliberately do not use the Stripe SDK. Running `npm install` through the device
bridge installs Linux binaries that break the local Mac build (see lightningcss below),
so checkout talks to `api.stripe.com` with plain `fetch`.

## Pricing

`src/lib/pricing.ts` is the only place amounts live. The browser sends catalog ids and
the server prices them, so a tampered request can never change a total. Never accept an
amount from the client.

## Verifying changes

Use `npx tsc --noEmit` and `npm run lint`. Do not run `npm install`, `npm run build` or
`npm run dev` through the device bridge: it executes in a Linux VM and fetches the Linux
lightningcss binary, which breaks Tracy's real Mac build. She runs those herself.
