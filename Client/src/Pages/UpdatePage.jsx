import React from 'react'
import { useState } from 'react';
import { put } from "../APIs/api.js"

export default function UpdatePage() {

    const [userDetails, setUserDetails] = useState(() => {
        const saved = localStorage.getItem("localUserDetails")
        return saved ? JSON.parse(saved) : null
    })

    const [formData, setFormData] = useState({
        username: userDetails?.userName,
        fullname: userDetails?.fullName,
        bio: userDetails?.bio,
        gender: "none"
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToBackend = new FormData()
        formDataToBackend.append("userName", formData.username)
        formDataToBackend.append("fullName", formData.fullname)
        formDataToBackend.append("bio", formData.bio)
        formDataToBackend.append("gender", formData.gender)

        try {
            const res = await put("users/update-user-profile", formDataToBackend, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })

            setUserDetails(res.data.data)
            localStorage.setItem("localUserDetails", JSON.stringify(res.data.data))
            console.log("updated user details:", res.data.data);

        } catch (error) {
            console.log(error?.response?.data?.message || "Something went wrong while profile update front-end");
        }
    }



    return (
        <section className="min-h-screen flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-10">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Update Profile
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Username */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter username"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                        />
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
                        />
                    </div>

                    {/* Bio Section */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                            Bio
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell something about yourself..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all resize-none h-24"
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                            Gender
                        </label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all bg-white"
                        >
                            <option value="none">Prefer not to say</option> 
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md font-semibold"
                    >
                        Update
                    </button>
                </form>
            </div>
        </section>
    );
}
