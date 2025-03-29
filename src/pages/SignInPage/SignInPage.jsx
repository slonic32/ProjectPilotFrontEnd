import SignInForm from "../../components/SignInForm/SignInForm";
import css from "./SignInPage.module.css";

export default function SignInPage() {
  return (
    <main className={css["signin-page"]}>
      <div className={css["content-wrapper"]}>
        <SignInForm />
      </div>
    </main>
  );
}
