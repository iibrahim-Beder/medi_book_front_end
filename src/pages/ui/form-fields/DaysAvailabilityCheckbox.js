import { IoMdRefresh } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdOutlineCheckCircle } from "react-icons/md";
import { FaCheckCircle, FaChevronDown } from "react-icons/fa";
import { CgUnavailable } from "react-icons/cg";

const DaysAvailabilityCheckbox = ({
  availability=[],
  selectedDays=[],
  onToggle,
  dayNames = null, 
  readOnly = false,
  disabled: MainInputdisabled = false,
  loading = false,
  error = false
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
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
    } else if (state === "NoShift") {
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
    } else {
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

  return (
    <div
      ref={dropdownRef}
      className={`form-group `}
      // className={` ${isOpen ? " form-group table-filter-show" : ""} ` }
    >
      <label> {t("Days")} </label>
      <div
        className="input-with-icon select-wrapper"
        style={{cursor:"pointer"}}
        onClick={() => !MainInputdisabled && setIsOpen(!isOpen)}
      >
        <select
          // className="form-control"
          value=""
          disabled={MainInputdisabled}
          style={{ pointerEvents: "none" }}
        >
          <option>{  loading ? t("Loading...") :  MainInputdisabled ? t("Blocked Select Template For Days") : t("Select days")}</option>
        </select>

        <FaChevronDown className="select-arrow" />
      </div>

      {isOpen && (
        <div className="table-filter-container">
          <div
            // className="filter-dropdown-menu dropdown-menu show"
            className="hover-tooltip tooltip-arrow"
            style={{
              // right: "4%",
              // top: "auto",
              // left: "unset",
              padding: "20px ",
              borderRadius: "5px",
              background: "var(--cardcolor)",
              border: "1px solid #E6E8EE",
              boxShadow: "var(--scshadocolor) 0px 4px 14px 0px",
              position: "absolute",
              marginTop: "10px",
              zIndex: 9,
              width: "97%",
              // maxWidth: "350px"
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
                  <span key={dayOfWeek} className="dc-checkbox">
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
                        <span style={{width:"30%", minWidth:"fit-content"}} >
                        {getDayName(dayOfWeek)}
                        </span>
                        {status.icon && (
                          <span className="status-indicator">
                            {status.icon}
                          </span>
                        )}
                        {status.label && (
                          <span className="status-text">{status.label}</span>
                        )}
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
