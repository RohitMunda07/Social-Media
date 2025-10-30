import React, { useState } from "react";
import { del } from "../APIs/api.js";
import { useDispatch } from "react-redux";
import { setAuthStatus } from "../Context/auth.slice.js";
import { useNavigate } from "react-router";

export default function DeleteAccountPage() {
    const [showModal, setShowModal] = useState(false);
    const [confirmStep, setConfirmStep] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (!password.trim()) {
            alert("Please enter your password to confirm deletion.");
            return;
        }

        try {
            setLoading(true);
            const res = await del("users/delete-user", { data: { password } }); // assuming password is needed
            console.log("Account deleted!");
            dispatch(setAuthStatus(false));
            setShowModal(false);
        } catch (error) {
            console.log(error?.response?.data?.message || "Error while deleting account (frontend)");
        } finally {
            setLoading(false);
            navigate("/")
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                    Delete Your Account
                </h1>
                <p className="text-gray-600 mb-6">
                    Deleting your account is{" "}
                    <span className="font-semibold text-red-600">permanent</span>. All
                    your data will be lost and cannot be recovered.
                </p>

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition duration-200"
                >
                    Delete Account
                </button>
            </div>

            {/* Popup Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm text-center animate-fadeIn">
                        {!confirmStep ? (
                            <>
                                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                                    Are you sure?
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    This action cannot be undone. Do you still want to delete your
                                    account?
                                </p>

                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => setConfirmStep(true)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                    >
                                        Yes, Delete
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                                    Confirm with Password
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Enter your password to permanently delete your account.
                                </p>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={() => {
                                            setConfirmStep(false);
                                            setShowModal(false);
                                            setPassword("");
                                        }}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={loading}
                                        className={`${loading
                                            ? "bg-red-400 cursor-not-allowed"
                                            : "bg-red-600 hover:bg-red-700"
                                            } text-white px-4 py-2 rounded-lg transition duration-200`}
                                    >
                                        {loading ? "Deleting..." : "Confirm Delete"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
