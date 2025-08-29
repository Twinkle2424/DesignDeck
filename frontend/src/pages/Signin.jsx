import { useState, useContext, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ThemeContext } from "../context/ThemeContext";
import api from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            const adminEmails = ["harshvekriya441@gmail.com", "ptwinkle837@gmail.com"];

            if (adminEmails.includes(user.email)) {
                navigate("/admin-dashboard");
            } else {
                navigate("/signin");
            }
        }

    }, [navigate]);

    const getCustomToastStyle = (theme) => ({
        borderRadius: "5px",
        padding: "18px 25px",
        fontSize: "14px",
        fontWeight: "500",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
        boxShadow: theme === "dark"
            ? "0px 4px 10px rgba(255, 255, 255, 0.2)"
            : "0px 4px 10px rgba(0, 0, 0, 0.1)",
        background: theme === "dark" ? "#181818" : "#fff",
        color: theme === "dark" ? "#fff" : "#333",
        border: theme === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid #ddd",
        width: "320px",
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(
                "/auth/login",
                { email, password },
                { withCredentials: true }
            );

            localStorage.setItem("user", JSON.stringify(res.data.user));

            toast("Login successful!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: getCustomToastStyle(theme),
                className: theme === "dark" ? "dark-theme" : "light-theme",
            });

            setTimeout(() => {

                const adminEmails = ["harshvekariya441@gmail.com", "ptwinkle837@gmail.com"];

                if (adminEmails.includes(res.data.user.email)) {
                    navigate("/admin-notifications");
                } else {
                    navigate("/dashboard");
                }


            }, 3000);
        } catch (error) {
            toast("Incorrect email or password!", {
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
                <title>DesignDeck - Sign In</title>
            </Helmet>
            <ToastContainer toastClassName={() => "custom-toast"} />
            <div className={`flex flex-col lg:flex-row items-center justify-center min-h-screen p-6 h-screen overflow-hidden ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
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
                    <form onSubmit={handleLogin} className="px-6 md:px-16 py-2 flex flex-col justify-center w-full pt-10">
                        <h2 className="text-2xl font-semibold">Welcome Back</h2>
                        <p className={`mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Sign in to Showcase, Inspire, and Elevate Your Creativity!</p>
                        <div className="mt-5">
                            <input type="email" placeholder="xyz@abc.com" className={`w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 ${theme === "dark" ? "bg-black text-white border-gray-600 focus:ring-blue-400" : "bg-white text-black border-gray-300 focus:ring-blue-500"}`} value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mt-3 relative">
                            <input type={showPassword ? "text" : "password"} placeholder="Enter your password" className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 pr-10 ${theme === "dark" ? "bg-black text-white border-gray-600 focus:ring-blue-400" : "bg-white text-black border-gray-300 focus:ring-blue-500"}`} value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <button type="button" className="absolute top-1/2 right-3 transform -translate-y-1/2 focus:outline-none" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FiEyeOff size={18} className="text-gray-400" /> : <FiEye size={18} className="text-gray-500" />}
                            </button>
                        </div>
                        <div className="flex justify-end">
                            <Link to="/resetpassword" className={`text-sm mt-4 cursor-pointer underline ${theme === "dark" ? "text-gray-300" : "text-black"}`}>Forgot Password?</Link>
                        </div>
                        <button type="submit" className={`w-full p-3 mt-4 rounded-md cursor-pointer ${theme === "dark" ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-[#376CFF] text-white hover:bg-blue-700"}`}>Sign In</button>
                        <div className="flex items-center my-3">
                            <hr className={`w-full ${theme === "dark" ? "border-gray-700" : "border-gray-300"}`} />
                            <span className={`mx-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>or</span>
                            <hr className={`w-full ${theme === "dark" ? "border-gray-700" : "border-gray-300"}`} />
                        </div>
                        <button onClick={handleGoogleLogin} className={`flex items-center justify-center gap-2 px-5 py-2.5 border rounded-md cursor-pointer transition-all ${theme === "dark" ? "bg-black text-white border-gray-600 hover:bg-gray-800" : "bg-white text-black border-gray-300 hover:bg-gray-100"}`}>
                            <FcGoogle className="text-xl" /> Sign in with Google
                        </button>
                        <p className={`text-sm mt-4 text-center ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Are you new? <Link to="/signup" className={`cursor-pointer hover:underline ml-1 ${theme === "dark" ? "text-gray-300" : "text-[#376CFF]"}`}>Create An Account</Link></p>
                    </form>
                </div>
                <div className="hidden lg:flex w-1/2 h-screen items-center justify-end p-8">
                    <img src="/Signin.png" alt="Sign in" className="w-[85%] h-full rounded-lg" />
                </div>
            </div>
        </>
    );
};

export default SignIn;
