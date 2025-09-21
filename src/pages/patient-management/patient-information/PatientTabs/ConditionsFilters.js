import React from "react";
import { Form, Button } from "react-bootstrap";
import { BiReset } from "react-icons/bi";
import Autocomplete from "../../../shared/SearchableDropdown";
import FilterDropdown from "./FilterDropdown";

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
        <div className="row g-2 align-items-center">

          {/* Searchable Dropdown */}
          <div className="col-12 col-lg-4 p-1">
            <Autocomplete
              options={conditions?.map((c) => c.nameEn) || []}
              value={searchTerm}
              onChange={(value) => setSearchTerm(value)}
              placeholder="Search Condition"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="col-12 col-lg-4 p-1">
            <FilterDropdown
              onFilter={(filtersToApply) => {
                setFilterActive(filtersToApply.active);
                setFilterSeverity(filtersToApply.severity);
                setFilterType(filtersToApply.type);
              }}
              onReset={() => {
                setSearchTerm(""); // reset search as well
                setFilterActive("");
                setFilterSeverity("");
                setFilterType("");
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

          {/* Filter and Reset Buttons */}
          <div className="col-12 col-lg-4 text-lg-start text-center p-1">
            <div className="btn-group mt-2">
              <Button
                className="PatientsFiltersBtn"
                variant="outline-secondary"
                onClick={() => {
                  // Apply filters manually if needed
                  console.log("Filters applied:", {
                    searchTerm, filterActive, filterSeverity, filterType
                  });
                }}
              >
                Filter
              </Button>
              <Button
                className="PatientsFiltersBtn"
                variant="outline-secondary"
                onClick={() => {
                  setSearchTerm("");
                  setFilterActive("");
                  setFilterSeverity("");
                  setFilterType("");
                  onReset();
                }}
              >
                <BiReset /> Reset
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ConditionsFilters;
