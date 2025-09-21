import React from "react";
import { Button, InputGroup } from "react-bootstrap";
import { BiReset, BiSearch } from "react-icons/bi";
import Autocomplete from "../../../shared/SearchableDropdown";
import FilterDropdown from "./FilterDropdown";
import DateRangePicker from "./DateRangePicker";

const ConditionsFilters = ({
  searchTerm, setSearchTerm,
  filterActive, setFilterActive,
  filterSeverity, setFilterSeverity,
  filterType, setFilterType,
  filterDateFrom, setFilterDateFrom,
  filterDateTo, setFilterDateTo,
  onReset, conditions
}) => {

  const filters = [
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

  return (
    <div className="PatientsFilters card shadow-sm mb-3 rounded-3 pl-4">
      <div className="card-body">

        {/* السطر الأول */}
        <div className="row g-2 align-items-center mb-2">
          {/* Search */}
          <div className="col-12 col-lg-12ل p-1 d-flex">
              <InputGroup.Text>
                            <BiSearch />
                          </InputGroup.Text>
            <Autocomplete
              options={conditions?.map((c) => c.nameEn) || []}
              value={searchTerm}
              onChange={(value) => setSearchTerm(value)}
              placeholder="Search Condition"
            />
          </div>

        
        </div>

        {/* السطر الثاني */}
        <div className="row g-2 align-items-center">
          {/* Filter Dropdown */}
          <div className="col-12 col-lg-4 p-1">
            <FilterDropdown
              onFilter={(filtersToApply) => {
                setFilterActive(filtersToApply.active);
                setFilterSeverity(filtersToApply.severity);
                setFilterType(filtersToApply.type);
              }}
              onReset={() => {
                setSearchTerm(""); 
                setFilterActive("");
                setFilterSeverity("");
                setFilterType("");
                setFilterDateFrom(null);
                setFilterDateTo(null);
                onReset();
              }}
              filters={filters}
              defaultValues={{
                active: filterActive,
                severity: filterSeverity,
                type: filterType,
              }}
              customCheckbox={true}
              customCheckboxLabel="is Active"
            />
          </div>

          {/* Date Range Picker */}
          <div className="col-12 col-lg-4 p-1">
            <DateRangePicker
              startDate={filterDateFrom}
              endDate={filterDateTo}
              onChange={({ start, end }) => {
                setFilterDateFrom(start);
                setFilterDateTo(end);
              }}
            />
          </div>
            {/* Search & Reset Buttons */}
          <div className="col-12 col-lg-4 text-lg-start text-center p-1">
            <div style={{display: "flex", justifyContent: " space-around"}}>
              <button
                className="dc-btn"
                variant=""
                onClick={() => {
                  console.log("Filters applied:", {
                    searchTerm, filterActive, filterSeverity, filterType,
                    filterDateFrom, filterDateTo
                  });
                }}
              >
                Search
              </button>
              <button
                className="btn btn-light"
                variant=""
                onClick={() => {
                  setSearchTerm("");
                  setFilterActive("");
                  setFilterSeverity("");
                  setFilterType("");
                  setFilterDateFrom(null);
                  setFilterDateTo(null);
                  onReset();
                }}
              >
                <BiReset /> Reset
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ConditionsFilters;
