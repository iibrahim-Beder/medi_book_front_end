
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useGetDoctorShiftRulesQuery } from '../api/doctor-information/generationRulesApi';
import { FaChevronDown } from "react-icons/fa";

export function StatusToggle() {
  const [status, setStatus] = useState("active");

  return (
    <div className="toggle-wrapper">
      <button
        className={`toggle-btn ${status === "active" ? "active" : ""}`}
        onClick={() => setStatus("active")}
      >
        Active
      </button>

      <button
        className={`toggle-btn ${status === "inactive" ? "inactive" : ""}`}
        onClick={() => setStatus("inactive")}
      >
        Inactive
      </button>
    </div>
  );
}
export default function Doctor() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("active");
  return (
    <div className="">
      <h1>Doctor generation rules</h1>

      <StatusToggle />

      <ActiveTabs activeCount={2} inactiveCount={3} activeTab={activeTab} setActiveTab={setActiveTab} />
      <AppointmentToggle activeCount={2} inactiveCount={3} />
      <StatusSelect />
 
    </div>
  );
}
export  function ActiveTabs({
  activeCount = 0,
  inactiveCount = 0,
  activeTab,
  setActiveTab
}) {

  const tabs = [
    { key: "active", label: "Active", count: activeCount },
    { key: "inactive", label: "InActive", count: inactiveCount },
  ];

  const visibleTabs = tabs.filter((tab) => tab.count > 0);

  if (visibleTabs.length === 0) return null;

  return (
    <div className="active-tabs">
      <ul className="nav nav-pills inner-tab">
        {visibleTabs.map((tab) => (
          <li className="nav-item" key={tab.key}>
            <button
              className={`nav-link ${
                activeTab === tab.key ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.key)}
              type="button"
            >
              {tab.label}
              <span className='num-item' style={{lineHeight:1.5}}>{tab.count}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* Content */}
      {/* <div className="tab-content mt-3">
        {activeTab === "active" && (
          <div>Active Content</div>
        )}
        {activeTab === "inactive" && (
          <div>Inactive Content</div>
        )}
      </div> */}
    </div>
  );
}
export  function AppointmentToggle({
  activeCount = 0,
  inactiveCount = 0,
  activeTab, setActiveTab
}) {
  // const [selected, setSelected] = useState("active");

  const tabs = [
    { key: "active", label: "Active", count: activeCount },
    { key: "inactive", label: "InActive", count: inactiveCount },
  ];

  // if (options.length === 0) return null;

  return (
    <div className="toggle-container">
      {tabs.map((tab) => (
        <div
          key={tab.key}
          className="toggle-item"
              onClick={() => setActiveTab(tab.key)}
        >
          <span
            className={`dot ${
              activeTab === tab.key ? "active" : ""
            }`}
          ></span>

          <span className="label">
            {tab.label} <span className="count">{tab.count}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
export  function StatusSelect({selected, setSelected}) {
  const [isOpen, setIsOpen] = useState(false);
  // const [selected, setSelected] = useState("Active");

  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = ["Active", "Inactive"];

  return (
    <div className="select-container" ref={ref}>
      <button
        className="select-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected}
    <FaChevronDown />
      </button>

      {isOpen && (
        <div className="tooltip-arrow mt-2" style={{    position: "absolute",zIndex: 3,width:" 100%"}}>
        <div className="dropdown">
          {options.map((opt) => (
            <div
              key={opt}
              className={`option ${
                selected === opt ? "active" : ""
              }`}
              onClick={() => {
                setSelected(opt);
                setIsOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
        </div>
      )}
    </div>
  );
}