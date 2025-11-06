import React from "react";
import { Button } from "react-bootstrap";
import { BiReset } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import DateRangePicker from "./DateRangePicker";
import FilterDropdown from "./FilterDropdown";

const ConditionsFilters = ({
  searchTerm = "",
  filterStatus = "All",
  filterSeverity = "",
  filterDateFrom = null,
  filterDateTo = null,
  setSearchTerm,
  setFilterStatus,
  setFilterSeverity,
  setFilterDateFrom,
  setFilterDateTo,
  onReset,
  onSearch,
  searchPlaceholder = "Search ...",
  showSearchInput = true,
  showSearchReset = true,
  showDateRange = true,
  showFilterDropdown = true,
  statusOptions = ["All", "Active", "Inactive"],
  severityOptions = ["Mild", "Moderate", "Severe"],
  conditions = []
}) => {
  const customFilters = [
    {
      name: "status",
      label: "Status",
      data: statusOptions.map(option => ({ key: option, label: option }))
    },
    {
      name: "severity",
      label: "Severity",
      data: severityOptions.map(option => ({ key: option, label: option }))
    }
  ];

  const handleReset = () => {
    setSearchTerm("");
    setFilterStatus("All");
    setFilterSeverity("");
    setFilterDateFrom(null);
    setFilterDateTo(null);
    if (onReset) onReset();
  };

  const handleSearch = () => {
    if (onSearch) onSearch();
  };

  // Handle dropdown filter changes
  const handleFilterChange = (appliedFilters) => {
    let newStatus = "All";
    let newSeverity = "";

    if (appliedFilters.status) {
      const activeStatus = Object.keys(appliedFilters.status).find(
        key => appliedFilters.status[key]
      );
      newStatus = activeStatus || "All";
    }

    if (appliedFilters.severity) {
      const activeSeverities = Object.keys(appliedFilters.severity).filter(
        key => appliedFilters.severity[key]
      );
      newSeverity = activeSeverities.length > 0 ? activeSeverities[0] : "";
    }

    setFilterStatus(newStatus);
    setFilterSeverity(newSeverity);

    const filtersToApply = {
      searchValue: searchTerm || "",
      isActive: newStatus,
      severity: newSeverity,
      dateNoted: filterDateFrom ? new Date(filterDateFrom).toISOString() : ""
    };

    if (onSearch) onSearch(filtersToApply);
  };

  return (
    <div className="filter-section">
      {/* Left side: search & reset */}
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
                if (e.key === "Enter") {
                  handleSearch(); // trigger search on Enter
                }
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
          <div>
            <div className="btn-group mt-2">
              <Button
                className="PatientsFiltersBtn"
                variant="outline-secondary"
                style={{ boxShadow: "none" }}
                onClick={handleSearch} // search button
              >
                Search
              </Button>
              <Button
                className="PatientsFiltersBtn"
                variant="outline-secondary"
                style={{ boxShadow: "none" }}
                onClick={handleReset} // reset all filters
              >
                <BiReset /> Reset
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Right side: date range & filter dropdown */}
      <div className="filter-and-date" style={{ display: "flex", gap: "12px" }}>
        {showDateRange && (
          <DateRangePicker
            startDate={filterDateFrom}
            endDate={filterDateTo}
            onChange={({ start, end }) => {
              setFilterDateFrom(start);
              setFilterDateTo(end);
              // search not triggered automatically here
            }}
          />
        )}

        {showFilterDropdown && (
          <FilterDropdown
            filters={customFilters}
            small={true}
            conditions={conditions}
            defaultValues={{
              status: {
                All: filterStatus === "All",
                Active: filterStatus === "Active",
                Inactive: filterStatus === "Inactive",
              },
              severity: {
                Mild: filterSeverity === "Mild",
                Moderate: filterSeverity === "Moderate",
                Severe: filterSeverity === "Severe",
              },
            }}
            onFilter={handleFilterChange}
            onReset={() => {
              // reset dropdown filters only
              setFilterStatus("All");
              setFilterSeverity("");

              const filtersToApply = {
                searchValue: searchTerm || "",
                isActive: "All",
                severity: "",
                dateNoted: filterDateFrom
                  ? new Date(filterDateFrom).toISOString()
                  : "",
              };

              if (onSearch) onSearch(filtersToApply);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ConditionsFilters;
