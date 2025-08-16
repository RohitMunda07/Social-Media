import React, { useState } from "react";
import axios from "axios";
import { post } from "../APIs/api";

export default function Testing() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const res = await axios.post("http://localhost:8080/api/v1/users/register", formData, {
      //   headers: { "Content-Type": "application/json" },
      // });
      const res = await post("users/register", formData, {
        headers: { "Content-Type": "application/json" },
      });
      setMessage(res.data.message || "User registered successfully!");
      console.log("Response:", res.data);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Something went wrong";
      setMessage("Error: " + errMsg);
      console.error(errMsg);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-96 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded-md"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 rounded-md"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Register
        </button>

        {message && (
          <p className="text-center text-sm mt-2 text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}
