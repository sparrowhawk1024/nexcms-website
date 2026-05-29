import type { Review } from "@/types";
import StarRating from "./StarRating";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const date = review.published_date
    ? new Date(review.published_date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="border border-fuchsia-500/20 bg-[#170529]/50 backdrop-blur-md rounded-xl p-5 hover:border-fuchsia-500/40 transition-all">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-[0_0_10px_rgba(217,70,239,0.3)]">
            {review.reviewer_name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-fuchsia-50 font-semibold text-sm truncate">
                {review.reviewer_name}
              </span>
              {review.verified_purchase && (
                <span className="text-[10px] bg-green-500/15 text-green-400 border border-green-500/25 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
                  ✓ Verified Purchase
                </span>
              )}
            </div>
            <StarRating rating={review.rating} showCount={false} size="xs" />
          </div>
        </div>
        {date && (
          <span className="text-fuchsia-400/40 text-xs flex-shrink-0 mt-1">{date}</span>
        )}
      </div>

      {/* Review title */}
      <h4 className="text-white font-semibold text-sm mb-2">{review.title}</h4>

      {/* Review body */}
      {review.review_body && (
        <div
          className="text-fuchsia-200/65 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: review.review_body }}
        />
      )}

      {/* Helpful */}
      {!!review.helpful_count && review.helpful_count > 0 && (
        <div className="mt-4 pt-3 border-t border-fuchsia-500/10 flex items-center gap-3">
          <span className="text-fuchsia-400/40 text-xs">Was this review helpful?</span>
          <button className="text-xs text-fuchsia-300/60 hover:text-cyan-400 transition-colors flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full border border-fuchsia-500/10 hover:border-cyan-400/30">
            👍 Yes ({review.helpful_count})
          </button>
          <button className="text-xs text-fuchsia-300/60 hover:text-fuchsia-300 transition-colors flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full border border-fuchsia-500/10">
            👎 No
          </button>
        </div>
      )}
    </div>
  );
}
