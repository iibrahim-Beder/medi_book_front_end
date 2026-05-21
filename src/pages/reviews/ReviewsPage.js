import Notes from "../doctor-financial-dashboard/component/Notes";
import ErrorPage from "../notFound-pageError/ErrorPage";
import Loader from "../shared/Loader";
import PatientReviewsCards from "./components/PatientsReviewsCards";
import RatingSummary from "./components/RatingReviewsSummary";
import TotalReviewsCard from "./components/TotalReviewsCard";
import { usePatientReviews } from "./hooks/usePatientReviews";

export default function ReviewsPage() {
  const { isLoading, isError,error, refetch, reviews, isFetching } =
    usePatientReviews();

  if (isError || (!isLoading && reviews.length === 0 && isFetching)) {
    return <ErrorPage refetch={refetch} isFetching={isFetching} error={error} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="row reviews-page ">
        <div className="col-lg-6  mb-3 col-m-d12">
          <TotalReviewsCard />
        </div>
        <div className="col-lg-6  mb-3 col-md-12">
          <RatingSummary />
        </div>
        <div className="col-lg-8  mb-3 col-md-12">
          <PatientReviewsCards />
        </div>
        <div className="col-lg-4  mb-3col-md-12">
          <Notes
            notes={[
              "Patient feedback from completed appointments",
              "These reviews are shown to patients",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
