import Button from "@mui/material/Button";
import { useStep1PersonalInfo } from "../doctor-registration/hooks/useStep1BasicInfo";
// import "./pageNotFoundAndErrorPage.css";

export default function ErrorPage({refetch,isFetching} ) {
    const { formData } = useStep1PersonalInfo(false);  

  return (
    <div className="page-not-found">
      <div className="content-container">
        <div className="text-content">
          <h3 style={{ fontWeight: "600", color: "#008ce9" }}>
            Sincere Apologies, {!formData?.firstName ? "Doctor" : "Dr." + formData.firstName}
          </h3>
          <div className="error-box mb-4">Server Error or Connection Issue</div>
          <h4 style={{ fontWeight: "500" }}>
            It seems we're having trouble connecting to the network.
            <br />
            Our technical team is on it.
          </h4>
          <h4 style={{ fontWeight: "500" }}>
            Please try again in a few moments, or check your internet
            connection.
            <br />
            (Error Code: 503 Service Unavailable)
          </h4>
            <Button
              onClick={refetch}
              variant="contained"
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                px: 3,
                backgroundColor: "#60a5fa",
                boxShadow: "none",
              }}
            >
              {isFetching ? "Loading..." : "Retry Connection"} 
            </Button>
        </div>
        <img src="/images/dashboard/errorServer.png" alt="Error" />
      </div>
    </div>
  );
}
