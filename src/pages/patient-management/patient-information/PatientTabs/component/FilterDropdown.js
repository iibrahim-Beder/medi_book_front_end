import React, { useState, useEffect, useRef } from "react";
import './new.css';
import { CiFilter } from "react-icons/ci";
import DropdownWithSearch from "../../../../shared/DropdownWithSearch";

const FilterDropdown = ({ 
  onFilter, 
  onReset, 
  filters = [], 
  defaultValues = {}, 
  customCheckbox = false, 
  customCheckboxLabel = "Enable Custom Filter",
  small = false, 
}) => {
  const [selectedFilters, setSelectedFilters] = useState(defaultValues);
  const [isOpen, setIsOpen] = useState(false);
  const [customCheckboxState, setCustomCheckboxState] = useState(false);
  const [openFilter, setOpenFilter] = useState(null);
  const dropdownRef = useRef(null); 

  const handleFilterChange = (filterName, key) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterName]: {
        ...prev[filterName],
        [key]: !prev[filterName][key],
      },
    }));
  };

  const handleCustomCheckboxChange = () => {
    setCustomCheckboxState((prevState) => !prevState);
  };

  const handleReset = () => {
    setSelectedFilters(defaultValues);
    setCustomCheckboxState(false);
    setOpenFilter(null);
    if (onReset) onReset();
  };

  const handleApplyFilter = () => {
    const filtersToApply = {
      ...selectedFilters,
      customCheckbox: customCheckboxState,
    };
    if (onFilter) {
      onFilter(filtersToApply);
    }
  };

  const toggleFilter = (filterName) => {
    setOpenFilter((prev) => (prev === filterName ? null : filterName));
  };

  //  event listener to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setOpenFilter(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className={` ${isOpen ? "table-filter-show" : ""} ` }>
      <button 
        className={`form-control Select1 filtecss ${small ? "small-filter" : ""}`}   
        type="button" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <CiFilter color="#012047" width={20}/> 
        <p className="mb-0 pr-1 pl-1" style={{ color: "#465D7C" }}>Filter By</p>
      </button>

      {isOpen && (
        <div 
          className="filter-dropdown-menu dropdown-menu show" 
          style={{
            right: "4%", 
            top: "auto", 
            left: "unset", 
            padding: "20px ", 
            borderRadius: "5px", 
            background: "var(--cardcolor)", 
            border: "1px solid #E6E8EE", 
            boxShadow: "var(--scshadocolor) 0px 4px 14px 0px", 
            position: "absolute", 
            zIndex: 9
          }}
        >
          <div className="filter-set-view">
            <DropdownWithSearch/>
            {filters.map((filter, filterIndex) => (
              <div 
                className="mb-3" 
                key={filterIndex} 
                style={{ borderTop: "1px solid #E6E8EE", paddingTop: "15px" }} 
              >  
                <button
                  type="button"
                  className={`btn btn-outline-secondary w-100 text-start dropdown-btn filter-btn ${openFilter === filter.name ? "open" : ""}`}
                  onClick={() => toggleFilter(filter.name)}
                >
                  {filter.label}
                  <span className="arrow"></span>
                </button>
                <div className={`dropdown-content ${openFilter === filter.name ? "open" : ""}`}>
                  {filter.data.map((item, index) => (
                    <span key={item.key} className="dc-checkbox">
                      <input
                        type="checkbox"
                        id={`${filter.name}-type-${index}`}
                        checked={selectedFilters[filter.name]?.[item.key] || false}
                        onChange={() => handleFilterChange(filter.name, item.key)}
                      />
                      <label htmlFor={`${filter.name}-type-${index}`}>{item.label}</label>
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {customCheckbox && (
              <div className="mb-3">
                <ul className="list-unstyled">
                  <li>
                    <div className="dc-on-off">
                      <input
                        type="checkbox"
                        id="custom-checkbox"
                        checked={customCheckboxState}
                        onChange={handleCustomCheckboxChange}
                      />
                      <label htmlFor="custom-checkbox">
                        <i></i>
                      </label>
                    </div>
                    <span>{customCheckboxLabel}</span>
                  </li>
                </ul>
              </div>
            )}

            <div className="d-flex justify-content-between">
              <button className="simple-btn btn" type="button" onClick={handleReset}>
                Reset
              </button>
              <button type="button" className="second-btn" onClick={handleApplyFilter}>
                Filter Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
