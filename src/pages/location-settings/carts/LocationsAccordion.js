import React, { memo, useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";
import { FaPlus} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import BlueMapPicker from "./MapSearch";
import PopupMessage from "../../shared/PopupMessage";
import { FaMapLocationDot } from "react-icons/fa6";


const LocationsAccordion = memo(({
  titlebackgroundColor = "var(--badybkcolor)",
  locations = [],
  onAddLocation,
  onDeleteLocation,
  onSaveLocation,
  onToggleActive, 
  ComponentProp = null,
  header = true,
  allowMultipleOpen = false,
  title = "Locations",
  noDataMessage = "No locations found",
}) => {
  const { t } = useTranslation();
  const [dataRead, setDataRead] = useState([]);
  const [draftData, setDraftData] = useState({});
  const [deletePopup, setDeletePopup] = useState({ show: false, id: null, itemName: "" });
  // new state for activation confirmation
  const [activePopup, setActivePopup] = useState({ show: false, id: null, newActive: false, locationName: "" });

  useEffect(() => {
    const formattedData = locations.map(location => ({
      ...location,
      id: location.id,
      isExpanded: location.isExpanded || false,
      isNew: location.isNew || false,
    }));
    setDataRead(formattedData);
    setDraftData({});
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

  // Handle active toggle confirmation
  const handleShowActiveConfirm = (id, newActive, locationName) => {
    setActivePopup({ show: true, id, newActive, locationName });
  };

  const handleCloseActiveConfirm = () => {
    setActivePopup({ show: false, id: null, newActive: false, locationName: "" });
  };

  const handleConfirmActiveToggle = () => {
    if (activePopup.id !== null && onToggleActive) {
      onToggleActive(activePopup.id, activePopup.newActive);
    }
    handleCloseActiveConfirm();
  };


  const handleEditClick = (id) => {
    setDataRead(prev =>
      prev.map(item => ({
        ...item,
        isExpanded: item.id === id
          ? !item.isExpanded
          : allowMultipleOpen
          ? item.isExpanded
          : false,
      }))
    );

    const item = dataRead.find(i => i.id === id);
    if (item && !item.isExpanded) {
      setDraftData(prev => ({
        ...prev,
        [id]: {
          lat: item.lat,
          lng: item.lng,
          displayName: item.displayName,
          officialName: item.officialName,
          isPrimary: item.isPrimary,
          isActive: item.isActive, // include isActive in draft (optional)
        },
      }));
    } else {
      setDraftData(prev => {
        const newDraft = { ...prev };
        delete newDraft[id];
        return newDraft;
      });
    }
  };

  const handleDraftChange = (id, field, value) => {
    setDraftData(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || dataRead.find(i => i.id === id) || {}),
        [field]: value,
      },
    }));
  };

  const handleSave = async (id) => {
    const draft = draftData[id];
    if (!draft) return;

    if (onSaveLocation) {
      const success = await onSaveLocation(id, draft);
      if (success) {
        setDataRead(prev =>
          prev.map(item =>
            item.id === id ? { ...item, isExpanded: false } : item
          )
        );
        setDraftData(prev => {
          const newDraft = { ...prev };
          delete newDraft[id];
          return newDraft;
        });
      }
    }
  };

  const handleCancel = (id) => {
    const item = dataRead.find(loc => loc.id === id);
    if (item?.isNew) {
      if (onDeleteLocation) {
        onDeleteLocation(id);
      }
    } else {
      setDataRead(prev =>
        prev.map(item =>
          item.id === id ? { ...item, isExpanded: false } : item
        )
      );
      setDraftData(prev => {
        const newDraft = { ...prev };
        delete newDraft[id];
        return newDraft;
      });
    }
  };

  const truncateTitle = (text, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className="dc-userexperience custom-accordion">
      {/* Header section (unchanged) */}
      <div className="">
        {ComponentProp}
        {header && (
          <div className="dc-tabscontenttitle dc-addnew  title-card">
            <h3>{title}</h3>
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
      {dataRead.length===0?(
        <div className="dc-experienceaccordion accordion">
          <span>{noDataMessage}</span>
        </div>
      ):(
      <ul className="dc-experienceaccordion accordion">
        {dataRead.map((item) => {
          const primaryCheckboxId = `primary-${item.id}`;
          const activeCheckboxId = `active-${item.id}`;
          const displayData = draftData[item.id] || item;

          return (
            <li key={item.id} className={`${item.isExpanded?"show":""}`}>
              {/* Accordion title (unchanged) */}
              <div
                className="dc-accordioninnertitle"
                style={{
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
                  {item.isPrimary && (
                    <FaMapLocationDot style={{ color: "var(--themecolor)" }} />
                  )}
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

              {/* Expanded content */}
              <div
                style={{
                  backgroundColor: "var(--badybkcolor)",
                }}
                className={`dc-collapseexp ${item.isExpanded ? "show" : "hide"}`}
              >
                <div>
                  <BlueMapPicker
                    value={displayData}
                    onChange={(loc) => {
                      handleDraftChange(item.id, "lat", loc.lat);
                      handleDraftChange(item.id, "lng", loc.lng);
                      handleDraftChange(item.id, "officialName", loc.officialName);
                      handleDraftChange(item.id, "displayName", loc.displayName);
                    }}
                  />
                  <div style={{ marginTop: "15px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    {/* Primary checkbox (draft-based) */}
                    <div className="dc-on-off">
                      <input style={{margin:"0 10px"}}
                        type="checkbox"
                        id={primaryCheckboxId}
                        checked={!!displayData.isPrimary}
                        onChange={(e) =>
                          handleDraftChange(item.id, "isPrimary", e.target.checked)
                        }
                      />
                      <label style={{margin:"0 8px"}} htmlFor={primaryCheckboxId}>
                        <i></i>
                      </label>
                      <span>{t("Is Primary")}</span>
                    </div>
                  </div>
                </div>
                <div className="dc-btnarea d-flex align-items-end w-100 pt-3">
                {!item.isNew &&<button
                    type="button"
                    onClick={() => handleShowActiveConfirm(item.id, !item.isActive, getLocationTitle(item))}
                    className={`second-btn mr-auto ${item.isActive ? "deactivate-btn" : ""}`}
                    style={{   minWidth:"fit-content" }}
                    >
                    {item.isActive ? t("Deactivate"): t("Activate")}
                </button>}
                  <button
                    type="button"
                    style={{ margin: '0 5px' }}
                    className="simple-btn"
                    onClick={() => handleCancel(item.id)}
                  >
                    {t("Cancel")}
                  </button>
                  <button
                    type="submit"
                    className="second-btn"
                    style={{ minWidth: "100px" }}
                    onClick={() => handleSave(item.id)}
                  >
                    {t("Save")}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      )
      }

      {/* Delete confirmation popup (unchanged) */}
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

      {/* Active toggle confirmation popup */}
      {activePopup.show && (
        <PopupMessage
          type="warning"
          title={t("are you sure?")}
          message={t(
            activePopup.newActive
              ? "Are you sure you want to activate this location?"
              : "Are you sure you want to deactivate this location?",
            { name: activePopup.locationName }
          )}
          buttons={[
            {
              text: t("Cancel"),
              onClick: handleCloseActiveConfirm,
              variant: "secondary"
            },
            {
              text: t("Confirm"),
              onClick: handleConfirmActiveToggle,
              variant: "primary"
            }
          ]}
          onClose={handleCloseActiveConfirm}
        />
      )}
    </div>
  );
});

export default LocationsAccordion;