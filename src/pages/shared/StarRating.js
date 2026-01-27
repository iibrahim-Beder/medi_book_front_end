import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa"; 

const StarRating = ({ rating ,style}) => {
  const totalStars = 5;

  return (
    <td style={{borderTop:"none", padding:"0" ,...style }}>
      {[...Array(totalStars)].map((_, index) => {
        return index < rating ? (
          <FaStar key={index} className="text-warning me-1" />
        ) : (
          <FaRegStar key={index} className="text-secondary me-1" />
        );
      })}
    </td>
  );
};

export default StarRating;
