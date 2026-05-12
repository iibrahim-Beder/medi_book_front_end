import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import "./pageNotFoundAndErrorPage.css";
export default function NotFoundPage({ setOpenStepRegister }) {
    const navigate = useNavigate();

  return (
    <div className="page-not-found">
      <div className="content-container">
        <div className="text-content">
          <h3 style={{fontWeight: "600", color: "#008ce9" }}>404 page not found.</h3>
          <h2 style={{fontWeight: "500"}}>It Look Like You've Wandered Off The Carte.</h2>
          <h5 style={{fontWeight: "500"}}>
            The page you are looking for does not exist or has been moved. (try
            checking the URL)
          </h5>
          <Link to="/dashboard">
            <Button
              variant="contained"
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                px: 3,
                backgroundColor: "#60a5fa",
                boxShadow: "none",
              }}
            >
              Go to Dashboard
            </Button>
          </Link>

          <a
            href="!#"
            style={{ textWrapMode: "nowrap", textDecoration: "underline", margin:"0 20px" ,fontWeight: "500",fontSize: "16px"}}
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
          >
            Go Back
          </a>        </div>
        <img src="/images/dashboard/notFound.png" alt="notFound" />
      </div>
    </div>
  );
}
