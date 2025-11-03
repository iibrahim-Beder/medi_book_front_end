import React from "react";

const LoadingButton = ({ 
  loading, 
  children, 
  onClick, 
  disabled, 
  className = "" 
}) => {
  return (
    <button
      type="button"
      className={`btn ${className} ${loading ? "loading" : ""}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <span className="spinner"></span>}
      {children}
    </button>
  );
};

export default LoadingButton;