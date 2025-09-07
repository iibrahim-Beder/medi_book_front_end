import React from "react";

const SectionTitle = ({ icon, title }) => {
  return (
    <h2 className="form-title mt-5">
      <span className="title-icon">{icon}</span>
      {title}
    </h2>
  );
};

export default SectionTitle;