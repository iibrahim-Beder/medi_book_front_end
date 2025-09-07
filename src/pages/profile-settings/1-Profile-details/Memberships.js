import React from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa"; // أيقونات القلم والسلة

const Memberships = () => {
  let menubarShip = [
    "Manchester Academy of Oral Medicine and Radiology",
    "United State Dental Council",
    "Sydney Academy of Aesthetic & Cosmetic Dentistry",
  ];

  return (
    <div className="dc-skills dc-tabsinfo dc-tabsinfo-test">
      <div className="dc-tabscontenttitle">
        <h3>Memberships</h3>
      </div>

      <div className="dc-skillscontent-holder">
        <form className="dc-formtheme dc-skillsform">
          <fieldset>
            <div className="form-group">
              <div className="form-group-holder">
                <input
                  type="text"
                  name="rate"
                  className="form-control"
                  placeholder="Select Your Memberships"
                />
              </div>
            </div>
            <div className="form-group dc-btnarea">
              <button type="button" className="dc-btn">
                Add Now
              </button>
            </div>
          </fieldset>
        </form>

        <div className="dc-myskills">
          <ul className="sortable list">
            {menubarShip.map((membership, index) => (
              <li key={index}>
                <div className="dc-dragdroptool">
                  <a href="#!" className="lnr lnr-menu"></a>
                </div>
                <span className="skill-dynamic-html">
                  <em className="skill-val">{membership}</em>
                </span>
                <span className="skill-dynamic-field">
                  <input type="text" defaultValue={membership} />
                </span>
                <div className="dc-rightarea">
                  <a href="#!" className="dc-addinfo">
                    <FaPencilAlt />
                  </a>
                  <a href="#!" className="dc-deleteinfo">
                    <FaTrash />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Memberships;
