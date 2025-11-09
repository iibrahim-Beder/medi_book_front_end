// MainSearch.jsx
import React, { useState } from "react";
import FilterDropdown from "../patient-management/patient-information/PatientTabs/component/FilterDropdown";

const MainSearch = ({ 
  filters, 
  defaultValues, 
  onFilter, 
  onReset, 
  placeholder = "Search doctors, clinics, hospitals, etc." 
}) => {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div
      className="dc-headerform-holder main-search "
      style={{ position: "relative", maxWidth: "430px" }}
    >
      <div
        className="dc-search-headerform p-0"
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "flex-end",
          position: "relative",
        }}
      >
        <form className="dc-formtheme dc-form-advancedsearch dc-headerform">
          <fieldset style={{ position: "relative", maxWidth: "407px" }}>
            <div className="form-group" style={{ width: "100%" }}>
              <input
                type="text"
                name="search"
                className="form-control"
                placeholder={placeholder}
              />
            </div>

            {/* {filters && filters.length > 0 && ( */}
            {/* <div className="form-group" style={{ position: "relative" }}>
                <FilterDropdown
                  filters={filters}
                  defaultValues={defaultValues}
                  onFilter={onFilter}
                  onReset={onReset} />
              </div> */}
            {/* )} */}

            <div className="dc-formbtn">
              <button
                type="button"
                className=""
                style={{
                  color: "#fff",
                  background: "#3fabf3",
                  margin: 0,
                  width: "50px",
                  height: "50px",
                  borderRadius: "0 4px 4px 0",
                }}
              >
                <i className="fa fa-search"></i>
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default MainSearch;
