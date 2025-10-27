import React, { useState, useEffect } from "react";
import { FaPencilAlt, FaTrash, FaPlus } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import BlueMapPicker from "./MapSearch";

// 1. Accordion for multiple locations
function LocationsAccordion({
  locations,
  toggleAccordion,
  handleSave,
  handleDelete,
  handleCancel,
}) {
  const { t } = useTranslation();

  return (
    <ul className="dc-experienceaccordion accordion">
      {locations.map((loc) => {
        const headerText = loc.displayName
          ? `${loc.displayName} - ${loc.officialName || ""}`
          : t("userLocation.newLocation");

        return (
          <li key={loc.id}>
            <div className="dc-accordioninnertitle">
              <span
                onClick={() => toggleAccordion(loc.id)}
                style={{ cursor: "pointer" }}
                aria-expanded={loc.isOpen}
              >
                {headerText}
              </span>
              <div className="dc-rightarea">
                <a
                  className="dc-addinfo"
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleAccordion(loc.id);
                  }}
                >
                  <FaPencilAlt />
                </a>
                <a
                  className="dc-deleteinfo"
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(loc.id);
                  }}
                >
                  <FaTrash />
                </a>
              </div>
            </div>

            {loc.isOpen && (
              <div className="dc-collapseexp collapse show">
                <BlueMapPicker
                  initial={loc}
                  onSave={(newLoc) => handleSave(newLoc, loc.id)}
                  handleCancel={() => handleCancel(loc.id)}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

// 2. Main component
export default function Step4Locations({
  ComponentProp,
  header = true,
  initialLocations = [],
  openFirstByDefault = true,
  onChange = () => {},
}) {
  const { t } = useTranslation();

  const [locations, setLocations] = useState(
    initialLocations.length
      ? initialLocations.map((loc, i) => ({
          ...loc,
          isOpen: openFirstByDefault && i === 0 ? true : false,
        }))
      : [
          {
            id: 1,
            lat: 30.0444,
            lng: 31.2357,
            displayName: "",
            officialName: "",
            isOpen: openFirstByDefault,
          },
        ]
  );

  useEffect(() => {
    onChange(locations);
  }, [locations]);

  const toggleAccordion = (id) => {
    setLocations((prev) =>
      prev.map((loc) =>
        loc.id === id
          ? { ...loc, isOpen: !loc.isOpen }
          : { ...loc, isOpen: false }
      )
    );
  };

  const handleSave = (newLoc, id) => {
    setLocations((prev) =>
      prev.map((loc) =>
        loc.id === id ? { ...newLoc, id: loc.id, isOpen: false } : loc
      )
    );
  };

  const handleCancel = (id) => {
    setLocations((prev) =>
      prev.map((loc) =>
        loc.id === id ? { ...loc, isOpen: false } : loc
      )
    );
  };

  const handleDelete = (id) => {
    setLocations((prev) => prev.filter((loc) => loc.id !== id));
  };

  const addNewLocation = () => {
    const newId = locations.length
      ? Math.max(...locations.map((l) => l.id)) + 1
      : 1;
    const newLoc = {
      id: newId,
      lat: 51.0,
      lng: 15.2551,
      displayName: "",
      officialName: "",
      isOpen: true,
    };
    setLocations((prev) =>
      prev.map((l) => ({ ...l, isOpen: false })).concat(newLoc)
    );
  };

  return (
    <div className="dc-userexperience dc-tabsinfo">
      <div className="title-with-icon ">
        {ComponentProp}
        {header && (
          <div className="dc-tabscontenttitle dc-addnew">
            <h3>{t("userLocation.addYourLocation")}</h3>
            <a
              href="#!"
              onClick={(e) => {
                e.preventDefault();
                addNewLocation();
              }}
            >
              <FaPlus /> {t("userLocation.addNew")}
            </a>
          </div>
        )}
        {!header && (
          <a
            href="#!"
            onClick={(e) => {
              e.preventDefault();
              addNewLocation();
            }}
          >
            <FaPlus /> {t("userLocation.addNew")}
          </a>
        )}
      </div>

      {locations.length === 1 && !openFirstByDefault ? (
        // أول Location يظهر كـ Field مختصر مع أزرار Edit/Delete
        <LocationsAccordion
          locations={locations}
          toggleAccordion={toggleAccordion}
          handleSave={handleSave}
          handleDelete={handleDelete}
          handleCancel={handleCancel}
        />
      ) : locations.length === 1 ? (
        <BlueMapPicker
          initial={locations[0]}
          onSave={(newLoc) => handleSave(newLoc, locations[0].id)}
        />
      ) : (
        <LocationsAccordion
          locations={locations}
          toggleAccordion={toggleAccordion}
          handleSave={handleSave}
          handleDelete={handleDelete}
          handleCancel={handleCancel}
        />
      )}
    </div>
  );
}
