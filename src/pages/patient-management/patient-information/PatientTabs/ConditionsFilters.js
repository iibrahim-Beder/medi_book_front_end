import React from "react";
import { Button } from "react-bootstrap";
import { BiReset } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import DateRangePicker from "./DateRangePicker";
import FilterDropdown from "./FilterDropdown";

const ConditionsFilters = ({
  // قيم الفلاتر
  searchTerm = "",
  filterActive = "",
  filterSeverity = "",
  filterType = "",
  filterDateFrom = null,
  filterDateTo = null,
  
  // دوال تحديث الفلاتر
  setSearchTerm,
  setFilterActive,
  setFilterSeverity,
  setFilterType,
  setFilterDateFrom,
  setFilterDateTo,
  
  // دوال إضافية
  onReset,
  onSearch,
  
  // خيارات التخصيص
  searchPlaceholder = "Search conditions...",
  showSearchReset = true,
  showDateRange = true,
  showFilterDropdown = true,
  customFilters = [],
  conditions = []
}) => {
  
  // الفلاتر الافتراضية
  const defaultFilters = [
    {
      name: "severity",
      label: "Severity",
      data: [
        { key: "Mild", label: "Mild" },
        { key: "Moderate", label: "Moderate" },
        { key: "Severe", label: "Severe" },
      ]
    },
    {
      name: "type",
      label: "Condition Type",
      data: [
        { key: "Chronic", label: "Chronic" },
        { key: "NonChronic", label: "Non-Chronic" },
      ]
    },
  ];

  // استخدام الفلاتر المخصصة إذا تم توفيرها، وإلا استخدام الافتراضية
  const filters = customFilters.length > 0 ? customFilters : defaultFilters;

  const handleReset = () => {
    setSearchTerm("");
    setFilterActive("");
    setFilterSeverity("");
    setFilterType("");
    setFilterDateFrom(null);
    setFilterDateTo(null);
    if (onReset) onReset();
  };

  const handleSearch = () => {
    if (onSearch) onSearch();
  };

  return (
    <div className="d-flex justify-content-between">
      {/* الجزء الأيسر: البحث وإعادة التعيين */}
      <div className="d-flex align-items-center" style={{ flexDirection: "column" }}>
        <div style={{ position: "relative", width: "250px" }}>
          <input
            className="form-control small-search"
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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

        {/* أزرار البحث وإعادة التعيين */}
        {showSearchReset && (
          <div className="ml-4" style={{width:"100%"}} >
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

      {/* الجزء الأيمن: نطاق التاريخ والفلاتر */}
      <div style={{ display: "flex", gap: "12px" }}>
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
            onFilter={(filters) => {
              // معالجة الفلاتر المطبقة من FilterDropdown
              if (filters.severity) {
                const activeSeverities = Object.keys(filters.severity).filter(
                  key => filters.severity[key]
                );
                setFilterSeverity(activeSeverities.length > 0 ? activeSeverities : "");
              }
              
              if (filters.type) {
                const activeTypes = Object.keys(filters.type).filter(
                  key => filters.type[key]
                );
                setFilterType(activeTypes.length > 0 ? activeTypes : "");
              }
            }}
            onReset={() => {
              setFilterSeverity("");
              setFilterType("");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ConditionsFilters;