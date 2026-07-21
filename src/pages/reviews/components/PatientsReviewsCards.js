// components/PatientReviewsCards.jsx

import React from "react";
import { Card, Button } from "react-bootstrap";
import { MdOutlineArrowForward } from "react-icons/md";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";

import StarRating from "../../shared/StarRating";
import FilterDropdown from "../../patient-management/patient-information/PatientTabs/component/FilterDropdown";
import DateRangePicker from "../../patient-management/patient-information/PatientTabs/component/DateRangePicker";
import ErrorLoading from "../../shared/ErrorLoading";
import Pagination from "../../shared/Pagination";

import { usePatientReviews } from "../hooks/usePatientReviews";
import { Link } from "react-router-dom";
import { convertSrcPatientImg } from "../../shared/utils";

const ShimmerCard = () => (
  <div className="mb-4 table-card card">
    <div className="d-flex justify-content-between mb-2" style={{display: "flex", alignItems: "center"}}>
    <div style={{display: "flex" , alignItems: "center", gap:"10px" }}>
       <figure className="dc-userlistingimg m-0">
         <Skeleton  width={60} height={60} />
       </figure>
      <Skeleton width={120} height={20} />
    </div>
      <Skeleton width={80} height={20} />
    </div>

    <Skeleton count={3} height={14} style={{ marginBottom: "6px" }} />

    <div className="d-flex justify-content-end mt-2">
      <Skeleton width={100} height={30} />
    </div>
  </div>
);

const PatientReviewsCards = () => {
  const { t } = useTranslation();

  const {
    reviews,
    totalCount,

    page,
    setPage,

    itemsPerPage,

    isLoading,
    isFetching,
    isError,
    refetch,

    setDateRange,

    setStarFilters,

    setAppointmentType,
  } = usePatientReviews();

  const showShimmer = isLoading || isFetching;

  return (
    <div
      className="table-card"
      style={{ boxShadow: "none", borderRadius: "20px" }}
    >
      <div className="comments-list">
        <h3 className="table-title" style={{ fontSize: "20px" }}>
          {t("PatientReviewsCards.table_title")}
        </h3>

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
                  { key: "PhoneCall", label: t("PhoneCall") },
                  { key: "InPerson", label: t("InPerson") },
                  { key: "VideoCall", label: t("VideoCall") },
                ],
              },
            ]}
            onFilter={(filters) => {
              const ratingFilters = filters.rating || {};

              setStarFilters(ratingFilters);

              const typeFilters = filters.type || {};

              const selectedType = Object.keys(typeFilters).find(
                (key) => typeFilters[key]
              );

              setAppointmentType(selectedType || undefined);
            }}
            onReset={() => {
              setStarFilters({});
              setAppointmentType(undefined);
              setDateRange({ start: null, end: null });
            }}
          />

          <DateRangePicker onChange={setDateRange} />
        </div>

        {isError ? (
          <ErrorLoading isError={isError} refetch={refetch} />
        ) : (
          <>
            {showShimmer ? (
              [...Array(itemsPerPage)].map((_, i) => (
                <ShimmerCard key={i} />
              ))
            ) : reviews.length === 0 ? (
              <p className="text-center text-muted mt-4">
                {t("No reviews found")}
              </p>
            ) : (
              reviews.map((review) => (
                <Card
                  key={review.reviewId}
                  className="mb-4 table-card"
                  style={{ boxShadow: "none" }}
                >
                  <div className="comments">
                    <div className="d-flex justify-content-between align-items-start comment-head mb-2 flex-wrap">
                        <div className="d-flex align-items-center">
                        <figure style={{maxWidth:"75px"}} className="dc-userlistingimg m-0">
                          <img src={convertSrcPatientImg(review.patientImage) || "/images/avt/patient-avt.png"} onError={(e) => (e.target.src = "/images/avt/patient-avt.png")} alt={review.patientName} />
                        </figure>
                      <div className="patient-info">
                        <Link to={`/pationt-information/${review?.patientId}`} className="button-elment"title="pationt profile" >
                          <h6 className="mb-0 fw-semibold button-elment ml-1">{review.patientName}</h6>
                        </Link>
                        <StarRating rating={review.rating} />
                      </div>
                        </div>

                      <div className="align-items-center d-flex text-end flex-column">
                          <h6 className="mb-0 fw-semibold">
                          {review.bookingType}
                        </h6>

                        <span>
                          {review.createdAt?.split("T")[0]}
                        </span>
                      </div>
                    </div>

                    <div className="review-info">
                      <p className="mb-3">{review.comment}</p>

                      <div className="comment-footer">
                        <Link to={`/appointment-management/${review.bookingId}`}>
                        <Button
                          style={{ float: "inline-end" }}
                          variant="outline-primary"
                          size="sm"
                          className="d-flex align-items-center view-btn ms-2"
                        >
                          {t("PatientReviewsCards.view_booking")}

                          <MdOutlineArrowForward className="ms-1 arrow-icon-view-table" />
                        </Button>
                        </Link>
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
    </div>
  );
};

export default PatientReviewsCards;