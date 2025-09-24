import React, { useState } from "react";
import './new.css';
import { CiFilter } from "react-icons/ci";

const FilterDropdown = ({ 
  onFilter, 
  onReset, 
  filters = [], // Filters passed as an array
  defaultValues = {}, // Default values for each filter
  customCheckbox = false, // Show custom checkbox or not
  customCheckboxLabel = "Enable Custom Filter" ,// Label for the custom checkbox
  small = false, // Small size for the button
}) => {
  const [selectedFilters, setSelectedFilters] = useState(defaultValues);
  const [isOpen, setIsOpen] = useState(false);
  const [customCheckboxState, setCustomCheckboxState] = useState(false);
  const [openFilter, setOpenFilter] = useState(null); // Track the currently opened filter

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
    setCustomCheckboxState((prevState) => !prevState); // Toggle custom checkbox state
  };

  const handleReset = () => {
    setSelectedFilters(defaultValues);
    setCustomCheckboxState(false); // Reset custom checkbox when pressing reset
    setOpenFilter(null); // Reset opened filter on reset
    if (onReset) onReset();
  };

  const handleApplyFilter = () => {
    const filtersToApply = {
      ...selectedFilters,
      customCheckbox: customCheckboxState, // Add custom checkbox state to filters
    };
    if (onFilter) {
      onFilter(filtersToApply); // Send applied filters
    }
  };

  const toggleFilter = (filterName) => {
    setOpenFilter((prev) => (prev === filterName ? null : filterName)); // Toggle current filter and close others
  };

  return (
    <div className={` ${isOpen ? "table-filter-show" : ""} ` }>
      <button className={`form-control Select1 filtecss ${small ? "small-filter" : ""}`}   type="button" onClick={() => setIsOpen(!isOpen)}>
        <CiFilter color="#012047" width={20}/> 
        <p className="mb-0 pr-1 pl-1" style={{ color: "#465D7C" }}>Filter By</p>
      </button>

      {isOpen && (
        <div className="filter-dropdown-menu dropdown-menu p-3 show" style={{zIndex:"4", minWidth:"350px"}}>
          <div className="filter-set-view">
            {/* Loop through filters dynamically */}
            {filters.map((filter, filterIndex) => (
              <div className="mb-3" key={filterIndex}>  
                <button
                 type="button"
                  className={`btn btn-outline-secondary w-100 text-start dropdown-btn ${openFilter === filter.name ? "open" : ""}`}
                  onClick={() => toggleFilter(filter.name)} // When clicking the filter
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

            {/* Add custom checkbox only if enabled */}
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

            {/* Buttons */}
            <div className="d-flex justify-content-between">
              <button type="button" className="btn btn-light" onClick={handleReset}>
                Reset
              </button>
              <button type="button" className="dc-btn" onClick={handleApplyFilter} style={{minWidth:"auto"}}>
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
