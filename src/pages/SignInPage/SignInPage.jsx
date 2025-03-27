import { useState } from "react";
import SignInForm from "../../components/SignInForm/SignInForm";
import UpdateProfileForm from "../../components/UpdateProfileForm/UpdateProfileForm";

export default function SignInPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  const handleLoginSuccess = () => {
    console.log("Setting isLoggedIn to true...");
    setIsLoggedIn(true); // Switch to profile update form after login
  };

  return (
    <main style={{ padding: "20px" }}>
      {!isLoggedIn ? (
        <div>
          <SignInForm onLoginSuccess={handleLoginSuccess} />
        </div>
      ) : (
        <div>
          <h2>Update Profile</h2>
          <UpdateProfileForm />
        </div>
      )}
    </main>
  );
}