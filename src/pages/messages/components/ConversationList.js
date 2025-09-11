import ConversationItem from "./ConversationItem";
import { IoSearchOutline } from "react-icons/io5";

export default function ConversationList() {
  return (
    
    <>
      <form className="dc-formtheme dc-formsearch">
        <fieldset>
          <div className="form-group">
            <input
              type="text"
              name="Location"
              className="form-control"
              placeholder="Search Here"
            />
            <button className="dc-searchgbtn">
              <IoSearchOutline/>
            </button>
          </div>
        </fieldset>
      </form>

      <div className="dc-verticalscrollbar dc-dashboardscrollbar patient-messages-list" 
      // style={{
      //  display:`${document.documentElement==="true"?"none":"patient-list"}`
      // }}
      > 
        <ConversationItem
         
          img="images/messages/img-01.jpg"
          name="Reta Milnes"
          lastMsg="Consectetur adipisicing elit sed do..."
          active
        />
        <ConversationItem
          img="images/messages/img-12.jpg"
          name="Jed Loeffler"
          lastMsg="Consectetur adipisicing elit sed do..."
           messeagesDotNotification={4}
        />
        <ConversationItem
          img="images/messages/img-03.jpg"
          name="Jovan Mery"
          lastMsg="Consectetur adipisicing elit sed do..."
          messeagesDotNotification={2}
        />
      </div>
    </>
  );
}
