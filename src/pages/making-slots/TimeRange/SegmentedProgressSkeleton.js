import Skeleton from "react-loading-skeleton";

export default function SegmentedProgressSkeleton({className}) {
  return (
    <div className={`${className} pt-3 pr-3 pl-3 flex-grow-1 `}>
      <Skeleton width={"100%"} height={30} style={{ borderRadius: 6}} />
    </div>
  );
};