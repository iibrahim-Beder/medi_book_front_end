import { useSelector } from "react-redux";
import MessageHeader from "./MessageHeader";
import ConversationHeader from "./ConversationHeader";
import ConversationList from "../components/ConversationList";
import ChatBox from "./ChatBox";

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
             <ChatBox />
          </li>
        </ul>
      </div>
    </div>
  );
}
