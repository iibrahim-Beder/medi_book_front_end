import { useDoctorLocationsManager } from "../useDoctorLocations";
import LocationsAccordion from "./LocationsAccordion";
import Loader from "../../shared/Loader";
import ActiveTabs from "../../making-slots/components/ActiveTabs";
import { useState } from "react";
export default function Step4Locations({ doctorId }) {
  const [activeTab, setActiveTab] = useState("Active");
  const {
    locations,
    errors,
    addNewLocation,
    updateLocalLocation,
    saveLocation,
    toggleActiveStatus,
    isLoading,
  
  } = useDoctorLocationsManager(doctorId);
  if (isLoading) return Loader("loading-in-side loading-in-right");

  return (
    <>
               <div className="table-header m-0">
              <h3 className="table-title">
                Locations
              </h3>
              <button
                className="add-btn pr-5"
                onClick={() => addNewLocation()}
              >
                {("Add New Location")}
              </button>
            </div>
            <ActiveTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
{ activeTab === "Active" &&    <LocationsAccordion
    title={"Active Locations"}
      locations={locations.filter((loc) => loc.isActive)}
      errors={errors}
      // onAddLocation={addNewLocation}
      onSaveLocation={saveLocation}
      onToggleActive={toggleActiveStatus}

    />}
    { activeTab === "Inactive" && <LocationsAccordion
    title={"Inactive Locations"}
      locations={locations.filter((loc) => !loc.isActive)}
      errors={errors}
      // onAddLocation={addNewLocation}
      onSaveLocation={saveLocation}
      onToggleActive={toggleActiveStatus}

    />}
    </>
  );
}