// app/api/revalidate/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Contentstack Deployment Webhook — On-demand ISR Revalidation
//
// SETUP IN CONTENTSTACK:
//   Settings → Webhooks → Create Webhook
//   URL:     https://your-domain.com/api/revalidate
//   Method:  POST
//   Header:  x-webhook-secret  →  <your secret value>
//   Trigger: Entry Published, Entry Unpublished, Entry Deleted
//
// ENVIRONMENT VARIABLES REQUIRED:
//   CONTENTSTACK_WEBHOOK_SECRET=your-secret-here   (add to .env.local + Vercel/Netlify)
//
// This handler clears the Next.js ISR cache for the affected content type,
// so the live site reflects CMS changes within seconds.
// ─────────────────────────────────────────────────────────────────────────────

import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// ── Contentstack Webhook Payload (partial) ────────────────────────────────────
interface CSWebhookPayload {
  event?: string;
  triggered_on?: string;
  data?: {
    entry?: {
      uid?: string;
      title?: string;
      locale?: string;
    };
    content_type?: {
      uid?: string;
      title?: string;
    };
  };
  metadata?: {
    content_type?: {
      uid?: string;
    };
  };
}

// ── Path map: which paths to revalidate per content type ──────────────────────
// Every content type known to NexStore is listed here.
const CONTENT_TYPE_PATHS: Record<string, string[]> = {
  product:       ["/", "/products", "/best-sellers", "/new-arrivals", "/deals", "/search"],
  review:        ["/"],
  banner:        ["/"],
  deal:          ["/", "/deals"],
  category_page: ["/"],
  blog:          ["/blog"],
  author:        ["/authors", "/blog"],
};

// ── POST — main webhook handler ───────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Validate shared secret ─────────────────────────────────────────────────
  const webhookSecret = process.env.CONTENTSTACK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[revalidate] CONTENTSTACK_WEBHOOK_SECRET is not set.");
    return NextResponse.json(
      { error: "Webhook secret not configured on server." },
      { status: 500 }
    );
  }

  // Accept the secret via header OR query-string (for backwards compat)
  const incomingSecret =
    req.headers.get("x-webhook-secret") ??
    req.headers.get("x-contentstack-secret") ??
    new URL(req.url).searchParams.get("secret");

  if (incomingSecret !== webhookSecret) {
    console.warn("[revalidate] Rejected — secret mismatch.");
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  // 2. Parse payload ──────────────────────────────────────────────────────────
  let payload: CSWebhookPayload = {};
  try {
    payload = await req.json();
  } catch {
    // Empty body = Contentstack test ping — still return 200
    console.info("[revalidate] Empty body (test ping).");
    return NextResponse.json({ revalidated: false, message: "Test ping acknowledged." });
  }

  const contentTypeUid =
    payload?.data?.content_type?.uid ??
    payload?.metadata?.content_type?.uid ??
    null;

  const entryUid   = payload?.data?.entry?.uid   ?? null;
  const entryTitle = payload?.data?.entry?.title  ?? "unknown";
  const event      = payload?.event               ?? "unknown";

  console.info(
    `[revalidate] event="${event}" content_type="${contentTypeUid ?? "?"}" ` +
    `entry="${entryTitle}" (${entryUid ?? "?"})`
  );

  // 3. Revalidate paths ───────────────────────────────────────────────────────
  const pathsToRevalidate: string[] =
    contentTypeUid && CONTENT_TYPE_PATHS[contentTypeUid]
      ? CONTENT_TYPE_PATHS[contentTypeUid]
      : ["/"]; // Fallback — at least bust the homepage

  const revalidated: string[] = [];

  for (const path of pathsToRevalidate) {
    try {
      revalidatePath(path);
      revalidated.push(path);
    } catch (err) {
      console.error(`[revalidate] Failed to revalidate "${path}":`, err);
    }
  }

  // Also revalidate the per-product cache tag for product entries
  if (contentTypeUid === "product" && entryUid) {
    try {
      revalidateTag(`product-${entryUid}`);
    } catch {
      // Non-critical — ISR path revalidation above covers it
    }
  }

  // 4. Respond ────────────────────────────────────────────────────────────────
  return NextResponse.json({
    revalidated: true,
    timestamp: new Date().toISOString(),
    event,
    contentType: contentTypeUid,
    entryTitle,
    pathsRevalidated: revalidated,
  });
}

// ── GET — health check ────────────────────────────────────────────────────────

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "NexStore Contentstack revalidation webhook",
    timestamp: new Date().toISOString(),
    supportedContentTypes: Object.keys(CONTENT_TYPE_PATHS),
  });
}
