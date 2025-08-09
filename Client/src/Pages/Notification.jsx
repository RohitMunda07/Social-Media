import React from 'react'
import NotificationMessage from '../Components/NotificationMessage'

export default function Notification() {
  return (
    <div className='h-[100vh] w-full mt-30 '> {/* fixed padding */}
      <div className='w-full'>
        <div className='flex flex-col mb-10'>
          <h1 className='text-3xl font-semibold text-center  mt-2 mb-10'>Notifications</h1>
          <span className='w-[8rem] h-1 -mt-9 rounded-3xl flex self-center bg-blue-700'></span>
        </div>

        {Array.from({ length: 25 }).map((_, i) => (
          <NotificationMessage key={i} />
        ))}
      </div>
    </div >
  )
}

