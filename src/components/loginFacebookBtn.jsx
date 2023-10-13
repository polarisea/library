/* eslint-disable no-undef */
import { FacebookFilled } from "@ant-design/icons";

// eslint-disable-next-line react/prop-types
function LoginGoogleButton({ callback }) {
  function onClick() {
    // eslint-disable-next-line no-undef
    FB.login(
      function (response) {
        if (response.status == "connected") {
          return callback(response);
        }
        callback(null);
      },
      { scope: "email, public_profile" },
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-[39px] h-[39px] border-[1px] border-[#dadce0] rounded-[4px]"
    >
      <FacebookFilled style={{ fontSize: "1.5rem", color: "blue" }} />
    </button>
  );
}

export default LoginGoogleButton;
