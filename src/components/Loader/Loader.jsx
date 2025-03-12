//import { ThreeDots } from "react-loader-spinner";
import ContentLoader, { Facebook } from "react-content-loader";
import css from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={css.loader}>
      <ContentLoader viewBox="0 0 380 70">
        {/* Only SVG shapes */}
        <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
        <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
        <rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
      </ContentLoader>
    </div>
  );
}
