import React from "react";
import { useTranslation } from "react-i18next";

const Pagination = ({
  currentPage,
  totalItems,
  rowsPerPage,
  onPageChange,
}) => {
  const { t } = useTranslation();
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;

  if (totalItems === 0) return null;

  return (
    <div className="d-flex justify-content-between align-items-center mt-3 nav-table"  >
      <div style={{ fontSize: "14px"}}>
        {t("showing")} {startIndex + 1} { t("to")}{" "}
        {Math.min(startIndex + rowsPerPage, totalItems)} {t("of")} {totalItems} {t("entries")}
      </div>

      <nav className="d-flex flex-wrap justify-content-center">
        <button
          className="dt-paging-button first"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
        >
          «
        </button>

        <button
          className="dt-paging-button previous"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
            {t("previous")}
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`dt-paging-button none ${
              currentPage === index + 1 ? "current" : ""
            }`}
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="dt-paging-button next"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
             {t("next")}
        </button>

        <button
          className="dt-paging-button last"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          »
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
