import React from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

const StarRating = ({ rating = 0, style }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <span style={{ display: "inline-flex", ...style }}>
      {[...Array(totalStars)].map((_, index) => {
        if (index < fullStars) {
          return <FaStar key={index} className="text-warning me-1" />;
        }

        if (index === fullStars && hasHalfStar) {
          return <FaStarHalfAlt key={index} className="text-warning me-1" />;
        }

        return <FaRegStar key={index} className="text-secondary me-1" />;
      })}
    </span>
  );
};

export default StarRating;
