import { useEffect } from "react";

export const useHiddenRightMatchObserver = ({
  tableWrapperRef,
  currentData,
  searchTerm,
}) => {
  useEffect(() => {
    if (!tableWrapperRef.current) return;

    const container = tableWrapperRef.current;

    const allRows = container.querySelectorAll("tbody tr");
    allRows.forEach(row =>
      row.classList.remove("has-hidden-right-match")
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const rowVisibilityMap = new Map();

        const allMatchRows = container.querySelectorAll("tr");
        allMatchRows.forEach(row => {
          const matchCellsInRow = row.querySelectorAll(
            '[data-right-has-match="true"]'
          );
          if (matchCellsInRow.length > 0) {
            rowVisibilityMap.set(row, {
              totalMatches: matchCellsInRow.length,
              visibleMatches: 0,
            });
          }
        });

        entries.forEach(entry => {
          const cell = entry.target;
          if (cell.getAttribute("data-right-has-match") !== "true") return;

          const row = cell.closest("tr");
          if (!row || !rowVisibilityMap.has(row)) return;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            rowVisibilityMap.get(row).visibleMatches++;
          }
        });

        rowVisibilityMap.forEach((rowData, row) => {
          const matchCells = row.querySelectorAll(
            '[data-right-has-match="true"]'
          );

          const containerRect = container.getBoundingClientRect();
          let visibleCount = 0;

          matchCells.forEach(cell => {
            const rect = cell.getBoundingClientRect();
            const isVisible =
              rect.top >= containerRect.top &&
              rect.bottom <= containerRect.bottom &&
              rect.left >= containerRect.left &&
              rect.right <= containerRect.right;

            if (isVisible) visibleCount++;
          });

          if (visibleCount < rowData.totalMatches) {
            row.classList.add("has-hidden-right-match");
          } else {
            row.classList.remove("has-hidden-right-match");
          }
        });
      },
      {
        root: container,
        threshold: [0, 0.1, 0.5, 0.9, 1],
        rootMargin: "20px 0px 20px 0px",
      }
    );

    const matchCells = container.querySelectorAll(
      '[data-right-has-match="true"]'
    );

    if (matchCells.length === 0) {
      allRows.forEach(row =>
        row.classList.remove("has-hidden-right-match")
      );
      return;
    }

    matchCells.forEach(cell => observer.observe(cell));

    const checkInitialVisibility = () => {
      matchCells.forEach(cell => {
        const row = cell.closest("tr");
        if (!row) return;

        const matchCellsInRow = row.querySelectorAll(
          '[data-right-has-match="true"]'
        );

        const containerRect = container.getBoundingClientRect();
        let visibleCount = 0;

        matchCellsInRow.forEach(matchCell => {
          const rect = matchCell.getBoundingClientRect();
          const isVisible =
            rect.top >= containerRect.top &&
            rect.bottom <= containerRect.bottom &&
            rect.left >= containerRect.left &&
            rect.right <= containerRect.right;

          if (isVisible) visibleCount++;
        });

        if (visibleCount < matchCellsInRow.length) {
          row.classList.add("has-hidden-right-match");
        } else {
          row.classList.remove("has-hidden-right-match");
        }
      });
    };

    setTimeout(checkInitialVisibility, 100);

    const handleScroll = () => {
      const records = observer.takeRecords();
      if (!records.length) {
        checkInitialVisibility();
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      container.removeEventListener("scroll", handleScroll);
    };
  }, [currentData, searchTerm]);
};
