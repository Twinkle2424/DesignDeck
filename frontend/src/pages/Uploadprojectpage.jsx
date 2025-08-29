import { useState, useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Helmet } from "react-helmet";
import { ThemeContext } from "../context/ThemeContext";
import { ToastContainer, toast } from "react-toastify";
import api from "../services/api";
import "react-toastify/dist/ReactToastify.css";

const UploadProjectPage = () => {
    const { theme } = useContext(ThemeContext);

    const [popupType, setPopupType] = useState(null);
    const [imageFiles, setImageFiles] = useState([]);
    const [videoFiles, setVideoFiles] = useState([]);
    const [codeFiles, setCodeFiles] = useState([]);
    const [tempFiles, setTempFiles] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState([]);
    const [globalTitle, setGlobalTitle] = useState("");
    const [globalDescription, setGlobalDescription] = useState("");
    const [globalCategory, setGlobalCategory] = useState([]);

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


    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const formattedFiles = files.map(file => ({
            name: file.name,
            url: URL.createObjectURL(file),
            file: file
        }));
        setTempFiles(prev => [...prev, ...formattedFiles]);
    };

    const handleUploadFiles = () => {
        if (tempFiles.length === 0) {
            toast("Please select files before uploading.", {
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

        if (!title || !description) {
            toast("Please enter a title and description.", {
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

        if (!globalTitle && !globalDescription) {
            setGlobalTitle(title);
            setGlobalDescription(description);
            setGlobalCategory(category);
        } else if (globalTitle !== title || globalDescription !== description) {
            toast("Title, Description and Category must be the same for all uploads.", {
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

        if (popupType === "image") {
            setImageFiles(prev => [...prev, ...tempFiles]);
        } else if (popupType === "video") {
            setVideoFiles(prev => [...prev, ...tempFiles]);
        } else if (popupType === "code") {
            setCodeFiles(prev => [...prev, ...tempFiles]);
        }

        toast("Files uploaded successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            style: getCustomToastStyle(theme),
            className: theme === "dark" ? "dark-theme" : "light-theme",
        });

        setTempFiles([]);
        setTitle("");
        setDescription("");
        setCategory("");
        setPopupType(null);
    };

    const handleDeleteTempFile = (index) => {
        setTempFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleDeleteFile = (type, index) => {
        if (type === "image") {
            setImageFiles(prev => prev.filter((_, i) => i !== index));
        } else if (type === "video") {
            setVideoFiles(prev => prev.filter((_, i) => i !== index));
        } else if (type === "code") {
            setCodeFiles(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("title", globalTitle);
        formData.append("description", globalDescription);
        formData.append("category", globalCategory);

        // ✅ Extract File from object
        if (imageFiles.length > 0) {
            imageFiles.forEach((file, index) => {
                if (file.file instanceof File) {
                    formData.append("projectImage", file.file, file.file.name);
                } else {
                    console.error(`❌ Skipping invalid image file at index ${index}:`, file);
                }
            });
        }

        if (videoFiles.length > 0) {
            videoFiles.forEach((file, index) => {
                if (file.file instanceof File) {
                    formData.append("projectVideo", file.file, file.file.name);
                } else {
                    console.error(`❌ Skipping invalid video file at index ${index}:`, file);
                }
            });
        }

        try {
            const response = await api.post("/api/projects/upload", formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast("Project Upload successfully", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: getCustomToastStyle(theme),
                className: theme === "dark" ? "dark-theme" : "light-theme",
            });

            // ✅ Clear state after successful upload
            setImageFiles([]);
            setVideoFiles([]);
            setCodeFiles([]);
            setGlobalTitle("");
            setGlobalDescription("");
            setGlobalCategory([]);

        } catch (error) {
            toast("Error uploading project", {
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


    const handleCancel = () => {
        toast("Upload canceled", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            style: getCustomToastStyle(theme),
            className: theme === "dark" ? "dark-theme" : "light-theme",
        });
        // Clear files and project details when canceling
        setImageFiles([]);
        setVideoFiles([]);
        setCodeFiles([]);
        setGlobalTitle("");
        setGlobalDescription("");
        setGlobalCategory([]);
        setPopup(null);
    };
    return (
        <>
            <Helmet>
                <title>DesignDeck - Upload Page</title>
            </Helmet>
            <Navbar />
            <ToastContainer toastClassName={() => "custom-toast"} />
            <div className={`${theme === "dark" ? "bg-black text-white" : "bg-white text-black"} min-h-screen flex flex-col px-4 sm:px-6 md:px-10 lg:px-20 w-full pt-10 sm:pt-16 md:pt-20`}>

                {/* Upload Section */}
                <div className="mt-6 sm:mt-8 md:mt-10 text-left">
                    <h2 className="text-xl sm:text-2xl font-semibold">Upload your Project</h2>
                    <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"} mt-2 max-w-lg font-regular text-xs sm:text-sm md:text-[13px]`}>
                        Seamlessly upload your project files with ease. Choose your preferred method and get started in just a few clicks.
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center pt-6 sm:pt-8 md:pt-10 gap-6 sm:gap-8 md:gap-10">
                    <div className="text-center px-4">
                        <h3 className="text-base sm:text-lg font-medium">Choose your upload type</h3>
                        <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"} text-xs sm:text-sm font-regular mt-2`}>
                            Easily upload your files by selecting the method that best suits your needs.
                        </p>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-8 sm:gap-10 md:gap-16 lg:gap-20 justify-center">
                        {/* Image Upload */}
                        <div className="flex flex-col items-center cursor-pointer" onClick={() => setPopupType("image")}>
                            <div className="bg-[#FDE8CB] w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 flex justify-center items-center rounded-full">
                                <i className="ri-gallery-line text-[#ED9E29] text-2xl sm:text-3xl"></i>
                            </div>
                            <p className="mt-2 font-medium text-sm sm:text-base">Image</p>
                        </div>

                        {/* Video Upload */}
                        <div className="flex flex-col items-center cursor-pointer" onClick={() => setPopupType("video")}>
                            <div className="bg-[#F4D9FF] w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 flex justify-center items-center rounded-full">
                                <i className="ri-video-line text-[#C684E0] text-2xl sm:text-3xl"></i>
                            </div>
                            <p className="mt-2 font-medium text-sm sm:text-base">Video</p>
                        </div>
                    </div>

                </div>

                {/* Upload Options */}
                {popupType === "image" && (
                    <ImagePopup
                        setPopup={setPopupType}
                        handleFileChange={handleFileChange}
                        handleUpload={handleUploadFiles}
                        tempFiles={tempFiles}
                        handleDeleteTempFile={handleDeleteTempFile}
                        setTitle={setTitle}
                        setDescription={setDescription}
                        title={title}
                        description={description}
                        setCategory={setCategory}
                        category={category}
                    />
                )}

                {popupType === "video" && (
                    <VideoPopup
                        setPopup={setPopupType}
                        handleFileChange={handleFileChange}
                        handleUpload={handleUploadFiles}
                        tempFiles={tempFiles}
                        handleDeleteTempFile={handleDeleteTempFile}
                        setTitle={setTitle}
                        setDescription={setDescription}
                        title={title}
                        description={description}
                        setCategory={setCategory}
                        category={category}
                    />
                )}

                {/* Display Uploaded Files */}
                {(imageFiles.length > 0 || videoFiles.length > 0 || codeFiles.length > 0) && (
                    <>
                        <div className="pt-10 sm:pt-16 md:pt-20 lg:pt-24">
                            <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-4">Uploaded Files</h3>

                            <div className="mt-4 sm:mt-6 py-3 sm:py-4 rounded-lg">
                                <h2 className="text-lg sm:text-xl font-medium">Project Title: {globalTitle}</h2>
                                <p className="text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2">Project Description: {globalDescription}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="text-gray-600 text-xs sm:text-sm">Categories:</span>
                                    {globalCategory.map((cat) => (
                                        <span key={cat} className={`px-2 py-1 text-xs rounded-full ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700"
                                            }`}>
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {imageFiles.length > 0 && <FileDisplay files={imageFiles} type="image" handleDelete={handleDeleteFile} />}
                            {videoFiles.length > 0 && <FileDisplay files={videoFiles} type="video" handleDelete={handleDeleteFile} />}
                        </div>
                        <div className="mt-6 flex justify-end mb-5 sm:mb-8">
                            <button className="bg-gray-500 text-white px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 text-xs sm:text-sm rounded-lg mr-2 cursor-pointer" onClick={handleCancel}>Cancel</button>
                            <button className="bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 text-xs sm:text-sm rounded-lg cursor-pointer" onClick={handleUpload}>Upload Files</button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

// Image Popup Component
const ImagePopup = ({
    setPopup,
    handleFileChange,
    handleUpload,
    tempFiles,
    handleDeleteTempFile,
    setTitle,
    setDescription,
    title,
    description,
    setCategory,
    category
}) => {
    const [previewFiles, setPreviewFiles] = useState([]);
    const { theme } = useContext(ThemeContext);

    const handleCategoryChange = (value) => {
        setCategory((prev) =>
            prev.includes(value) ? prev.filter((cat) => cat !== value) : [...prev, value]
        );
    };

    const availableCategories = [
        "UI/UX",
        "Motion Graphics",
        "Web Design",
        "App Design",
        "Graphic Design",
        "Fashion Design",
        "Other",
    ];

    // Generate image previews when tempFiles changes
    useEffect(() => {
        if (tempFiles.length > 0) {
            const previews = tempFiles.map(file => (file instanceof File ? URL.createObjectURL(file) : null));
            setPreviewFiles(previews);
        } else {
            setPreviewFiles([]);
        }
    }, [tempFiles]);

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 sm:px-6 md:px-8">
            <div className={`${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} rounded-xl p-4 sm:p-5 md:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-[90%] shadow-lg relative flex flex-col justify-center overflow-y-auto `}>
                {/* Close Button */}
                <button className={`absolute top-3 sm:top-4 right-3 sm:right-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"} cursor-pointer`} onClick={() => setPopup(null)}>✖</button>

                {/* Title */}
                <h2 className="text-base sm:text-lg md:text-[20px] flex items-center gap-2">
                    <i className="ri-file-upload-line"></i>
                    <p className="font-semibold">Upload Images</p>
                </h2>
                <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"} text-[10px] sm:text-[11px] md:text-[12px]`}>Add your images here</p>

                {/* File Upload Box */}
                <label htmlFor="fileInput" className={`mt-3 sm:mt-4 border border-2 ${theme === "dark" ? "border-[#FFB74D] bg-[#FFE3BD]" : "border-[#ED9E29] bg-[#FDE8CB]"} p-4 sm:p-5 md:p-6 text-center rounded-lg cursor-pointer h-20 sm:h-24 md:h-28 flex flex-col justify-center`}>
                    <i className={`ri-file-image-line ${theme === "dark" ? "text-[#FFB74D]" : "text-[#ED9E29]"} text-lg sm:text-xl md:text-[22px]`}></i>
                    <p className={`${theme === "dark" ? "text-[#FFB74D]" : "text-[#ED9E29]"} font-medium mt-1 text-sm sm:text-base`}>Choose Files</p>
                    <input type="file" id="fileInput" accept=".jpg,.png" className="hidden" onChange={handleFileChange} multiple />
                </label>
                <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"} text-[10px] sm:text-[11px] md:text-[12px] mt-1`}>Only .jpg and .png files. 50 MB max file size.</p>

                {/* Project Name */}
                <label className="text-xs sm:text-sm font-medium mt-2 sm:mt-3 block">Project Name</label>
                <input
                    type="text"
                    placeholder="Enter your project name"
                    className={`w-full border rounded-md p-2 sm:p-2.5 mt-1 focus:outline-none focus:ring-2 ${theme === "dark" ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-black"} text-xs sm:text-sm`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                {/* Project Description */}
                <label className="mt-2 text-xs sm:text-sm font-medium">Project Description</label>
                <textarea
                    placeholder="Enter your project description"
                    className={`w-full border rounded-md p-2 sm:p-2.5 mt-1 focus:outline-none focus:ring-2 ${theme === "dark" ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-black"} text-xs sm:text-sm`}
                    value={description}
                    rows={1}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <label className="mt-2 text-xs sm:text-sm font-medium">Categories</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                    {availableCategories.map((cat) => (
                        <div key={cat} className="flex items-center">
                            <input
                                type="checkbox"
                                id={cat}
                                checked={category.includes(cat)}
                                onChange={() => handleCategoryChange(cat)}
                                className="w-4 h-4 text-blue-600 rounded border-gray-300"
                            />
                            <label htmlFor={cat} className={`ml-2 text-xs sm:text-sm ${theme === "dark" ? "text-white" : "text-black"}`}>
                                {cat}
                            </label>
                        </div>
                    ))}
                </div>


                {/* Uploaded Files Section */}
                <div className="mt-1 sm:mt-2">
                    <label className="text-xs sm:text-sm font-medium">Uploaded Files</label>
                    {previewFiles.length > 0 ? (
                        <div className={`mt-1 sm:mt-2 ${tempFiles.length > 1 ? 'max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300' : ''} space-y-1 sm:space-y-2`}>
                            {previewFiles.map((preview, index) => (
                                <div key={index} className={`flex items-center justify-between ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"} p-1.5 sm:p-2 rounded border`}>
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <i className={`ri-image-2-line ${theme === "dark" ? "text-gray-300" : "text-[#9E9E9E]"} text-lg sm:text-xl md:text-[25px]`}></i>
                                        <div>
                                            <p className="text-xs sm:text-sm md:text-[14px] font-medium">{tempFiles[index]?.name}</p>
                                            <p className={`text-[10px] sm:text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                                {tempFiles[index]?.size
                                                    ? `${(Number(tempFiles[index].size) / (1024 * 1024)).toFixed(2)} MB`
                                                    : "0 MB"}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteTempFile(index)} className={`${theme === "dark" ? "text-gray-300" : "text-[#9E9E9E]"} cursor-pointer`}>
                                        <i className="ri-delete-bin-line text-lg sm:text-xl md:text-[22px]"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mt-1 sm:mt-2`}>No files selected</p>
                    )}
                </div>

                {/* Buttons */}
                <div className="mt-3 sm:mt-4 flex justify-end gap-2">
                    <button
                        className={`border ${theme === "dark" ? "border-[#FFB74D] text-[#FFB74D]" : "border-[#ED9E29] text-[#ED9E29]"} px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg cursor-pointer text-xs sm:text-sm`}
                        onClick={() => setPopup(null)}
                    >
                        Cancel
                    </button>
                    <button
                        className={`${theme === "dark" ? "bg-[#FFB74D]" : "bg-[#ED9E29]"} text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg cursor-pointer text-xs sm:text-sm`}
                        onClick={handleUpload}
                    >
                        Upload
                    </button>
                </div>
            </div>
        </div>
    );
};

// Video Popup Component
const VideoPopup = ({
    setPopup,
    handleFileChange,
    handleUpload,
    tempFiles,
    handleDeleteTempFile,
    setTitle,
    setDescription,
    title,
    description,
    setCategory,
    category
}) => {
    const [previewFiles, setPreviewFiles] = useState([]);
    const { theme } = useContext(ThemeContext);

    const handleCategoryChange = (value) => {
        setCategory((prev) =>
            prev.includes(value) ? prev.filter((cat) => cat !== value) : [...prev, value]
        );
    };

    const availableCategories = [
        "UI/UX",
        "Motion Graphics",
        "Web Design",
        "App Design",
        "Graphic Design",
        "Fashion Design",
        "Other",
    ];

    // Generate video previews when tempFiles changes
    useEffect(() => {
        if (tempFiles.length > 0) {
            setPreviewFiles(tempFiles.map(file => (file instanceof File ? URL.createObjectURL(file) : null)));
        } else {
            setPreviewFiles([]);
        }
    }, [tempFiles]);

    return (
        <div className="fixed h-screen w-screen inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 sm:px-6 md:px-8">
            <div className={`${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} rounded-xl p-4 sm:p-5 md:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-[90%] shadow-lg relative flex flex-col justify-center`}>
                {/* Close Button */}
                <button className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-600 cursor-pointer" onClick={() => setPopup(null)}>✖</button>

                {/* Title */}
                <h2 className="text-base sm:text-lg md:text-[20px] flex items-center gap-2">
                    <i className="ri-file-upload-line"></i>
                    <p className="font-semibold">Upload Videos</p>
                </h2>
                <p className="text-gray-500 text-[10px] sm:text-[11px] md:text-[12px]">Add your videos here</p>

                {/* File Upload Box */}
                <label htmlFor="videoFileInput" className="mt-3 sm:mt-4 border border-2 border-[#C684E0] bg-[#F4D9FF] p-4 sm:p-5 md:p-6 text-center rounded-lg cursor-pointer h-20 sm:h-24 md:h-28 flex flex-col justify-center">
                    <i className="ri-video-line text-[#C684E0] text-lg sm:text-xl md:text-[22px]"></i>
                    <p className="text-[#C684E0] font-medium mt-1 text-sm sm:text-base">Choose Videos</p>
                    <input type="file" id="videoFileInput" accept="video/*" className="hidden" onChange={handleFileChange} multiple />
                </label>
                <p className="text-gray-500 text-[10px] sm:text-[11px] md:text-[12px] mt-1">Only video files. Max 200MB per file.</p>

                {/* Project Name */}
                <label className="text-xs sm:text-sm font-medium mt-2 sm:mt-3 block">Project Name</label>
                <input
                    type="text"
                    placeholder="Enter project name"
                    className="w-full border rounded-md p-2 sm:p-2.5 mt-1 focus:outline-none focus:ring-2 border-gray-300 bg-white text-black text-xs sm:text-sm"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                {/* Project Description */}
                <label className="text-xs sm:text-sm mt-2 font-medium">Project Description</label>
                <textarea
                    placeholder="Enter project description"
                    className="w-full border rounded-md p-2 sm:p-2.5 mt-1 focus:outline-none focus:ring-2 border-gray-300 bg-white text-black text-xs sm:text-sm"
                    value={description}
                    rows={1}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <label className="mt-2 text-xs sm:text-sm font-medium">Categories</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                    {availableCategories.map((cat) => (
                        <div key={cat} className="flex items-center">
                            <input
                                type="checkbox"
                                id={cat}
                                checked={category.includes(cat)}
                                onChange={() => handleCategoryChange(cat)}
                                className="w-4 h-4 text-blue-600 rounded border-gray-300"
                            />
                            <label htmlFor={cat} className={`ml-2 text-xs sm:text-sm ${theme === "dark" ? "text-white" : "text-black"}`}>
                                {cat}
                            </label>
                        </div>
                    ))}
                </div>


                {/* Uploaded Videos Section */}
                <div className="mt-1 sm:mt-2">
                    <label className="text-xs sm:text-sm font-medium">Uploaded Videos</label>
                    {previewFiles.length > 0 ? (
                        <div className={`mt-1 sm:mt-2 ${tempFiles.length > 1 ? 'max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300' : ''} space-y-1 sm:space-y-2`}>
                            {previewFiles.map((preview, index) => (
                                <div key={index} className="flex items-center justify-between bg-white p-1.5 sm:p-2 rounded border border-gray-300">
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <i className="ri-video-line text-[#9E9E9E] text-lg sm:text-xl md:text-[25px]"></i>
                                        <div>
                                            <p className="text-xs sm:text-sm md:text-[14px] font-medium">{tempFiles[index]?.name}</p>
                                            <p className="text-[10px] sm:text-xs text-gray-500">
                                                {tempFiles[index]?.size
                                                    ? `${(Number(tempFiles[index].size) / (1024 * 1024)).toFixed(2)} MB`
                                                    : "0 MB"}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteTempFile(index)} className="text-[#9E9E9E] cursor-pointer">
                                        <i className="ri-delete-bin-line text-lg sm:text-xl md:text-[22px]"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">No files selected</p>
                    )}
                </div>

                {/* Buttons */}
                <div className="mt-3 sm:mt-4 flex justify-end gap-2">
                    <button className="border border-[#C684E0] px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[#C684E0] cursor-pointer text-xs sm:text-sm" onClick={() => setPopup(null)}>Cancel</button>
                    <button className="bg-[#C684E0] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg cursor-pointer text-xs sm:text-sm" onClick={handleUpload}>Upload</button>
                </div>
            </div>
        </div>
    );
};

const FileDisplay = ({ files, type, handleDelete }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <div className="mt-4">
            <h3 className={`text-lg font-medium capitalize ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{type} Files</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                {files.map((file, index) => (
                    <div key={index} className={`relative p-2 rounded-lg border ${theme === 'dark' ? 'border-gray-600 bg-black' : 'border-gray-300 bg-white'}`}>
                        {type === "image" && <img src={file.url} alt={file.name} className="w-full h-64 rounded-lg object-cover pt-10" />}
                        {type === "video" && <video src={file.url} controls className="w-full h-64 rounded-lg object-cover pt-10" />}
                        <button className={`absolute top-2 right-2.5 cursor-pointer ${theme === 'dark' ? 'text-white' : 'text-black'}`} onClick={() => handleDelete(type, index)}>✖</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UploadProjectPage;