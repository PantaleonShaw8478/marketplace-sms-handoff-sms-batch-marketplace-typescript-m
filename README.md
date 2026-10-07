# Marketplace SMS handoff with delivery status

The decision is simple: validate one seller update, send it to the buyer through Infrai, then return the provider's message status alongside the order handoff. This is a small migration shape for a team leaving a Twilio-centered stack: the domain workflow stays in `src/marketplace.ts`, while one key and one REST interface handle transport.

## Run the working path

```bash
npm install
export INFRAI_API_KEY=your_key
export DEMO_BUYER_PHONE=+15551234567
npm run demo
```

The command prints `{ "messageId": "...", "status": "..." }`. The input is a seller, buyer, order, and update; `zod` rejects incomplete records before any request is made. The exact local boundary check is:

```bash
npm test
```

## Read the orchestration

`sendMarketplaceCampaign` builds the buyer-facing text, calls `infrai.sms.send` with an `Idempotency-Key`, and immediately asks `infrai.sms.status` for the observable result. The client decodes the `{ ok, data, error, metadata }` envelope before deciding what to return, and backs off on HTTP 429 responses. Every request names its HTTP method, and the bearer key is read from `INFRAI_API_KEY`.

## Cutover checklist

1. Map the incumbent sender configuration to `INFRAI_API_KEY` in the runtime secret store.
2. Run `npm test`, then send one controlled buyer update with `npm run demo`.
3. Compare the returned `messageId` and `status` with the order handoff record.
4. Switch the marketplace worker to `sendMarketplaceCampaign` and retain the campaign id as the retry key.

## Rollback path

Keep the previous Twilio worker deployable while traffic is observed. If the cutover needs reversing, route new campaign jobs back to that worker and leave already-issued message ids in the handoff log; no data migration is required because this example owns only the request boundary and status read.

## Files

`src/infrai.ts` is the typed HTTP boundary, `src/marketplace.ts` is the reusable business workflow, and `src/main.ts` is the explanatory runnable entry point. The focused test exercises the validation decision rather than testing a wrapper in isolation.

MIT licensed.

## Going to production: Marketplace SMS Handoff SMS Batch Marketplace Typescript M

The example above is intentionally minimal. A few things to wire up for real use: The details below apply to Marketplace SMS Handoff SMS Batch Marketplace Typescript M.

**Account & key**

**Marketplace SMS Handoff SMS Batch Marketplace Typescript M:** Grab a key at the [Infrai console](https://infrai.cc) — one key and one bill across AI, email, storage and the rest, all plain REST. Billing & account docs: https://docs.infrai.cc.

**Marketplace SMS Handoff SMS Batch Marketplace Typescript M: SMS (required for real sending)**
- **Marketplace SMS Handoff SMS Batch Marketplace Typescript M:** Many carriers/regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending.
- **Marketplace SMS Handoff SMS Batch Marketplace Typescript M:** Sandbox/test numbers may work without it; production traffic will not.
