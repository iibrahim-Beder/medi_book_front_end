import Button from "@mui/material/Button";
import { useStep1PersonalInfo } from "../doctor-registration/hooks/useStep1BasicInfo";
import { getErrorSource } from "../utils/api-errors";

export default function ErrorPage({
  refetch,
  isFetching,
  error,
  nameVariable = false,
  imgStyle={}
}) {
  const { formData } = useStep1PersonalInfo(false);

  const source = getErrorSource(error);
  console.log("=====source", source);

  const isNetwork = source === "network";
  const isServer = source === "server";

  const errorConfig = {
    network: {
      title: "Connection Problem",
      message: "It seems we're having trouble connecting to the internet.",
      description: "Please check your internet connection and try again.",
      image: "/images/dashboard/enterNetError.png",
      code: "Network Error",
      button: "Retry Connection",
    },

    server: {
      title: "Server Error",
      message: "Our servers are temporarily unavailable at the moment.",
      description:
        "Our technical team is working to fix the issue. Please try again shortly.",
      image: "/images/dashboard/errorServer.png",
      code: `Error Code: ${error?.status || 500}`,
      button: "Retry Connection",
    },

    unknown: {
      title: "Unexpected Error",
      message: "Something went wrong unexpectedly.",
      description: "Please try again in a few moments.",
      image: "/images/dashboard/errorServer2.png",
      code: "Unknown Error",
      button: "Try Again",
    },
  };

  const currentError = errorConfig[source] || errorConfig.unknown;

  return (
    <div className="page-not-found">
      <div className={`content-container ${nameVariable ? "" : "p-0"}`} >
        <div className="text-content">
          {nameVariable && (
            <h3
              style={{
                fontWeight: "600",
                color: "#008ce9",
              }}
            >
              Sincere Apologies,{" "}
              {!formData?.firstName ? "Doctor" : `Dr. ${formData.firstName}`}
            </h3>
          )}

          <div className="error-box mb-4">{currentError.title}</div>

          <h4 style={{ fontWeight: "500" }}>{currentError.message}</h4>

          <h4 style={{ fontWeight: "500" }}>
            {currentError.description}
            <br />({currentError.code})
          </h4>

          <Button
            disabled={isFetching}
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
            {isFetching ? "Loading..." : currentError.button}
          </Button>
        </div>

        <img className={`${nameVariable?"p-3":""}`}  style={imgStyle}  src={currentError.image} alt={currentError.title} />
      </div>
    </div>
  );
}
