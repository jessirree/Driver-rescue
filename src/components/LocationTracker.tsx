import { useEffect, useState } from "react";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

const LocationTracker = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const user = auth.currentUser; // Get logged-in user

  useEffect(() => {
    if (!user) return;

    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        async (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setLocation(newLocation);

          // Update location in Firestore
          try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { location: newLocation });
          } catch (error) {
            console.error("Error updating location in Firestore:", error);
          }
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );
    } else {
      console.error("Geolocation not supported.");
    }
  }, [user]);

  return (
    <div>
      <h3>User Location</h3>
      {location ? (
        <p>Latitude: {location.lat}, Longitude: {location.lng}</p>
      ) : (
        <p>Getting location...</p>
      )}
    </div>
  );
};

export default LocationTracker;
