import React, { useEffect, useRef, useState } from 'react'
import { PostCard } from '../index.js'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { get, post, put } from "../APIs/api.js"
import { useDispatch, useSelector } from 'react-redux';
import { toggleLike } from '../Context/like.toggle.js';

export default function UserProfile() {

    const [followers, setFollower] = useState(0)
    const [followings, setFollowings] = useState(0)
    const [isFollowing, setIsFollowing] = useState(false)
    const [posts, setPosts] = useState({})
    const [likedData, setLikedData] = useState({})
    const [savePost, setSavePost] = useState([])
    const [userId, setUserId] = useState()
    const [comments, setAllComments] = useState()

    const [activeTab, setActiveTab] = useState("Posts"); // default active tab
    const tabs = ["Posts", "Comments", "Likes", "Saved", ];
    const [tempAvatar, setTempAvatar] = useState(null);
    const avatarRef = useRef(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadStatus, setUploadStatus] = useState("")
    const saveState = useSelector((state) => state.save.saveState)


    const [userDetails, setUserDetails] = useState(() => {
        const saved = localStorage.getItem("localUserDetails")
        return saved ? JSON.parse(saved) : null;
    });

    const getCurrentUserDetails = async () => {
        if (!userDetails) {
            try {
                const res = await get("users/get-current-user")
                setUserDetails(res.data.data)
                setUserId(res.data.data?._id)
                console.log("User_id:", userId);

                localStorage.setItem("localUserDetails", JSON.stringify(res.data.data))
                console.log("userDetails:", res.data.data);
            } catch (error) {
                console.log(error?.response?.data?.message || "Something went wrong while getting current user from front-end");
            }
        }

    }

    const getAllFollowers = async () => {
        try {
            const res = await get("subscription/getAllSubscriber")
            // console.log(res.data.data);
            // console.log("TotalSubscribers", res.data.data.totalSubscribers);
            setFollower(res.data.data.totalSubscribers)
            // console.log("user details after fetching followers", followers);

        } catch (error) {
            console.log(error?.response?.data?.message || "Error fetching User's followers front-end");
        }
    }

    const getAllFollowings = async () => {
        const res = await get("subscription/getUserfollowings")
        // console.log("user Following to data", res.data.data);
        setFollowings(res.data.data.totalFollowings)
        // console.log(followings);

    }


    const getAllUsersPost = async () => {
        try {
            const res = await get("post/get-users-all-post")
            console.log(res.data.data);

            // const postsArray = Array.isArray(res.data.data)
            //     ? res.data.data
            //     : []
            setPosts(res.data.data)

        } catch (error) {
            console.log(error?.response?.data?.message)
        }
    }

    // const getAllUsersPost = async () => {
    //     try {
    //         const res = await get("post/get-users-all-post")
    //         // console.log("Post data", res.data.data);
    //         // console.log("Post data all posts", res.data.data.allPost);
    //         // normalize response

    //         // setPosts((prev) => ([
    //         //     ...prev,
    //         //     Array.isArray(res.data.data) ? res.data.data : [res.data.data]
    //         // ]))
    //         // console.log("Post Details:", posts);

    //         setPosts(res.data.data)
    //     } catch (error) {
    //         console.log(error?.response?.data?.message);

    //     }
    // }

    const getAllComments = async () => {
        try {
            const res = await get("comment/get-all-comments")
            setAllComments(res.data.data)
            // console.log("comment data", res.data.data);
            // console.log("comment data commentData", res.data.data?.commentData);

        } catch (error) {
            console.log(error?.response?.data?.message || "Error fetching comments front-end");
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
            // setUploadStatus("✅ Upload successful!");
            setUploadStatus("");
            console.log("Uploaded Avatar:", res.data.data.avatar);
        } catch (error) {
            setUploadStatus("❌ Upload failed");
            console.log(error?.response?.data?.message || "Error while uploading avatar from front-end");
        }
    }

    const handlePostDelete = (deletedId) => {
        setPosts((prev) => {
            const filteredPosts = prev.allPost?.filter((post) => post._id !== deletedId) || []
            return {
                ...prev,                // keep any other keys (like totalPost)
                allPost: filteredPosts, // update the post list
                totalPost: filteredPosts.length // optionally update total count
            }
        })
    }


    // const handlePostDelete = (deletedId) => {
    //     setPosts((prev) => {
    //         console.log("Prev posts value:", prev)
    //         return ({... prev.allPost?.filter((post) => post._id !== deletedId)})
    //     })
    // }

    // const handleLikeUpdate = (postId) => {
    //     // console.log("Data received from PostCard:", updatedData);

    //     // CASE 1: if backend returns updatedPost (single post)
    //     // setLikedData((prev) => ({
    //     //     ...prev,
    //     //     postLike: prev.postLike?.[0],
    //     //     commentLike: prev.commentLike?.[0]
    //     // }))
    //     // setLikedData(updatedData)
    //     useDispatch(toggleLike(postId))

    // }

    // const handleSaveUpdate = (updatedData) => {
    //     if (!updatedData) return; // nothing to add

    //     const normalized = Array.isArray(updatedData)
    //         ? updatedData
    //         : [updatedData];

    //     setSavePost((prev) => ({
    //         ...prev,
    //         updatedData: [...(prev.updatedData || []), ...normalized],
    //     }));
    // };

    useEffect(() => {
        getCurrentUserDetails();
        getAllFollowers();
        getAllFollowings();
        getAllUsersPost();
        getAllComments();
    }, [])


    useEffect(() => {
        if (tempAvatar) uploadProfilePic();
        console.log("saved box", saveState);
    }, [tempAvatar, saveState, posts, setPosts]);

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

                    {/* <h1 className='font-semibold text-2xl'>{userId}</h1> */}
                    {/* {console.log("User_id", userId)} */}

                    <h3 className='text-lg'>{userDetails?.userName}</h3>
                    <div className='space-x-8 pt-3 flex flex-col md:flex-row justify-between w-full'>
                        <div className='space-x-5'>
                            <span className='capitalize inline-block'>
                                <span className='font-semibold'>{posts?.totalPost}</span> posts
                            </span>
                            <span className='capitalize inline-block'>
                                <span className='font-semibold'>{followings}</span> followings
                            </span>
                            <span className='capitalize inline-block'>
                                <span className='font-semibold'>{followers}</span> followers
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
                <div id="profile-contents" className="mt-5 w-full grid place-items-center overflow-x-hidden">
                    {/* post content */}
                    {activeTab === "Posts" && (
                        <>
                            {posts?.allPost?.map((post, ind) => (
                                <div key={ind} className='max-w-2xl'>
                                    {/* {console.log("Post Id", post?._id)} */}
                                    <PostCard
                                        postId={post?._id}
                                        title={post?.title}
                                        content={post?.description || ""}
                                        image={post?.images[0] || {}}
                                        tags={post.tags?.map((data) => data) || ""}
                                        hideDetails={false}
                                        onPostDelete={handlePostDelete}
                                    />
                                </div>
                            ))}
                        </>
                    )}

                    {/* comment section */}
                    {activeTab === "Comments" && (
                        <>
                            {comments?.map((comment, ind) => (
                                <div key={ind} data-comment-id={comment?._id} className='max-w-2xl'>
                                    <PostCard
                                        content={comment?.commentData || ""} // first level object
                                        image={comment?.commentOn?.images[0] || {}} // second level object
                                        // tags={}
                                        hideDetails={true}
                                    />
                                </div>
                            ))}
                        </>
                    )}

                    {/* like section */}
                    {
                        // likedData && console.log("check liked data: and type", likedData?.[0]?.likedBy?.userName || "unknown")
                        // likedData && console.log("check liked data: and type", likedData?.postLike?.[0].likedBy?.userName || "unknown")
                    }
                    {activeTab === "Likes" && (
                        <>
                            {
                                likedData?.postLike?.length > 0 ? (
                                    likedData.postLike.map((like, index) => (
                                        // {
                                        //     console.log("test", like?.likedBy?.userName);
                                        // }
                                        < div key={index} >
                                            <img className='inline-flex gap-x-3' src={like?.likedBy?.avatar} alt="profil-pic" />
                                            <h2>liked by: {like?.likedBy?.userName || "unknon"}</h2>
                                        </div>
                                    ))
                                )
                                    :
                                    (
                                        <p>
                                            No Liked Post
                                        </p>
                                    )
                            }
                        </>
                    )}

                    {/* saved section */}
                    {console.log("saved data on redux:", saveState)}
                    {activeTab === "Saved" && (
                        <>
                            {
                                saveState?.map((post, ind) => (
                                    <div key={ind} className='max-w-2xl'>
                                        <PostCard
                                            postId={post?.postDetails?._id}
                                            content={post?.postDetails?.description || ""}
                                            image={post?.postDetails?.images[0] || {}}
                                            // tags={post.tags?.map((data) => data) || ""}
                                            hideDetails={false}
                                        />
                                    </div>
                                ))
                            }
                        </>
                    )}

                    {/* overview section */}
                    {/* {activeTab === "Overview" && (
                        <div className="p-5 text-gray-600">
                            Overview of user activity will go here...
                        </div>
                    )} */}
                </div>
            </div >
        </section >
    )
}
