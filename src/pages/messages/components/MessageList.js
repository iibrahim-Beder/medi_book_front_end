import MessageHeader from "./MessageHeader";
import ConversationHeader from "./ConversationHeader";
import ConversationList from "../chat-ui/ConversationList";
import ChatBox from "./ChatBox";

export default function MessageList() {
  return (
    <div className="dc-dashboardbox dc-messages-holder">
      <MessageHeader />
      <ConversationHeader />
      <div className="dc-dashboardboxcontent dc-dashboardholder dc-offersmessages">
        <ul>
          <li>
            <ConversationList />
          </li>
          <li>
            <ChatBox />
          </li>
        </ul>
      </div>
    </div>
  );
}
