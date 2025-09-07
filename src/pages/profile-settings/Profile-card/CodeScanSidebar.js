import { FaFacebookF, FaTwitter, FaLinkedinIn, FaClone } from "react-icons/fa";
import { FaLaptop } from "react-icons/fa";

const CodeScanSidebar = () => {
  return (
    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-3">
      <div className="dc-haslayout dc-dbsectionspace dc-codescansidebar">
        <div className="dc-authorcodescan dc-codescanholder">
          <figure className="dc-qrcodeimg">
            <img src="images/qrcode.png" alt="QR Code" />
          </figure>

          <div className="dc-qrcodedetail">
            <FaLaptop className="icon" />
            <div className="dc-qrcodefeat">
              <h3>
                Scan with your <span>Smart Phone </span> To Get It Handy.
              </h3>
            </div>
          </div>

          <div className="dc-codescanicons">
            <span>Share Your Profile</span>
            <ul className="dc-socialiconssimple">
              <li className="dc-facebook">
                <a href="#">
                  <FaFacebookF />
                </a>
              </li>
              <li className="dc-twitter">
                <a href="#">
                  <FaTwitter />
                </a>
              </li>
              <li className="dc-linkedin">
                <a href="#">
                  <FaLinkedinIn />
                </a>
              </li>
              <li className="dc-clone">
                <a href="#">
                  <FaClone />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <figure className="dc-searchresultad">
          <a href="#">
            <img src="images/ads-img/img-02.jpg" alt="Advertisement" />
          </a>
          <span>Advertisement 770px X 90px</span>
        </figure>
      </div>
    </div>
  );
};

export default CodeScanSidebar;
