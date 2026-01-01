import MessageHeader from "./MessageHeader";
import ConversationHeader from "./ConversationHeader";
import ConversationList from "../chat-ui/ConversationList";
import ChatBox from "./ChatBox";
import { useSelector } from "react-redux";

export default function MessageList() {
    const selectedChat = useSelector((state) => state.chats.selectedChatId);  
  return (
    <div className="dc-dashboardbox dc-messages-holder">
      <MessageHeader />
      {selectedChat && <ConversationHeader />}
      <div className="dc-dashboardboxcontent dc-dashboardholder dc-offersmessages">
        <ul>
          <li>
            <ConversationList />
          </li>
          <li>
            {selectedChat &&  <ChatBox />}
          </li>
        </ul>
      </div>
    </div>
  );
}
