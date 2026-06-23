import { useEffect, useRef, useState } from "react";
import { useMessages } from "../hooks/useMessages";
import { useSignalR } from "../../../api/chat/chatUseSignalR";
import { useTypingIndicator } from "../hooks/useTypingIndicator";
import { BsHandThumbsUp } from "react-icons/bs";
import { BsHandThumbsDown } from "react-icons/bs";
import { CiFaceSmile } from "react-icons/ci";
import "emoji-picker-element";
import { useSelector } from "react-redux";

export default function ReplyBox({desabled=false}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  // Effect for emoji picker events
 useEffect(() => {
  if (!showEmojiPicker) return;

  const picker = emojiPickerRef.current;
  if (!picker) return;

  const onEmojiClick = (event) => {
    setMessage((prev) => prev + event.detail.unicode);
  };

  picker.addEventListener("emoji-click", onEmojiClick);

  return () => {
    picker.removeEventListener("emoji-click", onEmojiClick);
  };
}, [showEmojiPicker]);

  // Effect to handle click outside and ESC key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [showEmojiPicker]);

  const [message, setMessage] = useState("");
  const { sendMessage } = useMessages();
  const { updateusertyping } = useSignalR();

  const { onMessageSent, onInputBlur } = useTypingIndicator({
    message,
    updateUserTyping: updateusertyping,
  });

  const handleSendMessage = () => {
    if (desabled) return;
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
      onMessageSent();
    }
  };
const selectedChat = useSelector(
  (state) => state.chats.selectedChatId
);

  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [selectedChat]);

  return (
    <div className="dc-replaybox">
      <div className="form-group">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => { !desabled && setMessage(e.target.value)}}
          className="form-control"
          placeholder={desabled ? "You can't send message , selected conversation first" : "Type a message..."}
          onBlur={onInputBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
      </div>

      <div className="dc-iconbox" style={{ position: "relative" }}>
        <i onClick={() =>{ !desabled && sendMessage("👎")}} >
          <BsHandThumbsDown />
        </i>
        <i onClick={() => { !desabled && sendMessage("👍")}}>
          <BsHandThumbsUp />
        </i>
        <i 
          className="lnr lnr-smile" 
          ref={emojiButtonRef}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          style={{ cursor: "pointer" }}
        >
          <CiFaceSmile />
        </i>
        


        <button
        title={desabled ? "You can't send message , selected conversation first" : ""}
          className="dc-btnsendmsg"
          style={{ cursor: desabled ? "not-allowed" : "pointer" }}
          disabled={desabled}
          onClick={() => {
            handleSendMessage();
          }}
        >
          Send
        </button>
      </div>
                {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="emoji-container">
            <emoji-picker  ref={emojiPickerRef}></emoji-picker>
          </div>
        )}
    </div>
  );
}