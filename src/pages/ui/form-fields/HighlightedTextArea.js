import React from "react";
import Highlighter from "react-highlight-words";

const HighlightedTextArea = ({
  value = "",
  onChange,
  placeholder,
  searchTerm,
  isHasMatched = false,
  disabled = false,
  name,
}) => {
  return (
      <div className="readonly-textarea" >
        <Highlighter
          highlightClassName="text-highlight"
          searchWords={isHasMatched && searchTerm ? [searchTerm] : []}
          autoEscape
          textToHighlight={value || placeholder || ""}
        />
      </div>
  );
};

export default HighlightedTextArea;
