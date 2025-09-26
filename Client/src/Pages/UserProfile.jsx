import React from 'react'
import { Categories, PostCard } from '../index.js'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Height } from '@mui/icons-material';
import { height } from '@mui/system';

export default function UserProfile() {
    const content = [
        "Just discovered this amazing new framework for building web applications! The developer experience is incredible and the performance gains are substantial. Has anyone else tried it out? Would love to hear your thoughts and experiences.",

        "Working on a new design system for our startup. The challenge is balancing consistency with flexibility. Here's a sneak peek at our component library - what do you think about the color choices?"
    ]

    const tags = [
        ["#webdev", "#javascript", "#framework"],
        ["#design", "#ui", "#startup"]
    ]

    const image = [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/coding-setup-modern-workspace-Q2DUA98gMoMr6jtJ7uPv6kgZLyK30M.jpg",

        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/design-system-ui-components-colorful-ar6FRPYNIa555QL0nXsJcihz9Zmn4x.jpg"
    ]

    return (
        <section className='container mx-auto'>
            {/* banner */}
            <div className='bg-gradient-to-r from-[#3c34d8bb] to-[#2950bb9a] !h-[30vh] rounded-b-4xl'></div>

            {/* profile pic and details */}
            <div className='flex flex-col md:flex-row items-center gap-x-10 px-16 relative -top-16'>
                {/* user pic */}
                <div className='rounded-full flex-shrink-0'>
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/diverse-user-avatars-jNaliJbW5b5ccprrlYjj99XE0SOY9L.png" alt="" className='object-cover rounded-full ring-white ring-3 w-32 h-32' />
                </div>

                {/* details */}
                <div className='w-full'>
                    <h1 className='font-semibold text-2xl'>Rohit</h1>
                    <h3 className='text-lg'>@rohit1418</h3>
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
                                className='bg-blue-600 text-white text-[0.75rem] h-[1.5rem] rounded-lg inline-block'
                                style={{
                                    padding: '2px 15px'
                                }}
                            >Follow</button>
                            <button className='border border-gray-300 shadow-lg px-1 py-1 rounded-lg inline-block'><ChatBubbleOutlineIcon /></button>
                            <button className='border border-gray-300 shadow-lg px-1 py-1 rounded-lg inline-block'><MoreHorizIcon /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* user bio section */}
            <p className='-mt-10 max-w-3xl mb-8'>
                Full-stack developer passionate about creating amazing user experiences. Love to share knowledge and learn from the community. Always exploring new technologies and building cool stuff!

            </p>

            <div>
                {/* tabs */}
                <div className='bg-gray-200 rounded-lg px-3 py-1'>
                    <ul id='profile-tabs' className='flex justify-around'>
                        <li className='active-tab'>Posts</li>
                        <li>Comments</li>
                        <li>Likes</li>
                        <li>Saved</li>
                        <li>Overview</li>
                    </ul>
                </div>

                {/* content */}
                <div id='profile-contents' className='w-full grid grid-cols-1 gap-x-5'>
                    <div className='max-w-2xl'>
                        <PostCard content={content[0]} image={image[0]} tags={tags[0]} hideFollowBtn={true} />
                    </div>
                    <div className='max-w-2xl'>
                        <PostCard content={content[0]} image={image[1]} tags={tags[0]} />
                    </div>
                    <div className='max-w-2xl'>
                        <PostCard content={content[0]} image={image[0]} tags={tags[0]} />
                    </div>
                    <div className='max-w-2xl'>
                        <PostCard content={content[0]} image={image[1]} tags={tags[0]} />
                    </div>
                </div>
            </div>
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
