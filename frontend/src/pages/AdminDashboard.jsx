import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import { ThemeContext } from "../context/ThemeContext";
import { Sun, Moon, LogOut, Menu, Users, Trash2, Bell, Mail, Send, Shield,  Calendar } from "lucide-react"; // Added Menu icon
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
    const [isAdmin, setIsAdmin] = useState(null);
    const [message, setMessage] = useState("");
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [users, setUsers] = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState(null);
    const [subject, setSubject] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const [toastShown, setToastShown] = useState(false);

    const toggleSection = (section) => {
        // If clicking the same section, hide it; otherwise, show the new section
        setActiveSection(activeSection === section ? null : section);
    };

    const getCustomToastStyle = (theme) => ({
        borderRadius: "8px",
        padding: "16px",
        fontSize: "14px",
        fontWeight: "500",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        boxShadow: theme === "dark"
            ? "0px 4px 15px rgba(255, 255, 255, 0.15)"
            : "0px 4px 15px rgba(0, 0, 0, 0.1)",
        background: theme === "dark" ? "#222" : "#fff",
        color: theme === "dark" ? "#fff" : "#333",
        border: theme === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid #eaeaea",
        width: "320px",
    });

    useEffect(() => {
        api.get("/admin/admin-dashboard", { withCredentials: true })
            .then((res) => {
                if (res.data.isAdmin) {
                    setIsAdmin(true);
                    if (!toastShown) {
                        toast("Admin logged in successfully!", {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            style: getCustomToastStyle(theme),
                            className: theme === "dark" ? "dark-theme" : "light-theme",
                        });
                        setToastShown(true);
                    }
                } else {
                    toast("Access Denied: Admins Only!", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        style: getCustomToastStyle(theme),
                        className: theme === "dark" ? "dark-theme" : "light-theme",
                    });
                    navigate("/dashboard");
                }
            })
            .catch(() => {
                toast("Unauthorized access!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: getCustomToastStyle(theme),
                    className: theme === "dark" ? "dark-theme" : "light-theme",
                });
                navigate("/dashboard");
            });
    }, [navigate, theme, toastShown]);

    useEffect(() => {
        const fetchUsers = () => {
            api.get("/admin/all-users", { withCredentials: true })
                .then((res) => setUsers(res.data))
                .catch((err) => console.error("Error fetching users:", err));
        };

        fetchUsers(); // Fetch immediately on page load
        const interval = setInterval(fetchUsers, 2000); // Auto-refresh every 5 sec

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    // Fetch a specific user's details
    const handleDeleteUser = async (email) => {
        try {
            // Step 1: Send DELETE request to the backend
            const response = await api.delete(`/admin/delete-user/${email}`, {
                withCredentials: true,
            });
    
            toast("User deleted successfully!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: getCustomToastStyle(theme),
                className: theme === "dark" ? "dark-theme" : "light-theme",
            });
            setToastShown(true);
    
            // Step 2: Update UI
            setUsers(prevUsers => prevUsers.filter(user => user.email !== email));
        } catch (error) {
            console.error("Error deleting user:", error);
    
            toast(
                error?.response?.data?.message || "Failed to delete user.",
                {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: getCustomToastStyle(theme),
                    className: theme === "dark" ? "dark-theme" : "light-theme",
                }
            );
        }
    };

    const sendNotification = () => {
        if (!message.trim()) {
            toast("Message cannot be empty!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: getCustomToastStyle(theme),
                className: theme === "dark" ? "dark-theme" : "light-theme",
            });
            return;
        }

        api.post("/notifications/admin-notifications", { message }, { withCredentials: true })
            .then(() => {
                toast("Notification sent successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: getCustomToastStyle(theme),
                    className: theme === "dark" ? "dark-theme" : "light-theme",
                });
                setMessage("");
            })
            .catch(() => {
                toast("Failed to send notification!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: getCustomToastStyle(theme),
                    className: theme === "dark" ? "dark-theme" : "light-theme",
                });
            });
    };

    const sendEmail = async (e) => {
        e.preventDefault();

        if (!subject.trim() && !email.trim()) {
            toast("Subject and Message cannot be empty!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: getCustomToastStyle(theme),
                className: theme === "dark" ? "dark-theme" : "light-theme",
            });
            return;
        }

        try {
            const response = await api.post("/admin/send-email", {
                subject,
                email,
            });

            if (response.data.success) {
                toast("Email sent successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: getCustomToastStyle(theme),
                    className: theme === "dark" ? "dark-theme" : "light-theme",
                });
                setSubject("");
                setEmail("");
            }
        } catch (error) {
            toast("Failed to send email!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: getCustomToastStyle(theme),
                className: theme === "dark" ? "dark-theme" : "light-theme",
            });
        } finally {
        }
    };


    const handleLogout = () => {
        api.post("/admin/logout", {}, { withCredentials: true })
            .then(() => {
                toast("Admin logged out successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: getCustomToastStyle(theme),
                    className: theme === "dark" ? "dark-theme" : "light-theme",
                });
                setTimeout(() => navigate("/"), 3000);
            })
            .catch(() => {
                toast("Admin Logout failed!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: getCustomToastStyle(theme),
                    className: theme === "dark" ? "dark-theme" : "light-theme",
                });
            });
    };

    if (isAdmin === null) return (
        <div className={`flex items-center justify-center h-screen w-screen ${theme === "dark" ? "bg-[#1E1E1E] text-white" : "bg-white text-black"}`}>
            <h1 className="text-center text-xl font-semibold tracking-wide animate-bounce bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                Loading...
            </h1>
        </div>
    );

    const logoSrc = theme === 'dark' ? '/public/Frame 3.png' : '/public/Frame 2.png';

    return (
        <>
            <ToastContainer />
            <div className={`min-h-screen ${theme === "dark" ? "bg-black text-gray-100" : "bg-gray-50 text-gray-800"} transition-colors duration-300`}>
                {/* Navbar */}
                <nav className={`flex flex-col w-full items-end px-4 sm:px-6 py-3 fixed top-0 left-0 backdrop-blur-2xl z-50 ${theme === "dark" ? "bg-[#000000f3] text-white" : "bg-[#ffffffc3] text-black"
                    }`}>
                    <div className="w-full">
                        <div className="flex justify-between h-12">
                        <img
                        src={logoSrc}
                        alt="DesignDeck Logo"
                        width={180}
                        className="rounded-full"
                    />

                            {/* Desktop menu */}
                            <div className="hidden md:flex items-center space-x-4">
                                <button onClick={() => toggleSection('notification')}
                                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer relative ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}
                                >
                                    <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>

                                <button onClick={() => toggleSection('email')}
                                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer relative ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}
                                >
                                    <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>

                                <button
                                    onClick={toggleTheme}
                                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}
                                >
                                    {theme === "dark" ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-red-500 cursor-pointer ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}
                                >
                                    <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <span>Logout</span>
                                </button>
                            </div>

                            {/* Mobile menu button */}
                            <div className="flex items-center md:hidden">
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className={`p-2 rounded-md ${theme === "dark" ? "text-gray-400 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"}`}
                                >
                                    <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden w-full">
                            <div className={`px-2 pt-2 pb-3 space-y-1 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                                <button onClick={() => toggleSection('notification')}
                                    className={`flex w-full items-center gap-2 px-3 py-2 rounded-md text-base font-medium relative ${theme === "dark" ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"} transition-colors`}
                                >
                                    <Bell className="h-5 w-5" />
                                    <span>Notification System</span>
                                </button>

                                <button onClick={() => toggleSection('email')}
                                    className={`flex w-full items-center gap-2 px-3 py-2 rounded-md text-base font-medium relative ${theme === "dark" ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"} transition-colors`}
                                >
                                    <Mail className="h-5 w-5" />
                                    <span>Mail System</span>
                                </button>

                                <button
                                    onClick={toggleTheme}
                                    className={`flex w-full items-center gap-2 px-3 py-2 rounded-md text-base font-medium ${theme === "dark" ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"} transition-colors`}
                                >
                                    {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                    <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className={`flex w-full items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-red-500 ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </nav>

                {/* Main content */}
                <div className="pt-20 sm:pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Header */}
                    <div className={`mb-6 sm:mb-8 pb-4 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                        <h1 className="text-2xl sm:text-2xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className={`mt-2 text-sm sm:text-base ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Welcome to admin control center</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <div className={`p-4 sm:p-6 rounded-xl shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                            <h3 className={`text-base sm:text-lg font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Total Users</h3>
                            <p className="text-2xl sm:text-3xl font-bold mt-2">{users.length}</p>
                        </div>
                        <div className={`p-4 sm:p-6 rounded-xl shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                            <h3 className={`text-base sm:text-lg font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Active Users</h3>
                            <p className="text-2xl sm:text-3xl font-bold mt-2">{users.filter(user => user.isLoggedIn).length}</p>
                        </div>
                        <div className={`p-4 sm:p-6 rounded-xl shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                            <h3 className={`text-base sm:text-lg font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Offline Users</h3>
                            <p className="text-2xl sm:text-3xl font-bold mt-2">{users.filter(user => !user.isLoggedIn).length}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Notification Section */}
                        {(activeSection === 'notification' || activeSection === null) && (
                            <div className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                    <Bell className={`h-4 w-4 sm:h-5 sm:w-5 ${theme === "dark" ? "text-blue-400" : "text-blue-500"}`} />
                                    <h2 className="text-lg sm:text-xl font-semibold">Send Notification</h2>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Enter notification message"
                                        className={`w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme === "dark"
                                            ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                                            : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
                                            } transition-colors`}
                                    />
                                    <button
                                        onClick={sendNotification}
                                        className={`flex items-center justify-center gap-2 w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 mt-3 sm:mt-0 rounded-lg cursor-pointer ${theme === "dark"
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : "bg-blue-500 hover:bg-blue-600"
                                            } text-white font-medium transition-colors whitespace-nowrap flex-shrink-0`}
                                    >
                                        <Send className="h-4 w-4 " />
                                        Send Notification
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Email Section */}
                        {activeSection === 'email' && (
                            <div className={`p-4 sm:p-6 rounded-xl shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                    <Mail className={`h-4 w-4 sm:h-5 sm:w-5 ${theme === "dark" ? "text-blue-400" : "text-blue-500"}`} />
                                    <h2 className="text-lg sm:text-xl font-semibold">Send Email</h2>
                                </div>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Email Subject"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className={`w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme === "dark"
                                            ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                                            : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
                                            } transition-colors`}
                                    />
                                    <textarea
                                        placeholder="Email Message"
                                        rows={4}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme === "dark"
                                            ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                                            : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
                                            } transition-colors`}
                                    />
                                    <button
                                        onClick={sendEmail}
                                        className={`w-full px-4 sm:px-6 py-2 sm:py-3 rounded-lg cursor-pointer flex items-center justify-center gap-2 ${theme === "dark"
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : "bg-blue-500 hover:bg-blue-600"
                                            } text-white font-medium transition-colors`}
                                    >

                                        <Send className="h-4 w-4" />Send Email
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Users Table */}
                    <div className={`rounded-xl mt-8 shadow-md overflow-hidden ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"}`}>
                        {/* Header Section */}
                        <div className="p-4 sm:p-6 pb-3 sm:pb-4">
                            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                <Users className={`h-4 w-4 sm:h-5 sm:w-5 ${theme === "dark" ? "text-blue-400" : "text-blue-500"}`} />
                                <h2 className="text-lg sm:text-xl font-semibold">User Management</h2>
                            </div>
                            <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                All registered users and their current status
                            </p>
                        </div>

                        {/* User Cards Grid */}
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {users.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => handleUserClick(user._id)}
                                    className={`cursor-pointer rounded-lg overflow-hidden flex flex-col ${theme === "dark"
                                        ? "bg-gray-700"
                                        : "bg-white"
                                        } transition-all duration-200 ${theme === "dark" ? "shadow-lg shadow-gray-900/30" : "shadow-lg shadow-gray-200/50"} hover:shadow-xl`}
                                >

                                    {/* Card Content */}
                                    <div className="px-5 pt-5 pb-3 flex-grow">
                                        {/* Status & Avatar Row */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`relative w-12 h-12 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                                                } ring-2 ${theme === "dark" ? "ring-gray-600" : "ring-gray-200"}`}>
                                                {user.profilePicture ? (
                                                    <img
                                                        src={user.profilePicture}
                                                        alt={user.name}
                                                        className="w-full h-full object-cover rounded-full"
                                                    />
                                                ) : (
                                                    <span className={`text-lg font-semibold ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                )}

                                                {/* Status Dot */}
                                                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${theme === "dark" ? "border-gray-700" : "border-white"
                                                    } ${user.isLoggedIn ? "bg-green-500" : "bg-red-500"
                                                    }`}></span>
                                            </div>

                                            <div className="flex">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.isAdmin
                                                    ? theme === "dark" ? "bg-blue-900/40 text-blue-300" : "bg-blue-100 text-blue-700"
                                                    : theme === "dark" ? "bg-purple-900/40 text-purple-300" : "bg-purple-100 text-purple-700"
                                                    }`}>
                                                    <Shield className="w-3 h-3 mr-1" />
                                                    {user.isAdmin ? "Admin" : "User"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* User Info */}
                                        <div className="mb-4">
                                            <h3 className={`font-semibold text-lg mb-1 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>{user.name}</h3>
                                            <div className={`flex items-center text-sm mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                                                <Mail className={`h-3.5 w-3.5 mr-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                                                <span className="truncate">{user.email}</span>
                                            </div>
                                            <div className={`flex items-center text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                                <Calendar className="h-3.5 w-3.5 mr-2" />
                                                <span className="truncate text-xs">
                                                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never logged in"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Footer with Actions */}
                                    <div className={`px-5 py-3 flex justify-between items-center ${theme === "dark" ? "border-t border-gray-600" : "border-t border-gray-200"}`}>
                                        <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                            {user.isLoggedIn ? "Currently Active" : "Currently Inactive"}
                                        </span>

                                        <div className="flex space-x-1">

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteUser(user._id);
                                                }}
                                                className={`p-1.5 rounded-full transition cursor-pointer ${theme === "dark"
                                                    ? "hover:bg-gray-600"
                                                    : "hover:bg-gray-100"
                                                    }`}
                                            >
                                                <Trash2 className={`h-4 w-4 ${theme === "dark" ? "text-red-400" : "text-red-500"}`} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>


                    </div>

                </div>
            </div>
        </>
    );
};

export default AdminDashboard;