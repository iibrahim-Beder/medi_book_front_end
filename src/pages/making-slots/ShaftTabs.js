import React from "react";
import { useTranslation } from "react-i18next";


export default function ShaftTabs({ activeShift, setActiveShift,tabs }) {
  return (
    <div className="col-12 p-0 two-tabs">
      <div className="div-container-tabs shift">
        <ul className="nav nav-tabs nav-fill two-tabs-nav-container">
          {tabs.map((tab) => (
            <li className="nav-item" key={tab.templateId}>
              <a
                style={{ display: "flex", flexDirection: "column" }}
                href={`#${tab.templateId}`}
                className={`nav-link ${
                  Number(activeShift) === Number(tab.templateId) ? "active" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveShift(tab.templateId);
                }}
              >
                {tab.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
