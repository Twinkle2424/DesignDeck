import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { FcGoogle } from "react-icons/fc";
import { IoClose } from "react-icons/io5";
import { Helmet } from "react-helmet";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ThemeContext } from "../context/ThemeContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);

    const getCustomToastStyle = (theme) => ({
        borderRadius: "5px", // Less rounded
        padding: "18px 25px",
        fontSize: "14px",
        fontWeight: "500",
        textAlign: "left", // Align text properly
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // Ensures proper spacing
        gap: "10px", // Adds space between text and close icon
        boxShadow: theme === "dark"
            ? "0px 4px 10px rgba(255, 255, 255, 0.2)"
            : "0px 4px 10px rgba(0, 0, 0, 0.1)",
        background: theme === "dark" ? "#181818" : "#fff",
        color: theme === "dark" ? "#fff" : "#333",
        border: theme === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid #ddd",
        width: "320px", // Fixed width for consistency
    });

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!termsAccepted) {
            toast("You must accept the terms and conditions to proceed", {
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
            const response = await api.post(
                "/auth/register",
                { name, email, password },
                { withCredentials: true }
            );

            toast(response.data.message || "User registered successfully", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: getCustomToastStyle(theme),
                className: theme === "dark" ? "dark-theme" : "light-theme",
            });
            setTimeout(() => navigate("/signin"), 3000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
            toast(errorMessage, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: getCustomToastStyle(theme),
                className: theme === "dark" ? "dark-theme" : "light-theme",
            });
        }
    };

    const handleGoogleLogin = () => {
        window.open(`${api.defaults.baseURL}/auth/google`, "_self");
    };

    const logoSrc = theme === 'dark' ? '/public/Frame 3.png' : '/public/Frame 2.png';
    return (
        <>
            <Helmet>
                <title>DesignDeck - Signup Page</title>
            </Helmet>

            <ToastContainer
                toastClassName={() => "custom-toast"}
            />

            <div className={`flex flex-col lg:flex-row items-center justify-between min-h-screen p-6 h-screen transition-colors
                ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}
            >
                {/* Left Content */}
                <div className="w-full lg:w-1/2 h-full flex flex-col justify-center p-6">
                <div className="flex items-center space-x-2">
                <h1 className="text-xl font-semibold absolute top-7 left-10">
                            <img
                                src={theme === 'dark' ? '/public/Frame 3.png' : '/public/Frame 2.png'}
                                alt="DesignDeck Logo"
                                width={180} // Adjust the width as needed
                                className="inline-block mr-2"
                            />
                        </h1>
                    </div>
                    <form onSubmit={handleRegister} className="px-6 md:px-16 py-2 flex flex-col justify-center w-full pt-10">
                        <h2 className="text-2xl font-semibold">Create an Account</h2>
                        <p className={`mt-1 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                            Let's Create an Account & Showcase Your Creativity
                        </p>

                        <input
                            type="text"
                            placeholder="Your Name"
                            className={`w-full border rounded-md px-4 py-3 mt-5 focus:outline-none focus:ring-2
                                ${theme === "dark" ? "border-gray-600 bg-black text-white focus:ring-blue-400" : "border-gray-300 bg-white text-black focus:ring-blue-500"}`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <input
                            type="email"
                            placeholder="xyz@abc.com"
                            className={`w-full border rounded-md px-4 py-3 mt-3 focus:outline-none focus:ring-2
                                ${theme === "dark" ? "border-gray-600 bg-black text-white focus:ring-blue-400" : "border-gray-300 bg-white text-black focus:ring-blue-500"}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <div className="mt-3 relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className={`w-full border rounded-md p-3 pr-10 focus:outline-none focus:ring-2
                                    ${theme === "dark" ? "border-gray-600 bg-black text-white focus:ring-blue-400" : "border-gray-300 bg-white text-black focus:ring-blue-500"}`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute top-1/2 right-3 transform -translate-y-1/2"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FiEyeOff size={18} className="text-gray-400" /> : <FiEye size={18} className="text-gray-500" />}
                            </button>
                        </div>

                        <div className="mt-3 flex items-center">
                            <input
                                type="checkbox"
                                id="terms"
                                className={`mr-2 accent-blue-500 ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"}`}
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                            />
                            <label htmlFor="terms" className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                I agree to the{" "}
                                <span className="cursor-pointer hover:underline" onClick={() => setIsModalOpen(true)}>
                                    Terms & Conditions
                                </span>
                            </label>
                        </div>

                        <button type="submit" className={`w-full p-3 mt-4 rounded-md transition hover:cursor-pointer
                            ${theme === "dark" ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-[#376CFF] hover:bg-blue-700 text-white"}`}>
                            Sign Up
                        </button>

                        <div className="flex items-center my-2">
                            <hr className="w-full border-gray-300" />
                            <span className="mx-2 text-gray-500">or</span>
                            <hr className="w-full border-gray-300" />
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className={`flex items-center justify-center gap-2 px-5 py-2.5 
                                border rounded-md cursor-pointer transition-all 
                                ${theme === "dark" ? "bg-black text-white border-gray-600 hover:bg-gray-800"
                                    : "bg-white text-black border-gray-300 hover:bg-gray-100"}`}
                        >
                            <FcGoogle className="text-xl" />
                            Sign in with Google
                        </button>

                        <p className={`text-sm mt-4 text-center ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            Already have an account?
                            <Link
                                to="/signin"
                                className={`cursor-pointer hover:underline ml-1
                                ${theme === "dark" ? "text-gray-300" : "text-[#376CFF]"}`}
                            >
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>

                {/* Right Image (Visible only on lg screens) */}
                <div className="hidden lg:flex w-1/2 h-screen items-center justify-end p-8">
                    <img src="/Signup.png" alt="Sign in" className="w-[85%] h-full rounded-lg" />
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className={`p-6 rounded-lg w-[90%] md:w-[70%] lg:w-[40%] max-h-[90vh] overflow-y-auto relative
            ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}
                        >
                            <IoClose
                                className="absolute top-4 right-4 text-2xl text-gray-600 cursor-pointer"
                                onClick={() => setIsModalOpen(false)}
                            />
                            <h2 className="text-xl font-bold mb-4">Terms & Conditions</h2>
                            <p className="text-sm text-justify">
                                DesignDeck allows users to showcase their creative work while ensuring a respectful and professional environment.
                                By using our platform, you agree to follow ethical guidelines, avoid posting offensive or copyrighted content,
                                and respect others' intellectual property. Your uploaded content remains yours, but you grant DesignDeck the right
                                to display it publicly. We prioritize user privacy and data security, ensuring that your information is handled responsibly.
                                Any misuse of the platform, including fraud or harassment, may result in account suspension. Continued use of DesignDeck
                                means you accept these terms, which may be updated periodically.
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
};

export default Signup;