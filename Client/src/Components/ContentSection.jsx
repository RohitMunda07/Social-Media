import React from 'react'
import { Categories, PostCard } from '../index.js';

import './style.css'
export default function ContentSection() {
    return (
        <section>
            {/* Right Section (Main Content Area) */}
            <div className='flex-1 overflow-y-auto p-6'>
                {/* Category Buttons */}
                {/* <div className='mb-6'>
                        <Categories />
                    </div> */}

                {/* Posts / Feed */}
                <div className='space-y-6'>
                    <div className='flex w-full items-center flex-col'>
                        <PostCard />
                        <PostCard />
                    </div>

                </div>
            </div>
        </section>
    )
}
