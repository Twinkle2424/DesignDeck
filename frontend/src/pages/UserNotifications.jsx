import { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { ThemeContext } from "../context/ThemeContext";
import moment from "moment"; // For formatting timestamps

function UserNotifications() {
    const [notifications, setNotifications] = useState([]);
    const { theme } = useContext(ThemeContext);
    
    // ✅ Connect to the Socket.io server
    const socket = io(api.baseURL, { withCredentials: true });

    useEffect(() => {
        fetchNotifications(); // Fetch notifications when component mounts

        // ✅ Listen for real-time notifications
        socket.on("newNotification", (newNotif) => {
            setNotifications(prev => [{ ...newNotif, createdAt: new Date() }, ...prev]);
        });

        // ✅ Clean up socket connection
        return () => {
            socket.off("newNotification");
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        fetchNotifications(); // Initial fetch
    
        const interval = setInterval(() => {
            fetchNotifications();
        }, 5000); // Fetch every 5 seconds
    
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    // ✅ Fetch notifications from backend
    const fetchNotifications = async () => {
        try {
            const response = await api.get("/notifications/user-notifications", { withCredentials: true });

            // Sort notifications by date (newest first)
            const sortedNotifications = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setNotifications(sortedNotifications);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };
    return (
        <>
            <Navbar />
            <div className={`min-h-screen px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10 lg:px-16 lg:py-12 mt-10 transition-all ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center">🔔 User Notifications</h2>

                    {notifications.length === 0 ? (
                        <p className="text-center mt-6 text-md sm:text-lg text-gray-500">No new notifications</p>
                    ) : (
                        <>
                            <ul className="mt-6 space-y-4">
                                {notifications.map((notif, index) => (
                                    <li 
                                        key={index} 
                                        className={`p-4 sm:p-5 md:p-6 rounded-lg shadow-md border-l-4 transition-all 
                                            ${theme === "dark" ? "bg-gray-800 border-blue-400" : "bg-white border-blue-500"}`}
                                    >
                                        <p className="text-md sm:text-lg font-medium">{notif.message}</p>
                                        <span className="text-xs sm:text-sm text-gray-500">{moment(notif.createdAt).fromNow()}</span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default UserNotifications;