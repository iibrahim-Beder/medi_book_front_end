import React, { useState } from "react";
import BlueMapPicker from "./MapSearch";
import { FaPencilAlt, FaTrash, FaPlus } from "react-icons/fa";
import "../../MainCss.css";
import { useTranslation } from "react-i18next";

const LocationField = ({
  ComponentProp,
  locations = [
    {
      lat: 30.0444,
      lng: 31.2357,
      displayName: "العنوان الرئيسي - القاهرة",
      officialName: "القاهرة، محافظة القاهرة، مصر",
      isOpen: false,
    },
  ],
  onSave,
  onDelete,
  onAdd,
  header = true,
}) => {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [editIndex, setEditIndex] = useState(-1);

  // Save location (either add new or update existing one)
  const handleSave = (newLocation) => {
    if (editIndex >= 0) {
      const updatedLocations = [...locations];
      updatedLocations[editIndex] = { ...newLocation, isOpen: false };
      if (onSave) onSave(updatedLocations);
    } else {
      if (onAdd) onAdd([...locations, { ...newLocation, isOpen: false }]);
    }
    setEditing(false);
    setCurrentLocation(null);
    setEditIndex(-1);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditing(false);
    setCurrentLocation(null);
    setEditIndex(-1);
  };

  // Toggle accordion (expand/collapse location details)
  const toggleAccordion = (index) => {
    const updatedLocations = locations.map((loc, i) => ({
      ...loc,
      isOpen: i === index ? !loc.isOpen : false,
    }));
    if (onSave) onSave(updatedLocations);
  };

  // Edit existing location
  const handleEdit = (location, index) => {
    setCurrentLocation(location);
    setEditIndex(index);
    setEditing(true);
  };

  // Delete location by index
  const handleDelete = (index) => {
    if (onDelete) onDelete(index);
  };

  // Add new location (default values)
  const handleAddNew = () => {
    setCurrentLocation({
      lat: 51.0,
      lng: 15.2551,
      displayName: "",
      officialName: "",
      isOpen: false,
    });
    setEditIndex(-1);
    setEditing(true);
  };

  // If user is currently editing a location → show map picker
  if (editing) {
    return (
      <BlueMapPicker
        initial={
          currentLocation || {
            lat: 51.0,
            lng: 15.2551,
            displayName: "",
            officialName: "",
          }
        }
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="dc-shiftsmanager dc-tabsinfo">
      {/* Header with "Add Location" button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {ComponentProp}
        {header ? (
          <div className="dc-tabscontenttitle dc-addnew">
            <h3>{t("LocationInformation")}</h3>
            <a
              href="#!"
              onClick={(e) => {
                e.preventDefault();
                handleAddNew();
              }}
              className="dc-add-btn"
            >
              <FaPlus /> {t("AddLocation")}
            </a>
          </div>
        ) : (
          <a
            href="#!"
            onClick={(e) => {
              e.preventDefault();
              handleAddNew();
            }}
            className="dc-add-btn"
          >
            <FaPlus /> {t("AddLocation")}
          </a>
        )}
      </div>

      {/* Locations List */}
      <ul className="dc-shiftsaccordion accordion">
        {locations.length === 0 ? (
          // Case: No locations added yet
          <li>
            <div className="dc-no-locations">
              {t("NoLocationsAddedYet")}
            </div>
          </li>
        ) : locations.length === 1 ? (
          // Case: Only one location → show it directly in map picker
          <BlueMapPicker
            initial={locations[0]}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          // Case: Multiple locations → show accordion
          locations.map((location, index) => (
            <li key={index}>
              <div className="dc-accordioninnertitle">
                <span
                  onClick={() => toggleAccordion(index)}
                  style={{ cursor: "pointer" }}
                  aria-expanded={location.isOpen}
                >
                  {location.displayName || t("NoLocationSelected")}
                </span>
                <div className="dc-rightarea">
                  {/* Edit button */}
                  <a
                    className="dc-addinfo"
                    href="#!"
                    onClick={(e) => {
                      e.preventDefault();
                      handleEdit(location, index);
                    }}
                  >
                    <FaPencilAlt />
                  </a>
                  {/* Delete button */}
                  <a
                    className="dc-deleteinfo"
                    href="#!"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(index);
                    }}
                  >
                    <FaTrash />
                  </a>
                </div>
              </div>

              {/* Expanded location details */}
              {location.isOpen && (
                <div className="dc-collapseexp collapse show">
                  <div className="dc-formtheme dc-userform">
                    <fieldset>
                      <div className="form-group">
                        <label>{t("LocationName")}</label>
                        <div className="dc-description">
                          {location.displayName || t("NotSpecified")}
                        </div>
                      </div>
                      <div className="form-group">
                        <label>{t("OfficialAddress")}</label>
                        <div className="dc-description">
                          {location.officialName || t("NotSpecified")}
                        </div>
                      </div>
                      <div className="form-group">
                        <label>{t("Coordinates")}</label>
                        <div className="dc-description">
                          {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default LocationField;
