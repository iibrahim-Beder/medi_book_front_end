import { ArrowUp, ArrowDown } from "lucide-react";

const StatCard = ({ title, value, percentage, isPositive, icon: Icon, color }) => {
  return (
    <div className="col-xl-3 col-sm-6 col-12">
      <div className="card shadow-sm border-0 rounded-4 h-100 pb-0 "
      style={{
        paddingBottom:"0",
        padding:"1.5rem"
      }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            flexWrap: "nowrap",
            justifyContent: "flex-start",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            className="d-flex align-items-center justify-content-center  mb-3 "
            style={{
              borderRadius:"10px",
              backgroundColor: `${color}20`, // خلفية شفافة بنفس اللون
              color: color,
              width: "60px",
              height: "60px",
            }}
          >
            <Icon size={30} />
          </div>
          <h4 className="text-muted">{title}</h4>
        </div>
        {/* Icon داخل دائرة */}



       <div
         style={{
            display: "flex",
            width: "100%",
            flexWrap: "wrap",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
      >
        {/* Value */}
        <h3 className="fw-bold mb-2">{value}</h3>

        {/* <div>
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
          <small className="text-muted ms-2">since last month</small>
          </div> */}
        </div>
        {/* Percentage */}
      </div>
    </div>
  );
};

export default StatCard;
