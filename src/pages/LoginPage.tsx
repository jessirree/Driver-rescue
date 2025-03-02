import { Link } from "react-router-dom";
import "../App.css"

function LoginPage() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#002f6c" }}>
      <div className="card shadow-lg p-4" style={{ width: "22rem", borderRadius: "10px" }}>
        <h3 className="text-center" style={{ color: "#002f6c", fontWeight: "bold" }}>
          Login
        </h3>
        <hr className="w-25 mx-auto" style={{ border: "2px solid #002f6c" }} />
        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="mb-3 text-end">
            <a href="#" className="text-primary" style={{ fontSize: "0.9rem" }}>
              Forgot password?
            </a>
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Log in
            </button>
          </div>
        </form>
        <div className="text-center mt-3">
          <p className="text-muted" style={{ fontSize: "0.9rem" }}>
            Don’t have an account? <Link to="/SignupPage.tsx" className="text-primary">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

