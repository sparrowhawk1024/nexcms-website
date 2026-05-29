interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: "xs" | "sm" | "md" | "lg";
  showCount?: boolean;
  showNumeric?: boolean;
}

export default function StarRating({
  rating,
  reviewCount,
  size = "sm",
  showCount = true,
  showNumeric = false,
}: StarRatingProps) {
  const clampedRating = Math.max(0, Math.min(5, rating));
  const fullStars = Math.floor(clampedRating);
  const hasHalf = clampedRating % 1 >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  const sizeMap = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };
  const textSizeMap = {
    xs: "text-[10px]",
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const starClass = sizeMap[size];
  const textClass = textSizeMap[size];

  return (
    <div className="flex items-center gap-1.5">
      <div className={`flex gap-px ${starClass}`}>
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={`f-${i}`} className="star-filled">★</span>
        ))}
        {hasHalf && (
          <span className="relative inline-block">
            <span className="star-empty">★</span>
            <span
              className="star-filled absolute inset-0 overflow-hidden"
              style={{ width: "55%" }}
            >
              ★
            </span>
          </span>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span key={`e-${i}`} className="star-empty">★</span>
        ))}
      </div>

      {showNumeric && (
        <span className={`text-amber-400 font-bold ${textClass}`}>
          {clampedRating.toFixed(1)}
        </span>
      )}

      {showCount && reviewCount !== undefined && (
        <span className={`text-fuchsia-300/60 hover:text-fuchsia-200 cursor-pointer transition-colors ${textClass}`}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}
