import { Link } from 'react-router-dom';
import SingleSlot from'./SingleSlot'
import { BsFillChatTextFill } from "react-icons/bs";
import { BsWechat } from "react-icons/bs";


export default function PationtCard({userName,userImg,userType,userLocation,chatId,patientId}) {
    return (
      <div className="dc-user-header">
        <div>
          <figure className="dc-user-img">
            <img src={userImg} alt={`${userName} img`} />
          </figure>
        </div>
        <div className="dc-title">
          <a href="#!">{userType}</a>
          <Link className='button-elment' to={`/pationt-information/${patientId}`}>
          <h3 className='button-elment' title="open profile" >
            {userName} <i className="fa fa-check-circle"></i>
          </h3>
            </Link>
          <span>{userLocation}</span>
          <Link className='button-elment' to={`/chat/${chatId}`}>
          <button style={{fontSize:"40px"}} title="open chat" className='button-elment'>
        <BsWechat/>
          </button>
          </Link>

        </div>
        <SingleSlot
          time="10:30 am"
          spaces={2}
          status="pending"
          onClick={() => console.log("Slot clicked")}
        />
      </div>
    );
}