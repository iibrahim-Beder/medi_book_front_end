import { useState } from "react";
import "./DashboardBoxTitle.scss";

export default function DashboardBoxTitle({ title, tags }) {
  const [activeTag, setActiveTag] = useState(tags[0]); // Default to the first tag

  return (
    <div className="dc-dashboardboxtitle dc-yeartag">
      <h2>{title}</h2>
      <div className="dc-tag dc-widgettag">
        {tags.map((tag, index) => (
          <a
            key={index}
            href="#"
            className={activeTag === tag ? "dc-tagactive" : ""}
            onClick={(e) => {
              e.preventDefault();
              setActiveTag(tag);
            }}
          >
            {tag}
          </a>
        ))}
      </div>
    </div>
  );
}
