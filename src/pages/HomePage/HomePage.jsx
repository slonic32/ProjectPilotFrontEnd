import WelcomeSection from "../../components/WelcomeSection/WelcomeSection";
import UserInfo from "../../components/UserInfo/UserInfo";
import css from "./HomePage.module.css";

function HomePage() {
  return (
    <div>
      <div>
        <WelcomeSection />
        <UserInfo />
      </div>
    </div>
  );
}

export default HomePage;
