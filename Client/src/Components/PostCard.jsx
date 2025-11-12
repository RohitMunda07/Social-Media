import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import { Pencil, PencilIcon } from 'lucide-react';
import { DeleteForever } from '@mui/icons-material';
import { del, post, put, patch } from '../APIs/api.js';
import { useSelector, useDispatch } from 'react-redux';
import { toggleLike } from '../Context/like.toggle.js';
import { toggleSave } from '../Context/save.toggle.js';
import UpdatePost from "../Pages/UpdatePost.jsx"

const PostCard = ({ postId = "", title = "", content = "", image = "", tags = [] || "", hideDetails = {}, onPostDelete = () => { }, }) => {
    // const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [like, setLike] = useState(null)
    const [bookmark, setBookMark] = useState(false)
    const dispatch = useDispatch();
    const likedPosts = useSelector((state) => state.like.likedPosts);
    const saveState = useSelector((state) => state.save.saveState)
    const navigate = useNavigate()

    const handleDelete = async () => {
        console.log("deleting");
        try {
            const res = await del(`post/delete-post/${postId}`, {
                withCredentials: true
            })
            console.log("item deleted successfully", res.data.data);
            onPostDelete(postId)

        } catch (error) {
            console.log(error?.response?.data?.message || "Error delete item");

        }
    }

    const toggleLikeState = async () => {
        try {
            const res = await put(`like/toggle-like`, {}, {
                params: {
                    postId: postId
                },
                withCredentials: true
            })
            console.log(res.data.data);
            setLike(res.data.data)

            // console.log("sent liked data back");
            // console.log("liked Data in postCard:", res.data.data);
            onLikeUpdate(res.data.data)
        } catch (error) {
            console.log(error?.response?.data?.message || "Error in toggle like front-end");
        }
    }

    const handleSaveUpdate = () => {
        dispatch(toggleSave(postId))
        // console.log("savedPost:", );
    }

    const handleLikeUpdate = (postId) => {
        dispatch(toggleLike(postId))
        console.log("LikedPost:", likedPosts);
    }

    const handleUpdatePost = () => {
        const existingPostDetails = {
            title,
            content,
            image,
            postId,
        };

        navigate("/update-post", { state: { existingPost: existingPostDetails } });
    };

    useEffect(() => {
        // console.log("Updated likedPosts:", likedPosts);
        const isLiked = likedPosts.some((p) => p._id === postId);
        setLike(isLiked);
        console.log(saveState);
    }, [likedPosts, postId, saveState,]);

    return (
        <div className="py-4 w-full">
            <div className='bg-[whitesmoke] w-sm dark:text-white dark:bg-primary-dark px-8 py-8
            rounded-3xl outline-0
            '>
                {/* Top: User Info + Content */}
                <div className="flex items-start gap-4">
                    {/* Profile Pic */}
                    {!hideDetails &&
                        (
                            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold">
                                pic
                            </div>
                        )
                    }

                    {/* Right Side */}
                    <div className="flex-1">
                        {/* Username */}
                        <div className="px-2 py-1 rounded w-full font-semibold mb-2">
                            <div className='flex justify-between'>
                                {!hideDetails && <h2>rohit418 <span className='text-xs'>1h</span></h2>}

                                <div className='flex items-center gap-2'>
                                    <button
                                        className={`bg-blue-600 text-white ${hideDetails ? "hidden" : ""}`}
                                        style={{
                                            fontSize: '0.75rem',
                                            height: '1.5rem',
                                            borderRadius: '99px',
                                            padding: '2px 15px'
                                        }}

                                    >
                                        follow
                                    </button>


                                    {/* Dropdown Menu */}

                                    {!hideDetails && <MoreVertIcon
                                        onClick={(e) => setAnchorEl(e.currentTarget)}
                                        className="cursor-pointer"
                                    />}
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        disableScrollLock={true}
                                        onClose={() => setAnchorEl(null)}
                                    >
                                        <MenuItem onClick={() => { setAnchorEl(null); console.log("Hide post"); }}>
                                            <NotInterestedIcon /> Hide Post
                                        </MenuItem>

                                        <MenuItem onClick={() => handleUpdatePost()}>
                                            <PencilIcon /> Update Post
                                        </MenuItem>

                                        <MenuItem onClick={() => { setAnchorEl(null); console.log("Report post"); }}>
                                            <ReportGmailerrorredIcon /> Report Post
                                        </MenuItem>
                                        {
                                            !hideDetails &&
                                            <MenuItem onClick={() => handleDelete()}>
                                                <DeleteForever /> Delete
                                            </MenuItem>
                                        }
                                    </Menu>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section with Read More */}
                <div className="overflow-hidden bg-gray-100 py-8 rounded dark:text-white dark:bg-primary-dark">

                    <p className="text-start text-lg">
                        {title.length > 0 && (title)}
                    </p>

                    <p className="text-start text-lg">
                        {content.length > 0 && (content)}
                    </p>

                    <div className='text-start pt-3 space-x-3'>
                        {tags.length > 0 &&
                            (tags.map((tag) => (
                                <span key={tag}>{tag}</span>
                            )))
                        }
                    </div>

                    <div className='w-full h-full rounded-3xl mt-10'>
                        {image.length > 0 && (<img src={image} alt="post-image"
                            className='w-[80%] h-[18rem] rounded-3xl'
                        />)
                        }
                    </div>
                </div>

                {/* Icons */}
                <div className="flex justify-between px-10">
                    <div className='flex gap-3'>
                        <div className="flex items-center gap-1 ">
                            <div className='cursor-pointer hover:text-red-500'
                                onClick={() => handleLikeUpdate(postId)}
                            >
                                {like ? <FavoriteIcon fontSize="medium" htmlColor='red' /> : <FavoriteBorderIcon fontSize="medium" />}
                            </div>
                            <span className="text-sm">10</span>
                        </div>
                        <div className="flex items-center gap-1 cursor-pointer">
                            <div className='cursor-pointer hover:text-blue-500'>
                                <ShareIcon fontSize="medium" />
                            </div>
                            <span className="text-sm">10</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 cursor-pointer">
                        <div className='cursor-pointer  hover:text-yellow-600'
                            onClick={() => handleSaveUpdate()}
                        >
                            {bookmark ? <BookmarkIcon fontSize="medium" htmlColor='skyblue' /> : <BookmarkBorderIcon fontSize="medium" />}
                        </div>
                        <span className="text-sm"></span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PostCard;
