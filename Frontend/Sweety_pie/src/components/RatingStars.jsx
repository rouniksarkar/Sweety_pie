import React from "react";

const RatingStars = ({ rating = 0, count, size = "text-base" }) => {
  const value = Number(rating) || 0;

  return (
    <div className="flex items-center gap-1.5" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      <span className={`tracking-tight text-amber-400 ${size}`} aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index}>{index < Math.round(value) ? "★" : "☆"}</span>
        ))}
      </span>
      <span className="text-sm font-semibold text-slate-700">{value.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-sm text-slate-500">({count} {count === 1 ? "rating" : "ratings"})</span>
      )}
    </div>
  );
};

export default RatingStars;
