import CodeScanSidebar from "./Profile-card/CodeScanSidebar";
import ProfileSettings from "./ProfileSettings";

export default function Acco(){
    return(
        <div className="dc-haslayout">
            <div className="row">
          <ProfileSettings/>
           <CodeScanSidebar/>

            </div>
     
        
        
        </div>
    )
}