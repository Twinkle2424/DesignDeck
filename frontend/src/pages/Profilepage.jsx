import React from "react";
import Navbar from "../components/Navbar";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { FaUserEdit, FaUserPlus, FaUserMinus } from "react-icons/fa";
import { Helmet } from "react-helmet";
import api from "../services/api";
import { ThemeContext } from "../context/ThemeContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/toastStyles.css";

const API_BASE_URL = api.defaults.baseURL;

const Profilepage = () => {
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [bio, setBio] = useState('');
    const [dribbbleProfile, setDribbbleProfile] = useState('');
    const [behanceProfile, setBehanceProfile] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCurrentUser, setIsCurrentUser] = useState(true);
    const [following, setFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [profileOwner, setProfileOwner] = useState(null);
    const [followersList, setFollowersList] = useState([]);
    const [followingList, setFollowingList] = useState([]);
    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowing, setShowFollowing] = useState(false);
    const { theme } = useContext(ThemeContext);
    const { userId } = useParams();
    const navigate = useNavigate();

    const getCustomToastStyle = (theme) => ({
        borderRadius: "5px",
        padding: "16px",
        fontSize: "16px",
        fontWeight: "500",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
        boxShadow: theme === "dark"
            ? "0px 4px 10px rgba(255, 255, 255, 0.2)"
            : "0px 4px 10px rgba(0, 0, 0, 0.15)",
        background: theme === "dark" ? "#181818" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#333333",
        border: theme === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid #ddd",
        width: "400px"
    });

    const fetchUser = async () => {
        try {
            const res = await api.get("/auth/me", {
                withCredentials: true,
            });
            console.log("🟢 User Data Received:");

            if (res.data && res.data._id) {
                setUser(res.data);
                // Initialize form state with user data if available
                setBio(res.data.bio || '');
                setDribbbleProfile(res.data.dribbbleProfile || '');
                setBehanceProfile(res.data.behanceProfile || '');

                // Check if we're viewing a different user's profile
                if (userId && userId !== res.data._id) {
                    setIsCurrentUser(false);
                    fetchProfileOwner(userId);
                } else {
                    setIsCurrentUser(true);
                    setProfileOwner(res.data);
                    setFollowersCount(res.data.followers?.length || 0);
                    setFollowingCount(res.data.following?.length || 0);
                    // Fetch followers and following lists for current user
                    fetchFollowersList(res.data._id);
                    fetchFollowingList(res.data._id);
                }
            } else {
                navigate("/signin"); // Redirect to login if no user found
            }
        } catch (error) {
            console.error("❌ Error fetching user:", error);
            navigate("/signin"); // Redirect if not authenticated
        }
    };

    const fetchProfileOwner = async (ownerId) => {
        try {
            const res = await api.get(`/api/users/${ownerId}`, {
                withCredentials: true,
            });

            if (res.data) {
                setProfileOwner(res.data);
                setFollowersCount(res.data.followers?.length || 0);
                setFollowingCount(res.data.following?.length || 0);

                // Fetch followers and following lists
                fetchFollowersList(ownerId);
                fetchFollowingList(ownerId);

                // Check if current user is following profile owner
                if (user && res.data.followers && res.data.followers.includes(user._id)) {
                    setFollowing(true);
                } else {
                    setFollowing(false);
                }
            }
        } catch (error) {
            console.error("Error fetching profile owner:", error);
        }
    };

    const fetchFollowersList = async (userId) => {
        try {
            const response = await api.get(`/api/users/${userId}/followers`, {
                withCredentials: true,
            });
            setFollowersList(response.data);
        } catch (error) {
            console.error("Error fetching followers list:", error);
        }
    };

    const fetchFollowingList = async (userId) => {
        try {
            const response = await api.get(`/api/users/${userId}/following`, {
                withCredentials: true,
            });
            setFollowingList(response.data);
        } catch (error) {
            console.error("Error fetching following list:", error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [navigate, userId]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const endpoint = isCurrentUser || !userId
                    ? "/api/projects/user-projects"
                    : `/api/projects/user/${userId}`;

                const response = await api.get(endpoint, {
                    withCredentials: true,
                });

                if (response.data.success) {
                    // For each project, fetch the like status
                    const projectsWithLikes = await Promise.all(
                        response.data.projects.map(async (project) => {
                            try {
                                const likeResponse = await api.get(`/api/projects/like/${project._id}`, {
                                    withCredentials: true,
                                });

                                if (likeResponse.data.success) {
                                    return {
                                        ...project,
                                        likeCount: likeResponse.data.likeCount,
                                        liked: likeResponse.data.liked
                                    };
                                }
                                return project;
                            } catch (error) {
                                console.error(`Error fetching like status for project ${project._id}:`, error);
                                return project;
                            }
                        })
                    );

                    setProjects(projectsWithLikes);
                } else {
                    console.error("Error: ", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);  // Stop loading
            }
        };

        if (user) {
            fetchProjects();
        }

        const intervalId = setInterval(() => {
            if (user) {
                fetchProjects();
            }
        }, 5000);

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, [user, isCurrentUser, userId]);

    const handleFollow = async () => {
        if (!user || !profileOwner) return;

        try {
            const endpoint = following ? `/api/users/unfollow/${profileOwner._id}` : `/api/users/follow/${profileOwner._id}`;
            const response = await api.put(endpoint, {}, {
                withCredentials: true,
            });

            if (response.status === 200) {
                const action = following ? "unfollowed" : "followed";
                toast(`Successfully ${action} ${profileOwner.name}`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progressClassName: "Toastify__progress-bar",
                    className: theme === "dark" ? "dark-theme" : "light-theme",
                    style: getCustomToastStyle(theme),
                });

                setFollowing(!following);
                setFollowersCount(prevCount => following ? prevCount - 1 : prevCount + 1);

                // Refresh profile data and followers list
                fetchProfileOwner(profileOwner._id);
            }
        } catch (error) {
            console.error("Follow/unfollow error:", error.response?.data?.message || error.message);
            toast(error.response?.data?.message || "An error occurred", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progressClassName: "Toastify__progress-bar",
                className: theme === "dark" ? "dark-theme" : "light-theme",
                style: getCustomToastStyle(theme),
            });
        }
    };

    const handleViewProfile = (userId) => {
        navigate(`/profile/${userId}`);
        setShowFollowers(false);
        setShowFollowing(false);
    };

    if (!user) {
        return <div className={`flex items-center justify-center h-screen w-screen ${theme === "dark" ? "bg-[#1E1E1E] text-white" : "bg-white text-black"}`}>
            <h1 className="text-center text-xl font-semibold tracking-wide animate-bounce bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                Loading...
            </h1>
        </div>
    }

    const handleprofileChange = (event) => {
        event.preventDefault();
        setProfileImage(event.target.files[0]);
    };

    const handleCoverChange = (event) => {
        event.preventDefault();
        setCoverImage(event.target.files[0]);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        const isValidDribbble = (url) =>
            /^https?:\/\/(www\.)?dribbble\.com\/[a-zA-Z0-9_-]+\/?$/.test(url);

        const isValidBehance = (url) =>
            /^https?:\/\/(www\.)?behance\.net\/[a-zA-Z0-9_-]+\/?$/.test(url);

        const isDribbbleValid = !dribbbleProfile || isValidDribbble(dribbbleProfile);
        const isBehanceValid = !behanceProfile || isValidBehance(behanceProfile);

        if (!isDribbbleValid || !isBehanceValid) {
            toast("Please enter valid Dribbble and Behance links!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progressClassName: "Toastify__progress-bar",
                className: theme === "dark" ? "dark-theme" : "light-theme",
                style: getCustomToastStyle(theme),
            });
            return;
        }

        const formData = new FormData();
        if (profileImage) formData.append("profileImage", profileImage);
        if (coverImage) formData.append("coverImage", coverImage);
        formData.append("bio", bio);
        if (dribbbleProfile) formData.append("dribbbleProfile", dribbbleProfile);
        if (behanceProfile) formData.append("behanceProfile", behanceProfile);

        try {
            const response = await api.post(
                "/auth/updateprofile",
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                toast("Profile updated successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progressClassName: "Toastify__progress-bar",
                    className: theme === "dark" ? "dark-theme" : "light-theme",
                    style: getCustomToastStyle(theme),
                });
                setIsPopupOpen(false);
                fetchUser();
            }
        } catch (error) {
            console.error("Upload error:", error.response?.data || error.message);
        }
    };

    // Use the profile owner data for display
    const displayUser = profileOwner || user;

    return (
        <>
            <Helmet>
                <title>DesignDeck - Profile Page {displayUser.name}</title>
            </Helmet>
            <ToastContainer />
            <Navbar />
            <div className="min-h-screen bg-gray-100 mt-13">
                {/* Profile Section */}
                <div className="w-full flex flex-col items-center">
                    {/* Banner Section */}
                    <div className="w-full max-w-full h-40 sm:h-48 md:h-60">
                        <img
                            src={displayUser.bannerImage || "/public/image.png"}
                            alt="Gradient Banner"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Biodata Section */}
                    <div className={`relative w-full ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"} p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center -mt-12`}>
                        {/* Profile Image */}
                        <div className="absolute -top-12 left-4 sm:left-6">
                            {/* Blurred Border */}
                            <div className="w-32 h-32 sm:w-44 sm:h-44 absolute -inset-2 rounded-2xl border-4 border-white blur-2xl"></div>

                            {/* Profile Image Container */}
                            <div className={`w-28 h-28 sm:w-40 sm:h-40 ${theme === "dark" ? "bg-black" : "bg-white"} rounded-2xl p-1 relative border-4 border-transparent`}>
                                <img
                                    src={displayUser.profilePicture || `${API_BASE_URL}/uploads/default-profile.jpg`}
                                    alt="User"
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            </div>
                        </div>

                        {/* User Details */}
                        <div className="w-full pt-16 sm:pt-0 pl-2 sm:pl-48 flex flex-col gap-4 sm:gap-6">
                            {/* User Info */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl sm:text-2xl font-semibold">{displayUser.name}</h2>
                                </div>

                                <p className={`text-sm w-full sm:w-[70%] md:w-[50%] lg:w-[50%] break-words ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                    {displayUser.bio || "No Bio"}
                                </p>
                            </div>

                            {/* Followers/Following + Edit Button */}
                            <div className="flex flex-row items-center justify-start flex-wrap gap-6 w-full">
                                {/* Followers */}
                                <div
                                    className="flex flex-col items-center cursor-pointer"
                                    onClick={() => setShowFollowers(true)}
                                >
                                    <span className="font-semibold">{followersCount}</span>
                                    <span
                                        className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                                            }`}
                                    >
                                        Followers
                                    </span>
                                </div>

                                {/* Following */}
                                <div
                                    className="flex flex-col items-center cursor-pointer"
                                    onClick={() => setShowFollowing(true)}
                                >
                                    <span className="font-semibold">{followingCount}</span>
                                    <span
                                        className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                                            }`}
                                    >
                                        Following
                                    </span>
                                </div>

                                {/* Edit Profile */}
                                {isCurrentUser && (
                                    <button
                                        onClick={() => setIsPopupOpen(true)}
                                        className={`rounded-lg font-medium flex items-center gap-2 transition-colors duration-200 cursor-pointer
        px-3 py-1.5 text-sm
        sm:px-4 sm:py-2 sm:text-base
        ${theme === "dark"
                                                ? "bg-blue-900 text-blue-300 hover:bg-blue-800"
                                                : "bg-[#C3D7FF] text-[#0057FF] hover:bg-[#A9C4FF]"
                                            }`}
                                    >
                                        <FaUserEdit className="text-base sm:text-lg" />
                                        <span>Edit Profile</span>
                                    </button>
                                )}
                            </div>

                        </div>

                        {/* Social Icons */}
                        <div className="mt-4 sm:mt-0 sm:ml-auto flex gap-3 self-end sm:self-auto">
                            {/* Dribbble */}
                            <div className="relative group">
                                <a
                                    href={displayUser.dribbbleProfile || "#"}
                                    target={displayUser.dribbbleProfile ? "_blank" : "_self"}
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 p-2 rounded-full flex items-center justify-center transition-all cursor-pointer  hover:scale-110 active:scale-95 "
                                    style={{
                                        backgroundColor: theme === "dark" ? "#833AB4" : "#FEE2FE",
                                        color: theme === "dark" ? "#FBC2EB" : "#C13584"
                                    }}
                                >
                                    <i className="ri-dribbble-line text-xl"></i>
                                </a>
                            </div>

                            {/* Behance */}
                            <div className="relative group">
                                <a
                                    href={displayUser.behanceProfile || "#"}
                                    target={displayUser.behanceProfile ? "_blank" : "_self"}
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 p-2 rounded-full flex items-center justify-center transition-all cursor-pointer  hover:scale-110 active:scale-95 "
                                    style={{
                                        backgroundColor: theme === "dark" ? "#1E40AF" : "#DBEAFE",
                                        color: theme === "dark" ? "#93C5FD" : "#3B82F6"
                                    }}
                                >
                                    <i className="ri-behance-line text-xl"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* My Projects Section */}
                <div className={`max-w-full mx-auto p-4 sm:p-6 ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
                    <h3 className={`text-xl font-semibold border-b-2 pb-2 inline-block ${theme === "dark" ? "border-gray-600" : "border-gray-300"}`}>
                        {isCurrentUser ? "My Projects" : `${displayUser.name}'s Projects`}
                    </h3>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
                        <>
                            {projects?.length > 0 ? (
                                projects?.map((project, index) => (
                                    <Link
                                        to={`/view/${project._id}`}
                                        key={project._id || index}
                                        className="no-underline block"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log(`Navigating to /view/${project._id}`);
                                        }}
                                    >
                                        <div
                                            className={`group rounded-lg p-3 text-center ${theme === "dark" ? "bg-black" : "bg-white"}`}
                                        >
                                            {/* Media Handling - Using the new logic */}
                                            <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-65 rounded-lg overflow-hidden cursor-pointer">
                                                {project.firstImage || (project.images && project.images.length > 0) ? (
                                                    <>
                                                        {/* Show Image by Default */}
                                                        <img
                                                            src={`${API_BASE_URL}${project.firstImage || project.images[0]}` || "/default-thumbnail.jpg"}
                                                            alt={project.title}
                                                            className="w-full h-full object-cover rounded-lg group-hover:hidden"
                                                        />
                                                        {/* Show Video on Hover if available, otherwise show same image */}
                                                        {project.videos && project.videos.length > 0 ? (
                                                            <video
                                                                className="w-full h-full object-cover rounded-lg hidden group-hover:block"
                                                                autoPlay
                                                                loop
                                                                muted
                                                                playsInline
                                                            >
                                                                <source src={`${API_BASE_URL}${project.videos[0]}`} />
                                                                Your browser does not support the video tag.
                                                            </video>
                                                        ) : (
                                                            <img
                                                                src={`${API_BASE_URL}${project.firstImage || project.images[0]}` || "/default-thumbnail.jpg"}
                                                                alt={project.title}
                                                                className="w-full h-full object-cover rounded-lg hidden group-hover:block"
                                                            />
                                                        )}
                                                    </>
                                                ) : project.videos && project.videos.length > 0 ? (
                                                    <>
                                                        {/* For video-only projects: Show first frame of video as static thumbnail */}
                                                        <div className="w-full h-full group-hover:hidden">
                                                            <video
                                                                className="w-full h-full object-cover rounded-lg"
                                                                muted
                                                                playsInline
                                                                preload="metadata"
                                                            >
                                                                <source src={`${API_BASE_URL}${project.videos[0]}`} />
                                                                Your browser does not support the video tag.
                                                            </video>
                                                        </div>
                                                        {/* Play video on hover */}
                                                        <video
                                                            className="w-full h-full object-cover rounded-lg hidden group-hover:block"
                                                            autoPlay
                                                            loop
                                                            muted
                                                            playsInline
                                                        >
                                                            <source src={`${API_BASE_URL}${project.videos[0]}`} />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    </>
                                                ) : (
                                                    <div className={`rounded-lg w-full h-full flex items-center justify-center ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>
                                                        <span className="text-gray-500">No preview available</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between mt-1">
                                                <p className="mt-2 text-base text-start sm:text-lg font-medium line-clamp-3">
                                                    {project.title}
                                                </p>

                                                <div className={`text-xs sm:text-sm flex justify-center items-center gap-1 mt-1 px-2 py-1 rounded-full ${theme === "dark" ? "bg-blue-900 text-blue-300" : "bg-[#D5E0FF] text-blue-500"}`}>
                                                    <i className={`ri-heart-fill ${theme === "dark" ? "text-blue-500" : " text-blue-500"}`}></i>
                                                    {project.likeCount || 0}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-3 text-center p-4">
                                    <p className="text-lg font-semibold text-gray-500">No projects found</p>
                                </div>
                            )}

                            {/* Upload Project Card - Only show for current user */}
                            {isCurrentUser && (
                                <div className={`shadow-lg rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center w-full h-40 sm:h-48 md:h-56 lg:h-70 relative ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
                                    <div className={`rounded-full w-12 h-12 sm:w-15 sm:h-15 flex items-center justify-center ${theme === "dark" ? "bg-gray-600 text-gray-300" : "bg-[#DCE6FF] text-[#376CFF]"}`}>
                                        <Link to="/upload"><i className="ri-function-add-fill text-2xl sm:text-3xl"></i></Link>
                                    </div>
                                    <p className="mt-3 text-xl sm:text-2xl font-medium">Upload Project</p>
                                    <p className="text-xs sm:text-sm text-center w-full sm:w-[80%] md:w-[70%]">
                                        Show your creativity by uploading it to the world.
                                    </p>
                                </div>
                            )}
                        </>
                    </div>
                </div>

                {/* Followers Modal */}
                {showFollowers && (
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowFollowers(false)}
                    >
                        <div
                            className={`rounded-xl p-4 sm:p-6 w-full sm:w-[90%] max-w-md max-h-[80vh] overflow-y-auto shadow-lg relative ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"
                                }`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setShowFollowers(false)}
                                className={`absolute top-3 right-4 text-2xl cursor-pointer transition ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"
                                    }`}
                            >
                                &times;
                            </button>

                            {/* Title */}
                            <h2 className="text-xl font-semibold mb-4">Followers</h2>

                            {/* Followers List */}
                            {followersList.length > 0 ? (
                                <div className="space-y-3">
                                    {followersList.map((follower) => (
                                        <div
                                            key={follower._id}
                                            className={`flex items-center justify-between p-3 rounded-lg ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={follower.profilePicture || `${API_BASE_URL}/uploads/default-profile.jpg`}
                                                    alt={follower.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <span className="font-medium">{follower.name}</span>
                                            </div>
                                            <button
                                                onClick={() => handleViewProfile(follower._id)}
                                                className={`px-3 py-1 rounded text-sm cursor-pointer ${theme === "dark"
                                                    ? "bg-blue-900 text-blue-300 hover:bg-blue-800"
                                                    : "bg-[#C3D7FF] text-[#0057FF] hover:bg-[#A9C4FF]"
                                                    }`}
                                            >
                                                View
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                        No followers yet
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Following Modal */}
                {showFollowing && (
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowFollowing(false)}
                    >
                        <div
                            className={`rounded-xl p-4 sm:p-6 w-full sm:w-[90%] max-w-md max-h-[80vh] overflow-y-auto shadow-lg relative ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"
                                }`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setShowFollowing(false)}
                                className={`absolute top-3 right-4 text-2xl cursor-pointer transition ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"
                                    }`}
                            >
                                &times;
                            </button>

                            {/* Title */}
                            <h2 className="text-xl font-semibold mb-4">Following</h2>

                            {/* Following List */}
                            {followingList.length > 0 ? (
                                <div className="space-y-3">
                                    {followingList.map((following) => (
                                        <div
                                            key={following._id}
                                            className={`flex items-center justify-between p-3 rounded-lg ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={following.profilePicture || `${API_BASE_URL}/uploads/default-profile.jpg`}
                                                    alt={following.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <span className="font-medium">{following.name}</span>
                                            </div>
                                            <button
                                                onClick={() => handleViewProfile(following._id)}
                                                className={`px-3 py-1 rounded text-sm cursor-pointer ${theme === "dark"
                                                    ? "bg-blue-900 text-blue-300 hover:bg-blue-800"
                                                    : "bg-[#C3D7FF] text-[#0057FF] hover:bg-[#A9C4FF]"
                                                    }`}
                                            >
                                                View
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                        Not following anyone yet
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Edit Profile Popup */}
                {isPopupOpen && (
                    <div
                        className="fixed h-screen w-screen inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setIsPopupOpen(false)}
                    >
                        <div
                            className={`rounded-xl p-4 sm:p-6 w-full sm:w-[90%] max-w-md shadow-lg relative flex flex-col justify-center ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsPopupOpen(false)}
                                className={`absolute top-3 right-4 text-2xl cursor-pointer transition ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"}`}
                            >
                                &times;
                            </button>

                            {/* Title */}
                            <h2 className="mt-4 font-medium">Update Your Profile</h2>
                            <hr className={`border-t-2 w-36 sm:w-39 mt-1 ${theme === "dark" ? "border-gray-600" : "border-gray-300"}`} />

                            {/* Form */}
                            <div className="mt-4">
                                {/* Banner Image Upload */}
                                <label className="font-medium text-sm block">Banner Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverChange}
                                    className={`w-full p-2 border rounded-lg mt-2 text-sm ${theme === "dark" ? "border-gray-600 bg-black text-white" : "border-[#B7B7B7] bg-white text-black"}`}
                                />

                                {/* Profile Image Upload */}
                                <label className="font-medium text-sm block mt-2">Profile Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleprofileChange}
                                    className={`w-full p-2 border rounded-lg mt-2 text-sm ${theme === "dark" ? "border-gray-600 bg-black text-white" : "border-[#B7B7B7] bg-white text-black"}`}
                                />

                                {/* Bio */}
                                <label className="font-medium text-sm mt-2 block">Bio</label>
                                <textarea
                                    className={`w-full p-2 border rounded-lg mt-2 text-sm transition-all ${theme === "dark" ? "border-gray-600 bg-black text-white focus:ring-2 focus:ring-blue-400 focus:outline-none" : "border-gray-300 bg-white text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"}`}
                                    placeholder="Tell something about yourself"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows="2"
                                ></textarea>

                                {/* Dribbble Link */}
                                <label className="font-medium text-sm mt-1 block">Dribbble Profile</label>
                                <input
                                    type="url"
                                    className={`w-full p-2 border rounded-lg mt-2 text-sm transition-all ${theme === "dark" ? "border-gray-600 bg-black text-white focus:ring-2 focus:ring-blue-400 focus:outline-none" : "border-gray-300 bg-white text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"}`}
                                    placeholder="Enter your Social Media link"
                                    value={dribbbleProfile}
                                    onChange={(e) => {
                                        setDribbbleProfile(e.target.value);
                                    }}
                                />
                                {/* Behance Link */}
                                <label className="font-medium text-sm mt-1 block">Behance Profile</label>
                                <input
                                    type="url"
                                    className={`w-full p-2 border rounded-lg mt-2 text-sm transition-all ${theme === "dark" ? "border-gray-600 bg-black text-white focus:ring-2 focus:ring-blue-400 focus:outline-none" : "border-gray-300 bg-white text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"}`}
                                    placeholder="Enter your Social Media link"
                                    value={behanceProfile}
                                    onChange={(e) => {
                                        setBehanceProfile(e.target.value);
                                    }}
                                />
                            </div>

                            {/* Save Changes Button */}
                            <button
                                className={`text-md font-medium w-full py-3 mt-4 rounded-full cursor-pointer ${theme === "dark" ? "bg-blue-700 text-white hover:bg-blue-600" : "bg-[#376CFF] text-white hover:bg-[#2D5BEA]"}`}
                                onClick={handleUpdateProfile}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Profilepage;