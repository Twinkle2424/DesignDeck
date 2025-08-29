import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Contactus from "./pages/Contactus";
import Landingpage from "./pages/Landingpage";
import Dashboard from "./pages/Dashboard";
import Profilepage from "./pages/Profilepage";
import Profilepageothers from "./pages/Profilepageothers";
import Projectview from "./pages/Projectview";
import Uploadprojectpage from "./pages/Uploadprojectpage";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";// Updated import
import UserNotifications from "./pages/UserNotifications";
import AdminDashboard from "./pages/AdminDashboard";
import Document from "./Document/Document";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";
import "./index.css";

function App() {

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <HelmetProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              <Route path="/landingpage" element={<Landingpage />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profilepage" element={<Profilepage />} />
              <Route path="/contactus" element={<Contactus />} />
              <Route path="/logout" element={<Landingpage />} />
              <Route path="/view/:projectId" element={<Projectview />} />
              <Route path="/upload" element={<Uploadprojectpage />} />
              <Route path="/profile/:userId" element={<Profilepageothers />} />
              <Route path="/resetpassword" element={<ResetPassword />} />
              <Route path="/changepasswordwithtoken/:token" element={<ChangePassword />} />
              <Route path="/user-notifications" element={<UserNotifications />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/document" element={<Document />} />
              <Route path="*" element={<Landingpage />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </HelmetProvider>
    </GoogleOAuthProvider>
  );
}


export default App;
