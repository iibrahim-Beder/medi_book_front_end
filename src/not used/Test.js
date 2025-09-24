import FilterDropdown from '../pages/patient-management/patient-information/PatientTabs/FilterDropdown'; 
const MainSearch = () => {

  const defaultValues = {
    location: {
      usa: false,
      canada: false,
      england: false,
      switzerland: false,
      nz: false,
    }
  };

  const filterData = [
    {
      name: "location",
      label: "Choose Location",
      data: [
        { key: "usa", label: "United States" },
        { key: "canada", label: "Canada" },
        { key: "england", label: "England" },
        { key: "switzerland", label: "Switzerland" },
        { key: "nz", label: "New Zealand" }
      ]
    }
  ];

  const handleFilter = (filters) => {
    console.log("Filters applied:", filters);
  };

  const handleReset = () => {
    console.log("Filters reset");
  };

  return (
    <div className={"dc-headerform-holder show-sform' : "} >
      <div className="dc-search-headerform p-0 " style={{ width: "100%", display:"flex",flexDirection: "row-reverse", justifyContent: "flex-end" }}>
        <form className="dc-formtheme dc-form-advancedsearch dc-headerform">
          <fieldset>
            <div className="form-group">
              <input
                type="text"
                name="search"
                className="form-control"
                placeholder="Search doctors, clinics, hospitals, etc."
              />
            </div>

            <div className="form-group">
              <FilterDropdown 
                filters={filterData}
                defaultValues={defaultValues}
                onFilter={handleFilter}
                onReset={handleReset}
              />
            </div>

            <div className="dc-formbtn">
               <button type="button" className="dc-searchbtn"  style={{margin: 0, width: "50px", height: "50px", borderRadius:"0 4px 4px 0"}}>
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
