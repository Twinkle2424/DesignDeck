import { useState } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Document() {
  const [theme, setTheme] = useState('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("project-overview");

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  // Dynamic styles based on theme
  const styles = {
    background: theme === 'dark' ? 'bg-black' : 'bg-gray-50',
    text: theme === 'dark' ? 'text-gray-200' : 'text-gray-900',
    secondaryText: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    card: theme === 'dark' ? 'bg-black border-gray-700' : 'bg-white border-gray-200',
    activeSection: theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-50 text-blue-700',
    hoverSection: theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
    highlightBox: theme === 'dark' ? 'bg-blue-900/20 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-500 text-blue-700',
    list: theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
    badge: theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800',
    code: theme === 'dark' ? 'bg-black text-gray-300 border-gray-700' : 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const sidebarSections = [
    { id: "project-overview", name: "Project Overview" },
    { id: "tech-stack", name: "Tech Stack" },
    { id: "core-features", name: "Core Features" },
    { id: "backend-models", name: "Backend Models" },
    { id: "frontend-pages", name: "Frontend Pages" },
    { id: "design-considerations", name: "Design Considerations" },
    { id: "future-scope", name: "Future Scope" },
    { id: "conclusion", name: "Conclusion" },
    { id: "installation", name: "Installation & Setup" },
    { id: "api-docs", name: "API Documentation" }
  ];

  const logoSrc = theme === 'dark' ? '/public/Frame 3.png' : '/public/Frame 2.png';

  return (
    <>
      <Helmet>
        <title>DesignDeck Docs</title>
      </Helmet>
      <div className={`flex flex-col min-h-screen ${styles.background}`}>
        {/* Header */}
        <header className={`sticky top-0 backdrop-blur-2xl z-50 ${theme === "dark" ? "bg-[#0000003] text-white" : "bg-[#ffffff3] text-black"}`}>
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center">
              <button
                onClick={toggleMenu}
                className={`md:hidden mr-4 cursor-pointer ${styles.secondaryText}`}
              >
                <Menu size={24} />
              </button>
              <Link to="/landingpage"><div className="ml-3">
              <img
                        src={logoSrc}
                        alt="DesignDeck Logo"
                        width={180}
                        className="rounded-full"
                    />
              </div></Link>
            </div>

            <button
              onClick={toggleTheme}
              className={`${styles.secondaryText} hover:opacity-80 p-2 rounded-full cursor-pointer`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div
          className={`fixed inset-0 z-30 md:hidden ${
            theme === "dark"
              ? "bg-[#0000003] text-white"
              : "bg-[#ffffff3] text-black"
          } bg-opacity-50`}
          onClick={toggleMenu}
        >
            <div
              className={`fixed inset-y-0 left-0 w-64 ${styles.card} p-4 overflow-y-auto`}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <span className={`ml-3 font-bold ${styles.text}`}>DesignDeck</span>
                </div>
                <button onClick={toggleMenu} className={`${styles.secondaryText} p-1`}>
                  <X size={24} />
                </button>
              </div>

              <nav>
                <ul className="space-y-1">
                  {sidebarSections.map(section => (
                    <li key={section.id}>
                      <button
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full px-3 py-2 rounded-md text-left ${activeSection === section.id
                          ? styles.activeSection
                          : `${styles.text} ${styles.hoverSection}`
                          }`}
                      >
                        {section.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        )}

        <div className="flex flex-1">
          {/* Sidebar - Desktop - Fixed */}
          <aside className={`hidden md:block w-64 fixed top-16 bottom-0 border-r ${theme === 'dark' ? 'border-gray-700 bg-black' : 'border-gray-200'
            }`}>
            <div className="p-4 h-full overflow-y-auto">
              <nav>
                <ul className="space-y-1">
                  {sidebarSections.map(section => (
                    <li key={section.id}>
                      <button
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full px-3 py-2 rounded-md text-left cursor-pointer ${activeSection === section.id
                          ? styles.activeSection
                          : `${styles.text} ${styles.hoverSection}`
                          }`}
                      >
                        {section.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Main Content - Scrollable with all sections */}
          <main className="flex-1 overflow-y-auto md:ml-64 p-2 h-[85vh]">

            <div className="max-w-4xl mx-auto space-y-12 pb-20">
              {/* Project Overview Section */}
              <div id="project-overview" className={`${styles.card} rounded-lg shadow-sm border p-6 md:p-8`}>
                <h2 className={`text-3xl font-bold ${styles.text} mb-6`}>Project Overview</h2>

                <p className={`${styles.list} mb-4`}>
                  Design Deck is a social platform for designers and creative professionals to showcase their work, engage with a community of like-minded individuals, and build professional networks. The platform addresses a critical gap in the market: while there are numerous portfolio platforms for designers, few offer a comprehensive social experience that combines portfolio management with community engagement.
                </p>

                <h3 className={`text-xl font-semibold ${styles.text} mt-8 mb-4`}>Purpose and Goals</h3>
                <ul className={`list-disc pl-6 ${styles.list} space-y-2 mb-6`}>
                  <li>Provide designers with a dedicated space to showcase their creative work</li>
                  <li>Enable meaningful connections between creative professionals</li>
                  <li>Create an environment for constructive feedback and collaboration</li>
                  <li>Help designers gain visibility and recognition in the creative community</li>
                  <li>Offer a platform optimized for visual content with a focus on user experience</li>
                </ul>

                <div className={`${styles.highlightBox} border-l-4 p-4 my-6`}>
                  <h4 className="font-medium mb-2">Design Deck's Unique Value</h4>
                  <p>
                    Design Deck distinguishes itself by focusing on the unique needs of designers while incorporating social features that facilitate community building. The platform is built on the MERN stack (MongoDB, Express, React, Node.js) to ensure scalability, performance, and a seamless user experience.
                  </p>
                </div>

                <p className={`${styles.list} mb-4`}>
                  By combining robust portfolio functionality with social features, Design Deck creates a unique ecosystem that serves both the presentational and networking needs of design professionals.
                </p>
              </div>

              {/* Tech Stack Section */}
              <div id="tech-stack" className={`${styles.card} rounded-lg shadow-sm border p-6 md:p-8`}>
                <h2 className={`text-3xl font-bold ${styles.text} mb-6`}>Tech Stack</h2>

                <p className={`${styles.list} mb-6`}>
                  Design Deck leverages a modern technology stack to provide a responsive, feature-rich experience:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-4`}>Frontend</h3>
                    <ul className={`space-y-2 ${styles.list}`}>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span>React.js</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span>React Router</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span>Redux Toolkit</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span>Tailwind CSS</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span>Framer Motion</span>
                      </li>
                    </ul>
                  </div>

                  <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-4`}>Backend</h3>
                    <ul className={`space-y-2 ${styles.list}`}>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span>Node.js</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span>Express.js</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span>MongoDB</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span>Mongoose</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <h3 className={`text-xl font-semibold ${styles.text} mt-6 mb-4`}>Authentication & Storage</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className={`${styles.badge} rounded-full px-3 py-1 text-sm font-medium`}>JWT</span>
                  <span className={`${styles.badge} rounded-full px-3 py-1 text-sm font-medium`}>HTTP-only cookies</span>
                  <span className={`${styles.badge} rounded-full px-3 py-1 text-sm font-medium`}>Google OAuth 2.0</span>
                  <span className={`${styles.badge} rounded-full px-3 py-1 text-sm font-medium`}>Cloudinary</span>
                  <span className={`${styles.badge} rounded-full px-3 py-1 text-sm font-medium`}>bcrypt</span>
                </div>

                <h3 className={`text-xl font-semibold ${styles.text} mt-6 mb-4`}>Development Tools</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className={`${styles.badge} rounded-full px-3 py-1 text-sm font-medium`}>ESLint</span>
                  <span className={`${styles.badge} rounded-full px-3 py-1 text-sm font-medium`}>Prettier</span>
                  <span className={`${styles.badge} rounded-full px-3 py-1 text-sm font-medium`}>Jest & React Testing Library</span>
                  <span className={`${styles.badge} rounded-full px-3 py-1 text-sm font-medium`}>Postman</span>
                </div>
              </div>

              {/* Core Features Section */}
              <div id="core-features" className={`${styles.card} rounded-lg shadow-sm border p-6 md:p-8`}>
                <h2 className={`text-3xl font-bold ${styles.text} mb-6`}>Core Features</h2>

                <p className={`${styles.list} mb-6`}>
                  Design Deck offers a robust set of features tailored to the needs of design professionals:
                </p>

                <div className="space-y-8">
                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>User Authentication</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <ul className={`space-y-2 ${styles.list}`}>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>Email/password authentication with secure password hashing</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>Google OAuth 2.0 integration for seamless sign-in</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>JWT-based authentication with HTTP-only cookies</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>Password reset functionality via email</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>User Profile</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <ul className={`space-y-2 ${styles.list}`}>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>Customizable profile image with Cloudinary integration</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>Bio section for professional summary</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>Social media links (Instagram, Behance, LinkedIn, etc.)</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>Fully editable profile information</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>Profile statistics (followers, following, total projects)</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Project Upload</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <ul className={`space-y-2 ${styles.list}`}>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>Support for multiple image uploads</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>Video embed support</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>Project title and detailed description fields</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>Drag-and-drop interface for easy uploading</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>Edit and delete functionality for existing projects</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Like Projects Feature</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <ul className={`space-y-2 ${styles.list}`}>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>Users can like/unlike projects</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>Like count displayed on each project</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>Likes stored with project data</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>User's liked projects accessible from profile</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Follow Users Feature</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <ul className={`space-y-2 ${styles.list}`}>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>Users can follow/unfollow other users</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>Follower and following lists for each user</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>Follow counts displayed on user profiles</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>Feed prioritizes content from followed users</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Notification System</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <ul className={`space-y-2 ${styles.list}`}>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>Admin can send platform-wide notifications</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>Users receive notifications for likes, follows, etc.</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>Dedicated notifications page to view all notifications</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span>Read/unread status for notifications</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Backend Models Section */}
              <div id="backend-models" className={`${styles.card} rounded-lg shadow-sm border p-6 md:p-8`}>
                <h2 className={`text-3xl font-bold ${styles.text} mb-6`}>Backend Models</h2>

                <p className={`${styles.list} mb-6`}>
                  Design Deck's backend is structured around three primary data models that form the foundation of the platform:
                </p>

                <div className="space-y-8">
                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>User Model</h3>
                    <pre className={`${styles.code} p-4 rounded-lg border overflow-x-auto`}>
                      {`// User model schema
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    googleId: { type: String, unique: true, sparse: true }, // Optional for non-Google users
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google users
    profilePicture: { type: String, default: "http://localhost:5000/uploads/default-profile.jpg" },// Stores the profile picture URL
    bannerImage: { type: String, default: "http://localhost:5000/uploads/default-banner.png" }, // Stores the banner image URL
    bio: { type: String, maxlength: 500 }, // User bio with a max length
    dribbbleProfile: { type: String }, // Instagram profile link
    behanceProfile: { type: String }, // Behance profile link
    isAdmin: { type: Boolean, default: false },
    lastLogin: { type: Date, default: null },
    isLoggedIn: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
`}
                    </pre>
                    <p className={`${styles.list} mt-4`}>
                      The User model stores all user-related information, including authentication details, profile information, social links, and relationship data (followers/following).
                    </p>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Project Model</h3>
                    <pre className={`${styles.code} p-4 rounded-lg border overflow-x-auto`}>
                      {`// Project model schema
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    videos: [{ type: String }],
    category: [{ type: String, required: true }],
    likeCount: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // NEW
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
`}
                    </pre>
                    <p className={`${styles.list} mt-4`}>
                      The Project model represents design projects uploaded by users. It includes content information, creator reference, and engagement metrics like likes and views.
                    </p>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Notification Model</h3>
                    <pre className={`${styles.code} p-4 rounded-lg border overflow-x-auto`}>
                      {`// Notification model schema
const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", NotificationSchema);`}
                    </pre>
                    <p className={`${styles.list} mt-4`}>
                      The Notification model handles all types of notifications in the system, from likes and follows to system announcements. It links to relevant users and projects as needed.
                    </p>
                  </div>

                  <div className={`${styles.highlightBox} border-l-4 p-4 my-6`}>
                    <h4 className="font-medium mb-2">Data Relationships</h4>
                    <p>
                      Design Deck's data models are carefully designed with relationships that enable efficient querying and provide a solid foundation for implementing the platform's core features. The models use MongoDB's schema flexibility while maintaining structured relationships through references.
                    </p>
                  </div>
                </div>
              </div>

              {/* Frontend Pages Section */}
              <div id="frontend-pages" className={`${styles.card} rounded-lg shadow-sm border p-6 md:p-8`}>
                <h2 className={`text-3xl font-bold ${styles.text} mb-6`}>Frontend Pages</h2>

                <p className={`${styles.list} mb-6`}>
                  Design Deck's frontend is composed of several key pages and components that deliver a seamless user experience:
                </p>

                <div className="space-y-8">
                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Landing Page</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">The landing page serves as the entry point for new visitors, featuring:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Hero section with animated illustrations</li>
                          <li>Featured projects showcase</li>
                          <li>Platform benefits and features overview</li>
                          <li>Testimonials from designers</li>
                          <li>Call-to-action buttons for sign-up and demo requests</li>
                          <li>FAQ section addressing common queries</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Dashboard</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">The personalized dashboard gives users quick access to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Project overview and status tracking</li>
                          <li>Recent activities and notifications</li>
                          <li>Quick-access tools and templates</li>
                          <li>Team collaboration widgets</li>
                          <li>Performance analytics and insights</li>
                          <li>Customizable workspace settings</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Design Editor</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">Our powerful design editor includes:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Drag-and-drop interface with responsive controls</li>
                          <li>Rich component library with customizable elements</li>
                          <li>Real-time collaboration features</li>
                          <li>Version history and design comparison tools</li>
                          <li>Asset management system with search functionality</li>
                          <li>Export options in multiple formats (PNG, SVG, PDF)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Project Gallery</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">Browse and manage projects efficiently with:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Grid and list view options with sorting capabilities</li>
                          <li>Project categorization and tagging system</li>
                          <li>Preview thumbnails with hover interactions</li>
                          <li>Batch operations for multiple projects</li>
                          <li>Search and filter functionality</li>
                          <li>Project sharing and permission controls</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>User Profile</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">Users can manage their account through:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Personal information and preferences settings</li>
                          <li>Portfolio showcase with visibility controls</li>
                          <li>Subscription management and billing history</li>
                          <li>Achievement badges and skill endorsements</li>
                          <li>Connected accounts and integrations</li>
                          <li>Activity log and notification preferences</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Resource Library</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">Access a wealth of design resources including:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Template gallery with customizable starting points</li>
                          <li>Icon and illustration collections</li>
                          <li>Typography sets and color palette libraries</li>
                          <li>Tutorial videos and design guides</li>
                          <li>Community-shared resources with rating system</li>
                          <li>Trending and featured content recommendations</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Design Considerations Section */}
              <div id="design-considerations" className={`${styles.card} rounded-lg shadow-sm border p-6 md:p-8`}>
                <h2 className={`text-3xl font-bold ${styles.text} mb-6`}>Design Considerations</h2>

                <p className={`${styles.list} mb-6`}>
                  Design Deck was built with careful attention to fundamental design principles and user experience considerations:
                </p>

                <div className="space-y-8">
                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Accessibility</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">We prioritize inclusive design through:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>WCAG 2.1 AA compliance across all pages</li>
                          <li>Keyboard navigation support with visible focus states</li>
                          <li>Screen reader compatibility with ARIA attributes</li>
                          <li>Color contrast ratios that exceed minimum standards</li>
                          <li>Text resizing support without layout breaking</li>
                          <li>Alternative text for all visual elements</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Responsive Design</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">Our interface adapts seamlessly across devices through:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Mobile-first development approach</li>
                          <li>Fluid grid layouts that scale proportionally</li>
                          <li>Breakpoint-specific optimizations for critical views</li>
                          <li>Touch-friendly controls with appropriate sizing</li>
                          <li>Conditional loading of assets based on device capabilities</li>
                          <li>Performance optimizations for varying network conditions</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Performance Optimization</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">We've implemented numerous optimizations to ensure speed and efficiency:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Code splitting and lazy loading for faster initial load</li>
                          <li>Asset compression and modern image formats (WebP, AVIF)</li>
                          <li>Strategic caching policies for frequently accessed resources</li>
                          <li>Server-side rendering for critical pages</li>
                          <li>Optimized render cycles with React's virtual DOM</li>
                          <li>Web worker offloading for intensive calculations</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Visual Design System</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">Our cohesive design language is built on:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Comprehensive component library with consistent patterns</li>
                          <li>Hierarchical typography system with clear visual hierarchy</li>
                          <li>Color palette optimized for both light and dark modes</li>
                          <li>Consistent spacing and alignment principles</li>
                          <li>Subtle animations and transitions for improved feedback</li>
                          <li>Icon and illustration style guides for visual consistency</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>User Research Integration</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">Our design decisions are informed by extensive user research:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Usability testing sessions with representative user groups</li>
                          <li>A/B testing for critical user journeys and features</li>
                          <li>Heatmap and user session recordings for behavior analysis</li>
                          <li>Sentiment analysis from user feedback channels</li>
                          <li>Competitive analysis of industry standards and expectations</li>
                          <li>Iterative design improvements based on quantitative metrics</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Cross-Browser Compatibility</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">We ensure consistent experiences across platforms with:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Comprehensive testing across major browsers (Chrome, Firefox, Safari, Edge)</li>
                          <li>Progressive enhancement approach for feature support</li>
                          <li>Polyfills for essential functionality in older browsers</li>
                          <li>Fallback solutions for unsupported browser features</li>
                          <li>Browser-specific CSS fixes where necessary</li>
                          <li>Automated cross-browser testing in the CI/CD pipeline</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Future Scope Section */}
              <div id="future-scope" className={`${styles.card} rounded-lg shadow-sm border p-6 md:p-8`}>
                <h2 className={`text-3xl font-bold ${styles.text} mb-6`}>Future Scope</h2>

                <p className={`${styles.list} mb-6`}>
                  Design Deck is constantly evolving, with several exciting developments planned for upcoming releases:
                </p>

                <div className="space-y-8">
                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>AI Integration</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">Enhancing creative workflows with artificial intelligence:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Smart design suggestions based on project context</li>
                          <li>Automated asset generation and enhancement</li>
                          <li>Design critique and improvement recommendations</li>
                          <li>Natural language processing for design commands</li>
                          <li>Style transfer and theme generation capabilities</li>
                          <li>Accessibility compliance automation and suggestions</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Expanded Collaboration Features</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">Enhanced team functionality coming soon:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Live co-editing with presence indicators</li>
                          <li>In-app video conferencing and screen sharing</li>
                          <li>Advanced commenting with threaded discussions</li>
                          <li>Design review workflows with approval systems</li>
                          <li>Team performance analytics and insights</li>
                          <li>Cross-functional collaboration tooling</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Extended Platform Support</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">Bringing Design Deck to more platforms:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Native desktop applications for Windows and macOS</li>
                          <li>Mobile apps with optimized interfaces for iOS and Android</li>
                          <li>Offline mode with synchronization capabilities</li>
                          <li>Progressive Web App enhancements</li>
                          <li>Integration with design-focused hardware devices</li>
                          <li>Cross-platform design system synchronization</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Enhanced Design Tools</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">Expanding our creative toolkit with:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Advanced animation and interaction design capabilities</li>
                          <li>3D object manipulation and rendering</li>
                          <li>Augmented reality preview functionality</li>
                          <li>Voice and sound design integration</li>
                          <li>Expanded prototyping with conditional logic</li>
                          <li>Design-to-code generation with multiple framework options</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conclusion Section */}
              <div id="conclusion" className={`${styles.card} rounded-lg shadow-sm border p-6 md:p-8`}>
                <h2 className={`text-3xl font-bold ${styles.text} mb-6`}>Conclusion</h2>

                <div className={`${styles.card} shadow-sm rounded-lg border p-6`}>
                  <div className={`${styles.text}`}>
                    <p className="mb-4">
                      Design Deck represents a significant advancement in collaborative design tools, combining powerful creative capabilities with intuitive user experiences. Through careful consideration of modern development practices and user-centered design principles, we've created a platform that addresses the evolving needs of design professionals and teams.
                    </p>

                    <p className="mb-4">
                      The architecture decisions made throughout the development process prioritize scalability, performance, and maintainability, ensuring that Design Deck can continue to grow and adapt to emerging technologies and methodologies. By leveraging cutting-edge frontend frameworks and establishing robust backend systems, we've built a foundation that will support future innovations.
                    </p>

                    <p className="mb-4">
                      User feedback has been instrumental in shaping the platform, with continuous iteration based on real-world usage patterns and pain points. This commitment to user-centered development will remain a cornerstone of our approach as we implement new features and expand platform capabilities.
                    </p>

                    <p className="mb-4">
                      As we look to the future, Design Deck is positioned to lead the next generation of design tools, with planned advancements in AI integration, collaboration features, and cross-platform support. These developments will further empower designers to create exceptional experiences efficiently and collaboratively.
                    </p>

                    <p>
                      We invite designers, developers, and creative professionals to join us on this journey, contributing to the evolution of Design Deck and helping shape the future of digital design tools. Together, we can build a more connected, efficient, and inspiring creative ecosystem.
                    </p>
                  </div>
                </div>
              </div>

              {/* Installation Section */}
              <div id="installation" className={`${styles.card} rounded-lg shadow-sm border p-6 md:p-8`}>
                <h2 className={`text-3xl font-bold ${styles.text} mb-6`}>Installation</h2>

                <p className={`${styles.list} mb-6`}>
                  Follow these steps to set up Design Deck for local development or production deployment:
                </p>

                <div className="space-y-8">
                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Prerequisites</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">Ensure you have the following installed:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Node.js (v16.0.0 or higher)</li>
                          <li>npm (v8.0.0 or higher) or Yarn (v1.22.0 or higher)</li>
                          <li>MongoDB (v5.0 or higher)</li>
                          <li>Redis (optional, for enhanced caching)</li>
                          <li>Git</li>
                          <li>A modern web browser (Chrome, Firefox, Safari, or Edge)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Local Development Setup</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">Clone and set up the development environment:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Clone the repository: <code>git clone https://github.com/designdeck/designdeck.git</code></li>
                          <li>Navigate to the project directory: <code>cd designdeck</code></li>
                          <li>Install dependencies: <code>npm install</code> or <code>yarn</code></li>
                          <li>Create a <code>.env</code> file based on <code>.env.example</code></li>
                          <li>Start the development server: <code>npm run dev</code> or <code>yarn dev</code></li>
                          <li>Access the application at <code>http://localhost:3000</code></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Environment Configuration</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">Configure these essential environment variables:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li><code>MONGODB_URI</code>: Connection string for your MongoDB instance</li>
                          <li><code>JWT_SECRET</code>: Secret key for JWT authentication</li>
                          <li><code>STORAGE_PROVIDER</code>: Asset storage configuration (S3, local, etc.)</li>
                          <li><code>API_RATE_LIMIT</code>: Request rate limiting configuration</li>
                          <li><code>SMTP_CREDENTIALS</code>: Email service configuration</li>
                          <li><code>OAUTH_PROVIDERS</code>: Social authentication credentials</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Production Deployment</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">Prepare and deploy to production:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Build the application: <code>npm run build</code> or <code>yarn build</code></li>
                          <li>Set production environment variables on your hosting platform</li>
                          <li>Deploy the built files to your hosting service</li>
                          <li>Configure your server with appropriate security headers</li>
                          <li>Set up SSL certificates for secure connections</li>
                          <li>Configure monitoring and logging services</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Docker Deployment</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">For containerized deployment with Docker:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Build the Docker image: <code>docker build -t designdeck .</code></li>
                          <li>Run with environment variables: <code>docker run -p 3000:3000 --env-file .env designdeck</code></li>
                          <li>For Docker Compose: <code>docker-compose up -d</code></li>
                          <li>Configure container orchestration (Kubernetes, etc.) as needed</li>
                          <li>Set up appropriate volumes for persistent data</li>
                          <li>Configure container networking and security</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Troubleshooting</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">Common issues and solutions:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Database connection errors: Check MongoDB connection string and network access</li>
                          <li>Missing dependencies: Run <code>npm install</code> or <code>yarn</code> again</li>
                          <li>Port conflicts: Change the port in <code>.env</code> file</li>
                          <li>Build failures: Check console errors and ensure Node version compatibility</li>
                          <li>Authentication issues: Verify JWT secret and OAuth configurations</li>
                          <li>Performance issues: Check for memory leaks and optimize database queries</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Documentation Section */}
              <div id="api-docs" className={`${styles.card} rounded-lg shadow-sm border p-6 md:p-8`}>
                <h2 className={`text-3xl font-bold ${styles.text} mb-6`}>API Documentation</h2>

                <p className={`${styles.list} mb-6`}>
                  Design Deck provides a comprehensive RESTful API for integrating with your applications and extending platform functionality:
                </p>

                <div className="space-y-8">
                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Authentication</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">Secure your API requests with these endpoints:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li><code>POST /api/auth/login</code> - Authenticate user credentials</li>
                          <li><code>POST /api/auth/register</code> - Create a new user account</li>
                          <li><code>POST /api/auth/refresh</code> - Refresh authentication token</li>
                          <li><code>POST /api/auth/logout</code> - Invalidate current token</li>
                          <li><code>GET /api/auth/me</code> - Retrieve current user information</li>
                          <li><code>POST /api/auth/password-reset</code> - Reset user password</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Projects</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">Manage design projects with these endpoints:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li><code>GET /api/projects</code> - List all projects with pagination</li>
                          <li><code>POST /api/projects</code> - Create a new project</li>
                          <li><code>GET /api/projects/:id</code> - Retrieve project details</li>
                          <li><code>PUT /api/projects/:id</code> - Update project information</li>
                          <li><code>DELETE /api/projects/:id</code> - Remove a project</li>
                          <li><code>GET /api/projects/:id/history</code> - View project version history</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Assets</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">Handle design assets with these endpoints:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li><code>GET /api/assets</code> - List all available assets</li>
                          <li><code>POST /api/assets</code> - Upload new asset</li>
                          <li><code>GET /api/assets/:id</code> - Download asset file</li>
                          <li><code>PUT /api/assets/:id</code> - Update asset metadata</li>
                          <li><code>DELETE /api/assets/:id</code> - Remove an asset</li>
                          <li><code>GET /api/assets/search</code> - Search assets by type or tags</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Collaboration</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">Enable team collaboration with these endpoints:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li><code>GET /api/teams</code> - List all teams</li>
                          <li><code>POST /api/teams</code> - Create a new team</li>
                          <li><code>PUT /api/teams/:id/members</code> - Manage team members</li>
                          <li><code>POST /api/projects/:id/share</code> - Share a project</li>
                          <li><code>POST /api/projects/:id/comments</code> - Add project comments</li>
                          <li><code>GET /api/notifications</code> - Retrieve user notifications</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>Templates</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">Work with design templates through these endpoints:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li><code>GET /api/templates</code> - Browse available templates</li>
                          <li><code>POST /api/templates</code> - Create a custom template</li>
                          <li><code>GET /api/templates/:id</code> - Get template details</li>
                          <li><code>POST /api/templates/:id/use</code> - Create project from template</li>
                          <li><code>PUT /api/templates/:id</code> - Update a template</li>
                          <li><code>GET /api/templates/featured</code> - Get featured templates</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xl font-semibold ${styles.text} mb-3`}>API Integration</h3>
                    <div className={`${styles.card} shadow-sm rounded-lg border p-4`}>
                      <div className={`${styles.list}`}>
                        <p className="mb-3">Integrate with the platform using these resources:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li><code>GET /api/status</code> - Check API service health</li>
                          <li><code>GET /api/webhooks</code> - Manage notification webhooks</li>
                          <li><code>POST /api/keys</code> - Generate API access keys</li>
                          <li><code>GET /api/rate-limits</code> - View current rate limit status</li>
                          <li><code>GET /api/docs</code> - Access interactive API documentation</li>
                          <li><code>GET /api/changelog</code> - View API version history</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <p className={`${styles.text}`}>
                    For complete API documentation including request parameters, response schemas, and example code in multiple programming languages,
                    please visit our <a href="#" className="text-blue-600 hover:underline">Interactive API Documentation</a> or download our
                    <a href="#" className="text-blue-600 hover:underline"> API Reference Guide</a>.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}