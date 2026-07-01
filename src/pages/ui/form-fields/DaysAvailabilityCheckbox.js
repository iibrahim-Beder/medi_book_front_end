import { IoMdRefresh } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdOutlineCheckCircle } from "react-icons/md";
import { FaCheckCircle, FaChevronDown } from "react-icons/fa";
import { CgUnavailable } from "react-icons/cg";
import { IoLocation } from "react-icons/io5";

const DaysAvailabilityCheckbox = ({
  availability=[],
  selectedDays=[],
  onToggle,
  dayNames = null, 
  readOnly = false,
  disabled: MainInputdisabled = false,
  loading = false,
  error = false,
  locationVisability = false,
  openAlways=false,
  isUseToDeactivate  = false,
  isUseToReactivate  = false
}) => {
  console.log("availability",availability);
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const defaultDayNames = {
    0: t("days.sunday"),
    1: t("days.monday"),
    2: t("days.tuesday"),
    3: t("days.wednesday"),
    4: t("days.thursday"),
    5: t("days.friday"),
    6: t("days.saturday"),
  };

  const getDayName = (dayOfWeek) =>
    (dayNames ? dayNames[dayOfWeek] : defaultDayNames[dayOfWeek]) || dayOfWeek;

  const getStatusInfo = (item) => {
    const { state, shiftId } = item;
    
    if(isUseToDeactivate ){
    if (state === "Active") {
      return {
        disabled: false,
        // icon: <MdOutlineCheckCircle   className="status-icon deactivated" />,
        // label: t(""),
        Conflict: false,
        deactivated: true
      };
    } else if (state === "Inactive" ) {
      return {
        disabled: true,
        icon: <CgUnavailable   className="status-icon reactivate" />,
        label: t("day already deactivated"),
        Conflict: false,
        deactivated: true
      };
    } else if (state === "NoShift" || state === "NotExist") {
      return {
        disabled: true,
        icon: <CgUnavailable   className="status-icon reactivate" />,
        label: t("day has no shift"),
        Conflict: true,
        deactivated: true
      };
    }
    
    
    
    }
        
    if (state === "Active") {
      return {
        disabled: true,
        icon: <FaCheckCircle className="status-icon active" />,
        label: t("day already active"),
      };
    } else if (state === "Inactive" && shiftId) {
      return {
        disabled: false,
        icon: <IoMdRefresh className="status-icon reactivate" />,
        label: t("day will reactivated"),
      };
    } else if (state === "NoShift" || (isUseToReactivate && state === "NotExist")) {
      return {
        disabled: true,
        icon: <CgUnavailable   className="status-icon reactivate" />,
        label: t("day has no shift"),
        Conflict: true,
      };
    } else if (state === "Conflict") {
      return {
        disabled: true,
        icon: <CgUnavailable   className="status-icon reactivate" />,
        label: t("day conflict"),
        Conflict: true,
      };
    }else if (state === "AlreadyDeactivated") {
      return {
        disabled: true,
        icon: <CgUnavailable   className="status-icon reactivate" />,
        label: t("day already deactivated"),
        Conflict: false,
        deactivated: true
      };
    }else if (state === "AvailableToDeactivate") {
      return {
        disabled: false,
        // icon: <MdOutlineCheckCircle   className="status-icon deactivated" />,
        // label: t(""),
        Conflict: false,
        deactivated: true
      };
    }
    else {
      return {
        icon: <MdOutlineCheckCircle   className="status-icon active " />,
        disabled: false,
        label: "Available",
      };
    }
  };

  const sortedAvailability = [...availability].sort(
    (a, b) => a.dayOfWeek - b.dayOfWeek,
  );

    const selectedDayNames = selectedDays.map((day) => getDayName(day));
    const  selectedDayNamesString = loading ? t("Loading...") : selectedDayNames.length > 0 ? selectedDayNames.length === 7 ? t("All days") : selectedDayNames.join(", "): t("Select days");

  return (
    <div
      ref={dropdownRef}
      className={`form-group `}
      // className={` ${isOpen ? " form-group table-filter-show" : ""} ` }
    >
      {!openAlways && <>
       <label> {t("Choose Days")} </label>
      <div
        className={`input-with-icon select-wrapper ${error ? "input-error" : ""}`}
        style={{cursor:"pointer"}}
        onClick={() => !MainInputdisabled && setIsOpen(!isOpen)}
      >
        {/* <select
           title={selectedDayNamesString}
          // className="form-control"
          value=""
          disabled={MainInputdisabled}
        >
          <option>{  loading ? t("Loading...") :  MainInputdisabled ? t("Blocked Select Template For Days") : selectedDayNamesString}</option>
        </select> */}
                  <input
                            style={{paddingRight:"30px", border:isOpen ? "1px solid var(--blue)" : "" }}

              ref={inputRef}
              type="text"
              className={`form-control Select1 TimePickerMain ${false ? "input-error" : ""}`}
              // id={name}
              // name={name}
              value={selectedDayNamesString}
              // onFocus={handleInputFocus}
              // onKeyDown={handleKeyDown}
              disabled={MainInputdisabled}
              autoComplete="off"
              // style={{
              //   border:
              //     inputError || showError
              //       ? "1px solid #ff4d4f"
              //       : "",
              // }}
              // placeholder={placeholder}
            />

        <FaChevronDown className="select-arrow" />
      </div>
      </>
      }

      {(isOpen || openAlways) && (
        <div className="table-filter-container">
          <div
            // className="filter-dropdown-menu dropdown-menu show"
            className={`${openAlways ? " " : "hover-tooltip tooltip-arrow  container-checkboxs "} `}
            style={{
              position:openAlways ? "unset" : "absolute",
            }}
          >
            <div className="days-availability-checkbox">
              {sortedAvailability.map((item, index) => {
                const dayOfWeek = item.dayOfWeek;
                const status = getStatusInfo(item);
                const Conflict = status.Conflict || false;
                const disabled = status.disabled || readOnly;
                const isChecked = ((selectedDays.includes(dayOfWeek))||(disabled)) && !Conflict;

                return (
                  <span key={dayOfWeek} className={`dc-checkbox ${ status.deactivated? "deactivated" : ""}`}>
                    <input
                      type="checkbox"
                      id={`${getDayName(dayOfWeek)}-type-${index}`}
                      checked={isChecked}
                      onChange={() => onToggle(dayOfWeek)}
                      disabled={disabled}
                      value={dayOfWeek}
                    />
                    <label
                      className={`day-label ${disabled ? "disabled" : "enabled"}`}
                      htmlFor={`${getDayName(dayOfWeek)}-type-${index}`}
                    >
                      <div className="d-flex " style={{ gap: "4px" }}>
                        <span style={{width:"50%", minWidth:"fit-content"}} >
                        {getDayName(dayOfWeek)}
                        </span>
                      <div className={`labels ${locationVisability ? "container-label-location" : ""}`}>
                        <div className="status-label d-flex w-100">
                        {status.icon && (
                          <span className="status-indicator">
                            {status.icon}
                          </span>
                        )}
                          {status.label && (
                          <span className="status-text">{status.label}</span>
                        )}
                        </div>
                        {status.label && locationVisability && (
                          <span className="location">
                            <IoLocation className="mr-1" />
                            {item.locationName?.length > 30
                              ? `${item.locationName.slice(0, 30)}...`
                              : item.locationName}
                          </span>
                        )} 
                        </div>
                      </div>
                    </label>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
            {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default DaysAvailabilityCheckbox;
