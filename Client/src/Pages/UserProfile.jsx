import React from 'react'
import { Categories, PostCard } from '../index.js'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export default function UserProfile() {
    return (
        <section className='container mx-auto'>
            {/* banner */}
            <div className='bg-gradient-to-r from-[#3c34d8bb] to-[#2950bb9a] !h-[30vh] rounded-b-4xl'></div>

            {/* profile pic and details */}
            <div className='flex items-center gap-x-10 px-16 relative -top-16'>
                {/* user pic */}
                <div className='w-32 rounded-full'>
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/diverse-user-avatars-jNaliJbW5b5ccprrlYjj99XE0SOY9L.png" alt="" className='object-cover rounded-full ring-white ring-3' />
                </div>

                {/* details */}
                <div className='w-full'>
                    <h1 className='font-semibold text-2xl'>Rohit</h1>
                    <h3 className='text-lg'>@rohit1418</h3>
                    <div className='space-x-8 pt-3 flex justify-between w-full'>
                        <div className='space-x-5'>
                            <span className='capitalize'>
                                <span className='font-semibold'>15</span> posts
                            </span>
                            <span className='capitalize'>
                                <span className='font-semibold'>15</span> followings
                            </span>
                            <span className='capitalize'>
                                <span className='font-semibold'>155</span> followings
                            </span>
                        </div>

                        <div className='space-x-5'>
                            <button
                                className='bg-blue-600 text-white text-[0.75rem] h-[1.5rem] rounded-lg'
                                style={{
                                    padding: '2px 15px'
                                }}
                            >Follow</button>
                            <button className='border border-gray-300 shadow-lg px-1 py-1 rounded-lg'><ChatBubbleOutlineIcon /></button>
                            <button className='border border-gray-300 shadow-lg px-1 py-1 rounded-lg'><MoreHorizIcon /></button>
                        </div>
                    </div>
                </div>
            </div>
            <p className='-mt-10 max-w-3xl'>
                Full-stack developer passionate about creating amazing user experiences. Love to share knowledge and learn from the community. Always exploring new technologies and building cool stuff!
            </p>
        </section>
    )
}

// <div className='h-[90vh] mt-30 w-full '>
//     <div className='w-full flex items-center flex-col'>
//         <img src="./man.png" alt="profile-image" className='w-[20rem] h-[20rem]' />
//         <Categories />
//         <div className='text-center mt-10 w-3xl'>
//             <PostCard />
//         </div>
//     </div>
// </div>
