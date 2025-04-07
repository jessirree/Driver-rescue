import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import"../App.css";

const db = getFirestore();

function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

       // Save user info to Firestore
       await setDoc(doc(db, "users", user.uid), {
        userId: user.uid,
        name: name,
        email: user.email,
        phone: phone,
        role: "client", // Default role is "client"
        createdAt: new Date(),
      });

      alert("Account created successfully!");
      navigate("/login"); // Redirect to login page after successful signup
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already in use. Try logging in instead.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters long.");
      } else {
        setError(err.message);
      }
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#002f6c" }}>
      <div className="card shadow-lg p-4" style={{ width: "24rem", borderRadius: "10px" }}>
        <h3 className="text-center" style={{ color: "#002f6c", fontWeight: "bold" }}>Signup</h3>
        <hr className="w-25 mx-auto" style={{ border: "2px solid #002f6c" }} />

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSignUp}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" placeholder="Enter your name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" className="form-control" id="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm your password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input type="tel" className="form-control" id="phone" placeholder="Enter your phone number" required value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">Sign up</button>
          </div>
        </form>

        <div className="text-center mt-3">
          <p className="text-muted" style={{ fontSize: "0.9rem" }}>
            Already have an account? <a href="/login" className="text-primary">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;