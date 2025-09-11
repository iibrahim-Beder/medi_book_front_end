export default function ChatMessage({ type, img, text, link, date }) {
  const msgClass =
    type === "sender" ? "dc-memessage dc-readmessage" : "dc-offerermessage";

  return (
    <div className={msgClass}>
      <figure>
        <img src={img} alt="user" />
      </figure>
      <div className="dc-description">
        <p>{text}</p>
        {link && (
          <p>
            <a href={link} target="_blank" rel="noreferrer">
              {link}
            </a>
          </p>
        )}
        <time>{date}</time>
      </div>
    </div>
  );
}
