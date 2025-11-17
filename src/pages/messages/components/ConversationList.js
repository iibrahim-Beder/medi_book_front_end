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
         
          img="/images/avt/patient-avt.png"
          name="Reta Milnes"
          lastMsg="Consectetur adipisicing elit sed do..."
          active
        />
        <ConversationItem
          img="/images/avt/patient-avt.png"
          name="Jed Loeffler"
          lastMsg="Consectetur adipisicing elit sed do..."
           messeagesDotNotification={4}
        />
        <ConversationItem
          img="/images/avt/patient-avt.png"
          name="Jovan Mery"
          lastMsg="Consectetur adipisicing elit sed do..."
          messeagesDotNotification={2}
        />
        <ConversationItem
          img="/images/avt/patient-avt.png"
          name="Jovan Mery"
          lastMsg="Consectetur adipisicing elit sed do..."
          messeagesDotNotification={2}
        />
        <ConversationItem
          img="/images/avt/patient-avt.png"
          name="Jovan Mery"
          lastMsg="Consectetur adipisicing elit sed do..."
          messeagesDotNotification={12}
        />
        <ConversationItem
          img="/images/avt/patient-avt.png"
          name="Jovan Mery"
          lastMsg="Consectetur adipisicing elit sed do..."
          messeagesDotNotification={21}
        />
        <ConversationItem
          img="/images/avt/patient-avt.png"
          name="Jovan Mery"
          lastMsg="Consectetur adipisicing elit sed do..."
          messeagesDotNotification={20}
        />
        <ConversationItem
          img="/images/avt/patient-avt.png"
          name="Jovan Mery"
          lastMsg="Consectetur adipisicing elit sed do..."
          messeagesDotNotification={122}
        />
        <ConversationItem
          img="/images/avt/patient-avt.png"
          name="Jovan Mery"
          lastMsg="Consectetur adipisicing elit sed do..."
          messeagesDotNotification={122}
        />
        <ConversationItem
          img="/images/avt/patient-avt.png"
          name="Jovan Mery"
          lastMsg="Consectetur adipisicing elit sed do..."
          messeagesDotNotification={122}
        />
        <ConversationItem
          img="/images/avt/patient-avt.png"
          name="Jovan Mery"
          lastMsg="Consectetur adipisicing elit sed do..."
          messeagesDotNotification={122}
        />
        <ConversationItem
          img="/images/avt/patient-avt.png"
          name="Jovan Mery"
          lastMsg="Consectetur adipisicing elit sed do..."
          messeagesDotNotification={122}
        />
        <ConversationItem
          img="/images/avt/patient-avt.png"
          name="Jovan Mery"
          lastMsg="Consectetur adipisicing elit sed do..."
          messeagesDotNotification={122}
        />
      </div>
    </>
  );
}
