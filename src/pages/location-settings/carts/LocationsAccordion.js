import React, { memo, useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";
import { FaPlus, FaMapMarkerAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import BlueMapPicker from "./MapSearch";
import PopupMessage from "../../shareds/PopupMessage";

const LocationsAccordion = memo(({
  titlebackgroundColor = "var(--cardcolor)",
  locations = [],
  onAddLocation,
  onDeleteLocation,
  onUpdateLocation,
  onSaveLocation,
  ComponentProp = null,
  header = true,
  allowMultipleOpen = false,
}) => {
  const { t } = useTranslation();
  const [dataRead, setDataRead] = useState([]);
  const [deletePopup, setDeletePopup] = useState({ show: false, id: null, itemName: "" });

  useEffect(() => {
    const formattedData = locations.map(location => ({
      ...location,
      id: location.id,
      isExpanded: location.isExpanded || false,
      isNew: location.isNew || false,
    }));
    setDataRead(formattedData);
  }, [locations]);

  const getLocationTitle = (location) => {
    if (location.displayName) {
      return location.displayName;
    }
    if (location.officialName) {
      return location.officialName;
    }
    return t("userLocation.newLocation");
  };

  const handleShowDeleteConfirm = (id, itemName) => {
    setDeletePopup({ show: true, id, itemName });
  };

  const handleCloseDeleteConfirm = () => {
    setDeletePopup({ show: false, id: null, itemName: "" });
  };

  const handleConfirmDelete = () => {
    if (deletePopup.id !== null && onDeleteLocation) {
      onDeleteLocation(deletePopup.id);
    }
    handleCloseDeleteConfirm();
  };

  const handleEditClick = (id) => {
    const updatedData = dataRead.map((item) => ({
      ...item,
      isExpanded: item.id === id ? !item.isExpanded : (allowMultipleOpen ? item.isExpanded : false)
    }));
   
    setDataRead(updatedData);
    updatedData.forEach((item) => {
      if (onUpdateLocation && item.id) {
        onUpdateLocation(item.id, "isExpanded", item.isExpanded);
      }
    });
  };

  const handleSave = (id, locationData) => {
    if (onSaveLocation) {
      onSaveLocation(id, locationData);
    }
  };

  const handleCancel = (id) => {
    const item = dataRead.find(loc => loc.id === id);
    if (item?.isNew) {
      if (onDeleteLocation) {
        onDeleteLocation(id);
      }
    } else {
      handleEditClick(id);
    }
  };

  const truncateTitle = (text, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className="dc-locationsmanager dc-tabsinfo two-level-accordion locations">
      <div className="d-flex justify-content-between align-items-center mb-3">
        {ComponentProp}
        {header && (
          <div className="dc-tabscontenttitle dc-addnew">
            <h3>{t("userLocation.addYourLocation")}</h3>
            {onAddLocation && (
              <a href="#!" onClick={(e) => {
                e.preventDefault();
                onAddLocation();
              }}>
                <FaPlus /> {t("userLocation.addNew")}
              </a>
            )}
          </div>
        )}
        {!header && onAddLocation && (
          <a href="#!" onClick={(e) => {
            e.preventDefault();
            onAddLocation();
          }}>
            <FaPlus /> {t("userLocation.addNew")}
          </a>
        )}
      </div>

      <ul className="dc-experienceaccordion accordion">
        {dataRead.map((item) => (
          <li key={item.id}>
            <div
              className="dc-accordioninnertitle"
              style={{
                borderColor: "#eee",
                borderLeft: item.isNew
                  ? "2px solid #ffa500"
                  : "",
                borderBottomLeftRadius: item.isExpanded ? "0" : "",
                backgroundColor: `${titlebackgroundColor}`,
              }}
            >
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer"
                }}
                onClick={() => handleEditClick(item.id)}
              >
                <FaMapMarkerAlt style={{ color: "var(--themecolor)" }} />
                <span
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "inline-block",
                  }}
                  title={getLocationTitle(item)}
                >
                  {truncateTitle(getLocationTitle(item), 60)}
                </span>
                {item.isNew && (
                  <span style={{ color: "#ffa500", fontWeight: "bold", fontSize: "0.9em" }}>
                    ({t("status.new")})
                  </span>
                )}
              </span>

              <div className="dc-rightarea" onClick={(e) => e.stopPropagation()}>
                <a
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEditClick(item.id);
                  }}
                  className="dc-addinfo dc-skillsaddinfo"
                >
                  <FiEdit2 />
                </a>
                {onDeleteLocation && (
                  <a
                    href="#!"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleShowDeleteConfirm(item.id, getLocationTitle(item));
                    }}
                    className="dc-deleteinfo"
                    style={{ marginLeft: "8px" }}
                  >
                    <IoTrashOutline />
                  </a>
                )}
              </div>
            </div>

            <div
              style={{
                backgroundColor: "var(--cardcolor)",
              }}
              className={`dc-collapseexp ${item.isExpanded ? "show" : "hide"}`}
            >
              <div style={{ padding: "20px" }}>
                <BlueMapPicker
                  initial={item}
                  onSave={(newLocation) => handleSave(item.id, newLocation)}
                  handleCancel={() => handleCancel(item.id)}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

      {deletePopup.show && (
        <PopupMessage
          type="danger"
          title={t("popup.delete_location_title")}
          message={t("popup.delete_location_confirm", { name: deletePopup.itemName })}
          buttons={[
            {
              text: t("actions.cancel"),
              onClick: handleCloseDeleteConfirm,
              variant: "secondary"
            },
            {
              text: t("actions.delete"),
              onClick: handleConfirmDelete,
              variant: "danger"
            }
          ]}
          onClose={handleCloseDeleteConfirm}
        />
      )}
    </div>
  );
});

export default LocationsAccordion;