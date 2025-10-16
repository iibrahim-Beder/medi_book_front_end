import FilterDropdown from "../patient-management/patient-information/PatientTabs/component/FilterDropdown";

const MainSearch = ({ 
  filters, 
  defaultValues, 
  onFilter, 
  onReset, 
  placeholder = "Search doctors, clinics, hospitals, etc." 
}) => {
    return (
      <div className="dc-headerform-holder">
        <div
          className="dc-search-headerform p-0"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row-reverse",
            justifyContent: "flex-end",
          }}
        >
          <form className="dc-formtheme dc-form-advancedsearch dc-headerform">
            <fieldset>
              <div className="form-group">
                <input
                  type="text"
                  name="search"
                  className="form-control"
                  placeholder={placeholder} />
              </div>

              {filters && filters.length > 0 && (
                <div className="form-group">
                  <FilterDropdown
                    filters={filters}
                    defaultValues={defaultValues}
                    onFilter={onFilter}
                    onReset={onReset} />
                </div>
              )}

              <div className="dc-formbtn">
                <button
                  type="button"
                  className="dc-searchbtn"
                  style={{
                    margin: 0,
                    width: "50px",
                    height: "50px",
                    borderRadius: "0 4px 4px 0",
                  }}
                >
                  <i className="fa fa-search"></i>
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    );
  };

export default MainSearch;
