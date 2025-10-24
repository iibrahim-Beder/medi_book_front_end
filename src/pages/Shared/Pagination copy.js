import React from "react";

const Pagination = ({
  currentPage,
  totalItems,
  rowsPerPage,
  onPageChange,
  getPageNumbers,
}) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;

  if (totalItems === 0) return null;

  return (
    <div className="d-flex justify-content-between align-items-center mt-3 nav-table">
      <div style={{ fontSize: "14px", color: "#555" }}>
        Showing {startIndex + 1} to{" "}
        {Math.min(startIndex + rowsPerPage, totalItems)} of {totalItems} entries
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
          Previous
        </button>

        {getPageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            className={`dt-paging-button none ${
              currentPage === pageNumber ? "current" : ""
            }`}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}

        <button
          className="dt-paging-button next"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
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
