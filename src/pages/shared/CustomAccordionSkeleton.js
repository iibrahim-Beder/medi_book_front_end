import Skeleton from "react-loading-skeleton";
 

export default function CustomAccordionSkeleton( {className="" , number=5} ) {
  return (
    <div className={`${className} table-card flex-grow-1 `}>
      <Skeleton width={"100%"} height={30} style={{ borderRadius: 3, margin:"0px  0px 19px 0px" }} />
      {[...Array(number)].map((i) => (
        <div key={i} className=" dc-accordioninnertitle skeleton">
          <div className="note-header">
            <div style={{width:"90%", display:"flex", flexDirection:'column' } } >
            <Skeleton width={"100%"} height={20} style={{ width:"59%", borderRadius: 3 }} />
            </div>
          </div>

          <div className="note-actions">
            <Skeleton width={40} height={36} style={{ borderRadius: 8 }} />
            <Skeleton width={40} height={36} style={{ borderRadius: 8, marginLeft: 8 }} />
          </div>
        </div>
      ))}
    </div>
  );
};