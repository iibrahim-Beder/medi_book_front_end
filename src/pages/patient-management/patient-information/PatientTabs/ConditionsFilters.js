import React from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { BiDownload, BiReset, BiSearch } from "react-icons/bi";
import Autocomplete from "../../../shared/SearchableDropdown";
import FilterDropdown from "./FilterDropdown";
import DateRangePicker from "./DateRangePicker";
import { FaSearch } from 'react-icons/fa';
import MainSearch from "../../../../not used/Test";
import { CiSearch } from "react-icons/ci";

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
    <div className="d-flex justify-content-between">
    
      <div className="">
        <div style={{ position: "relative", width: "250px" }}>
          <input
            className="form-control small-search"
            type="text"
            placeholder={"Search conditions..."}
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

        {/*  Search & Reset */}
        <div className="ml-3">
          <div className="btn-group mt-2">
            <Button
              className="PatientsFiltersBtn"
              variant="outline-secondary"
              style={{ boxShadow: "none" }}
            >
              search
            </Button>
            <Button
              className="PatientsFiltersBtn"
              variant="outline-secondary"
              style={{ boxShadow: "none" }}
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
            </Button>
          </div>
        </div>
      </div>

      {/* Date Range Picker */}
      <div style={{ display: "flex", gap: "12px" }}>
        <DateRangePicker
          startDate={filterDateFrom}
          endDate={filterDateTo}
          onChange={({ start, end }) => {
            setFilterDateFrom(start);
            setFilterDateTo(end);
          }}
        />

        <FilterDropdown filters={filters} small={true} />
      </div>
    </div>
  );
};

export default ConditionsFilters;
