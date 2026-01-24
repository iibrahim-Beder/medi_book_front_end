import { useEffect } from "react";
import { lowerFirstChar } from "../pages/shared/utils";

export const useScrollToFirstMatch = ({
  currentData,
  searchTerm,
  FIELD_KEY_MAP,
  hasHiddenMatch,
  handleViewClick,
}) => {
  useEffect(() => {
    if (!currentData?.length) return;

    const scrollToFirstMatch = () => {
      setTimeout(() => {
        const el = document.querySelector('[data-has-match="true"]');
        el?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }, 0);
    };

    const firstMatchRow = currentData.find(
      item => item.highlightInfo?.matchedFields?.length
    );

    if (!firstMatchRow) {
      scrollToFirstMatch();
      return;
    }

    const firstMatchField =
      firstMatchRow.highlightInfo.matchedFields[0]?.field;

    if (!firstMatchField) {
      scrollToFirstMatch();
      return;
    }
      let fieldKey;    
      if (FIELD_KEY_MAP === null) {
        fieldKey = lowerFirstChar(firstMatchField);
      } else {
        fieldKey = FIELD_KEY_MAP[firstMatchField];
      }
    const fieldValue = firstMatchRow[fieldKey];

    const isHidden = hasHiddenMatch(
      firstMatchRow,
      fieldKey,
      fieldValue,
      searchTerm
    );
    console.log("isHidden", isHidden);

    if (isHidden) {
      handleViewClick(firstMatchRow.id, fieldKey, true);
    } else {
      handleViewClick(null);
      scrollToFirstMatch();
    }
  }, [currentData, searchTerm]);
};
