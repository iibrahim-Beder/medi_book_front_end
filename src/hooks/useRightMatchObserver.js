// hooks/useHiddenRightMatchObserver.js

import { useEffect } from "react";

export const useHiddenRightMatchObserver = ({
  tableWrapperRef,
  currentData,
  searchTerm,
}) => {
  useEffect(() => {
    const container = tableWrapperRef.current;
    if (!container) return;

    const rows = Array.from(container.querySelectorAll("tbody tr"));

    const check = () => {
      const containerRect = container.getBoundingClientRect();

      rows.forEach((row) => {
        const matchCells = row.querySelectorAll(
          '[data-right-has-match="true"]'
        );

        if (!matchCells.length) {
          row.classList.remove("has-hidden-right-match");
          return;
        }

        const lastCell = matchCells[matchCells.length - 1];
        const rect = lastCell.getBoundingClientRect();

        const isPassedRight = rect.right > containerRect.right;

        if (isPassedRight) {
          row.classList.add("has-hidden-right-match");
        } else {
          row.classList.remove("has-hidden-right-match");
        }
      });
    };

    check();

    const handleScroll = () => {
      check();
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [currentData, searchTerm]);
};