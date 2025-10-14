import React from "react";
import { FaTrash } from "react-icons/fa";

export default function BreakItem({ breakData, onBreakChange, onDeleteBreak }) {
  return (
    <div className="breakdiv">
      <div>
        {" "}
        <label style={{ marginBottom: "0px" }}>Start time</label>
        <input
          type="time"
          value={breakData.from}
          onChange={(e) => onBreakChange("from", e.target.value)}
        />
      </div>
      <div>
        <label style={{ marginBottom: "0px" }}>Start time</label>

        <input 
          type="time"
          value={breakData.to}
          onChange={(e) => onBreakChange("to", e.target.value)}
        />
      </div>

      <button
        className="DeletBtn dc-deleteinfo"
        onClick={(e) => {
          e.preventDefault();
          onDeleteBreak();
        }}
      >
        <FaTrash />
      </button>
    </div>
  );
}