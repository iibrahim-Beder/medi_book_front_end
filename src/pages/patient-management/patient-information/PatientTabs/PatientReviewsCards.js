import React, { useMemo, useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { MdOutlineArrowForward } from "react-icons/md";
import { useTranslation } from "react-i18next";
import StarRating from "../../../shared/StarRating";
import FilterDropdown from "./component/FilterDropdown";
import DateRangePicker from "./component/DateRangePicker";
import Pagination from "../../../shared/Pagination";
import { useGetPatientReviewsQuery } from "../../../../api/patientReviewsApi";
import Skeleton from "react-loading-skeleton";

const ShimmerCard = () => {
  return (
    <div className="mb-4 table-card card">
      <div className="d-flex justify-content-between mb-2">
        <Skeleton width={120} height={20} />
        <Skeleton width={80} height={20} />
      </div>
      <Skeleton count={3} height={14} style={{ marginBottom: "6px" }} />
      <div className="d-flex justify-content-end mt-2">
        <Skeleton width={100} height={30} />
      </div>
    </div>
  );
};

const PatientReviewsCards = ({ patientId = 4 }) => {
  const { t } = useTranslation();

  // Filters
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [starFilters, setStarFilters] = useState({});
  const [page, setPage] = useState(1);
  const itemsPerPage = 3;

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [dateRange, starFilters]);

  // Build filter object (stable via useMemo)
  const filter = useMemo(() => {
    const selected = Object.keys(starFilters).filter((k) => starFilters[k]).map(Number);
    const minRating = selected.length ? Math.min(...selected) : undefined;
    const maxRating = selected.length ? Math.max(...selected) : undefined;

    return {
      minRating: minRating !== undefined ? minRating : undefined,
      maxRating: maxRating !== undefined ? maxRating : undefined,
      fromDate: dateRange.start ? dateRange.start.toISOString() : undefined,
      toDate: dateRange.end ? dateRange.end.toISOString() : undefined,
    };
  }, [starFilters, dateRange]);

  // API call
  const {
    data: reviewsResponse,
    isLoading,    // true only on first mount / initial load
    isFetching,   // true whenever a request is in-flight (including after filters/page change)
    isError,
    refetch,
  } = useGetPatientReviewsQuery({
    patientId,
    filter,
    pageNumber: page,
    pageSize: itemsPerPage,
  });
 console.log(reviewsResponse);
  const reviews = reviewsResponse?.data || [];
  console.log("reviewsResponse" , reviewsResponse);
  const averageRating = reviewsResponse?.averageRating ?? 0;
  const totalCount = reviewsResponse?.totalCount ?? 0;

  // show shimmer inside the reviews area when fetching (initial or subsequent)
  const showShimmer = isFetching || isLoading ;

  return (
    <div className="comments-list">
      <div className="table-header">
        <div>
          <h3 className="table-title">{t("PatientReviewsCards.table_title")}</h3>
          <h6 className="table-subtitle">{t("Common.table_subtitle")}</h6>
        </div>
        <div className="review-content">
          <div className="review-rate">
            <h3>{t("PatientReviewsCards.overall_rating")}</h3>
            <div className="star-over-rated">
              <span>{Number(averageRating).toFixed(1)}</span>
              <StarRating rating={averageRating} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="review-filters d-flex gap-3 align-items-center">
        <FilterDropdown
          small
          filters={[
            {
              name: "rating",
              label: t("Rating"),
              data: [
                { key: "5", label: "5 Stars" },
                { key: "4", label: "4 Stars" },
                { key: "3", label: "3 Stars" },
                { key: "2", label: "2 Stars" },
                { key: "1", label: "1 Star" },
              ],
            },
          ]}
          onFilter={(filters) => setStarFilters(filters.rating || {})}
          onReset={() => setStarFilters({})}
        />
        <DateRangePicker onChange={setDateRange} />
      </div>

      {/* Reviews area */}
      {/* If there's an error — show error bar in the reviews area */}
      {isError ? (
        <div className="text-center text-danger mt-4">
          {t("Error loading reviews")}
          <Button onClick={refetch} variant="outline-primary" className="ms-2">
            {t("Retry")}
          </Button>
        </div>
      ) : (
        <>
          {/* Show shimmer cards only where the cards are supposed to be */}
          {showShimmer ? (
            <div>
              {[...Array(itemsPerPage)].map((_, i) => (
                <ShimmerCard key={i} />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-center text-muted mt-4">{t("No reviews found")}</p>
          ) : (
            reviews.map((review) => (
              <Card key={review.reviewId} className="mb-4 table-card">
                <div className="comments">
                  <div className="d-flex justify-content-between align-items-start comment-head mb-2">
                    <div className="patient-info">
                      <h6 className="mb-0 fw-semibold">{review.bookingType}</h6>
                      <span>{review.createdAt?.split("T")[0]}</span>
                    </div>
                    <div className="text-end">
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                  <div className="review-info">
                    <p className="mb-3">{review.comment}</p>
                    <div className="comment-footer">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="d-flex align-items-center view-btn ms-2"
                      >
                        {t("PatientReviewsCards.view_booking")}{" "}
                        <MdOutlineArrowForward className="ms-1 arrow-icon-view-table" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </>
      )}

      <Pagination
        currentPage={page}
        totalItems={totalCount}
        rowsPerPage={itemsPerPage}
        onPageChange={setPage}
      />
    </div>
  );
};

export default PatientReviewsCards;
