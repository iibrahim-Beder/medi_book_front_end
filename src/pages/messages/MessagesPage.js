import MessageList from "./components/MessageList";
import ProfileSidebar from "./components/ProfileSidebar";
import "./messages.css";

export default function MessagesPage() {
  return (
    <section className="dc-haslayout dc-dbsectionspace dc-dbsectionspace-test messages-page">
      <div className="row dc-dbsectionspace-row">
        <div className="col-lg-8 col-xl-9">
          <MessageList />
        </div>
        <div className="col-md-4 col-xl-3">
          <ProfileSidebar />
        </div>
      </div>
    </section>
  );
}
