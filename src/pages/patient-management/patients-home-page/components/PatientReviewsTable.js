import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import Pagination from "../../../shareds/Pagination"
import "../../Patient-management.css";
import { MdExpandMore, MdOutlineArrowForward } from "react-icons/md";
import { t } from "i18next";
import TextAreaField from "../../../ui/form-fields/TextAreaField";
import StarRating from "../../../shareds/StarRating"; 
import ConditionsFilters from "../../patient-information/PatientTabs/component/ConditionsFilters";
import FilterDropdown from "../../patient-information/PatientTabs/component/FilterDropdown";
import DateRangePicker from "../../patient-information/PatientTabs/component/DateRangePicker";

const PatientReviewsTable = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("all"); 
  const [currentPage, setCurrentPage] = useState(1); 
  
  // Filters states
  const [filterServiceType, setFilterServiceType] = useState("");
  const [filterRating, setFilterRating] = useState(null);
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);

  // Mock data representing patient reviews with corrected service types
  const reviewsData = [
    {
      id: "#RV001",
      serviceType: "Video Call",
      rating: 5,
      review: "Dr. Smith was very thorough and took the time to explain everything clearly. The wait time was minimal and the staff was friendly. Highly recommended!",
      reviewDate: "2023-10-15",
      bookingId: "#BK001"
    },
    {
      id: "#RV002",
      serviceType: "In-Person Visit",
      rating: 4,
      review: "Good overall experience. The dentist was professional and the cleaning was done carefully. The only downside was the slightly long waiting time.",
      reviewDate: "2023-09-22",
      bookingId: "#BK002"
    },
    {
      id: "#RV003",
      serviceType: "Voice Call",
      rating: 5,
      review: "Excellent therapy sessions! The therapist was knowledgeable and helped me recover quickly from my injury. The exercises were effective and well-explained.",
      reviewDate: "2023-11-05",
      bookingId: "#BK003"
    },
    {
      id: "#RV004",
      serviceType: "In-Person Visit",
      rating: 3,
      review: "The examination was comprehensive but I felt a bit rushed during the consultation. The optometrist answered my questions but didn't seem to have much time.",
      reviewDate: "2023-08-18",
      bookingId: "#BK004"
    },
    {
      id: "#RV005",
      serviceType: "Video Call",
      rating: 5,
      review: "Outstanding care from Dr. Johnson. He explained my heart condition in detail and provided a clear treatment plan. The follow-up was also excellent.",
      reviewDate: "2023-12-01",
      bookingId: "#BK005"
    },
    {
      id: "#RV006",
      serviceType: "In-Person Visit",
      rating: 4,
      review: "The dermatologist was very knowledgeable and prescribed an effective treatment for my skin condition. The clinic was clean and modern.",
      reviewDate: "2023-07-14",
      bookingId: "#BK006"
    },
    {
      id: "#RV007",
      serviceType: "Voice Call",
      rating: 5,
      review: "Dr. Wilson was amazing with my child! She made the visit comfortable and fun. My son actually looks forward to his checkups now.",
      reviewDate: "2023-11-28",
      bookingId: "#BK007"
    },
    {
      id: "#RV008",
      serviceType: "Video Call",
      rating: 2,
      review: "Disappointed with the consultation. The doctor seemed distracted and didn't properly address my concerns about my knee pain. Will seek a second opinion.",
      reviewDate: "2023-06-10",
      bookingId: "#BK008"
    }
  ];

  // List of valid visit types for DropdownWithSearch and checkbox filter
  const visitTypes = ["Video Call", "Voice Call", "In-Person Visit"];

  // Handle expand/collapse for review text
  const handleReviewClick = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  // Handle view booking action
  const handleViewBooking = (bookingId) => {
    console.log(`View booking: ${bookingId}`);
  };

  // Handle search (triggered by Search or Filter Now buttons)
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
    // Filtering is handled in filteredReviews below
  };

  // Handle reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setFilterServiceType("");
    setFilterRating(null);
    setFilterDateFrom(null);
    setFilterDateTo(null);
    setCurrentPage(1);
  };

  // Apply search & filters
  const filteredReviews = reviewsData
    .filter((review) => {
      if (!searchTerm) return true; 
      if (searchBy === "all") {
        return Object.values(review)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else {
        return review[searchBy]?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      }
    })
    .filter((review) => {
      if (filterServiceType && !filterServiceType.includes(review.serviceType)) return false;
      if (filterRating && !filterRating.includes(review.rating.toString())) return false;
      if (filterDateFrom && new Date(review.reviewDate) < new Date(filterDateFrom)) return false;
      if (filterDateTo && new Date(review.reviewDate) > new Date(filterDateTo)) return false;
      return true;
    });

  const rowsPerPage = 5; 
  const totalPages = Math.ceil(filteredReviews.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredReviews.slice(startIndex, startIndex + rowsPerPage);

  // Utility: truncate long text
  const truncateText = (text, maxLength = 300) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="table-container">
           <div className="mt-4" >
              <h3 className="table-title">{t("patientsReviews")}</h3>
            </div>
      <div className="">
        <div className="table-card">
          <div className="table-header pb-3 mb-4"
          style={{borderBottom:"1px solid #eee"}}
          >
            <div className="review-content">
              <div className="review-rate">
                <h3>{t("overallRating")}</h3>
                <div className="star-over-rated">
                  <span>4.0</span>
                  <StarRating rating={4} />
                </div>
              </div>
            </div>
          </div>
          <div className="review-filters ">
             <FilterDropdown small/>
             <DateRangePicker/>
          </div>

          <div style={{ overflow: "auto" }}>
            <Table className="data-table align-middle mb-0 table-hover">
              <thead>
                <tr>
                  <th>{t("appointmentType")}</th>
                  <th>{t("rating")}</th>
                  <th>{t("review")}</th>
                  <th>{t("reviewDate")}</th>
                  <th>{t("action")}</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((review) => (
                  <React.Fragment key={review.id}>
                    <tr>
                      <td title={review.serviceType}>{review.serviceType}</td>
                      <td>
                        <StarRating rating={review.rating} />
                      </td>
                      <td title={review.review}>
                        <div className="d-flex align-items-center">
                          <span
                            className="text-truncate"
                            style={{ maxWidth: "550px" }}
                          >
                            {truncateText(review.review, 400)}
                          </span>
                          <Button
                            className="view-btn ms-2"
                            size="sm"
                            style={{
                              backgroundColor: "transparent",
                              color: "#278fff",
                              padding: 0,
                              fontSize: "19px",
                              height: "20px",
                            }}
                            onClick={() => handleReviewClick(review.id)}
                          >
                            <MdExpandMore
                              style={{
                                transform:
                                  expandedRow === review.id
                                    ? "rotate(180deg)"
                                    : "rotate(0deg)",
                                transition: "transform 0.3s ease",
                              }}
                            />
                          </Button>
                        </div>
                      </td>
                      <td>{formatDate(review.reviewDate)}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleViewBooking(review.bookingId)}
                          className="d-flex align-items-center view-btn ms-2"
                        >
                          {t("viewBooking")}{" "}
                          <MdOutlineArrowForward className="ms-1 arrow-icon-view-table" />
                        </Button>
                      </td>
                    </tr>

                    {expandedRow === review.id && (
                      <tr
                        className="table-active-content"
                        style={{ backgroundColor: "transparent" }}
                      >
                        <td
                          colSpan="5"
                          className="border-0 background-in-hover-none"
                        >
                          <div className="description-expanded-section">
                            <TextAreaField
                              label={t("review")}
                              value={review.review}
                              disabled={true}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
          </div>
       <Pagination
  currentPage={currentPage}
  totalItems={filteredReviews.length}
  rowsPerPage={rowsPerPage}
  onPageChange={setCurrentPage}
/>
        </div>
      </div>
    </div>
  );
};

export default PatientReviewsTable;
