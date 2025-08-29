import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { ThemeContext } from "../context/ThemeContext";
import { Sun, Moon, LogOut, Menu, Users, User as UserIcon, X, Trash2, Bell, Mail, Send } from "lucide-react"; // Added Menu icon
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
    const [isAdmin, setIsAdmin] = useState(null);
    const [message, setMessage] = useState("");
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [users, setUsers] = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profilePopupUser, setProfilePopupUser] = useState(null);
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
        axios.get("http://localhost:5000/admin/admin-dashboard", { withCredentials: true })
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
            axios.get("http://localhost:5000/admin/all-users", { withCredentials: true })
                .then((res) => setUsers(res.data))
                .catch((err) => console.error("Error fetching users:", err));
        };

        fetchUsers(); // Fetch immediately on page load
        const interval = setInterval(fetchUsers, 2000); // Auto-refresh every 5 sec

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    // Fetch a specific user's details

    const handleProfileIconClick = (user) => {
        if (isAdmin) {
            setProfilePopupUser(user);
        }
    };

    const handleDeleteUser = async (email) => {
        // Step 1: Send DELETE request to the backend
        const response = await axios.delete(`http://localhost:5000/admin/delete-user/${email}`, {
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

        // Step 2: Update UI immediately after deletion
        setUsers(prevUsers => prevUsers.filter(user => user.email !== email));
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

        axios.post("http://localhost:5000/notifications/admin-notifications", { message }, { withCredentials: true })
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
            const response = await axios.post("http://localhost:5000/admin/send-email", {
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
        axios.post("http://localhost:5000/auth/logout", {}, { withCredentials: true })
            .then(() => {
                toast("Logged out successfully!", {
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
                toast("Logout failed!", {
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

    return (
        <>
            <ToastContainer />
            <div className={`min-h-screen ${theme === "dark" ? "bg-black text-gray-100" : "bg-gray-50 text-gray-800"} transition-colors duration-300`}>
                {/* Navbar */}
                <nav className={`flex flex-col w-full items-end px-4 sm:px-6 py-3 fixed top-0 left-0 backdrop-blur-2xl z-50 ${theme === "dark" ? "bg-[#000000f3] text-white" : "bg-[#ffffffc3] text-black"
                    }`}>
                    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                        <div className="flex justify-between h-12">
                            <div className="flex items-center">
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${theme === "dark" ? "bg-blue-600" : "bg-blue-500"} flex items-center justify-center text-white font-bold text-lg sm:text-xl`}>
                                    A
                                </div>
                                <h1 className="ml-2 sm:ml-3 text-lg sm:text-xl font-bold tracking-tight">AdminPanel</h1>
                            </div>

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
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className={`mt-2 text-sm sm:text-base ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Welcome to your control center</p>
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
                                        className={`flex items-center gap-2 w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 mt-3 sm:mt-0 rounded-lg cursor-pointer ${theme === "dark"
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : "bg-blue-500 hover:bg-blue-600"
                                            } text-white font-medium transition-colors whitespace-nowrap flex-shrink-0`}
                                    >
                                        <Send className="h-4 w-4" />
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

                        {/* User Table */}
                        <div className="overflow-x-auto">
                            <div className="inline-block min-w-full align-middle">
                                <div className="overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead>
                                            <tr className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-100"} text-left`}>
                                                <th className="px-4 py-3 text-sm font-medium">Name</th>
                                                <th className="px-4 py-3 text-sm font-medium">Email</th>
                                                <th className="px-4 py-3 text-sm font-medium">Role</th>
                                                <th className="px-4 py-3 text-sm font-medium hidden sm:table-cell">Last Login</th>
                                                <th className="px-4 py-3 text-sm font-medium">Status</th>
                                                <th className="px-4 py-3 text-sm font-medium">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {users.map((user) => (
                                                <tr
                                                    key={user._id}
                                                    onClick={() => handleUserClick(user._id)}
                                                    className={`cursor-pointer ${theme === "dark"
                                                        ? "hover:bg-gray-700 text-gray-300"
                                                        : "hover:bg-gray-50 text-gray-800"} transition`}
                                                >
                                                    <td className="px-4 py-3">{user.name}</td>
                                                    <td className="px-4 py-3 truncate">{user.email}</td>
                                                    <td className="px-4 py-3">{user.isAdmin ? "Admin" : "User"}</td>
                                                    <td className="px-4 py-3 hidden sm:table-cell">
                                                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isLoggedIn
                                                            ? "bg-green-500 text-white"
                                                            : "bg-red-500 text-white"}`}>
                                                            {user.isLoggedIn ? "Online" : "Offline"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 flex items-center space-x-2">
                                                        {/* Profile Icon Button */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleProfileIconClick(user);
                                                            }}
                                                            className={`p-1 rounded-full transition cursor-pointer hover:scale-105`}
                                                            disabled={!isAdmin}
                                                        >
                                                            <UserIcon
                                                                className={`h-5 w-5 ${theme === "dark"
                                                                    ? "text-blue-400 hover:text-blue-300"
                                                                    : "text-blue-500 hover:text-blue-600"
                                                                    }`}
                                                            />
                                                        </button>

                                                        {/* Delete Icon Button */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteUser(user._id);
                                                            }}
                                                            className="p-1 rounded-full transition cursor-pointer hover:scale-105"
                                                        >
                                                            <Trash2 onClick={() => handleDeleteUser(user.email)}
                                                                className={`h-5 w-5 ${theme === "dark"
                                                                    ? "text-red-400 hover:text-red-300"
                                                                    : "text-red-500 hover:text-red-600"
                                                                    }`}
                                                            />
                                                        </button>
                                                    </td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Profile Popup */}
                            {profilePopupUser && isAdmin && (
                                <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${theme === "dark" ? "bg-black/40 backdrop-blur-sm" : "bg-white/40 backdrop-blur-md"}`}>
                                    <div className={`w-full max-w-md relative rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${theme === "dark" ? "bg-gray-900 text-gray-200 border border-gray-800" : "bg-white text-gray-900 border border-gray-200"}`}>
                                        <button onClick={() => setProfilePopupUser(null)} className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-colors duration-200 text-gray-300 cursor-pointer `}>
                                            <X className="w-6 h-6" />
                                        </button>

                                        <div className={`h-24 md:h-32 lg:h-36 ${profilePopupUser.bannerImage}`} />

                                        <div className="relative -mt-10 md:-mt-14 lg:-mt-16 flex justify-center">
                                            <div className={`w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full border-4 flex items-center justify-center shadow-md ${theme === "dark" ? "border-gray-800 bg-gray-700" : "border-white bg-gray-200"}`}>
                                                <div className={`w-10 md:w-12 lg:w-14 h-10 md:h-12 lg:h-14 ${profilePopupUser.profilePicture}`} />
                                            </div>
                                        </div>

                                        <div className="text-center p-4 md:p-5 lg:p-6">
                                            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">{profilePopupUser.name}</h2>
                                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs md:text-sm font-medium ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"}`}>
                                                {profilePopupUser.isAdmin ? "Admin" : "User"}
                                            </span>
                                        </div>

                                        <div className={`p-4 md:p-5 lg:p-6 mx-4 md:mx-5 mb-4 md:mb-5 rounded-xl ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-800"}`}>
                                            <div className="space-y-2 md:space-y-2.5">
                                                {[
                                                    { label: "Email", value: profilePopupUser.email },
                                                    {
                                                        label: "Last Login",
                                                        value: profilePopupUser.lastLogin
                                                            ? new Date(profilePopupUser.lastLogin).toLocaleString()
                                                            : "Never"
                                                    },
                                                    {
                                                        label: "Status",
                                                        value: profilePopupUser.isLoggedIn ? "Online" : "Offline",
                                                        className: profilePopupUser.isLoggedIn ? "text-green-500" : "text-red-500"
                                                    }
                                                ].map(({ label, value, className = '' }, index) => (
                                                    <p key={index} className={`text-sm md:text-base flex items-center ${className}`}>
                                                        <strong className="mr-2 min-w-[80px] md:min-w-[100px] inline-block">{label}:</strong>
                                                        {value}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;