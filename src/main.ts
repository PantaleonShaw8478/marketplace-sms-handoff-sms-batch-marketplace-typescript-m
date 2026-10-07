import { sendMarketplaceCampaign } from "./marketplace.js";

const phone = process.env.DEMO_BUYER_PHONE;
if (!phone) throw new Error("DEMO_BUYER_PHONE is required");
const result = await sendMarketplaceCampaign({
  campaignId: "seller-update-2026-09-11",
  seller: { id: "seller-17", displayName: "North Market" },
  buyer: { phone, name: "Rina" },
  order: { id: "order-842", totalCents: 4590 },
  update: "Your order is packed and ready for handoff"
});
console.log(JSON.stringify(result));
