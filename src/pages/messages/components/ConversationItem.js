export default function ConversationItem({ img, name, lastMsg, active ,messeagesDotNotification}) {
  return (
    
    <div onClick={() =>   document.documentElement.setAttribute("isConversationOpen", "true") }
      className={`dc-ad dc-dotnotification ${active ? "dc-active" : ""}`}
      //If there are no new messages, no notification will appear
        style={
    messeagesDotNotification !== undefined && messeagesDotNotification !== null
      ? { "--messages-dotnotification": `"${messeagesDotNotification}"` }
      : {}
  }

    >
      <figure>
        <img src={img} alt={name} />
      </figure>
      <div className="dc-adcontent">
        <h3>{name}</h3>
        <span>{lastMsg}</span>
      </div>
    </div>
  );
}
