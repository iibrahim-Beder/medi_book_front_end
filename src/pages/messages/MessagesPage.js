import MessageList from "./components/MessageList";
import ProfileSidebar from "./components/ProfileSidebar";
import { useConversations } from "./hooks/useConversations";
import { useSyncChatWithUrl } from "./hooks/useSyncChatWithUrl";
import "./messages.css";
import ErrorPage from "../notFound-pageError/ErrorPage";
export default function MessagesPage() {
  const{isLoading,isError,refetch,conversations ,isFetching}=useConversations();
    useSyncChatWithUrl();
    
    if(isError|| (!isLoading && conversations.length === 0 && isFetching)){
         return   <ErrorPage refetch={refetch} isFetching={isFetching} />
    }
  return (<>
    
  {isLoading || (!isError && conversations.length === 0) ? (
<div className="preloader-outer">
  <div className="wt-preloader-holder">
    <div className="wt-loader"></div>
  </div>
</div>
) : (
<section className="dc-haslayout dc-dbsectionspace dc-dbsectionspace-test messages-page">
<div className="row dc-dbsectionspace-row">
<div className="col-lg-8 col-xl-9 conversation-and-messages  ">
  <MessageList />
</div>
<div className="col-md-4 col-xl-3">
  <ProfileSidebar />
</div>
</div>
</section>)}
  
  </>
  );
}
