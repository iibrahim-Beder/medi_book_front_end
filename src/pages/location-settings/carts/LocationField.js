import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LocationsAccordion from "./LocationsAccordion";

export default function Step4Locations({
  ComponentProp,
  header = true,
  initialLocations = [],
  onChange = () => {},
}) {
  const { t } = useTranslation();

  const [locations, setLocations] = useState(
    initialLocations.length
      ? initialLocations.map((loc, i) => ({
          ...loc,
          isExpanded: i === 0 ? true : false,
          isNew: false,
        }))
      : [
          {
            id: 1,
            lat: 30.0444,
            lng: 31.2357,
            displayName: "",
            officialName: "",
            isExpanded: true,
            isNew: true,
          },
        ]
  );

  useEffect(() => {
    onChange(locations);
  }, [locations]);

  const handleUpdateLocation = (locationId, field, value) => {
    setLocations(prev =>
      prev.map(location =>
        location.id === locationId ? { ...location, [field]: value } : location
      )
    );
    console.log("Updating location:", locationId, field, value);
  };

  const addNewLocation = () => {
    const newId = locations.length ? Math.max(...locations.map(l => l.id)) + 1 : 1;
    const newLocation = {
      id: newId,
      lat: 30.0444,
      lng: 31.2357,
      displayName: "",
      officialName: "",
      isExpanded: true,
      isNew: true,
    };
    setLocations(prev => [...prev, newLocation]);
    console.log("Adding new location:", newLocation);
  };

  const handleSaveLocation = (locationId, locationData) => {
    setLocations(prev =>
      prev.map(location =>
        location.id === locationId ? { 
          ...locationData, 
          id: locationId,
          isNew: false, 
          isExpanded: false 
        } : location
      )
    );
    console.log("Saving location:", locationId, locationData);
  };

  const deleteLocation = (locationId) => {
    setLocations(prev => prev.filter(location => location.id !== locationId));
    console.log("Deleting location:", locationId);
  };

  return (
    <div className="dc-step4locations">
      <LocationsAccordion
        locations={locations}
        onAddLocation={addNewLocation}
        onDeleteLocation={deleteLocation}
        onUpdateLocation={handleUpdateLocation}
        onSaveLocation={handleSaveLocation}
        ComponentProp={ComponentProp}
        header={header}
        allowMultipleOpen={false}
      />
    </div>
  );
}