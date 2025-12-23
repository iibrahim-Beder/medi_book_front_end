import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./FeedbackSlider.scss";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Placeholder } from "react-bootstrap";

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

const FeedbackSlider = () => {
  const feedbacks = [
    {
      img: "/images/avt/patient-avt.png",
      title: "Internal Braces on mo...",
      date: "Jun 27, 2018",
    },
    {
      img: "/images/avt/patient-avt.png",
      title: "Sleeping Noise from H...",
      date: "Jun 27, 2018",
    },
    {
      img: "/images/avt/patient-avt.png",
      title: "Visited For Conservative",
      date: "Jun 27, 2018",
    },
    {
      img: "/images/avt/patient-avt.png",
      title: "Another Feedback Example",
      date: "Jul 15, 2018",
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    // autoplay: true,
    // autoplaySpeed: 2000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
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
        {feedbacks.map((item, index) => (
          <div className="item" key={index}>
            <div className="dc-postedsilderitem">
              <figure className="dc-consultation-img">
                <img  style={{maxHeight:"40px"}} src={item.img} alt={item.title} />
              </figure>
              <div className="dc-consultation-title">
                <h5>
                  <a href="#">{item.title}</a>
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

export default FeedbackSlider;
