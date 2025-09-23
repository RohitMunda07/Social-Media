import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Button from '@mui/material/Button'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';



const PostCard = ({ content = "", image = "", tags = [] || "" }) => {
    // const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [like, setLike] = useState(false)
    const [bookmark, setBookMark] = useState(false)


    return (
        <div className="py-4 w-full flex items-center flex-col mb-15 ">
            <div className='bg-[whitesmoke] dark:text-white dark:bg-primary-dark px-8 py-8
            rounded-3xl outline-0
            '>
                {/* Top: User Info + Content */}
                <div className="flex items-start gap-4">
                    {/* Profile Pic */}
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold">
                        pic
                    </div>

                    {/* Right Side */}
                    <div className="flex-1">
                        {/* Username */}
                        <div className="px-2 py-1 rounded w-full font-semibold mb-2">
                            <div className='flex justify-between'>
                                <h2>rohit418 <span className='text-xs'>1h</span></h2>

                                <div className='flex items-center gap-2'>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            fontSize: '0.75rem',
                                            height: '1.5rem',
                                            borderRadius: '99px',
                                            padding: '2px 15px'
                                        }}
                                    >
                                        follow
                                    </Button>

                                    {/* Dropdown Menu */}
                                    <MoreVertIcon
                                        onClick={(e) => setAnchorEl(e.currentTarget)}
                                        className="cursor-pointer"
                                    />
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        disableScrollLock={true}
                                        onClose={() => setAnchorEl(null)}
                                    >
                                        <MenuItem onClick={() => { setAnchorEl(null); console.log("Hide post"); }}>
                                            <NotInterestedIcon /> Hide Post
                                        </MenuItem>
                                        <MenuItem onClick={() => { setAnchorEl(null); console.log("Report post"); }}>
                                            <ReportGmailerrorredIcon /> Report Post
                                        </MenuItem>
                                    </Menu>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

                {/* Content Section with Read More */}
                <div className="relative overflow-hidden bg-gray-100 py-10 rounded dark:text-white dark:bg-primary-dark">

                    <p className="text-start text-lg">
                        {content}
                    </p>

                    <div className='text-start pt-3 space-x-3'>
                        {tags.map((tag) => (
                            <span>{tag}</span>
                        ))}
                    </div>

                    <div className='w-full h-full bg-amber-700 rounded-3xl mt-10'>
                        <img src={image} alt="post-image"
                            className='object-cover rounded-3xl'
                        />
                    </div>
                </div>

                {/* Icons */}
                <div className="flex justify-between px-10">
                    <div className='flex gap-3'>
                        <div className="flex items-center gap-1 ">
                            <div className='cursor-pointer hover:text-red-500'
                                onClick={() => setLike((prev) => !prev)}
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
                            onClick={() => setBookMark((prev) => !prev)}
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
