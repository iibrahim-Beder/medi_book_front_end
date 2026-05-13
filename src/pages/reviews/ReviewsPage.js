import Notes from "../doctor-financial-dashboard/component/Notes";
import ErrorPage from "../notFound-pageError/ErrorPage";
import DataEmptyCom from "../shared/DataEmptyCom";
import Loader from "../shared/Loader";
import PatientReviewsCards from "./components/PatientsReviewsCards";
import RatingSummary from "./components/RatingReviewsSummary";
import TotalReviewsCard from "./components/TotalReviewsCard";
import { usePatientReviews } from "./hooks/usePatientReviews";

export default function ReviewsPage() {
  const { isLoading, isError, refetch, reviews, isFetching } =
    usePatientReviews();
  console.log("reviews", reviews);
  if (isError || (!isLoading && reviews.length === 0 && isFetching)) {
    return <ErrorPage refetch={refetch} isFetching={isFetching} />;
  }

  if (isLoading) {
    return <Loader />;
  }
  if (reviews.length === 0) {
    return (
      <div className="col-lg-12 m-4">
        <div className="">
          <DataEmptyCom
            text="No Reviews Found"
            children={<>⭐⭐⭐⭐⭐</>}
            imgStyle={{ maxWidth: "50%", maxHeight: "70vh" }}
          />
        </div>
      </div>
    );
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
