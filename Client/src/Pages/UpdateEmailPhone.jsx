import React, { useState } from "react";

export default function UpdateContactInfo() {
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    setContactInfo({
      ...contactInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Contact Info:", contactInfo);
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Update Contact Info
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={contactInfo.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none transition-all"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={contactInfo.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md font-semibold"
          >
            Update
          </button>
        </form>
      </div>
    </section>
  );
}
