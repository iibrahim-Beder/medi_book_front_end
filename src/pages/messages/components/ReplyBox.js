import { useEffect, useState } from "react";
import { useMessages } from "../hooks/useMessages";
import { useSignalR } from "../../../api/chat/chatUseSignalR";
import { useTypingIndicator } from "../hooks/useTypingIndicator";

export default function ReplyBox() {
  const [message, setMessage] = useState("");
  const { sendMessage } = useMessages();
  const { updateusertyping } = useSignalR();

  const chatId = 1;

  const { onMessageSent, onInputBlur } = useTypingIndicator({
    chatId,
    message,
    updateUserTyping: updateusertyping,
  });

  return (
    <div className="dc-replaybox">
      <div className="form-group">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="form-control"
          placeholder="Type message here"
          onBlur={onInputBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (message.trim()) {
                sendMessage(message);
                setMessage("");
                onMessageSent();
              }
            }
          }}
        />
      </div>

      <div className="dc-iconbox">
        <button
          className="dc-btnsendmsg"
          onClick={() => {
            if (message.trim()) {
              sendMessage(message);
              setMessage("");
              onMessageSent();
            }
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
