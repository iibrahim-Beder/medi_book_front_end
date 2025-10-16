import React from "react";
import { Card, Row, Col, Image, Badge, Button } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import { FaReply } from "react-icons/fa6";
import StarRating from "../pages/shared/StarRating";
import MainSearch from "../pages/shared/MainSearch";

const reviewsData = [
  {
    id: "#RV001",
    serviceType: "Video Call",
    rating: 5,
    review:
      "Dr. Smith was very thorough and took the time to explain everything clearly. The wait time was minimal and the staff was friendly. Highly recommended!",
    reviewDate: "2023-10-15",
    bookingId: "#BK001",
    patientName: "Adrian",
    patientImg: "assets/img/doctors-dashboard/profile-01.jpg",
  },
  {
    id: "#RV002",
    serviceType: "In-Person Visit",
    rating: 4,
    review:
      "Good overall experience. The dentist was professional and the cleaning was done carefully. The only downside was the slightly long waiting time.",
    reviewDate: "2023-09-22",
    bookingId: "#BK002",
    patientName: "Kelly",
    patientImg: "assets/img/doctors-dashboard/profile-02.jpg",
  },
  {
    id: "#RV003",
    serviceType: "Voice Call",
    rating: 5,
    review:
      "Excellent therapy sessions! The therapist was knowledgeable and helped me recover quickly from my injury. The exercises were effective and well-explained.",
    reviewDate: "2023-11-05",
    bookingId: "#BK003",
    patientName: "Samuel",
    patientImg: "assets/img/doctors-dashboard/profile-03.jpg",
  },
  {
    id: "#RV004",
    serviceType: "In-Person Visit",
    rating: 3,
    review:
      "The examination was comprehensive but I felt a bit rushed during the consultation. The optometrist answered my questions but didn't seem to have much time.",
    reviewDate: "2023-08-18",
    bookingId: "#BK004",
    patientName: "Nora",
    patientImg: "assets/img/doctors-dashboard/profile-04.jpg",
  },
];

const PatientReviewsCards = () => {
  const renderStars = (count) => {
    const total = 5;
    return Array.from({ length: total }, (_, i) => (
      <FaStar
        key={i}
        color={i < count ? "#ffc107" : "#e4e5e9"}
        size={16}
        className="me-1"
      />
    ));
  };

  const getServiceBadge = (type) => {
    const variant =
      type === "Video Call"
        ? "info"
        : type === "In-Person Visit"
        ? "success"
        : "warning";
    return <Badge bg={variant}>{type}</Badge>;
  };

  return (
    <div className="comments-list">
    <MainSearch/>
    </div>
  );
};

export default PatientReviewsCards;
