import { Link } from "react-router-dom";
import 'remixicon/fonts/remixicon.css'
import { Helmet } from "react-helmet";
import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Sun, Moon, Menu, X } from "lucide-react";
import { CardContainer } from "../UI/3d-card";

const Landingpage = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);
    const [termsOfServiceOpen, setTermsOfServiceOpen] = useState(false);

    const logoSrc = theme === 'dark' ? '/public/Frame 3.png' : '/public/Frame 2.png';

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <>
            <Helmet>
                <title>DesignDeck - Landing Page</title>
            </Helmet>
            <div>
                <div>
                    <nav
                        className={`fixed top-0 left-0 w-full backdrop-blur-2xl z-50 px-4 sm:px-6 md:px-10 py-3 flex justify-between items-center transition-all duration-300 ${theme === "dark" ? "bg-[#000000c3] text-white" : "bg-[#ffffffc3] text-black"}`}
                    >
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <img
                                src={logoSrc}
                                alt="DesignDeck Logo"
                                width={180}
                                className="rounded-full"
                            />
                        </div>
                        {/* Mobile Menu Button */}
                        <button
                            className="block md:hidden"
                            onClick={toggleMobileMenu}
                        >
                            {mobileMenuOpen ?
                                <X size={24} /> :
                                <Menu size={24} />
                            }
                        </button>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-4 lg:space-x-10 text-base lg:text-lg">
                            <a
                                href="#home"
                                className={`cursor-pointer relative after:block after:h-[2px] after:w-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full ${theme === "dark" ? "text-gray-300 after:bg-gray-300" : "text-gray-700 after:bg-gray-700"}`}
                            >
                                Home
                            </a>
                            <a
                                href="#features"
                                className={`cursor-pointer relative after:block after:h-[2px] after:w-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full ${theme === "dark" ? "text-gray-300 after:bg-gray-300" : "text-gray-700 after:bg-gray-700"}`}
                            >
                                Features
                            </a>
                            <a
                                href="#aboutus"
                                className={`cursor-pointer relative after:block after:h-[2px] after:w-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full ${theme === "dark" ? "text-gray-300 after:bg-gray-300" : "text-gray-700 after:bg-gray-700"}`}
                            >
                                About us
                            </a>
                            <a
                                href="#explore"
                                className={`cursor-pointer relative after:block after:h-[2px] after:w-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full ${theme === "dark" ? "text-gray-300 after:bg-gray-300" : "text-gray-700 after:bg-gray-700"}`}
                            >
                                Explore
                            </a>
                        </div>

                        {/* Desktop Login Button */}
                        <div className="hidden md:block">
                            <Link to="/signin">
                                <button
                                    className={`px-4 lg:px-6 py-2 rounded-full border-5 shadow-md border backdrop-blur-md cursor-pointer transition-all duration-300 ${theme === "dark" ? "bg-purple-600 text-white border-white/50" : "bg-purple-400 text-white border-white/50"}`}
                                >
                                    Log in
                                </button>
                            </Link>
                        </div>
                    </nav>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className={`fixed top-14 left-0 w-full z-40 py-4 px-4 flex flex-col space-y-4 md:hidden transition-all duration-300 ${theme === "dark" ? "bg-[#000000ee] text-white" : "bg-[#ffffffee] text-black"}`}>
                            <a
                                href="#home"
                                className={`cursor-pointer px-4 py-2 rounded-md ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
                                onClick={toggleMobileMenu}
                            >
                                Home
                            </a>
                            <a
                                href="#features"
                                className={`cursor-pointer px-4 py-2 rounded-md ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
                                onClick={toggleMobileMenu}
                            >
                                Features
                            </a>
                            <a
                                href="#aboutus"
                                className={`cursor-pointer px-4 py-2 rounded-md ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
                                onClick={toggleMobileMenu}
                            >
                                About us
                            </a>
                            <a
                                href="#explore"
                                className={`cursor-pointer px-4 py-2 rounded-md ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
                                onClick={toggleMobileMenu}
                            >
                                Explore
                            </a>
                            <Link to="/signin" onClick={toggleMobileMenu}>
                                <button
                                    className={`w-full px-4 py-2 rounded-full border-5 shadow-md border backdrop-blur-md cursor-pointer transition-all duration-300 ${theme === "dark" ? "bg-purple-600 text-white border-white/50" : "bg-purple-400 text-white border-white/50"}`}
                                >
                                    Login
                                </button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Home Section */}
                <div
                    id="home"
                    className={`py-24 sm:py-32 md:py-40 px-4 sm:px-6 md:px-16 flex flex-col items-center text-center transition-all duration-300 ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}
                >
                    <div className="flex flex-col items-center">
                        <h1
                            className={`text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight max-w-3xl drop-shadow-lg transition-all duration-300 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                        >
                            Your Designs, Your Code, Your Platform The Ultimate Creative Hub
                            <span className="mr-2"></span>
                            <span className="relative inline-block group">
                                <span
                                    className="text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-[length:200%_200%] animate-[gradientBG_3s_ease-in-out_infinite] bg-clip-text text-transparent cursor-pointer"
                                    style={{
                                        backgroundSize: "200% 200%",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    DesignDeck
                                </span>
                            </span>
                        </h1>

                        <p
                            className={`mt-4 max-w-xl px-4 transition-all duration-300 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                        >
                            Your creativity deserves the perfect stage welcome to DesignDeck.
                        </p>
                    </div>


                    {/* Buttons Container */}
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                        {/* Dark Mode Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className={`mt-2 transition-all duration-300 sm:mt-6 px-4 sm:px-5 py-2 sm:py-3 text-base sm:text-lg font-semibold rounded-full border-5 shadow-md 
                                ${theme === "dark" ? "bg-white border-gray-300 text-black border-opacity-40 " : "bg-black border-[#A0A0A0] border-opacity-40 text-white"} 
                                backdrop-blur-md cursor-pointer flex flex-row items-center`}
                        >
                            {theme === "dark" ? (
                                <>
                                    <Moon className="text-black mr-2" size={18} />
                                    Light Mode
                                </>
                            ) : (
                                <>
                                    <Sun className="text-white mr-2" size={18} />
                                    Dark Mode
                                </>
                            )}
                        </button>

                        <Link to="/signup">
                            <button className="mt-2 sm:mt-6 px-5 sm:px-7 py-2 sm:py-3 text-base sm:text-lg font-semibold bg-[#376CFF] text-white rounded-full border-5 shadow-md border border-white/50 backdrop-blur-md cursor-pointer">
                                Get Started
                            </button>
                        </Link>
                    </div>

                    {/* Image Section */}
                    <div className="mt-8 sm:mt-12 flex flex-col md:flex-row gap-4 sm:gap-6 max-w-5xl">
                        <div className="w-full md:w-1/2">
                            <img
                                src="./public/image.jpg"
                                alt="Creative Design Showcase"
                                className={`w-full rounded-lg shadow-lg transition-all duration-300 ${theme === "dark" ? "brightness-90" : "brightness-100"}`}
                            />
                        </div>
                        <div className="w-full md:w-1/2 mt-4 md:mt-0">
                            <img
                                src="./public/image-1.jpg"
                                alt="Growth Stats"
                                className={`w-full rounded-lg shadow-lg transition-all duration-300 ${theme === "dark" ? "brightness-90" : "brightness-100"}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div
                    id="features"
                    className={`py-12 sm:py-16 md:py-20 lg:py-24 text-center transition-all duration-300 ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"
                        }`}
                >
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2
                            className={`text-2xl sm:text-3xl sm:mb-4 md:text-4xl font-bold transition-all duration-300 ${theme === "dark" ? "text-white" : "text-gray-900"
                                }`}
                        >
                            Explore the Power of{" "}
                            <span className={`${theme === "dark" ? "text-gray-300" : "text-black"}`}>
                                DesignDeck
                            </span>
                        </h2>
                        <p
                            className={`mt-2 sm:mt-3 md:mt-4 px-4 transition-all duration-300 ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                                }`}
                        >
                            DesignDeck is a powerful platform to showcase your designs, upload code,
                            share visuals, and connect with a vibrant creative community.
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Card 1 */}
                        <CardContainer>
                            <div
                                className={`rounded-xl flex flex-col gap-3 p-6 sm:p-6 lg:p-5 transition-all border-3 border-[#FDE8CB] ${theme === "dark"
                                    ? "bg-black hover:border-[#000] shadow-[0_0_15px_4px_rgba(255,255,255,0.20)]"
                                    : "bg-white hover:border-[#fff] hover:shadow-lg"
                                    }`}
                            >
                                <div className="flex items-center justify-center rounded-[10px] w-12 h-12 sm:w-14 sm:h-14 bg-[#FDE8CB] self-start">
                                    <i className="ri-gallery-line text-[24px] sm:text-[30px] text-[#ED9E29]"></i>
                                </div>
                                <h3
                                    className={`font-semibold text-left text-lg sm:text-xl mt-3 sm:mt-4 transition-all ${theme === "dark" ? "text-white" : "text-black"
                                        }`}
                                >
                                    Image & Video Upload
                                </h3>
                                <p
                                    className={`text-sm sm:text-base mt-2 sm:mt-3 text-justify transition-all ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                                        }`}
                                >
                                    DesignDeck empowers creators with Image & Video Upload for seamless
                                    media sharing, portfolio building, and high-quality project
                                    showcasing.
                                </p>
                            </div>
                        </CardContainer>

                        {/* Card 2 */}
                        <CardContainer>
                            <div
                                className={`rounded-xl flex flex-col gap-3 p-5 sm:p-6 lg:p-5 transition-all border-3 border-[#DCE6FF] ${theme === "dark"
                                    ? "bg-black hover:border-[#000] shadow-[0_0_15px_4px_rgba(255,255,255,0.20)]"
                                    : "bg-white hover:border-[#fff] hover:shadow-lg"
                                    }`}
                            >
                                <div className="flex items-center justify-center rounded-[10px] w-12 h-12 sm:w-14 sm:h-14 bg-[#DCE6FF] self-start">
                                    <i className="ri-user-follow-line text-[24px] sm:text-[30px] text-[#9091FF]"></i>
                                </div>
                                <h3
                                    className={`font-semibold text-left text-lg sm:text-xl mt-3 sm:mt-4 transition-all ${theme === "dark" ? "text-white" : "text-black"
                                        }`}
                                >
                                    Follow Users
                                </h3>
                                <p
                                    className={`text-sm sm:text-base mt-2 sm:mt-3 text-justify transition-all ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                                        }`}
                                >
                                    Stay connected by following your favorite creators on DesignDeck. Get
                                    notified when they upload new projects, update their profiles, or gain
                                    popularity.
                                </p>
                            </div>

                        </CardContainer>

                        {/* Card 3 */}
                        <CardContainer>
                            <div
                                className={`rounded-xl flex flex-col gap-3 p-5 sm:p-6 lg:p-5 transition-all border-3 border-[#F4D9FF] ${theme === "dark"
                                    ? "bg-black hover:border-[#000] shadow-[0_0_15px_4px_rgba(255,255,255,0.20)]"
                                    : "bg-white hover:border-[#fff] hover:shadow-lg"
                                    }`}
                            >
                                <div className="flex items-center justify-center rounded-[10px] w-12 h-12 sm:w-14 sm:h-14 bg-[#F4D9FF] self-start">
                                    <i className="ri-bard-line text-[24px] sm:text-[30px] text-[#D87EF5]"></i>
                                </div>
                                <h3
                                    className={`font-semibold text-left text-lg sm:text-xl mt-3 sm:mt-4 transition-all ${theme === "dark" ? "text-white" : "text-gray-900"
                                        }`}
                                >
                                    Future of DesignDeck
                                </h3>
                                <p
                                    className={`text-sm sm:text-base mt-2 sm:mt-3 text-justify transition-all ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                                        }`}
                                >
                                    Future of DesignDeck to revolutionize creative possibilities,
                                    streamline workflows, boost collaboration, and unlock limitless
                                    innovation for designers and developers.
                                </p>
                            </div>
                        </CardContainer>
                    </div>
                </div>


                {/* About Us Section */}
                <div
                    id="aboutus"
                    className={`py-12 sm:py-16 transition-all duration-300 ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}
                >
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 xl:px-6 flex flex-wrap items-center">
                        {/* Video Section */}
                        <div className="w-full md:w-1/2">
                            <video
                                muted
                                autoPlay
                                loop
                                src="/public/graph.mp4"
                                className="rounded-lg w-full shadow-lg"
                                playsInline
                            ></video>
                        </div>

                        {/* Text Section */}
                        <div className="w-full md:w-1/2 mt-6 md:mt-0 md:pl-4 lg:pl-10">
                            <h2
                                className={`text-2xl sm:text-3xl md:text-4xl font-bold transition-all ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                            >
                                Next-Generation Design & Code Showcase
                            </h2>
                            <p
                                className={`mt-3 sm:mt-4 text-base sm:text-lg transition-all ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                            >
                                DesignDeck is a cutting-edge design and development showcase platform where
                                creators, developers, and designers can upload, preview, and share their work
                                seamlessly. With real-time code previews, media uploads, and an interactive
                                community, it brings innovation to the forefront.
                            </p>

                            {/* Stats Cards */}
                            <div className="mt-4 sm:mt-6 flex flex-wrap gap-3 sm:gap-4">
                                {/* Card 1 */}
                                <div
                                    className="border-4 rounded-xl px-4 sm:px-8 py-3 sm:py-4 text-center hover:cursor-pointer transition-all border-[#FDE8CB] hover:bg-[#FDE8CB]"
                                >
                                    <span
                                        className="text-lg sm:text-xl font-semibold transition-all text-[#ED9E29]"
                                    >
                                        7000+
                                    </span>
                                    <p
                                        className="text-xs sm:text-sm opacity-70 transition-all text-[#ED9E29]"
                                    >
                                        Designs
                                    </p>
                                </div>

                                {/* Card 2 */}
                                <div
                                    className="border-4 rounded-xl px-4 sm:px-8 py-3 sm:py-4 text-center hover:cursor-pointer transition-all border-[#DCE6FF] hover:bg-[#DCE6FF]"
                                >
                                    <span
                                        className="text-lg sm:text-xl font-semibold transition-all text-[#9091FF]"
                                    >
                                        10,000+
                                    </span>
                                    <p
                                        className="text-xs sm:text-sm opacity-70 transition-all text-[#9091FF]"
                                    >
                                        Creators
                                    </p>
                                </div>

                                {/* Card 3 */}
                                <div
                                    className="border-4 rounded-xl px-3 sm:px-6 py-3 sm:py-4 text-center hover:cursor-pointer transition-all border-[#F4D9FF] hover:bg-[#F4D9FF]"
                                >
                                    <span
                                        className="text-lg sm:text-xl font-semibold transition-all text-[#D87EF5]"
                                    >
                                        50+
                                    </span>
                                    <p
                                        className="text-xs sm:text-sm opacity-70 transition-all text-[#D87EF5]"
                                    >
                                        Design Styles
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <footer id="explore"
                    className={`px-6 sm:px-10 pt-10 pb-5 text-sm transition-all ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"
                        }`}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-gray-600 pb-8">
                        {/* Brand Info */}

                        <div className="flex flex-col items-start space-y-4 text-left col-span-2">
                            <div className="flex items-center">
                                <img
                                    src={logoSrc}
                                    width={180}
                                    alt="DesignDeck Logo"
                                    className="rounded-full "
                                />
                            </div>
                            <p className="text-sm text-gray-400 max-w-md">
                                <span className={`font-medium ${theme === "dark" ? "text-white" : "text-black"}`}> DesignDeck </span> is a platform that empowers creators to showcase their
                                designs, upload code, and share their work with a vibrant community.
                            </p>
                        </div>


                        {/* Quick Links */}
                        <div>
                            <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#home">Home</a></li>
                                <li><a href="#features">Features</a></li>
                                <li><Link to="/signup">Get Started</Link></li>
                                <li><Link to="/document">Docs</Link></li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h2 className="text-lg font-semibold mb-3">Connect With Us</h2>
                            <div className="flex space-x-3 mb-3">
                                <a href="https://github.com/Harsh266/DesignDeck" target="_blank" rel="noopener noreferrer">
                                    <i className="ri-github-line text-xl"></i>
                                </a>
                                <Link to="/contactus">
                                    <i className="ri-contacts-line text-xl"></i>
                                </Link>
                            </div>
                            <div className="text-gray-400 space-y-1">
                                <p><i className="ri-mail-line mr-2"></i> design.deck@email.com</p>
                                <p><i className="ri-phone-line mr-2"></i> +91 XXXXX - XXXXX</p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar - Modified to use buttons instead of Links for popups */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-5 text-gray-400 text-xs sm:text-sm gap-3">
                        <p>&copy; {new Date().getFullYear()} DesignDeck. All rights reserved.</p>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setPrivacyPolicyOpen(true)}
                                className="hover:text-gray-300 cursor-pointer"
                            >
                                Privacy Policy
                            </button>
                            <button
                                onClick={() => setTermsOfServiceOpen(true)}
                                className="hover:text-gray-300 cursor-pointer"
                            >
                                Terms of Service
                            </button>
                        </div>
                    </div>
                </footer>

                {/* Privacy Policy Modal */}
                {privacyPolicyOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
                        <div
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
                            onClick={() => setPrivacyPolicyOpen(false)}
                        ></div>

                        <div
                            className={`relative max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-lg shadow-xl transform transition-all ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
                                }`}
                        >
                            <div className="px-6 py-4 border-b border-gray-300 flex justify-between items-center">
                                <h3 className="text-xl font-bold">Privacy Policy</h3>
                                <button
                                    onClick={() => setPrivacyPolicyOpen(false)}
                                    className="text-2xl focus:outline-none cursor-pointer"
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                <p className="mb-6">
                                    At DesignDeck, your privacy is our priority. We collect minimal personal information solely to provide and improve our services, including features like user profiles, saved projects, and personalized dashboards. Any data you provide—such as your name, email, or content uploads—is securely stored and never shared with third parties without your consent. We implement strong technical safeguards to ensure data protection, but no system is completely invulnerable. You may access, update, or delete your information anytime through your account settings. Continued use of our platform implies your agreement with our practices. We may update this policy occasionally and will notify users of major changes. If you have any concerns, feel free to contact us at design.deck@email.com.
                                </p>

                                <p className="text-sm text-gray-500 mt-6">Last Updated: April 8, 2025</p>
                            </div>
                        </div>
                    </div>
                )}


                {/* Terms of Service Modal */}
                {termsOfServiceOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
                        <div
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
                            onClick={() => setTermsOfServiceOpen(false)}
                        ></div>

                        <div
                            className={`relative max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-lg shadow-xl transform transition-all ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
                                }`}
                        >
                            <div className="px-6 py-4 border-b border-gray-300 flex justify-between items-center">
                                <h3 className="text-xl font-bold">Terms & Conditions</h3>
                                <button
                                    onClick={() => setTermsOfServiceOpen(false)}
                                    className="text-2xl focus:outline-none cursor-pointer"
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                <p className="mb-6">
                                    By accessing or using DesignDeck, you agree to be bound by these Terms & Conditions. You must use the platform responsibly, refrain from uploading harmful or illegal content, and respect other users. DesignDeck grants you a limited, non-exclusive license to use its services for personal, creative purposes. You retain ownership of your projects but allow us to display them on your profile and within the platform for discovery. We may modify features or suspend accounts that violate these terms. We’re not liable for losses or damages arising from user misuse or downtime. These terms may change over time, and continued use implies acceptance of updates.
                                </p>

                                <p className="text-sm text-gray-500 mt-6">Last Updated: April 8, 2025</p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
};

export default Landingpage;