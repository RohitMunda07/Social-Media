import React, { useState } from 'react';
import { Categories, PostCard } from '../index.js';

import './style.css';

export default function Home() {
    return (
        <div className='h-[90vh] w-full overflow-hidden'>
            <section className='flex h-full'>
                {/* Right Section (Main Content Area) */}
                <div className='flex-1 overflow-y-auto p-6'>
                    {/* Posts / Feed */}
                    <div className='space-y-6'>
                        <div className='flex w-full items-center flex-col'>
                            <PostCard />
                            <PostCard />
                            <PostCard />
                            <PostCard />
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
