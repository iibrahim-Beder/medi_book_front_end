import React from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { BiDownload, BiReset, BiSearch } from "react-icons/bi";
import Autocomplete from "../../../shared/SearchableDropdown";
import FilterDropdown from "./FilterDropdown";
import DateRangePicker from "./DateRangePicker";
import { FaSearch } from 'react-icons/fa';
import SearchHeaderForm from "../../../../not used/Test";

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
    <div
      // className="PatientsFilters card shadow-sm mb-3 rounded-3 P-4"
      className=""
      // style={{
      //   border: "1px solid #ddd",
      //   width: "96% ",
      //   margin: "auto",
      //   boxShadow: "2px 2px 20px 0px #ddd",
      //   padding: "3px 6px",
      // }}
    >
      {/* <div className="card-body"> */}
        {/* first row */}
     
     
     
        <div
         className=""
    //      style={{display: "flex",
    // flexWrap: "nowrap",
    // flexDirection:" row",
    // alignItems: "center",
    // justifyContent:"space-between"}}

         >

        {/* <div  className="row"> */}
      <div className="row">
  {/* مكان البحث والفلاتر القديمة */}
  <div className="col-12 col-lg-9 p-0">
    <SearchHeaderForm />
  </div>

  {/* Date Range Picker */}
  <div className="col-12 col-lg-3 p-1">
    <DateRangePicker
      startDate={filterDateFrom}
      endDate={filterDateTo}
      onChange={({ start, end }) => {
        setFilterDateFrom(start);
        setFilterDateTo(end);
      }}
    />
  </div>

  {/* أزرار Search & Reset */}
  <div>
    <div className="btn-group mt-2">
      {/* <Button
        className="PatientsFiltersBtn"
        variant="outline-secondary"
        style={{ boxShadow: "none" }}
        onClick={() => {
          console.log("Filters applied:", {
            searchTerm,
            filterActive,
            filterSeverity,
            filterType,
            filterDateFrom,
            filterDateTo,
          });
        }}
      >
        Search
      </Button> */}
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

    
        </div>

        {/*second row*/}
        {/* <div
          className="row g-2 align-items-center"
          style={{ display: "flex", justifyContent: "center" }}
        >
         
        </div> */}
      {/* </div> */}
    </div>
  );
};

export default ConditionsFilters;
