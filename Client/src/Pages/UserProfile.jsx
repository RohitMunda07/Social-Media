import React from 'react'
import {Categories, PostCard} from '../index.js'

export default function UserProfile() {
    return (
        <div className='h-[90vh] w-full overflow-hidden'>
            <section className='flex h-full'>
                <div className='flex-1 p-6'>
                    <div className='w-full flex items-center flex-col overflow-auto h-[90vh]'>
                        <img src="./man.png" alt="profile-image" className='w-[20rem] h-[20rem]' />
                        <Categories />
                        <div className='text-center mt-10 w-3xl'>
                            <PostCard />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
