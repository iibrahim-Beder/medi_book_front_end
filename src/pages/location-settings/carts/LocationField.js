import { useDoctorLocationsManager } from "../useDoctorLocations";
import LocationsAccordion from "./LocationsAccordion";
import Loader from "../../shared/Loader";
export default function Step4Locations({ doctorId }) {
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
    <LocationsAccordion
      locations={locations}
      errors={errors}
      onAddLocation={addNewLocation}
      onSaveLocation={saveLocation}
      onToggleActive={toggleActiveStatus}
    />
  );
}