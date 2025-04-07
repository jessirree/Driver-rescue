import { useState } from "react";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";
import { auth } from "../firebaseConfig"; // Ensure you import Firebase Auth

const db = getFirestore();

interface RatingFormProps {
  providerId: string; // The service provider being rated
}

const RatingForm: React.FC<RatingFormProps> = ({ providerId }) => {
  const [stars, setStars] = useState(5);
  const clientId = auth.currentUser?.uid; // The logged-in driver giving the rating

  const handleSubmit = async () => {
    if (!clientId) {
      alert("You must be logged in as a driver to submit a rating.");
      return;
    }

    try {
      await addDoc(collection(db, "ratings"), {
        clientId,
        providerId,
        stars,
        createdAt: Timestamp.now(),
      });

      alert("Rating submitted successfully!");
      setStars(5);
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating.");
    }
  };

  return (
    <div>
      <h3>Rate This Service Provider</h3>
      <select value={stars} onChange={(e) => setStars(parseInt(e.target.value))}>
        {[1, 2, 3, 4, 5].map((num) => (
          <option key={num} value={num}>{num} Stars</option>
        ))}
      </select>
      <button onClick={handleSubmit}>Submit Rating</button>
    </div>
  );
};

export default RatingForm;
