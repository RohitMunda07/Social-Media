import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import Button from '@mui/material/Button'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';



const PostCard = () => {
    // const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    return (
        <div className="py-4 w-full flex items-center flex-col h-[20rem] mx-auto mb-6">
            <div className='bg-white border-t-1 border-b-1 p-2 max-w-2xl'>
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
                                            padding: '0 10px'
                                        }}
                                    >
                                        join
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

                        {/* Content Section with Read More */}
                        <div className="relative h-[13rem] overflow-hidden bg-gray-100 px-3 py-2 rounded">
                            <p className="text-start text-lg">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus magni earum maxime ipsam deserunt nostrum quibusdam asperiores non, dolorum delectus quo totam rem fugit ab itaque nihil quaerat modi alias accusamus aliquid reiciendis aperiam atque sequi! Dolorum esse nostrum sequi sed iste est blanditiis tempore delectus minima! Culpa eaque nihil et repellat eum placeat quia fugit cupiditate molestiae. Facere repellendus provident illum sed velit maiores, perspiciatis totam ut eligendi dignissimos dolores at iusto dolor eum incidunt animi obcaecati asperiores. Eos cupiditate neque accusamus vitae rerum tenetur commodi error deserunt quos! Eius perspiciatis qui similique aperiam ex nostrum repudiandae fuga ab quasi, obcaecati quo, recusandae quibusdam deserunt quisquam maxime explicabo doloremque dolores molestiae neque autem doloribus a consequatur tempore iste. Recusandae aliquid tempore, eligendi quis ea voluptatibus nisi mollitia architecto explicabo, maxime nihil laboriosam doloribus qui vel commodi dolor modi distinctio ipsam nostrum eveniet facilis delectus aspernatur! Sit ex ea ratione iusto nemo eveniet deleniti, recusandae perspiciatis laborum illo molestiae assumenda quibusdam libero nisi! Magni totam, beatae, a error distinctio aliquid et perspiciatis ducimus deserunt ratione quam delectus eveniet consequatur minima ipsum dolor autem quae magnam vel est! Quisquam ut quae cum cumque ipsam sint, tenetur ullam fuga obcaecati necessitatibus officiis!
                            </p>

                        </div>

                    </div>
                </div>

                {/* Icons */}
                <div className="flex ml-[5rem] gap-6 mt-4">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-red-500">
                        <FavoriteBorderIcon fontSize="small" />
                        <span className="text-sm"></span>
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer hover:text-blue-500">
                        <ShareIcon fontSize="small" />
                        <span className="text-sm"></span>
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer hover:text-yellow-600">
                        <BookmarkBorderIcon fontSize="small" />
                        <span className="text-sm"></span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PostCard;
