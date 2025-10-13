import React from "react";
import { Button } from "react-bootstrap";
import { BiReset } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import DateRangePicker from "./DateRangePicker";
import FilterDropdown from "./FilterDropdown";

const ConditionsFilters = ({
  // Filter values
  searchTerm = "",
  filterServiceType = "",
  filterRating = "",
  filterDateFrom = null,
  filterDateTo = null,
  
  // Filter update functions
  setSearchTerm,
  setFilterServiceType,
  setFilterRating,
  setFilterDateFrom,
  setFilterDateTo,
  
  // Additional functions
  onReset,
  onSearch,
  
  // Customization options
  searchPlaceholder = "Search reviews...",
  showSearchInput = true,
  showSearchReset = true,
  showDateRange = true,
  showFilterDropdown = true,
  customFilters = [],
  conditions = []
}) => {
  // Default filters (not used since customFilters are provided)
  const defaultFilters = [];

  // Use custom filters if provided, otherwise default
  const filters = customFilters.length > 0 ? customFilters : defaultFilters;

  const handleReset = () => {
    setSearchTerm("");
    setFilterServiceType("");
    setFilterRating("");
    setFilterDateFrom(null);
    setFilterDateTo(null);
    if (onReset) onReset();
  };

  const handleSearch = () => {
    if (onSearch) onSearch();
  };

  return (
    <div className="filter-section">
      {/* Left side: search and reset */}
      <div className="d-flex align-items-center" style={{ flexDirection: "column" }}>
        {showSearchInput && (
          <div style={{ position: "relative"}}>
            <input
              className="form-control small-search"
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          <div className="" >
            <div className="btn-group mt-2" > 
              <Button
                className="PatientsFiltersBtn"
                variant="outline-secondary"
                style={{ boxShadow: "none" }}
                onClick={handleSearch}
              >
                Search
              </Button>
              <Button
                className="PatientsFiltersBtn"
                variant="outline-secondary"
                style={{ boxShadow: "none" }}
                onClick={handleReset}
              >
                <BiReset /> Reset
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Right side: date range and filters */}
      <div className="filter-and-date" style={{ display: "flex", gap: "12px" }}>
        {showDateRange && (
          <DateRangePicker
            startDate={filterDateFrom}
            endDate={filterDateTo}
            onChange={({ start, end }) => {
              setFilterDateFrom(start);
              setFilterDateTo(end);
            }}
          />
        )}

        {showFilterDropdown && (
          <FilterDropdown 
            filters={filters} 
            small={true} 
            conditions={conditions}
            defaultValues={{
              rating: {
                "1": false,
                "2": false,
                "3": false,
                "4": false,
                "5": false
              },
              serviceType: {
                "Video Call": false,
                "Voice Call": false,
                "In-Person Visit": false
              }
            }}
            onFilter={(filters) => {
              // Handle applied filters from FilterDropdown
              if (filters.rating) {
                const activeRatings = Object.keys(filters.rating).filter(
                  key => filters.rating[key]
                );
                setFilterRating(activeRatings.length > 0 ? activeRatings : "");
              }
              
              if (filters.serviceType) {
                const activeServiceTypes = Object.keys(filters.serviceType).filter(
                  key => filters.serviceType[key]
                );
                setFilterServiceType(activeServiceTypes.length > 0 ? activeServiceTypes : "");
              }

              if (filters.condition) {
                setFilterServiceType(filters.condition);
              }

              handleSearch();
            }}
            onReset={() => {
              setFilterRating("");
              setFilterServiceType("");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ConditionsFilters;