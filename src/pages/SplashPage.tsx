import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function SplashPage (){
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login"); // Redirect to login after 2 seconds
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, [navigate]);

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center splash-page"
      style={{
        height: "100vh",
        background: "linear-gradient(to bottom, #001f3f, #004080)",
        color: "white",
      }}
    >
      {/* Logo and Title */}
      <div className="fade-in">
        <img
          src="../assets/logo.png" // Fix path
          alt="Driver Rescue Logo"
          style={{ width: "300px", height: "300px", transform: "scaleX(-1)" }}
        />
        <h1 className="mt-3">Your Roadside Help, Just a Click Away</h1>
      </div>

      {/* Footer */}
      <div className="mt-5">
        <small>
          By signing in, you agree to our{" "}
          <a href="/terms" className="text-white text-decoration-underline">
            Terms and Conditions
          </a>
          . See how we use your data in our{" "}
          <a href="/privacy" className="text-white text-decoration-underline">
            Privacy Policy
          </a>
          .
        </small>
      </div>
    </div>
  );
}


export default SplashPage;
