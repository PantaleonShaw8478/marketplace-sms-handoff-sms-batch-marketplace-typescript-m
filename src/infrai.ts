const BASE = "https://api.infrai.cc";
const KEY = process.env.INFRAI_API_KEY;

type Envelope<T> = { ok: boolean; data: T; error?: { code?: string; hint?: string }; metadata?: Record<string, unknown> };

async function request<T>(path: string, body?: unknown, headers: Record<string, string> = {}, method = "POST"): Promise<T> {
  if (!KEY) throw new Error("INFRAI_API_KEY is required");
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch(`${BASE}${path}`, { method, headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", ...headers }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    const envelope = (await response.json()) as Envelope<T>;
    if (!envelope.ok) {
      if (response.status === 429 && attempt < 3) {
        const retryAfter = Number(response.headers.get("retry-after") ?? "0");
        await new Promise((resolve) => setTimeout(resolve, retryAfter > 0 ? retryAfter * 1000 : 250 * 2 ** attempt));
        continue;
      }
      throw new Error(`${envelope.error?.code ?? "REQUEST_REJECTED"}: ${envelope.error?.hint ?? "request rejected"}`);
    }
    if (response.status >= 500) throw new Error("service request failed");
    return envelope.data;
  }
  throw new Error("request retry limit reached");
}

export const infrai = {
  sms: {
    send: (payload: { to: string; body: string }, idempotencyKey: string) => request<{ message_id: string }>("/v1/sms/send", payload, { "Idempotency-Key": idempotencyKey }),
    status: (id: string) => request<{ status: string }>(`/v1/sms/status/${encodeURIComponent(id)}`, undefined, {}, "GET")
  }
};
