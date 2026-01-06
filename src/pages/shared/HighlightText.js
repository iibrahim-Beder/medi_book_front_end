import React from "react";
import Highlighter from "react-highlight-words";

const HighlightText = ({
  text,
  searchTerm,
  matchedFields = [],
  fieldName,
  className = ""
}) => {
  if (!text || !searchTerm) {
    return <span className={className}>{text}</span>;
  }

  const shouldHighlight = matchedFields.some(
    (match) => match.field === fieldName
  );

  if (!shouldHighlight) {
    return <span className={className}>{text}</span>;
  }

  return (  
    <Highlighter
      highlightClassName="text-highlight"
      searchWords={[searchTerm]}
      autoEscape
      textToHighlight={String(text)}
      caseSensitive={false}
    />
  );
};

export default HighlightText;
