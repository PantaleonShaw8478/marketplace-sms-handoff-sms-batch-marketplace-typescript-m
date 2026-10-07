import { z } from "zod";
import { infrai } from "./infrai.js";

export const campaignSchema = z.object({
  campaignId: z.string().min(1),
  seller: z.object({ id: z.string().min(1), displayName: z.string().min(1) }),
  buyer: z.object({ phone: z.string().min(5), name: z.string().min(1) }),
  order: z.object({ id: z.string().min(1), totalCents: z.number().int().nonnegative() }),
  update: z.string().min(1)
});
export type CampaignInput = z.infer<typeof campaignSchema>;
export type MessageResult = { messageId: string; status: string };

export async function sendMarketplaceCampaign(input: CampaignInput): Promise<MessageResult> {
  const body = campaignSchema.parse(input);
  const text = `${body.seller.displayName}: ${body.update} Order ${body.order.id} for ${body.buyer.name}.`;
  const sent = await infrai.sms.send({ to: body.buyer.phone, body: text }, `marketplace-${body.campaignId}`);
  const status = await infrai.sms.status(sent.message_id);
  return { messageId: sent.message_id, status: status.status };
}
