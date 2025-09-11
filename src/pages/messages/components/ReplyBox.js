export default function ReplyBox() {
  return (
    <div className="dc-replaybox">
      <div className="form-group">
        <textarea
          className="form-control"
          name="reply"
          placeholder="Type message here"
        ></textarea>
      </div>
      <div className="dc-iconbox">
        <i className="lnr lnr-thumbs-up"></i>
        <i className="lnr lnr-thumbs-down"></i>
        <i className="lnr lnr-smile"></i>
        <a href="javascript:void(0);" className="dc-btnsendmsg">
          Send
        </a>
      </div>
    </div>
  );
}
