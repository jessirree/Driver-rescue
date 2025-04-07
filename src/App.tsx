import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { auth } from "./firebaseConfig";
import { useLocation } from "react-router-dom";

import ServiceGrid from "./pages/ServiceGrid";
import SplashPage from "./pages/SplashPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";
import AdminDashboard from "./pages/AdminDashboard";
import ServicesList from "./pages/ServicesList";
import ServiceProviderDashboard from "./pages/ServiceProviderDashboard";
import ChangePassword from "./components/ChangePassword";
import LocationPicker from "./components/LocationPicker";
import Chat from "./pages/chat";

const db = getFirestore();


function App() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [passwordChanged, setPasswordChanged] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true); // Track if splash screen should be shown

  useEffect(() => {
    // Show splash screen for 2 seconds, then hide it
    const splashTimeout = setTimeout(() => {
      setShowSplash(false);
    }, 2000); // 2 seconds

        // Firebase Auth Listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth State Changed:", user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("User role:", userDoc.data().role);
            setUserRole(userDoc.data().role);
            // Check passwordChanged only for service providers
            if (userData.role === "service-provider") {
              setPasswordChanged(userData.passwordChanged ?? false);
            } else {
              setPasswordChanged(null); // Not applicable for other roles
            }
          } else {
            console.log("User document not found.");
            setUserRole(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserRole(null);
        }
      } else {
        console.log("No user logged in.");
        setUserRole(null);
      }
      setLoading(false);
    });
  
    return () => {
      clearTimeout(splashTimeout); //Clean up splash timeout
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {showSplash ? ( //Show Splash Page first, then switch to Login Page
        <SplashPage />
      ) : (
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Role-Based Protected Routes */}
        <Route
          path="/client-dashboard"
          element={userRole === "client" ? <ServiceGrid/> : <Navigate to="/login" />}
        />
        <Route
          path="/service-dashboard"
          element={userRole === "service-provider" ? (passwordChanged === false ? (
              <Navigate to="/change-password" />
            ) : (<ServiceProviderDashboard />)) : (<Navigate to="/login" />)}
        />
        <Route
          path="/admin-dashboard"
          element={userRole === "admin" ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        {/* Password Change Route */}
        <Route
            path="/change-password"
            element={userRole === "service-provider" ? <ChangePassword /> : <Navigate to="/login" />}
          />
             {/* New Location Picker Route */}
          <Route
           path="/location-picker" 
           element={<LocationPickerWrapper />} />

{/* Services List Route with Location Parameters */}
<Route
 path="/services-list/:serviceId" 
 element={<ServicesListWrapper />} 
 />
        {/* Default Route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
   )}
   </>
 );
}
// Wrapper for Location Picker
function LocationPickerWrapper() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const serviceId = queryParams.get("serviceId");

  return <LocationPicker serviceId={serviceId} />;
}

// Wrapper for Services List (Extracts lat/lng from query params)
function ServicesListWrapper() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const lat = queryParams.get("lat");
  const lng = queryParams.get("lng");
  const serviceId = queryParams.get("serviceId");

  return <ServicesList serviceId={serviceId} lat={lat} lng={lng} />;
}


export default App;
