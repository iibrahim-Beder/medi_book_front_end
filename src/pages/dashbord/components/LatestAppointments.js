import { FaChevronRight } from "react-icons/fa";

export default function LatestAppointments({ title, appointments }) {
  return (
    <div className="dc-dashboardbox">
      <div className="dc-dashboardboxtitle">
        <h2>{title}</h2>
      </div>
      <div className="dc-dashboardboxcontent dc-hiredfreelance">
        {appointments.map((appointment, index) => (
          <div className="dc-userlistinghold" key={index}>
            <figure className="dc-userlistingimg">
              <img src={appointment.img} alt={appointment.name} />
            </figure>
            <div className="dc-proposaldetails">
              <div className="dc-contenthead">
                <div className="dc-title">
                  <h3>
                    <a href="#">{appointment.name}</a>
                    <span>Booking on: {appointment.date}</span>
                  </h3>
                  <a href="#" className="dc-hiredarrow">
                    <FaChevronRight />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
