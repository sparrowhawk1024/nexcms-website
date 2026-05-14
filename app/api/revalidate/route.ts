// app/api/revalidate/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// On-demand ISR revalidation endpoint
//
// Set up a Contentstack webhook pointing to:
//   https://your-domain.com/api/revalidate?secret=YOUR_SECRET
//
// In Contentstack: Settings → Webhooks → Create Webhook
//   URL: https://your-domain.com/api/revalidate?secret=<REVALIDATE_SECRET>
//   Triggers: Entry publish / unpublish / delete
//
// This will clear the Next.js cache for the relevant content type so the
// site reflects changes within seconds rather than waiting for revalidate interval.
// ─────────────────────────────────────────────────────────────────────────────

import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  // Guard – must match REVALIDATE_SECRET in your .env.local
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Contentstack webhook payload includes content_type.uid
    const contentType: string = body?.data?.content_type?.uid ?? "";

    // Revalidate the correct paths based on which content type changed
    if (contentType === "blog") {
      revalidatePath("/blog");
      revalidatePath("/");
    } else if (contentType === "product") {
      revalidatePath("/products");
      revalidatePath("/");
    } else if (contentType === "author") {
      revalidatePath("/authors");
    } else {
      // Nuclear option – revalidate everything
      revalidatePath("/", "layout");
    }

    return NextResponse.json({ revalidated: true, contentType });
  } catch {
    return NextResponse.json({ error: "Failed to parse body" }, { status: 400 });
  }
}
