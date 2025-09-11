import ChatMessages from "./ChatMessages";
import ReplyBox from "./ReplyBox";

export default function ChatBox() {
  return (
    <div className="dc-chatarea">
      <ChatMessages />
      <ReplyBox />
    </div>
  );
}
