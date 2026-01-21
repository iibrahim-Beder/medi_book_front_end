import Highlighter from "react-highlight-words";

const ReadOnlyHighlightedField = ({
  value = "",
  placeholder = "",
  searchTerm,
  isHasMatched = false,
}) => {
  const text = value || placeholder;

  return (
    <div className="readonly-field">
      {isHasMatched && searchTerm ? (
        <Highlighter
          highlightClassName="text-highlight"
          searchWords={[searchTerm]}
          autoEscape
          textToHighlight={text}
        />
      ) : (
        text
      )}
    </div>
  );
};

export default ReadOnlyHighlightedField;
