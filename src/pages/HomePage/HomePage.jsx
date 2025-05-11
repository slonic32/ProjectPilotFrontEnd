import WelcomeSection from "../../components/WelcomeSection/WelcomeSection";
import ProjectFileTree from "../../components/ProjectFileTree/ProjectFileTree";
import ProjectDashboard from "../../components/ProjectDashboard/ProjectDashboard";
import UserInfo from "../../components/UserInfo/UserInfo";
import ClockWithPlant from "../../components/Clock/ClockWithPlant";
import css from "./HomePage.module.css";

export default function HomePage() {
  return (
    <div className={css.page}>
      {/* Vines */}
      <img
        src="src/assets/images/imgbin-leaf-green-leaves-PrY01nVcvG7rKmaHQu1phZLCY.png"
        alt="Right Vine"
        className={`${css.vineRight} ${css.vine}`}
      />
      <img
        src="src/assets/images/pngtree-cartoon-green-plant-vine-png-image_4569455.png"
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
