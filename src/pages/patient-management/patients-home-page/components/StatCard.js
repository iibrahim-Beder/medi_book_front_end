import { ArrowUp, ArrowDown } from "lucide-react";

const StatCard = ({ title, value, percentage, isPositive, icon: Icon, color }) => {
  return (
    <div className="col-xl-3 col-sm-12 col-md-6 col-12 stats-card">
      <div className="dc-insightsitem dc-dashboardbox stats-card-item">
        <div>
          <figure className="dc-userlistingimg">
        <img alt="icon " src={Icon} ></img>
          </figure>
          {/* <div
            className="d-flex align-items-center justify-content-center  mb-3 "
            style={{
              borderRadius: "10px",
              backgroundColor: "#F9F9F9",
              color: "var(--terthemecolor)",
              width: "60px",
              height: "60px",
            }}
          >
            <Icon size={30} />
          </div> */}
          <h4 className=" stats-card-title " style={{ textAlign: "center" }}>
            {title}
          </h4>
        </div>
        <div
          // style={{
          //   display: "flex",
          //   width: "100%",
          //   flexWrap: "wrap",
          //   justifyContent: "center",
          //   flexDirection: "column",
          //   alignItems: "center",
          //   gap: "10px",
          // }}
        >
          {/* Value */}
          <h3 className="fw-bold mb-0 ">{value}</h3>
          <div className=" prs-state ">
            <span
              className={`badge rounded-pill px-2 py-1 ${
                isPositive
                  ? "bg-success-subtle text-success"
                  : "bg-danger-subtle text-danger"
              }`}
            >
              {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              <span className="ms-1">{percentage}%</span>
            </span>
            <small
              className={` ms-2  ${
                isPositive
                  ? "bg-success-subtle text-success"
                  : "bg-danger-subtle text-danger"
              }`}
            >
              since last month
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
