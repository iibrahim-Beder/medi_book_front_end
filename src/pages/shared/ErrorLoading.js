import { PropagateLoader } from "react-spinners";
import { FaExclamationTriangle } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function ErrorLoading( { isError, refetch }) {
    const { t } = useTranslation();
    return (
        <div className="error-loading">
          <div className="text-center text-danger mt-4">
                   <FaExclamationTriangle size={40} />
                   <h5 className="mt-2">{t("Error loading reviews")}</h5>
                   <PropagateLoader color="var(--bluecolor)" loading={isError} size={10} />
                   <div style={{ marginTop: "30px" }}>
                     <button className="dc-btn" onClick={refetch}>
                       {t("Retry")}
                     </button>
                   </div>
                 </div>
        </div>
    );
}