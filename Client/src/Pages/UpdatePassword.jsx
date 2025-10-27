import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { put } from "../APIs/api.js";

export default function UpdatePassword() {
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    const toggleVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData()
        formData.append("oldPassword", passwordData.currentPassword)
        formData.append("newPassword", passwordData.newPassword)
        formData.append("confirmPassword", passwordData.confirmPassword)

        try {
            const res = await put("users/update-password", formData, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            })
            console.log("Password Updated successfully");

        } catch (error) {
            console.log(error?.response?.data?.message || "Something went wrong while password update front-end");
        }
        console.log("Password Updated:", passwordData);
    };

    return (
        <section className="min-h-screen flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-10">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Change Password
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Current Password */}
                    <div className="relative">
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                            Current Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handleChange}
                            placeholder="Enter current password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                        />
                        <button
                            type="button"
                            onClick={toggleVisibility}
                            className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                        </button>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                            New Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handleChange}
                            placeholder="Enter new password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm new password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="mt-4 w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md font-semibold"
                    >
                        Update Password
                    </button>
                </form>
            </div>
        </section>
    );
}
