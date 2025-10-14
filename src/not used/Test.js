import React from "react";
import { Card, Row, Col, Image, Badge, Button } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import { FaReply } from "react-icons/fa6";
import StarRating from "../pages/shared/StarRating";

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
      {reviewsData.map((review) => (
        <Card key={review.id} className="mb-4 border-0 shadow-sm p-3 rounded-4">
          <div className="comments">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-start comment-head mb-2">
              <div className="d-flex align-items-center">
                <Image
                  src={review.patientImg}
                  roundedCircle
                  width={50}
                  height={50}
                  className="me-3"
                />
                <div className="patient-info">
                  <h6 className="mb-0 fw-semibold">{review.patientName}</h6>
                  <small className="text-muted">{review.reviewDate}</small>
                </div>
              </div>
              <div className="text-end">
                <div className=""> <StarRating rating={review.rating} /></div>
                {/* {getServiceBadge(review.serviceType)} */}
              </div>
            </div>

            {/* Review Text */}
            <div className="review-info">
              <p className="mb-2 text-secondary">{review.review}</p>
              <div className="comment-reply">
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 text-decoration-none text-primary d-inline-flex align-items-center"
                  onClick={() => alert(`Go to booking ${review.bookingId}`)}
                >
                  <FaReply className="me-2" />
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PatientReviewsCards;
