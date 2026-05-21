// src/utils/api-errors.js

export const isNetworkError = (error) => {
  return (
    error?.status === "FETCH_ERROR" ||
    error?.status === "TIMEOUT_ERROR" ||
    error?.error?.includes("Failed to fetch")
  );
};

export const isServerError = (error) => {
  return [500, 502, 503, 504].includes(
    Number(error?.status)
  );
};

export const getErrorSource = (error) => {
  console.log("==== getErrorSourc",error);
  if (isNetworkError(error)) {
    return "network";
  }

  if (isServerError(error)) {
    return "server";
  }

  return "unknown";
};

export const getErrorMessage = (error) => {
  if (isNetworkError(error)) {
    return "There is a problem with the internet connection or the connection to the server is currently unavailable.";
  }

  if (isServerError(error)) {
    return "Our servers are temporarily unavailable at the moment. Please try again shortly.";
  }

  const serverMessage =
    error?.data?.message ||
    error?.message ||
    error?.data?.error ||
    error?.error;

  if (serverMessage) {
    return serverMessage;
  }

  return "Something went wrong. Please try again.";
};