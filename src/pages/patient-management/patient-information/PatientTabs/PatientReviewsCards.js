import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { MdOutlineArrowForward } from "react-icons/md";
import StarRating from "../../../shared/StarRating";
import FilterDropdown from "./component/FilterDropdown";
import DateRangePicker from "./component/DateRangePicker";
import Pagination from "../../../shared/Pagination";

const reviewsData = [
  {
    id: "#RV001",
    serviceType: "Video Call",
    rating: 5,
    review:
      "Dr. Edalin Hendry has been my family's trusted doctor for years. Their genuine care and thorough approach to our health concerns make every visit reassuring. Dr. Edalin Hendry's ability to listen and explain complex health issues in understandable terms is exceptional. We are grateful to have such a dedicated physician by our side",
    reviewDate: "11 Mar 2024",
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
    reviewDate: "11 Mar 2024",
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
    reviewDate: "11 Mar 2024",
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
    reviewDate: "12 Apr 2022",
    bookingId: "#BK004",
    patientName: "Nora",
    patientImg: "assets/img/doctors-dashboard/profile-04.jpg",
  },
];

const PatientReviewsCards = () => {
  // Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 3;
  // Get reviews for the current page only
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, reviewsData.length);
  const paginatedReviews = reviewsData.slice(startIndex, endIndex);

  return (
    <div className="comments-list">
      <div className="table-header">
        <div>
          <h3 className="table-title">Patient Reviews</h3>
          <h6 className="table-subtitle">Ahmed Mohamed Ali</h6>
        </div>

        {/* Overall rating summary section */}
        <div className="review-content">
          <div className="review-rate">
            <h3>Overall Rating</h3>
            <div className="star-over-rated">
              <span>4.0</span>
              <StarRating rating={4} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters section */}
      <div className="review-filters">
        <FilterDropdown small />
        <DateRangePicker />
      </div>

      {/* Render paginated review cards */}
      {paginatedReviews.map((review) => (
        <Card key={review.id} className="mb-4 table-card">
          <div className="comments">
            {/* Review header with type, date, and rating */}
            <div className="d-flex justify-content-between align-items-start comment-head mb-2">
              <div className="patient-info">
                <h6 className="mb-0 fw-semibold">{review.serviceType}</h6>
                <span>{review.reviewDate}</span>
              </div>
              <div className="text-end">
                <StarRating rating={review.rating} />
              </div>
            </div>

            {/* Review text and view booking button */}
            <div className="review-info">
              <p className="mb-3">{review.review}</p>
              <div className="comment-footer">
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="d-flex align-items-center view-btn ms-2"
                >
                  View Booking <MdOutlineArrowForward className="ms-1" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}

      <Pagination
        currentPage={page}
        totalItems={reviewsData.length}
        rowsPerPage={itemsPerPage}
        onPageChange={setPage}
      />
    </div>
  );
};

export default PatientReviewsCards;
