import ChatMessage from "./ChatMessage";

export default function ChatMessages() {
  return (
    <div className="dc-messages dc-verticalscrollbar dc-dashboardscrollbar">
     
      <ChatMessage
        type="sender"
        img="/images/avt/doctor-avt.jpg"
        text="Eiusmod tempor incididunt labore et dolore magna."
        link="https://themeforest.net"
        date="Jun 28, 2017 09:30"
      />
       <ChatMessage
        type="receiver"
        img="/images/avt/patient-avt.png"
        text="Consectetur adipisicing elit sei do eiusmod "
        date="January 12th, 2011"
      />
       <ChatMessage
        type="receiver"
        img="/images/avt/patient-avt.png"
        text="Consectetur adipisicing elit sei do eiusmod tempor incididunt labore et dolore."
        date="January 12th, 2011"
      />


    </div>
  );
}
