import React, { useState, useRef } from "react";
import Button from "@mui/material/Button";
import { post } from "../APIs/api.js"

export default function CreatePost() {
    const fileInputRef = useRef(null);
    const [images, setImages] = useState([]); // stores selected images

    const [postDetails, setPostDetails] = useState({
        heading: "",
        contentText: "",
        images: [],
    })

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files); // convert FileList to array
        const previews = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));

        setImages((prev) => [...prev, ...previews]);

        setPostDetails((prev) => ({
            ...prev,
            images: [...prev.images, ...files]
        }))
    };

    const handleRemoveImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setPostDetails((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }))
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleHeadingChange = (e) => {
        setPostDetails((prev) => ({
            ...prev,
            heading: e.target.value
        }))
    }

    const handleContentTextChange = (e) => {
        setPostDetails((prev) => ({
            ...prev,
            contentText: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData()
        formData.append("title", postDetails.heading)
        formData.append("description", postDetails.contentText)

        postDetails.images.forEach((file) => (
            formData.append("images", file)
        ))

        try {
            const res = await post("post/create", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            console.log("Post Created:", res.data);

        } catch (error) {
            console.log("Error while creating post:", error);
        }
    }

    console.log(postDetails.heading);
    console.log(postDetails.contentText);

    return (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto mt-10">
                <h1 className="font-semibold text-[clamp(5vw,6vw,6.5vw)]">Create Post</h1>
                <h3 className="text-gray-600 mt-2 text-sm sm:text-base">
                    Share your thoughts with the Connect Sphere community
                </h3>

                {/* Post box */}
                <form
                    onSubmit={handleSubmit}
                    className="mt-6 px-6 py-8 sm:px-10 sm:py-12 shadow-lg rounded-lg bg-[whitesmoke] space-y-6">
                    <input
                        type="text"
                        placeholder="Add a title"
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg outline-none focus:ring focus:ring-blue-200 focus:border-blue-400 font-bold"
                        onChange={handleHeadingChange}
                    />
                    <textarea
                        placeholder="What's on your mind?"
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg outline-none focus:ring focus:ring-blue-200 focus:border-blue-400 resize-none h-32 sm:h-40"
                        onChange={handleContentTextChange}
                    />

                    {/* Image upload & preview */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 items-start">
                        <Button variant="contained" color="primary" onClick={handleUploadClick}>
                            Upload Images
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            multiple
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Preview selected images */}
                    {images.length > 0 && (
                        <div className="flex flex-wrap gap-4 mt-4">
                            {images.map((img, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={img.url}
                                        alt={`preview-${index}`}
                                        className="w-32 h-32 object-cover rounded-lg"
                                    />
                                    <button
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Post button */}
                    <Button
                        type="submit"
                        variant="contained"
                        className="mt-4">
                        Post
                    </Button>
                </form>
            </div>
        </section>
    );
}
