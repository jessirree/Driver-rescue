import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import "./LoginPage.css";

const db = getFirestore();

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData.role === "admin") {
          navigate("/admin-dashboard");
        } else if (userData.role === "client") {
          navigate("/client-dashboard");
        } else if (userData.role === "service-provider") {
          navigate("/service-dashboard");
        } else {
          setError("Invalid role assigned.");
        }
      } else {
        setError("User role not found in Firestore.");
      }
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        navigate("/signup");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else {
        setError(`Login failed: ${err.message}`);
      }
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-white">
      <div className="row w-100 h-100">
        {/* Left Panel */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center text-dark left-panel">
          <img src="/assets/logo.png" alt="Logo" className="logo" />
          <h1 className="fw-bold text-center mt-3">Effortless Roadside Assistance with Driver Rescue</h1>
          <p className="text-center mt-3 px-5">
            Experience unparalleled roadside assistance that connects you with skilled service providers in real-time.
            Whether you’re facing a breakdown, need urgent repairs, or fuel delivery, we ensure timely help at your
            fingertips. Manage your service requests and payments seamlessly for a stress-free experience.
          </p>
        </div>

        {/* Right Panel */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="card p-4 login-card">
            <h3 className="text-center fw-bold">Welcome Back!</h3>
            <p className="text-center">
              Don't have an account?{" "}
              <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/signup")}>
                Create a new account
              </span>
            </p>
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </form>

            <div className="text-center mt-3">
              <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/forgot-password")}>
                Forgot password? Click here
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
