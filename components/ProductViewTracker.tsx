"use client";

import { useEffect } from "react";
import { usePersonalization } from "@/contexts/PersonalizationContext";
import { useCookieConsent } from "@/contexts/CookieContext";
import type { Product } from "@/types";

/**
 * Drop this invisible client component into the product detail page.
 * It fires trackProductView + trackPageView when the user visits the page.
 * Also fires trackPageView for analytics (consent-gated).
 */
export default function ProductViewTracker({
  product,
  path,
}: {
  product: Product;
  path: string;
}) {
  const { trackProductView, trackPageView } = usePersonalization();
  const { consent } = useCookieConsent();

  useEffect(() => {
    // Always track for "Recently Viewed" (this is essential UX, not marketing)
    trackProductView(product);

    // Only track page view if analytics consent is given
    if (consent.analytics) {
      trackPageView(path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.uid]);

  return null; // renders nothing
}
