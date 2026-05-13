import { useEffect, useState } from "react";
import "./DashboardInsights.scss";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";


//  dashboard insights component to show insights data in the dashboard
export default function DashboardInsights() { 
   const { t } = useTranslation();
  const insights = [
    {title: t("Messages"), img: '/images/card-icon/chat.png',     link: "/chat",isNotIcon:true },
    {title: t("financial dashboard"), img: "/images/thumbnail/img-20.png", link: "/manage-financial",ToBigImg:true  },
    {title: t("Next appointment"), img: "/images/thumbnail/img-21.png",   link: "/appointment-management", countdown: "2026-05-14T20:20:22" ,ToBigImg:true  },
    {title: t("patients dashboard"), img: "/images/thumbnail/img-22.png",   link: "/patients",ToBigImg:true  }
  ];
  return (
    <section className="dc-haslayout dc-jobpostedholder dc-dbsectionspace">
      <div className="row m-0 ">
        {insights.map((item, index) => (
          <div
            className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3"
            key={index}
          >
            <div className={`dc-insightsitem dc-dashboardbox ${item.isNotIcon?"dc-insightnoticon":""}`}>
              {item.countdown && (
                <CountdownTimer targetDate={item.countdown} />
              )}

              <figure className={`dc-userlistingimg ${item.ToBigImg?"big":""}`}>
                <img src={item.img} alt={item.title} />
              </figure>

              <div className="dc-insightdetails">
                <div className="dc-title">
                  <h3>{item.title}</h3>
                  
                  <Link to={item.link} >
                  <button >Click To View</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Countdown Component
function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const countdown = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance <= 0) {
        clearInterval(countdown);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [targetDate]);

  return (
    <ul className="dc-countersoon">
      <li><i className="fa fa-spinner fa-spin"></i></li>
      <li><div className="dc-countdowncontent"><p>d</p> <span>{timeLeft.days}</span></div></li>
      <li><div className="dc-countdowncontent"><p>h</p> <span>{timeLeft.hours}</span></div></li>
      <li><div className="dc-countdowncontent"><p>m</p> <span>{timeLeft.minutes}</span></div></li>
      <li><div className="dc-countdowncontent"><p>s</p> <span>{timeLeft.seconds}</span></div></li>
    </ul>
  );
}
