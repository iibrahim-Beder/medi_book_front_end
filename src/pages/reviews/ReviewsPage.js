import Notes from "../doctor-financial-dashboard/component/Notes";
import PatientReviewsCards from "./components/PatientsReviewsCards";
import RatingSummary from "./components/RatingReviewsSummary";
import TotalReviewsCard from "./components/TotalReviewsCard";


export default function ReviewsPage() {
    return (
        <div>
      <div className="row reviews-page ">
      <div className="col-lg-6  mb-3 col-m-d12">
        <TotalReviewsCard />
      </div>
      <div className="col-lg-6  mb-3 col-md-12">
        <RatingSummary   />
      </div>
       <div className="col-lg-8  mb-3 col-md-12">
      <PatientReviewsCards />
      </div>
      <div className="col-lg-4  mb-3col-md-12">
      <Notes />
      </div>
    </div>  
        </div>
    )
}