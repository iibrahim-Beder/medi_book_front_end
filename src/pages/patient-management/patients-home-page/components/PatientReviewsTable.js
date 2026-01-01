import React, { useState, useEffect, useMemo } from "react";
import { Table, Button } from "react-bootstrap";
import Pagination from "../../../shared/Pagination";
import "../../Patient-management.css";
import { MdExpandMore, MdOutlineArrowForward } from "react-icons/md";
import { t } from "i18next";
import TextAreaField from "../../../ui/form-fields/TextAreaField";
import StarRating from "../../../shared/StarRating";
import FilterDropdown from "../../patient-information/PatientTabs/component/FilterDropdown";
import DateRangePicker from "../../patient-information/PatientTabs/component/DateRangePicker";
import { useGetReviewsQuery } from "../../../../api/reviewsApi"; 
import Skeleton from "react-loading-skeleton";
import ErrorLoading from "../../../shared/ErrorLoading";

const PatientReviewsTable = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter states
  const [filterAppointmentType, setFilterAppointmentType] = useState(undefined);
  const [selectedRatings, setSelectedRatings] = useState({});
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  const rowsPerPage = 5;

  // Transform filters to API format
  const filter = useMemo(() => {
    const ratings = Object.keys(selectedRatings)
      .filter((k) => selectedRatings[k])
      .map(Number);

    const minRating = ratings.length ? Math.min(...ratings) : undefined;
    const maxRating = ratings.length ? Math.max(...ratings) : undefined;

    return {
      searchValue: searchTerm || undefined,
      appointmentType: filterAppointmentType,
      minRating,
      maxRating,
      fromDate: dateRange.start?.toISOString().split("T")[0],
      toDate: dateRange.end?.toISOString().split("T")[0],
    };
  }, [searchTerm, filterAppointmentType, selectedRatings, dateRange]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // API Query
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetReviewsQuery({
    filter,
    pageNumber: currentPage,
    pageSize: rowsPerPage,
  });

  const reviews = response?.data || [];
  const totalCount = response?.totalCount || 0;
  const averageRating = response?.averageRating || 0;

  // Handle expand/collapse
  const handleReviewClick = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  // Handle view booking
  const handleViewBooking = (bookingId) => {
    console.log(`View booking: ${bookingId}`);
  };


  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedRatings({});
    setFilterAppointmentType(undefined);
    setDateRange({ start: null, end: null });
    setCurrentPage(1);
  };

  // Truncate text
  const truncateText = (text, maxLength = 400) => {
    if (!text) return "";
    return text.length <= maxLength ? text : text.substring(0, maxLength) + "...";
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Shimmer Row
  const ShimmerRow = () => (
  <tr className="shimmer-row">
    <td>
      <Skeleton height={18} width={100} borderRadius={4} />
    </td>
    <td>
      <div className="d-flex align-items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} circle width={16} height={16} />
        ))}
      </div>
    </td>
    <td>
      <Skeleton height={18} width={250} borderRadius={4} />
    </td>
    <td>
      <Skeleton height={18} width={120} borderRadius={4} />
    </td>
    <td>
      <Skeleton height={30} width={90} borderRadius={8} />
    </td>
  </tr>
);

  return (
    <div className="table-container">
      <div className="mt-4">
        <h3 className="table-title">{t("patientsReviews")}</h3>
      </div>

      <div className="table-card">
        {/* Overall Rating */}
        <div
          className="table-header pb-3 mb-4"
          style={{ borderBottom: "1px solid #eee" }}
        >
          <div className="review-content">
            <div className="review-rate">
              <h3>{t("overallRating")}</h3>
              <div className="star-over-rated">
                <span>{Number(averageRating).toFixed(1)}</span>
                <StarRating rating={averageRating} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="review-filters d-flex gap-3 align-items-center flex-wrap mb-3">
          <FilterDropdown
            small
            filters={[
              {
                name: "rating",
                label: t("Select Rating max, min"),
                data: [
                  { key: "5", label: "5 Stars" },
                  { key: "4", label: "4 Stars" },
                  { key: "3", label: "3 Stars" },
                  { key: "2", label: "2 Stars" },
                  { key: "1", label: "1 Star" },
                ],
              },
              {
                name: "type",
                label: t("Appointment Type"),
                data: [
                  { key: "Consultation", label: t("Consultation") },
                  { key: "FollowUp", label: t("FollowUp") },
                  { key: "Emergency", label: t("Emergency") },
                ],
              },
            ]}
            onFilter={(filters) => {
              setSelectedRatings(filters.rating || {});
              const typeFilter = filters.type || {};
              const selectedType = Object.keys(typeFilter).find(
                (k) => typeFilter[k]
              );
              setFilterAppointmentType(selectedType || undefined);
            }}
            onReset={resetFilters}
          />
          <DateRangePicker onChange={setDateRange} />
        </div>

        {/* Table */}
        <div style={{ overflow: "auto" }}>
          {isError ? (
            <ErrorLoading isError={isError} refetch={refetch} />
          ) : (
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
                {(isLoading || isFetching) ? (
                  Array.from({ length: rowsPerPage }).map((_, i) => (
                    <ShimmerRow key={i} />
                  ))
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      {t("No reviews found")}
                    </td>
                  </tr>
                ) : (
                  reviews.map((review) => (
                    <React.Fragment key={review.id}>
                      <tr>
                        <td title={review.bookingType}>{review.bookingType}</td>
                        <td>
                          <StarRating rating={review.rating} />
                        </td>
                        <td title={review.comment} style={{maxWidth:"50vw"}}>
                          <div className="d-flex align-items-center">
                            <span
                              className="text-truncate"
                              // style={{ maxWidth: "550px" }}
                            >
                              {truncateText(review.comment)}
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
                        <td>{formatDate(review.createdAt)}</td>
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

                      {/* Expanded Row */}
                      {expandedRow === review.id && (
                        <tr className="table-active-content">
                          <td colSpan="5" className="border-0 background-in-hover-none">
                            <div className="description-expanded-section">
                              <TextAreaField
                                label={t("review")}
                                value={review.comment}
                                disabled={true}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={totalCount}
          rowsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default PatientReviewsTable;