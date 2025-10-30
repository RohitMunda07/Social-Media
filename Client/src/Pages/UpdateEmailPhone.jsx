import React, { useState } from "react";
import { put } from "../APIs/api";

export default function UpdateContactInfo() {
  const [userDetails, setUserDetails] = useState(() => {
    const saved = localStorage.getItem("localUserDetails")
    return saved ? JSON.parse(saved) : null
  })

  // const saved = await get("users/get-current-user")
  //   console.log("saved data:", saved.data.data);
  //   return saved ? saved.data.data : null

  const [contactInfo, setContactInfo] = useState({
    email: userDetails?.email || "",
    // phone: userDetails?.email || "",
  });

  const handleChange = (e) => {
    setContactInfo({
      ...contactInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData()
    formData.append("email", contactInfo.email)
    // formData.append("phone", contactInfo.phone)

    try {
      const res = await put("users/update-email-phone", formData)

      setUserDetails(res.data.data)
      localStorage.setItem("localUserDetails", JSON.stringify(res.data.data))
      console.log("Updated Details:", res.data.data);

    } catch (error) {
      console.log(error?.response?.data?.message || "something went wrong while updating the email and phoneNumber from front-end");
    }
    // console.log("Updated Contact Info:", contactInfo);
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
          {/* <div>
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
          </div> */}

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
