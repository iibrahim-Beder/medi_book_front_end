import React, { useState } from "react";
import { FaTrash, FaPencilAlt } from "react-icons/fa";

const ExperienceItem = ({ title, period, index, onDelete }) => {
  const [isOpen, setIsOpen] = useState(index === 0); // أول عنصر مفتوح
//       <div className="dc-rightarea">
                  // <a href="#" className="dc-addinfo">
                  //   <FaPencilAlt />
                  // </a>
                  // <a href="#" className="dc-deleteinfo">
                  //   <FaTrash />
                  // </a>
                // </div>
  return (
    <li>
      <div className="dc-accordioninnertitle">
        <span onClick={() => setIsOpen(!isOpen)}>
          {title} <em>({period})</em>
        </span>
             <div className="dc-rightarea">
                  <a href="#" className="dc-addinfo">
                    <FaPencilAlt />
                  </a>
                  <a href="#" className="dc-deleteinfo">
                    <FaTrash />
                  </a>
                </div>
      </div>

      {isOpen && (
        <div className="dc-collapseexp show">
          <form className="dc-formtheme dc-userform">
            <fieldset>
              <div className="form-group form-group-half">
                <input
                  type="text"
                  placeholder="Company Title"
                  className="form-control"
                />
              </div>
              <div className="form-group form-group-half">
                <input
                  type="text"
                  placeholder="Starting Date"
                  className="form-control"
                />
              </div>
              <div className="form-group form-group-half">
                <input
                  type="text"
                  placeholder="Ending Date *"
                  className="form-control"
                />
              </div>
              <div className="form-group form-group-half">
                <input
                  type="text"
                  placeholder="Your Job Title"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <textarea
                  className="form-control"
                  placeholder="Your Job Description"
                ></textarea>
              </div>
              <div className="form-group">
                <span>* Leave ending date empty if it's your current job</span>
              </div>
            </fieldset>
          </form>
        </div>
      )}
    </li>
  );
};

export default ExperienceItem;
