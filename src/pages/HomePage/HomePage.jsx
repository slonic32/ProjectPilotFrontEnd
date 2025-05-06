import WelcomeSection from "../../components/WelcomeSection/WelcomeSection";
import UserInfo from "../../components/UserInfo/UserInfo";
import ProjectDashboard from "../../components/ProjectDashboard/ProjectDashboard";
import css from "./HomePage.module.css";

export default function HomePage() {
  return (
    <div className={css.page}>
      <div className={css.container}>
        <WelcomeSection />
        
      </div>
    </div>
  );
}
