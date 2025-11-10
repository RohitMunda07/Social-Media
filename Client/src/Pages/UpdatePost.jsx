import React, { useState } from "react";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom"; // or next/link if still in Next.js
import UpdatePostForm  from "../Components/UpdatePostForm.jsx";

export default function UpdatePostPage() {
    const [preview, setPreview] = useState("");

    // Mock existing post data
    const existingPost = {
        id: "1",
        content:
            "Just finished an amazing project with the team! Really proud of what we accomplished together. Check it out and let me know what you think! 🚀",
        image: "/project-showcase.jpg",
        createdAt: "2 hours ago",
        likes: 234,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/messages">
                            <IconButton>
                                <ArrowBackIcon sx={{ color: "#1e293b" }} />
                            </IconButton>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Preview Section */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
                            {/* Preview Image */}
                            {preview ? (
                                <div className="relative">
                                    <img
                                        src={preview || "/placeholder.svg"}
                                        alt="Post preview"
                                        className="w-full h-64 object-cover"
                                    />
                                </div>
                            ) : existingPost.image ? (
                                <div className="relative">
                                    <img
                                        src={existingPost.image || "/placeholder.svg"}
                                        alt="Current post"
                                        className="w-full h-64 object-cover"
                                    />
                                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                                        Current
                                    </div>
                                </div>
                            ) : null}

                            {/* Post Content Preview */}
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                                        YU
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">You</p>
                                        <p className="text-xs text-gray-500">{existingPost.createdAt}</p>
                                    </div>
                                </div>

                                <p className="text-gray-800 leading-relaxed mb-4 whitespace-pre-wrap">
                                    {document.querySelector("textarea")?.value || existingPost.content}
                                </p>

                                <div className="flex gap-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
                                    <button className="hover:text-blue-600 transition-colors">
                                        💬 Comment
                                    </button>
                                    <button className="hover:text-blue-600 transition-colors">
                                        ↗️ Share
                                    </button>
                                    <button className="hover:text-blue-600 transition-colors ml-auto">
                                        ❤️ {existingPost.likes} Likes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <UpdatePostForm existingPost={existingPost} onPreviewChange={setPreview} />
                </div>
            </div>
        </div>
    );
}
