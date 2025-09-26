import React, { useState } from 'react';
import { Categories, PostCard, SideBar } from '../index.js';

import './style.css';

export default function Home() {
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
        <div id='grid-container' className='mx-auto w-full min-h-screen dark:text-white dark:bg-primary-dark'>

            <div>
                <SideBar />
            </div>

            {/* Right Section (Main Content Area) */}
            <div className='flex w-full min-h-[100vh] flex-col'>
                <PostCard content={content[0]} image={image[0]} tags={tags[0]} hideFollowBtn={false}/>
                <PostCard content={content[1]} image={image[1]} tags={tags[1]} hideFollowBtn={false}/>
                <PostCard content={content[0]} image={image[0]} tags={tags[0]} hideFollowBtn={false}/>
                <PostCard content={content[1]} image={image[1]} tags={tags[1]} hideFollowBtn={false}/>
                <PostCard content={content[0]} image={image[0]} tags={tags[0]} hideFollowBtn={false}/>
                <PostCard content={content[1]} image={image[1]} tags={tags[1]} hideFollowBtn={false}/>
                <PostCard content={content[0]} image={image[0]} tags={tags[0]} hideFollowBtn={false}/>
                <PostCard content={content[1]} image={image[1]} tags={tags[1]} hideFollowBtn={false}/>
            </div>

        </div>
    );
}
