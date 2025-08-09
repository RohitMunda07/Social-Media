import React from 'react'
import { Categories, PostCard } from '../index.js'

export default function UserProfile() {
    return (
        <div className='h-[90vh] mt-30 w-full '>
            <div className='w-full flex items-center flex-col'>
                <img src="./man.png" alt="profile-image" className='w-[20rem] h-[20rem]' />
                <Categories />
                <div className='text-center mt-10 w-3xl'>
                    <PostCard />
                </div>
            </div>
        </div>
    )
}
