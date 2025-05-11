import WelcomeSection from "../../components/WelcomeSection/WelcomeSection";
import ProjectFileTree from "../../components/ProjectFileTree/ProjectFileTree";
import ProjectDashboard from "../../components/ProjectDashboard/ProjectDashboard";
import UserInfo from "../../components/UserInfo/UserInfo";
import ClockWithPlant from "../../components/Clock/ClockWithPlant";
import css from "./HomePage.module.css";
import vine1 from "../../assets/images/vine1.png"
import vine2 from "../../assets/images/vine2.png"
export default function HomePage() {
  return (
    <div className={css.page}>
      {/* Vines */}
      <img
        src={vine2}
        alt="Right Vine"
        className={`${css.vineRight} ${css.vine}`}
      />
      <img
        src={vine1}
        alt="Top Vine"
        className={`${css.vineTop} ${css.vine}`}
      />

      {/* Clock (top left or top center based on preference) */}
      <div className={css.clockWrapper}>
        <ClockWithPlant />
      </div>

      {/* Main content */}
      <div className={css.container}>
        <WelcomeSection />
        <ProjectFileTree />
      </div>
    </div>
  );
}
