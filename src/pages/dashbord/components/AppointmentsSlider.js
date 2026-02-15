import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./AppointmentsSlider.scss";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const NextArrow = ({ onClick }) => (
  <div className="custom-arrow next" onClick={onClick}>
    <FaChevronRight />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div className="custom-arrow prev" onClick={onClick}>
    <FaChevronLeft />
  </div>
);

const AppointmentsSlider = () => {
  const appointments = [
    {
      img: "/images/avt/patient-avt.png",
      name: "Ayesha Khan",
      type: "Video Call",
      date: "12:00 PM",
    },
    {
      img: "/images/avt/patient-avt.png",
      name: "Smith Doe",
      type: "In-Person",
      date: "11:00 PM",
    },
    {
      img: "/images/avt/patient-avt.png",
      name: "Smith Doe",
      type: "In-Person",
      date: "10:30 PM",
    },
    {
      img: "/images/avt/patient-avt.png",
      name: "mark joe",
      type: "Video Call",
      date: "10:00 PM",
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    // autoplay: true,
    // autoplaySpeed: 2000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="dc-postedsilder">
      <Slider {...settings}>
        {appointments.map((item, index) => (
          <div className="item" key={index}>
            <div className="dc-postedsilderitem">
      <div className="consultation-item">
        {/* <div className="left"> */}
          <figure className="dc-consultation-img">
            <img style={{ maxHeight: "40px" }} src={item.img} alt="img" />
          </figure>
          <h6>{item.name}</h6>
        {/* </div> */}
      </div>
              <div className="dc-consultation-title">
                <h5 style={{ fontSize: "14px", color:"var(--text-sub)" }}>
                  <a href="#">{item.type}</a>
                  <em>{item.date}</em>
                </h5>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default AppointmentsSlider;
