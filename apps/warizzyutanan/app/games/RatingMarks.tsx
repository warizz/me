export function ratingColor(rating: unknown) {
  if (rating === 2 || rating === "2") return "#d4a017"; // golden
  if (rating === 1 || rating === "1") return "#16a34a"; // green
  return "#6b7280"; // gray (0, -1, unrated)
}

export function RatingMarks({ rating }: { rating: unknown }) {
  const filled =
    rating === 2 || rating === "2" ? 2 : rating === 1 || rating === "1" ? 1 : 0;
  const isGolden = filled === 2;
  const color = ratingColor(rating);
  return (
    <span className="inline-flex gap-[3px] align-middle">
      {[1, 2].map((n) => (
        <span
          key={n}
          style={{
            width: 11,
            height: 11,
            borderRadius: 2,
            border: `1.5px solid ${color}`,
            background:
              n <= filled
                ? isGolden
                  ? "linear-gradient(135deg, #b8860b, #ffd700, #b8860b)"
                  : color
                : "transparent",
            backgroundSize: isGolden ? "200% 200%" : undefined,
            animation:
              n <= filled && isGolden
                ? "rating-gold-drift 2s ease-in-out infinite"
                : undefined,
            display: "inline-block",
          }}
        />
      ))}
    </span>
  );
}
