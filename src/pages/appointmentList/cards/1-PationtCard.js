import SingleSlot from'./SingleSlot'


export default function PationtCard({userName,userImg,userType,userLocation}){
    return(
            <div className="dc-user-header">
            <div>
              <figure className="dc-user-img">
                <img src={userImg} alt={`${userName} img`} />
              </figure>
            </div>
            <div className="dc-title">
              <a href="#!">{userType}</a>
              <h3>
                {userName} <i className="fa fa-check-circle"></i>
              </h3>
              <span>{userLocation}</span>
            </div>
            <SingleSlot
  time="10:30 am" 
  spaces={2} 
  status="pending" 
  onClick={() => console.log("Slot clicked")}
/>
          </div>
    )
}