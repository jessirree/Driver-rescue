import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ServiceGrid from "./pages/ServiceGrid";
import Navbar from "./components/navbar";
import SplashPage from "./pages/SplashPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";

function App() {
  return (
    /* <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
    </Routes> */
    <div>
      <SplashPage/>
      <Navbar /> {/* Bottom Navbar */}
    </div>
  );
}
export default App;
