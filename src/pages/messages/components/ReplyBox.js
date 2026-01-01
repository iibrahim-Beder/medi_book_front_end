import { useEffect, useRef, useState } from "react";
import { useMessages } from "../hooks/useMessages";
import { useSignalR } from "../../../api/chat/chatUseSignalR";
import { useTypingIndicator } from "../hooks/useTypingIndicator";
import { BsHandThumbsUp } from "react-icons/bs";
import { BsHandThumbsDown } from "react-icons/bs";
import { CiFaceSmile } from "react-icons/ci";
import "emoji-picker-element";

export default function ReplyBox() {
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

      <div className="dc-iconbox" style={{ position: "relative" }}>
        <i onClick={() => sendMessage("👎")} >
          <BsHandThumbsDown />
        </i>
        <i onClick={() => sendMessage("👍")}>
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
                {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="emoji-container">
            <emoji-picker  ref={emojiPickerRef}></emoji-picker>
          </div>
        )}
    </div>
  );
}