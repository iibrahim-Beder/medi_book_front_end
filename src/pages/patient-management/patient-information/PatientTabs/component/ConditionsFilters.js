import React from "react";
import { Button } from "react-bootstrap";
import { BiReset } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import DateRangePicker from "./DateRangePicker";
import FilterDropdown from "./FilterDropdown";

const ConditionsFilters = ({
  searchTerm = "",
  filterDateFrom = null,
  filterDateTo = null,
  setSearchTerm,
  setFilterDateFrom,
  setFilterDateTo,
  onReset,
  onSearch,
  searchPlaceholder = "Search ...",
  showSearchInput = true,
  showSearchReset = true,
  showDateRange = true,
  showFilterDropdown = true,
  filterConfigs = [],
  conditions = []
}) => {

  // Reset handler
  const handleReset = () => {
    setSearchTerm("");
    setFilterDateFrom(null);
    setFilterDateTo(null);
    if (onReset) onReset();
  };

  // Search handler
  const handleSearch = () => {
    if (onSearch) onSearch();
  };

  // Handle filter change
  const handleFilterChange = (appliedFilters) => {
    const result = {};
    filterConfigs.forEach(filter => {
      if (appliedFilters[filter.name]) {
        const selected = Object.keys(appliedFilters[filter.name]).find(
          key => appliedFilters[filter.name][key]
        );
        result[filter.name] = selected || "";
      }
    });

    if (onSearch) onSearch(result);
  };

  return (
    <div className="filter-section d-flex justify-content-between align-items-center flex-wrap">

      {/* Left side: search and buttons */}
      <div className="d-flex align-items-center" style={{ flexDirection: "column" }}>
        {showSearchInput && (
          <div style={{ position: "relative" }}>
            <input
              className="form-control small-search"
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <CiSearch
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#000",
                fontSize: "23px",
              }}
            />
          </div>
        )}

        {showSearchReset && (
          <div className="btn-group mt-2">
            <Button
              className="PatientsFiltersBtn"
              variant="outline-secondary"
              onClick={handleSearch}
            >
              Search
            </Button>
            <Button
              className="PatientsFiltersBtn"
              variant="outline-secondary"
              onClick={handleReset}
            >
              <BiReset /> Reset
            </Button>
          </div>
        )}
      </div>

      {/* Right side: date range & dropdown */}
      <div className="filter-and-date d-flex "style={{gap:"12px"}}>
        {showDateRange && (
          <DateRangePicker
            startDate={filterDateFrom}
            endDate={filterDateTo}
            onChange={({ start, end }) => {
    setFilterDateFrom(start);
    setFilterDateTo(end);
    handleSearch({ 
      ...conditions, 
      diagnosisDateFrom: start, 
      diagnosisDateTo: end 
    });
  }}
          />
        )}

        {showFilterDropdown && (
          <FilterDropdown
            filters={filterConfigs}
            small={true}
            conditions={conditions}
            onFilter={handleFilterChange}
            onReset={onReset}
          />
        )}
      </div>
    </div>
  );
};

export default ConditionsFilters;
