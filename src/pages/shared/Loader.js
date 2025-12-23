export default function Loader(className) {
    return  (      <div className={`preloader-outer  ${className}`}>
          <div className="wt-preloader-holder">
            <div className="wt-loader"></div>
          </div>
        </div>);
}