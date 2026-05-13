import { MdArrowForwardIos } from "react-icons/md";
import StarRating from "../../shared/StarRating";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { usePatientReviews } from "../../reviews/hooks/usePatientReviews";
import Skeleton from "react-loading-skeleton";
import DataEmptyCom from "../../shared/DataEmptyCom";

export default function LatestReviews() {
  const {reviews , isLoading} = usePatientReviews(4);
  console.log("reviews", reviews);


  return (
    <div className="dc-dashboardbox">
      <div className="dc-dashboardboxtitle">
        <h2>Latest Reviews</h2>
      </div>
      <div className="dc-dashboardboxcontent dc-hiredfreelance latest-appointments">
        {isLoading
          ? Array(4)
              .fill(0)
              .map((_, index) => <FeedbackSkeleton key={index} />)
          : reviews?.length  ?( reviews.map((appointment, index) => (
              <FeedbackItem
                key={appointment.bookingId || index}
                appointment={appointment}
              />
            ))) : <DataEmptyCom containerStyle={{flexDirection: "column"}} imgStyle={{width:"100%" ,maxWidth:"300px"}}  text="No Reviews Found" children={"⭐⭐⭐⭐⭐"} />}
      </div>
    </div>
  );
}
const FeedbackItem = ({ appointment, index }) => {
  const textRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    }
  }, []);

  return (
      <div className="dc-userlistinghold" key={index}>
    <figure className="dc-userlistingimg">
      <img src={"/images/avt/patient-avt.png"} alt={appointment.patientName} />
    </figure>
    <div className="dc-userlistingcontent2">
      <Link to={`/pationt-information/${appointment.patientId||4}`} className="button-elment"title="pationt profile" >
      <h6 className="mt-2 button-elment">{appointment.patientName}</h6>
      </Link>
      <StarRating rating={appointment.rating|| 4} 
      //  style={{marginBottom: "10px",marginTop: "auto"}}
       />
    </div>

    <div className="dc-proposaldetails">
      <div className="dc-contenthead">
        <div className="dc-title">
          {/* <h3> */}
            <span ref={textRef} className={`${isOverflowing ? "overflowing" : ""}`} >{appointment.comment}</span>
            {/* <span>Booking on: {appointment.date}</span> */}
          {/* </h3> */}
          <Link to={`/appointment-management/${appointment.bookingId}`} className="btn-link" title="view appointment" >
          <a href="#" className="dc-hiredarrow">
            <MdArrowForwardIos />
          </a>
          </Link>
        </div>
      </div>
    </div>
  </div>
  );
};
const FeedbackSkeleton = () => {
  return (
    <div className="dc-userlistinghold">
      <figure className="dc-userlistingimg">
        <Skeleton  width={60} height={60} />
      </figure>

      <div className="dc-userlistingcontent2">
        <Skeleton width={120} height={18} />
        <Skeleton width={90} height={15} />
      </div>

      <div className="dc-proposaldetails w-100">
        <div className="dc-contenthead">
          <div className="dc-title w-100">
            <Skeleton count={2} />
          </div>
        </div>
      </div>
    </div>
  );
};