import { useEffect } from "react";

export const useScrollToFirstMatch = ({
  prescriptionsData,
  searchTerm,
  FIELD_KEY_MAP,
  hasHiddenMatch,
  handleViewClick,
}) => {
  useEffect(() => {
    if (!prescriptionsData?.data?.length) return;

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

    const firstMatchRow = prescriptionsData.data.find(
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

    const fieldKey = FIELD_KEY_MAP[firstMatchField];
    const fieldValue = firstMatchRow[fieldKey];

    const isHidden = hasHiddenMatch(
      firstMatchRow,
      fieldKey,
      fieldValue,
      searchTerm
    );

    if (isHidden) {
      handleViewClick(firstMatchRow.id, fieldKey, true);
    } else {
      handleViewClick(null);
      scrollToFirstMatch();
    }
  }, [prescriptionsData, searchTerm]);
};
