import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

interface Rating {
  clientId: string | null;
  clientName: string;
  stars: number;
  review: string;
}

function ProviderRating() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const ratingsQuery = query(collection(db, "ratings"), where("providerId", "==", user.uid));

    const unsubscribe = onSnapshot(ratingsQuery, (snapshot) => {
      const ratingsData = snapshot.docs.map((doc) => ({
        clientId: doc.data().clientId || null,
        clientName: doc.data().clientName || "Unknown",
        stars: doc.data().stars || 0,
        review: doc.data().review || "",
      })) as Rating[];

      setRatings(ratingsData);

      // Calculate average rating
      if (ratingsData.length > 0) {
        const avg = ratingsData.reduce((sum, rating) => sum + rating.stars, 0) / ratingsData.length;
        setAverageRating(avg);
      } else {
        setAverageRating(0);
      }
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div>
      <h3>Average Rating: {averageRating.toFixed(1)} ⭐</h3>

      <ul>
        {ratings.map((rating, index) => (
          <li key={index}>
            <strong>{rating.clientName}</strong>: {rating.stars} ⭐ - "{rating.review}"
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProviderRating;
