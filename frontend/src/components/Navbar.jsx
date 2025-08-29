import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import api from "../services/api";
import { ThemeContext } from "../context/ThemeContext";
import { Sun, Moon, Menu, X, User, LogOut } from "lucide-react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const fetchUserRan = useRef(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const popupRef = useRef(null);

  // ✅ Fetch user data
  const fetchUser = async () => {
    console.log("🟡 Fetching user data...");
    try {
      const res = await api.get("/auth/me", {
        withCredentials: true, // Send cookies for authentication
      });

      console.log("🟢 User Data Received:");

      if (res.data && res.data._id) {
        setUser(res.data); // ✅ Update user state
        console.log("🟣 User state updated:");
      } else {
        setUser(null);
        console.log("🟣 No valid user found, setting user to null");
      }
    } catch (error) {
      console.error("❌ Error fetching user:",);
      setUser(null);
    }
  };

  // ✅ Load user on mount (Prevent double fetch in Strict Mode)
  useEffect(() => {
    if (!fetchUserRan.current) {
      fetchUserRan.current = true;
      fetchUser();
    }
  }, []);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    console.log("🟡 Logging out...");

    try {
      const response = await api.post(
        "/auth/logout",
        {},
        { withCredentials: true } // Ensure cookies are sent
      );

      console.log("🟢 Logout successful:", response.data);

      // Clear user data
      setUser(null);
      localStorage.removeItem("user");

      // Close UI elements
      setShowPopup(false);
      setMobileMenuOpen(false);

      // Redirect after delay
      navigate("/landingpage");

    } catch (error) {
      console.error("❌ Logout failed:", error.response?.data || error.message);

      // Debugging: Check browser cookies
      console.log("Browser Cookies:", document.cookie);
    }
  };

  const logoSrc = theme === 'dark' ? '/public/Frame 3.png' : '/public/Frame 2.png';


  return (
    <nav
      className={`flex w-full justify-between items-center px-4 sm:px-6 py-3 fixed top-0 left-0 backdrop-blur-2xl z-50 ${theme === "dark" ? "bg-[#000000f3] text-white" : "bg-[#ffffffc3] text-black"
        }`}
    >
      {/* Logo */}
      <Link to="/dashboard">
        <div className="flex items-center space-x-2">
          <img
            src={logoSrc}
            alt="DesignDeck Logo"
            width={180}
            className="rounded-full"
          />
        </div>
      </Link>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden flex items-center justify-center"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4 relative">
        {user ? (
          <>
            {/* User Profile Section */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setShowPopup(!showPopup)}
            >
              <img
                src={user.profilePicture || `${api.defaults.baseURL}uploads/default-profile.jpg`}
                alt="User"
                className="object-cover object-top w-8 h-8 md:w-10 md:h-10 rounded-full"
              />
              <div className="hidden sm:block">
                <p className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>
                  {user.name}
                </p>
                <p className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}>
                  {user.email}
                </p>
              </div>
            </div>

            {/* Notification Icon */}
            <Link to="/user-notifications"><button
              className={`p-2 rounded-full cursor-pointer h-8 w-8 md:h-10 md:w-10 flex items-center justify-center transition-all duration-300 ${theme === "dark" ? "bg-gray-700 text-white" : "bg-[#DCE6FF] text-[#9091FF]"
                }`}
            >
              <i className="ri-notification-2-line text-[16px] md:text-[20px]"></i>
            </button></Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 cursor-pointer rounded-full h-8 w-8 md:h-10 md:w-10 flex items-center justify-center transition-all duration-300 ${theme === "dark" ? "bg-gray-700 text-white" : "bg-[#DCE6FF] text-[#9091FF]"
                }`}
            >
              {theme === "dark" ? (
                <Sun className="text-xl md:text-2xl" />
              ) : (
                <Moon className="text-xl md:text-2xl" />
              )}
            </button>

            {/* Profile Popup */}
            {showPopup && (
              <div
                ref={popupRef}
                className={`fixed top-16 right-5 w-80 max-w-full shadow-2xl rounded-3xl p-6 transition-all duration-300 ease-in-out z-50 ${theme === 'dark' ? 'bg-[#1f1f1f] text-white' : 'bg-white text-black'
                  }`}
                style={{ width: '350px' }} // explicitly set width
              >
                {/* Close Button */}
                <button
                  className="absolute top-4 right-4 cursor-pointer transition"
                  onClick={() => setShowPopup(false)}
                >
                  <X size={22} />
                </button>

                {/* Profile Section */}
                <div className="flex flex-col items-center mb-6">
                  <img
                    src={
                      user.profilePicture
                        ? `${user.profilePicture}`
                        : `${api.defaults.baseURL}uploads/default-profile.jpg`
                    }
                    alt="User"
                    className="w-24 h-24 rounded-full object-cover object-top shadow-md"
                  />
                  <h2 className="font-semibold text-lg mt-3">{user.name}</h2>
                  <p className="text-sm mt-1 text-gray-400">{user.email}</p>
                </div>

                {/* Icon Buttons Section */}
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <Link to="/profilepage">
                    <button
                      className={`w-full flex flex-col items-center p-3 rounded-xl cursor-pointer  ${theme === 'dark'
                        ? 'bg-gray-700 text-white'
                        : 'bg-[#DCE6FF] text-[#4C5FFF]'
                        }`}
                      onClick={() => setShowPopup(false)}
                    >
                      <User size={24} />
                      <span className="text-xs mt-1">Profile</span>
                    </button>
                  </Link>

                  <button
                    className={`w-full flex flex-col items-center p-3 rounded-xl cursor-pointer ${theme === 'dark'
                      ? 'bg-gray-700 text-white'
                      : 'bg-[#FFE0E0] text-[#FF4C4C]'
                      }`}
                    onClick={handleLogout}
                  >
                    <LogOut size={24} />
                    <span className="text-xs mt-1">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <Link to="/signin" className="text-blue-600 font-semibold">
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
  <div
    className={`md:hidden fixed inset-0 backdrop-blur-2xl z-40 flex justify-center items-start pt-16 ${
      theme === "dark" ? "bg-[#000000c3]" : "bg-[#ffffffcc]"
    }`}
  >
    <div
      className={`w-80 max-w-sm rounded-3xl p-6 shadow-2xl ${
        theme === "dark" ? "bg-[#1f1f1f] text-white" : "bg-white text-black"
      } flex flex-col items-center gap-6 relative`}
    >
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 cursor-pointer transition"
        onClick={() => setMobileMenuOpen(false)}
        aria-label="Close menu"
      >
        <X size={22} />
      </button>

      {user ? (
        <>
          {/* Profile Section */}
          <div className="flex flex-col items-center gap-2">
            <img
              src={
                user.profilePicture ||
                `${api.defaults.baseURL}uploads/default-profile.jpg`
              }
              alt="User"
              className="w-24 h-24 rounded-full object-cover object-top"
            />
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>

          {/* Icon Buttons */}
          <div className="grid grid-cols-2 gap-4 border-t pt-4 w-full">
            <Link to="/user-notifications">
              <button
                className={`flex flex-col items-center justify-center h-20 w-32 rounded-xl transition ${
                  theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-[#DCE6FF] text-[#4C5FFF]"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className="ri-notification-2-line text-2xl"></i>
                <span className="text-xs mt-1">Alerts</span>
              </button>
            </Link>

            <button
              onClick={toggleTheme}
              className={`flex flex-col items-center justify-center h-20 w-32 rounded-xl transition ${
                theme === "dark"
                  ? "bg-gray-700 text-white"
                  : "bg-[#DCE6FF] text-[#4C5FFF]"
              }`}
            >
              {theme === "dark" ? (
                <Sun className="text-2xl" />
              ) : (
                <Moon className="text-2xl" />
              )}
              <span className="text-xs mt-1">Theme</span>
            </button>

            <Link to="/profilepage">
              <button
                className={`flex flex-col items-center justify-center h-20 w-32 rounded-xl transition ${
                  theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-[#DCE6FF] text-[#4C5FFF]"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={24} />
                <span className="text-xs mt-1">Profile</span>
              </button>
            </Link>

            <button
              className={`flex flex-col items-center justify-center h-20 w-32 rounded-xl transition ${
                theme === "dark"
                  ? "bg-gray-700 text-white"
                  : "bg-[#FFE0E0] text-[#FF4C4C]"
              }`}
              onClick={handleLogout}
            >
              <LogOut size={24} />
              <span className="text-xs mt-1">Logout</span>
            </button>
          </div>
        </>
      ) : (
        <Link
          to="/signin"
          className="text-blue-600 font-semibold text-lg p-3 w-full text-center bg-blue-50 rounded-lg"
          onClick={() => setMobileMenuOpen(false)}
        >
          Sign In
        </Link>
      )}
    </div>
  </div>
)}

    </nav>
  );
};

export default Navbar;