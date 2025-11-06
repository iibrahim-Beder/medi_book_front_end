import React from 'react';
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

  const shouldHighlight = matchedFields.includes(fieldName);
  
  if (!shouldHighlight) {
    return <span className={className}>{text}</span>;
  }

  return (
    <Highlighter
      highlightClassName="text-highlight"
      searchWords={[searchTerm]}
      autoEscape={true}
      textToHighlight={String(text)}
      caseSensitive={false}
      findChunks={({ searchWords, textToHighlight }) => {
        const chunks = [];
        const text = textToHighlight.toLowerCase();
        const searchTerm = searchWords[0].toLowerCase();

        if (!searchTerm) return chunks;

        let index = text.indexOf(searchTerm);
        
        while (index !== -1) {
          chunks.push({
            start: index,
            end: index + searchTerm.length
          });
          index = text.indexOf(searchTerm, index + 1);
        }

        return chunks;
      }}
    />
  );
};

export default HighlightText;