import { useSelector } from "react-redux";
import ChatMessages from "./ChatMessages";
import ReplyBox from "./ReplyBox";
import DataEmptyComponent from "../../shared/DataEmptyComponent";

export default function ChatBox() {
    const selectedChat = useSelector((state) => state.chats.selectedChatId);
  return (
    <div className="dc-chatarea">
      {/* <ChatMessages /> */}
      
            {selectedChat ? (
              <ChatMessages />
            ) : (
              <DataEmptyComponent
                containerStyle={{ flexDirection: "column" ,minHeight: "55vh"}}
                imgStyle={{ width: "100%", maxWidth: "300px" }}
                title="No Conversation Selected"
                imgType="empty-message"
                text="Select a conversation to start a chat with your patient."
              />
            )}
      <ReplyBox desabled={!selectedChat} />
    </div>
  );
}
