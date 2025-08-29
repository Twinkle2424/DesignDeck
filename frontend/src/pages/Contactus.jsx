import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import api from "../services/api";
import { ThemeContext } from "../context/ThemeContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/toastStyles.css";

const Contactus = () => {
    const { theme } = useContext(ThemeContext);

    // Custom toast styles
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


    const progressStyle = { background: "#0099FF" }; // Light Blue Progress Bar

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.body.classList.add("overflow-hidden");
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post("/api/contact/send-email", formData);

            toast("Message sent successfully!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: getCustomToastStyle(theme),
                progressStyle, // Light Blue Progress Bar
                className: theme === "dark" ? "dark-theme" : "light-theme",
            });

            setFormData({ name: "", email: "", message: "" });

        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Failed to send message!";

            toast(errorMessage, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: getCustomToastStyle(theme),
                progressStyle, // Light Blue Progress Bar
                className: theme === "dark" ? "dark-theme" : "light-theme",
            });
        } finally {
            setLoading(false);
        }
    };


    const logoSrc = theme === 'dark' ? '/public/Frame 3.png' : '/public/Frame 2.png';

    return (
        <>
            <Helmet>
                <title>DesignDeck - Contact Us</title>
            </Helmet>
            <ToastContainer toastClassName={() => "custom-toast"}
                progressClassName="custom-toast-progress" />
            <div
                className={`relative flex flex-col lg:flex-row items-center justify-center min-h-screen ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"
                    }`}
            >
                {/* Fixed Logo on Top-Left */}
                <Link to="/logout" className="absolute top-6 left-6 z-50">
                    <img
                        src={logoSrc}
                        alt="DesignDeck Logo"
                        width={180}
                        className="rounded-full"
                    />
                </Link>

                {/* Centered Form */}
                <div className="w-full lg:w-1/2 flex justify-center items-center pt-5">
                    <div className="w-full max-w-xl px-4 md:px-10 py-8">
                        <h2 className="text-3xl font-semibold mb-3 text-start">Get in Touch</h2>
                        <p
                            className={`text-sm mb-6 text-start ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                                }`}
                        >
                            We will get back to you as soon as possible
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full border rounded-full px-4 py-3 focus:outline-none focus:ring-2 border-2 ${theme === "dark"
                                        ? "bg-black border-gray-800 text-white focus:ring-[#0099FF]"
                                        : "bg-white border-gray-100 text-black focus:ring-[#376CFF]"
                                    }`}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Your E-Mail ID"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full border rounded-full px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-300 border-2 ${theme === "dark"
                                        ? "bg-black border-gray-800 text-white focus:ring-[#0099FF]"
                                        : "bg-white border-gray-100 text-black focus:ring-[#376CFF]"
                                    }`}
                            />
                            <textarea
                                name="message"
                                placeholder="Message"
                                rows="5"
                                required
                                value={formData.message}
                                onChange={handleChange}
                                className={`w-full border rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-300 border-2 ${theme === "dark"
                                        ? "bg-black border-gray-800 text-white focus:ring-[#0099FF]"
                                        : "bg-white border-gray-100 text-black focus:ring-[#376CFF]"
                                    }`}
                            ></textarea>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#376CFF] text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition ease-in-out duration-300 flex items-center justify-center"
                            >
                                {loading ? (
                                    "Sending..."
                                ) : (
                                    <>
                                        <i className="ri-send-plane-line mr-2"></i> Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right-side Image (hidden on small screens) */}
                <div className="hidden lg:flex w-1/2 h-screen items-center justify-end p-10">
                    <img
                        src="/Contactus.png"
                        alt="Contact Us"
                        className="w-[85%] h-full object-cover rounded-lg"
                    />
                </div>
            </div>

        </>
    );
};

export default Contactus;
