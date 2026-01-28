import React, { useMemo, useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { MdOutlineArrowForward } from "react-icons/md";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import { useGetReviewsQuery } from "../../../api/reviewsApi";
import StarRating from "../../shared/StarRating";
import FilterDropdown from "../../patient-management/patient-information/PatientTabs/component/FilterDropdown";
import DateRangePicker from "../../patient-management/patient-information/PatientTabs/component/DateRangePicker";
import ErrorLoading from "../../shared/ErrorLoading";
import Pagination from "../../shared/Pagination";


const ShimmerCard = () => (
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

const PatientReviewsCards = ({ patientId = 4 }) => {
  const { t } = useTranslation();

  //  State for filters
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [starFilters, setStarFilters] = useState({});
  const [appointmentType, setAppointmentType] = useState(undefined);
  const [page, setPage] = useState(1);
  const itemsPerPage = 3;

  //  Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [dateRange, starFilters, appointmentType]);

  //  Build filters
  const filter = useMemo(() => {
    const selectedRatings = Object.keys(starFilters)
      .filter((k) => starFilters[k])
      .map(Number);

    const minRating = selectedRatings.length
      ? Math.min(...selectedRatings)
      : undefined;
    const maxRating = selectedRatings.length
      ? Math.max(...selectedRatings)
      : undefined;

    return {
      minRating,
      maxRating,
      appointmentType,
      fromDate: dateRange.start?.toISOString(),
      toDate: dateRange.end?.toISOString(),
    };
  }, [starFilters, dateRange, appointmentType]);

  // API call
  const {
    data: reviewsResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetReviewsQuery({
    patientId,
    filter,
    pageNumber: page,
    pageSize: itemsPerPage,
  });

  const reviews = reviewsResponse?.data || [];
  const averageRating = reviewsResponse?.averageRating ?? 0;
  const totalCount = reviewsResponse?.totalCount ?? 0;
  const showShimmer = isFetching || isLoading;

  return (
    <div className="table-card" style={{boxShadow:"none", borderRadius:"20px"}} >
    <div className="comments-list">
          <h3 className="table-title" style={{fontSize:"20px"}}>{t("PatientReviewsCards.table_title")}</h3>
      {/*  Filters */}
      <div className="review-filters d-flex gap-3 align-items-center flex-wrap">

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
          { key: "FollowUp", label: t("Follow Up") },
          { key: "Emergency", label: t("Emergency") },
          { key: "Routine", label: t("Routine") },
        ],
      },
    ]}
    onFilter={(filters) => {
      //  Extract Rating Filters
      const ratingFilters = filters.rating || {};
      const selectedRatings = Object.keys(ratingFilters)
        .filter((k) => ratingFilters[k])
        .map(Number);
      setStarFilters(ratingFilters);

      // Extract Appointment Type
      const typeFilters = filters.type || {};
      const selectedType = Object.keys(typeFilters).find(
        (key) => typeFilters[key]
      );
      setAppointmentType(selectedType || undefined);
    }}
     onReset={() => {
      setStarFilters({});
      setAppointmentType(undefined);
    }}
  />

        {/* Date Filter */}
        <DateRangePicker onChange={setDateRange} />
      </div>

      {isError ? (
        <ErrorLoading isError={isError} refetch={refetch} />
      ) : (
        <>
          {showShimmer ? (
            [...Array(itemsPerPage)].map((_, i) => <ShimmerCard key={i} />)
          ) : reviews.length === 0 ? (
            <p className="text-center text-muted mt-4">{t("No reviews found")}</p>
          ) : (
            reviews.map((review) => (
              <Card key={review.reviewId} className="mb-4 table-card" style={{boxShadow:"none"}} >
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
                      style={{float:"inline-end"}}
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

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalItems={totalCount}
        rowsPerPage={itemsPerPage}
        onPageChange={setPage}
      />
    </div>
    </div>
  );
};

export default PatientReviewsCards;
