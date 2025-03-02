
import "../App.css";

function SplashPage (){
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{
        height: "100vh",
        background: "linear-gradient(to bottom, #001f3f, #004080)",
        color: "white",
      }}
    >
      {/* Logo and Title */}
      <div>
        <img
           src= "/assets/logo.png"
          style={{ width: "300px", height: "300px",   transform: "scaleX(-1)" }}
        />
        <h1 className="mt-3">Your Roadside Help, Just a Click Away</h1>
      </div>

      {/* Buttons */}
      <div className="mt-4">
        <button className="btn btn-light btn-lg mb-3" style={{ width: "200px" }}>
          Sign Up
        </button>
        <br />
        <button className="btn btn-outline-light btn-lg" style={{ width: "200px" }}>
          Log In
        </button>
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
};

export default SplashPage;
