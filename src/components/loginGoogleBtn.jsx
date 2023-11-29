/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import { useEffect } from "react";

function LoginGoogleButton({ callback }) {
  useEffect(() => {
    const parent = document.getElementById("google_btn");
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback,
    });

    google.accounts.id.renderButton(parent, {
      type: "standard",
      text: "Sign in with Google",
      size: "large",
    });
  }, []);

  return <span id="google_btn"></span>;
}

export default LoginGoogleButton;
