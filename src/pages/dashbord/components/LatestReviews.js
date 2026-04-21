import { MdArrowForwardIos } from "react-icons/md";
import StarRating from "../../shared/StarRating";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function LatestReviews() {
  const feedbacks = [
    {
      id: 1,
      img: "/images/avt/patient-avt.png",
      title:
        "The working of the doctor was very good, I was very satisfied with the treatment. The working of the dentist was very good, I was very satisfied with the treatment.",
      name: "Bob Brown",
      date: "Jun 27, 2018",
      rate: 5,
      patientId:4,
    },
    {
      id: 2,
      img: "/images/avt/patient-avt.png",
      name: "Terrence Tynan",
      title: "Internal Braces on month 2 of treatment was very helpful for my child. , he is now able to eat and sleep without pain. and Internal Braces on month 2 of treatment was very helpful for my child. , he is now able to eat and sleep without pain.",
      date: "Jun 27, 2018",
      rate: 3,
      patientId:5
    },
    {
      id: 3,
      img: "/images/avt/patient-avt.png",
      name: "Terrence Tynan",
      title: "Visited For Conservative",
      date: "Jun 27, 2018",
      rate: 4,
      patientId:6
    },
    {
      id: 4,
      img: "/images/avt/patient-avt.png",
      name: "Aileen Remington",
      title: "Another Feedback Example",
      date: "Jul 15, 2018",
      rate: 3,
      patientId:7
    },
  ];
  return (
    <div className="dc-dashboardbox">
      <div className="dc-dashboardboxtitle">
        <h2>Latest Reviews</h2>
      </div>
      <div className="dc-dashboardboxcontent dc-hiredfreelance latest-appointments">
        {feedbacks.map((appointment, index) => (
          <FeedbackItem appointment={appointment} />
        ))}
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
      <img src={appointment.img} alt={appointment.name} />
    </figure>
    <div className="dc-userlistingcontent2">
      <Link to={`/pationt-information/${appointment.patientId}`} className="button-elment"title="pationt profile" >
      <h6 className="mt-2 button-elment">{appointment.name}</h6>
      </Link>
      <StarRating rating={appointment.rate|| 4} 
      //  style={{marginBottom: "10px",marginTop: "auto"}}
       />
    </div>

    <div className="dc-proposaldetails">
      <div className="dc-contenthead">
        <div className="dc-title">
          {/* <h3> */}
            <span ref={textRef} className={`${isOverflowing ? "overflowing" : ""}`} >{appointment.title}</span>
            {/* <span>Booking on: {appointment.date}</span> */}
          {/* </h3> */}
          <Link to={`/appointment-management/${appointment.id}`} className="btn-link" title="view appointment" >
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