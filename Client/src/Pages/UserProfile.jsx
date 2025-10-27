import React, { useEffect, useRef, useState } from 'react'
import { PostCard } from '../index.js'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { get, post, put } from "../APIs/api.js"

export default function UserProfile() {

    const userData = [
        {
            content: "Just discovered this amazing new framework for building web applications! The developer experience is incredible and the performance gains are substantial. Has anyone else tried it out? Would love to hear your thoughts and experiences.",
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/coding-setup-modern-workspace-Q2DUA98gMoMr6jtJ7uPv6kgZLyK30M.jpg",
            tags: ["#webdev", "#javascript", "#framework"],
        },

        {
            content: "Working on a new design system for our startup. The challenge is balancing consistency with flexibility. Here's a sneak peek at our component library - what do you think about the color choices?",
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/design-system-ui-components-colorful-ar6FRPYNIa555QL0nXsJcihz9Zmn4x.jpg",
            tags: ["#design", "#ui", "#startup"],
        },

        {
            content: "Just discovered this amazing new framework for building web applications! The developer experience is incredible and the performance gains are substantial. Has anyone else tried it out? Would love to hear your thoughts and experiences.",
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/coding-setup-modern-workspace-Q2DUA98gMoMr6jtJ7uPv6kgZLyK30M.jpg",
            tags: ["#webdev", "#javascript", "#framework", "#learning"],
        },
        {
            content: "Just discovered this amazing new framework for building web applications! The developer experience is incredible and the performance gains are substantial. Has anyone else tried it out? Would love to hear your thoughts and experiences.",
            // image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/coding-setup-modern-workspace-Q2DUA98gMoMr6jtJ7uPv6kgZLyK30M.jpg",
            // tags: ["#webdev", "#javascript", "#framework", "#learning"],
        },
    ]

    const [isFollowing, setIsFollowing] = useState(false)
    const [activeTab, setActiveTab] = useState("Posts"); // default active tab
    const tabs = ["Posts", "Comments", "Likes", "Saved", "Overview"];
    const [tempAvatar, setTempAvatar] = useState(null);
    const avatarRef = useRef(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadStatus, setUploadStatus] = useState("")
    const [userDetails, setUserDetails] = useState(() => {
        const saved = localStorage.getItem("localUserDetails")
        return saved ? JSON.parse(saved) : null;
    });

    const getCurrentUserDetails = async () => {
        if (!userDetails) {
            try {
                const res = await get("users/get-current-user")
                setUserDetails(res.data.data)
                localStorage.setItem("localUserDetails", JSON.stringify(res.data.data))
                console.log("userDetails:", res.data.data);
            } catch (error) {
                console.log(error?.response?.data?.message || "Something went wrong while getting current user from front-end");
            }
        }

    }

    const handleUpload = () => {
        avatarRef.current.click() // open file picker
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTempAvatar(file) // store the selected file
            setUploadProgress(0)
            setUploadStatus("")
        }

    }

    const uploadProfilePic = async () => {
        if (!tempAvatar) return
        const formData = new FormData()
        formData.append("avatar", tempAvatar)

        try {
            setUploadStatus("Uploading...")
            const res = await put("users/update-avatar-image", formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: () => {
                    const percent = Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total)
                    setUploadProgress(percent)
                }
            })
            const updateUser = { ...userDetails, avatar: res.data.data.avatar }
            setUserDetails(updateUser)
            localStorage.setItem("localUserDetails", JSON.stringify(updateUser))
            setUploadStatus("✅ Upload successful!");
            console.log("Uploaded Avatar:", res.data.data.avatar);
        } catch (error) {
            setUploadStatus("❌ Upload failed");
            console.log(error?.response?.data?.message || "Error while uploading avatar from front-end");
        }
    }

    useEffect(() => {
        getCurrentUserDetails();
    }, [])

    useEffect(() => {
        if (tempAvatar) uploadProfilePic();
    }, [tempAvatar]);

    // localAvatar = localStorage.getItem("avatar")

    return (
        <section className='container mx-auto'>
            {/* banner */}
            {/* {console.log("this is the res data", userDetails?.fullName)} */}
            <div className='bg-gradient-to-r from-[#3c34d8bb] to-[#2950bb9a] !h-[30vh] rounded-b-4xl'></div>

            {/* profile pic and details */}
            <div className='flex flex-col md:flex-row items-center gap-x-10 px-16 relative -top-16'>
                {/* user pic */}
                <div className='rounded-full flex-shrink-0'>
                    <input
                        ref={avatarRef}
                        type="file"
                        onChange={handleFileChange}
                        accept='image/*'
                        style={{ display: "none" }}
                    />
                    {uploadProgress > 0 && <p>Progress: {uploadProgress}%</p>}
                    {uploadStatus && <p>{uploadStatus}</p>}
                    <img
                        onClick={handleUpload}
                        src={userDetails?.avatar || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/diverse-user-avatars-jNaliJbW5b5ccprrlYjj99XE0SOY9L.png"} alt="User Avatar" className='object-cover rounded-full ring-white ring-3 w-32 h-32' />
                </div>

                {/* details */}
                <div className='w-full'>
                    <h1 className='font-semibold text-2xl'>{userDetails?.fullName}</h1>
                    <h3 className='text-lg'>{userDetails?.userName}</h3>
                    <div className='space-x-8 pt-3 flex flex-col md:flex-row justify-between w-full'>
                        <div className='space-x-5'>
                            <span className='capitalize inline-block'>
                                <span className='font-semibold'>15</span> posts
                            </span>
                            <span className='capitalize inline-block'>
                                <span className='font-semibold'>15</span> followings
                            </span>
                            <span className='capitalize inline-block'>
                                <span className='font-semibold'>155</span> followings
                            </span>
                        </div>

                        <div className='pt-2 md:pt-0 space-x-3 md:space-x-5 text-nowrap'>
                            <button
                                className={`${isFollowing ? "bg-green-600" : "bg-blue-600"} text-white text-[0.75rem] h-[1.5rem] rounded-lg inline-block`}
                                style={{
                                    padding: '2px 15px'
                                }}
                                onClick={(() => setIsFollowing((prev) => !prev))}
                            >{isFollowing ? "Following" : "Follow"}</button>
                            <button className='border border-gray-300 shadow-lg px-1 py-1 rounded-lg inline-block'><ChatBubbleOutlineIcon /></button>
                            <button className='border border-gray-300 shadow-lg px-1 py-1 rounded-lg inline-block'><MoreHorizIcon /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* user bio section */}
            <p className='-mt-10 max-w-3xl mb-8'>
                {userDetails?.bio}
            </p>

            <div>
                {/* tabs */}
                <div className='bg-gray-200 rounded-lg px-3 py-1 w-full'>
                    <ul id='profile-tabs' className='flex flex-wrap justify-around'>
                        {tabs.map((tab) => (
                            <li key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`cursor-pointer px-4 py-2 rounded-lg transition ${activeTab === tab
                                    ? "bg-white  font-semibold"
                                    : "text-gray-700 hover:bg-gray-300"
                                    }`}
                            >
                                {tab}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Content area */}
                <div id="profile-contents" className="mt-5 w-full grid grid-cols-1 gap-x-5 overflow-x-hidden">
                    {/* post content */}
                    {activeTab === "Posts" && (
                        <>
                            {userData.map((post, ind) => (
                                <div key={ind} className='max-w-2xl'>
                                    <PostCard
                                        content={post?.content || ""}
                                        image={post?.image || {}}
                                        tags={post.tags?.map((data) => data) || ""}
                                        hideFollowBtn={true}
                                    />
                                </div>
                            ))}
                        </>
                    )}

                    {/* comment section */}
                    {activeTab === "Comments" && (
                        <div className="p-5 text-gray-600">User comments will go here...</div>
                    )}

                    {/* like section */}
                    {activeTab === "Likes" && (
                        <div className="p-5 text-gray-600">User liked posts will go here...</div>
                    )}

                    {/* saved section */}
                    {activeTab === "Saved" && (
                        <div className="p-5 text-gray-600">User saved posts will go here...</div>
                    )}

                    {/* overview section */}
                    {activeTab === "Overview" && (
                        <div className="p-5 text-gray-600">
                            Overview of user activity will go here...
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
