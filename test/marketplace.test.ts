import assert from "node:assert/strict";
import { campaignSchema } from "../src/marketplace.js";

const parsed = campaignSchema.safeParse({ campaignId: "c-1", seller: { id: "s-1", displayName: "Market" }, buyer: { phone: "+15551234567", name: "Rina" }, order: { id: "o-1", totalCents: 1200 }, update: "Packed" });
assert.equal(parsed.success, true);
assert.equal(campaignSchema.safeParse({ campaignId: "", seller: { id: "s", displayName: "Market" }, buyer: { phone: "+1", name: "Rina" }, order: { id: "o", totalCents: 1 }, update: "Packed" }).success, false);
console.log("campaign boundary checks passed");
