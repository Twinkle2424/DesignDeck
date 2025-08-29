import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { Helmet } from "react-helmet";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const API_BASE_URL = api.defaults.baseURL;

const ProjectView = () => {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allMedia, setAllMedia] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const { theme } = useContext(ThemeContext);
    const location = useLocation();
    const { projectId } = useParams();

    useEffect(() => {
        const fetchProjectDetails = async () => {
            setLoading(true);
            try {
                // Extract project ID from URL or from state if passed via Link
                const id = projectId || location.state?.projectId;

                if (!id) {
                    console.error("No project ID found");
                    setLoading(false);
                    return;
                }

                const response = await api.get(`/api/projects/${id}`, {
                    withCredentials: true,
                });

                if (response.data.success) {
                    setProject(response.data.project);

                    // Combine images and videos into a single array for easier navigation
                    const images = response.data.project.images || [];
                    const videos = response.data.project.videos || [];

                    // Create media lists separately
                    const videosList = videos.map(src => ({ type: 'video', src }));
                    const imagesList = images.map(src => ({ type: 'image', src }));

                    // Combine with videos first, then images
                    const mediaList = [...videosList, ...imagesList];

                    setAllMedia(mediaList);

                    // Fetch like status for this project
                    fetchLikeStatus(id);
                } else {
                    console.error("Failed to fetch project details");
                }
            } catch (error) {
                console.error("Error fetching project details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [projectId, location]);

    const fetchLikeStatus = async (id) => {
        try {
            const likeStatusRes = await api.get(`/api/projects/like/${id}`, {
                withCredentials: true,
            });

            if (likeStatusRes.data.success) {
                setLiked(likeStatusRes.data.liked);
                setLikeCount(likeStatusRes.data.likeCount);
            }
        } catch (error) {
            console.error(`❌ Like status error for project ${id}:`, error.response?.data || error.message);
        }
    };

    const handleLikeToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const res = await api.post(`/api/projects/like/${projectId}`, {}, {
                withCredentials: true,
            });

            if (res.data.success) {
                setLiked(res.data.liked);
                setLikeCount(res.data.likeCount);
            }
        } catch (error) {
            console.error("❌ Toggle like error:", error.response?.data || error.message);
        }
    };

    if (!project) {
        return (
            <>
                <Navbar />
                <div className={`min-h-screen flex flex-col items-center justify-center px-4 ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
                    <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
                    <p className="text-center">The project you're looking for doesn't exist or has been removed.</p>
                    <button
                        onClick={() => window.history.back()}
                        className={`mt-6 px-4 py-2 rounded-full text-sm font-medium ${theme === "dark" ? "bg-purple-600 text-white" : "bg-purple-200 text-purple-600"}`}
                    >
                        Go Back
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>{project.title} - DesignDeck</title>
            </Helmet>
            <Navbar />
            <div className={`w-full min-h-screen mx-auto px-2 sm:px-4 md:px-6 pt-16 pb-10 ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
                <div className={`grid gap-4 md:gap-6 lg:gap-8`}>
                    {allMedia.map((media, index) => (
                        <div key={index} className="w-full max-w-2xl mx-auto relative">
                            {/* Profile Card only on first media */}
                            {index === 0 && (
                                <div
                                    className={`fixed z-[2] bottom-4 sm:bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 shadow-lg rounded-lg p-3 sm:p-4 flex flex-col items-center justify-center ${theme === "dark"
                                        ? "bg-gray-900 text-white"
                                        : "bg-white text-black"
                                        } ${isCollapsed ? "w-22 sm:w-26" : "w-[92%] sm:w-[85%] md:w-[80%] max-w-md"}`}
                                >
                                    {/* Profile Section */}
                                    <div className="flex items-center justify-between w-full">
                                        {!isCollapsed && (
                                            <div className="flex items-center gap-2 pr-2 sm:pr-4 md:pr-8 flex-1">
                                                <img
                                                    src={project.userId?.profilePicture || `${api.defaults.baseURL}uploads/default-profile.jpg`}
                                                    alt={project.userId?.name || "Unknown designer"}
                                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                                                />
                                                <div className="overflow-hidden">
                                                    <h3 className="text-xs sm:text-sm font-semibold line-clamp-2">
                                                        {project.title}
                                                    </h3>

                                                    <p
                                                        className={`text-xs truncate ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                                                            }`}
                                                    >
                                                        {project.userId?.name || "Unknown designer"}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex gap-1 sm:gap-2 flex-shrink-0">


                                            {/* Profile Button */}
                                            <Link to={`/profile/${project.userId?._id}`}>
                                                <button
                                                    className={`rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center cursor-pointer ${theme === "dark"
                                                        ? "bg-gray-700 hover:bg-gray-600"
                                                        : "bg-gray-200 hover:bg-gray-300"
                                                        }`}
                                                >
                                                    <i
                                                        className={`ri-user-fill text-base sm:text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                                                            }`}
                                                    ></i>
                                                </button>
                                            </Link>

                                            {/* Three-dot Button (Reopen Profile Section) */}
                                            {isCollapsed ? (
                                                <button
                                                    className={`rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center cursor-pointer ${theme === "dark"
                                                        ? "bg-gray-700 hover:bg-gray-600"
                                                        : "bg-gray-200 hover:bg-gray-300"
                                                        }`}
                                                    onClick={() => setIsCollapsed(false)}
                                                >
                                                    <i
                                                        className={`ri-more-2-fill text-base sm:text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                                                            }`}
                                                    ></i>
                                                </button>
                                            ) : (
                                                <>
                                                    {/* Like Button */}
                                                    <button
                                                        className={`rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center cursor-pointer ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                                                            }`}
                                                        onClick={handleLikeToggle}
                                                    >
                                                        <i
                                                            className={`ri-heart-fill text-base sm:text-lg ${liked
                                                                ? theme === "dark"
                                                                    ? "text-blue-400"
                                                                    : "text-blue-600"
                                                                : theme === "dark"
                                                                    ? "text-gray-200"
                                                                    : "text-gray-600"
                                                                }`}
                                                        />

                                                    </button>
                                                    {/* Expand/Collapse Button */}
                                                    <button
                                                        className={`rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center cursor-pointer ${theme === "dark"
                                                            ? "bg-gray-700 hover:bg-gray-600"
                                                            : "bg-gray-200 hover:bg-gray-300"
                                                            }`}
                                                        onClick={() => setExpanded(!expanded)}
                                                    >
                                                        <i
                                                            className={`${expanded
                                                                ? "ri-collapse-diagonal-line"
                                                                : "ri-expand-diagonal-fill"
                                                                } text-base sm:text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                                                                }`}
                                                        ></i>
                                                    </button>



                                                    {/* Close Button */}
                                                    <button
                                                        className={`rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center cursor-pointer ${theme === "dark"
                                                            ? "bg-gray-700 hover:bg-gray-600"
                                                            : "bg-gray-200 hover:bg-gray-300"
                                                            }`}
                                                        onClick={() => setIsCollapsed(true)}
                                                    >
                                                        <i
                                                            className={`ri-close-line text-base sm:text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                                                                }`}
                                                        ></i>
                                                    </button>

                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Expanded Description Section (Smooth Transition) */}
                                    <div
                                        className={`overflow-hidden transition-all duration-500 ease-in-out w-full ${expanded ? "max-h-32 sm:max-h-40 mt-3 sm:mt-4" : "max-h-0"
                                            }`}
                                    >
                                        <div
                                            className={`p-2 shadow-md rounded-lg max-h-24 overflow-y-auto custom-scrollbar ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                                                }`}
                                        >
                                            <p
                                                className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"
                                                    }`}
                                            >
                                                {project.description || "No description provided."}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            )}

                            {/* Media Display */}
                            {media.type === "image" ? (
                                <img
                                    src={`${API_BASE_URL}${media.src}`}
                                    alt={`Project media ${index + 1}`}
                                    className="w-full h-auto sm:h-auto md:h-auto lg:h-auto rounded-lg shadow-lg object-contain"
                                />
                            ) : (
                                <video
                                    src={`${API_BASE_URL}${media.src}`}
                                    autoPlay
                                    loop
                                    muted
                                    controls
                                    className="w-full h-auto sm:h-auto md:h-auto lg:h-auto rounded-lg shadow-lg object-contain"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ProjectView;