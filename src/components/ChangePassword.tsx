import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, updatePassword } from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

const db = getFirestore();
const auth = getAuth();

function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleChangePassword = async () => {
    if (!user) {
      alert("User not found.");
      return;
    }

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
      } 

    try {
      await updatePassword(user, newPassword);
      await updateDoc(doc(db, "users", user.uid), { passwordChanged: true });
      alert("Password updated successfully!");
      navigate("/service-dashboard"); // Redirect to dashboard
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Change Your Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleChangePassword} className="btn btn-success">
        Update Password
      </button>
    </div>
  );
}

export default ChangePassword;
