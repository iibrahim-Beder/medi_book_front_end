import React, { useState } from "react";
import { Card, Row, Col, Image, Badge, Button } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import { FaReply } from "react-icons/fa6";
import StarRating from "../../../shared/StarRating";
import { MdOutlineArrowForward } from "react-icons/md";
import FilterDropdown from "./component/FilterDropdown";
import DateRangePicker from "./component/DateRangePicker";

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
  const [page, setPage] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(reviewsData.length / itemsPerPage);

  // Go to next page
  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  // Go to previous page
  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  // Get reviews for the current page only
  const paginatedReviews = reviewsData.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  // Calculate visible range text (e.g., Showing 1–3 of 10)
  const startIndex = page * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, reviewsData.length);

  return (
    <div className="comments-list">
      <div>
        <div className="table-header">
          <div>
            <h3 className="table-title"> Patient Reviews </h3>
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
      </div>

      {/* Filters section */}
      <div className="review-filters">
        <FilterDropdown small />
        <DateRangePicker />
      </div>
      
      {/* Render paginated review cards */}
      {paginatedReviews.map((review) => (
        <Card key={review.id} className="mb-4 table-card ">
          <div className="comments">
            {/* Review header with type, date, and rating */}
            <div className="d-flex justify-content-between align-items-start comment-head mb-2">
              <div className="d-flex align-items-center">
                <div className="patient-info">
                  <h6 className="mb-0 fw-semibold">{review.serviceType}</h6>
                  <span>{review.reviewDate}</span>
                </div>
              </div>
              <div className="text-end">
                <div className="">
                  <StarRating rating={review.rating} />
                </div>
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
      
      {/* Pagination controls */}
      <div className="d-flex justify-content-between align-items-center mt-3 nav-table">
        <div
          className="dt-layout-cell dt-layout-start"
          style={{ fontSize: "14px", color: "#555" }}
        >
          <div className="dt-info">
            Showing {startIndex + 1} to {endIndex} of {reviewsData.length} entries
          </div>
        </div>

        <div className="dt-layout-cell dt-layout-end">
          <div className="dt-paging">
            <nav aria-label="pagination" className="d-flex">
              {/* Go to first page */}
              <button 
                className="dt-paging-button first" 
                type="button" 
                disabled={page === 0} 
                onClick={() => setPage(0)}
              >
                «
              </button>

              {/* Go to previous page */}
              <button 
                className="dt-paging-button previous" 
                type="button" 
                disabled={page === 0} 
                onClick={handlePrevPage}
              >
                Previous
              </button>

              {/* Page number buttons */}
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`dt-paging-button none ${page === index ? "current" : ""}`}
                  type="button"
                  onClick={() => setPage(index)}
                >
                  {index + 1}
                </button>
              ))}

              {/* Go to next page */}
              <button 
                className="dt-paging-button next" 
                type="button" 
                disabled={page === totalPages - 1} 
                onClick={handleNextPage}
              >
                Next
              </button>

              {/* Go to last page */}
              <button 
                className="dt-paging-button last" 
                type="button" 
                disabled={page === totalPages - 1} 
                onClick={() => setPage(totalPages - 1)}
              >
                »
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientReviewsCards;
