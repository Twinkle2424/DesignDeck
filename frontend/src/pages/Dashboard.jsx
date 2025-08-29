import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Helmet } from "react-helmet";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

// Define API base URL as a constant
const API_BASE_URL = api.defaults.baseURL;

const Dashboard = () => {
    const categories = ["All", "UI/UX", "Motion Graphics", "Web Design", "App Design", "Graphic Design", "Fashion Design", "Other"];
    const [activeCategory, setActiveCategory] = useState("All");
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { theme } = useContext(ThemeContext);

    // Filter projects by category - memoized to prevent unnecessary recalculations
    const filterProjectsByCategory = useCallback((projectsList, category) => {
        if (category === "All") {
            return projectsList;
        }

        return projectsList.filter(project => {
            if (Array.isArray(project.category)) {
                return project.category.some(cat =>
                    cat.trim().toLowerCase() === category.trim().toLowerCase()
                );
            } else if (typeof project.category === 'string') {
                return project.category.trim().toLowerCase() === category.trim().toLowerCase();
            }
            return false;
        });
    }, []);

    // Fetch projects with random order - only called on initial load and manual refresh
    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            // Add a random query parameter to prevent caching and get random order
            const timestamp = new Date().getTime();
            const response = await api.get(`/api/projects/all-projects?random=${timestamp}`, {
                withCredentials: true,
            });

            if (response.data.success) {
                const allProjects = response.data.projects || [];

                // Normalize projects to ensure category is always an array
                const normalizedProjects = allProjects.map(project => {
                    if (typeof project.category === 'string') {
                        return { ...project, category: [project.category] };
                    } else if (!project.category) {
                        return { ...project, category: ["Uncategorized"] };
                    }
                    return project;
                });

                // Shuffle the array for more randomness on client side
                const shuffledProjects = [...normalizedProjects].sort(() => Math.random() - 0.5);

                setProjects(shuffledProjects);

                // Apply category filtering
                const filtered = filterProjectsByCategory(shuffledProjects, activeCategory);
                setFilteredProjects(filtered);
            } else {
                console.log("No projects fetched or API returned error");
                setProjects([]);
                setFilteredProjects([]);
            }
        } catch (error) {
            console.error(`Error fetching projects:`, error);
            setProjects([]);
            setFilteredProjects([]);
        } finally {
            setLoading(false);
        }
    }, [activeCategory, filterProjectsByCategory]);

    // Initial fetch only once when component mounts
    useEffect(() => {
        fetchProjects(); // initial call - fetch only once
        // No interval setup for automatic refresh
    }, [fetchProjects]);

    // Handle category change
    const handleCategoryChange = (category) => {
        if (category === activeCategory) return; // Skip if same category
        setActiveCategory(category);
        setSearchQuery(""); // Reset search when changing categories

        // Immediately filter existing projects without waiting for next fetch
        const filtered = filterProjectsByCategory(projects, category);
        setFilteredProjects(filtered);
    };

    // Handle manual refresh - now this is the only way to fetch new projects
    const handleRefresh = () => {
        fetchProjects();
    };

    return (
        <>
            <Helmet>
                <title>DesignDeck - Dashboard</title>
            </Helmet>
            <Navbar />
            <div className={`px-4 sm:px-6 md:px-8 pt-16 ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
                {/* Header Section */}
                <div className="relative text-center py-8 sm:py-12 md:py-16 mt-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold px-2">
                        Discover the world's{" "}
                        <span className={`${theme === "dark" ? "text-gray-300" : "text-black"}`}>
                            top designers
                        </span>
                    </h1>
                    <p className={`font-regular mt-3 sm:mt-4 md:mt-6 text-sm sm:text-base px-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        Explore work from the most talented and accomplished designers{" "}
                        <span className="hidden sm:inline"><br /></span>
                        ready to take on your next project
                    </p>
                </div>

                {/* Categories*/}
                <div className="md:flex-row md:items-center justify-between mt-4 sm:mt-6 px-2">
                    <div className="flex justify-start md:justify-center gap-2 sm:gap-4 overflow-x-auto pb-2">
                        <div className="flex space-x-2 sm:space-x-4">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryChange(cat)}
                                    className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${activeCategory === cat
                                        ? theme === "dark"
                                            ? "bg-purple-600 text-white"
                                            : "bg-purple-200 text-purple-600"
                                        : theme === "dark"
                                            ? "text-gray-400"
                                            : "text-gray-600"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Refresh Button - more prominent now as it's the only way to fetch new projects */}
                <div className="flex justify-end">
                    <button
                        onClick={handleRefresh}
                        className={`mt-3 md:mt-0 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 cursor-pointer ${theme === "dark"
                            ? "bg-purple-700 text-white hover:bg-purple-600"
                            : "bg-purple-500 text-white hover:bg-purple-600"
                            } transition-colors duration-200`}
                        disabled={loading}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {loading ? 'Loading...' : 'Refresh Projects'}
                    </button>
                </div>

                {/* Image & Video Grid */}
                <div className={`max-w-full mx-auto p-4 sm:p-6 ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
                    <div className="flex justify-between items-center">
                        <h3
                            className={`text-xl font-semibold border-b-2 pb-2 inline-block min-w-fit px-1 ${theme === "dark" ? "border-gray-600" : "border-gray-300"}`}
                        >
                            {activeCategory === "All" ? "All Projects" : `${activeCategory} Projects`}
                        </h3>
                    </div>

                    {filteredProjects.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
                            {filteredProjects.map((project, index) => (
                                <Link to={`/view/${project._id}`} key={project._id || index} className="no-underline">
                                    <div className={`rounded-xl overflow-hidden group cursor-pointer ${theme === "dark" ? "bg-black" : "bg-white"}`}>
                                        {/* Media Handling */}
                                        <div className="relative w-full h-48 sm:h-52 md:h-60 rounded-xl overflow-hidden">
                                            {project.images && project.images.length > 0 ? (
                                                <>
                                                    {/* Show Image by Default */}
                                                    <img
                                                        src={`${API_BASE_URL}${project.images[0]}` || "/default-thumbnail.jpg"}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover rounded-xl group-hover:hidden"
                                                    />
                                                    {/* Show Video on Hover if available, otherwise show same image */}
                                                    {project.videos && project.videos.length > 0 ? (
                                                        <video
                                                            className="w-full h-full object-cover rounded-xl hidden group-hover:block"
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
                                                            src={`${API_BASE_URL}${project.images[0]}` || "/default-thumbnail.jpg"}
                                                            alt={project.title}
                                                            className="w-full h-full object-cover rounded-xl hidden group-hover:block"
                                                        />
                                                    )}
                                                </>
                                            ) : project.videos && project.videos.length > 0 ? (
                                                <>
                                                    {/* For video-only projects: Show first frame of video as static thumbnail */}
                                                    <div className="w-full h-full group-hover:hidden">
                                                        <video
                                                            className="w-full h-full object-cover rounded-xl"
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
                                                        className="w-full h-full object-cover rounded-xl hidden group-hover:block"
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
                                                <img
                                                    src="/default-thumbnail.jpg"
                                                    alt={project.title}
                                                    className="w-full h-full object-cover rounded-xl"
                                                />
                                            )}

                                            {/* Category Labels - Display multiple categories */}
                                            <div className="absolute top-2 right-2 flex flex-wrap justify-end gap-1">
                                                {Array.isArray(project.category) && project.category.length > 0 ? (
                                                    project.category.map((cat, idx) => (
                                                        <span key={idx} className="px-2 py-1 rounded-full text-xs bg-opacity-70 bg-black text-white">
                                                            {cat}
                                                        </span>
                                                    ))
                                                ) : project.category ? (
                                                    <span className="px-2 py-1 rounded-full text-xs bg-opacity-70 bg-black text-white">
                                                        {project.category}
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 rounded-full text-xs bg-opacity-70 bg-black text-white">
                                                        Uncategorized
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* User Info at Bottom */}
                                        <div className="py-2 flex items-center justify-between gap-3">
                                            {/* User Info */}
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <img
                                                    src={project.userId?.profilePicture || `${API_BASE_URL}/uploads/default-profile.jpg`}
                                                    alt={project.userId?.name || "Unknown"}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div className="flex flex-col">
                                                    <h2 className={`font-semibold text-sm sm:text-base break-words max-w-[180px] sm:max-w-[220px] md:max-w-full ${theme === "dark" ? "text-white" : "text-black"}`}>
                                                        {project.title}
                                                    </h2>
                                                    <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                                        {project.userId?.name || "Unknown User"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Like Count */}
                                            <div className={`text-xs sm:text-sm flex justify-center items-center gap-1 px-2 py-1 rounded-full ${theme === "dark" ? "bg-blue-900 text-blue-300" : "bg-[#D5E0FF] text-blue-500"}`}>
                                                <i className={`ri-heart-fill ${theme === "dark" ? "text-blue-500" : "text-blue-500"}`}></i>
                                                {project.likeCount || 0}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 mt-6">
                            {loading ? (
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
                                    <p className="mt-4 text-lg">Loading projects...</p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-lg">No projects found</p>
                                    {activeCategory !== "All" && (
                                        <button
                                            onClick={() => handleCategoryChange("All")}
                                            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-full text-sm hover:bg-purple-600"
                                        >
                                            View All Projects Instead
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;