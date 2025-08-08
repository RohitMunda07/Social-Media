import React from 'react'
import NotificationMessage from '../Components/NotificationMessage'

export default function Notification() {
  return (
    <div className='h-[90vh] w-full overflow-hidden'>
      <section className='flex h-full'>
        <div className='flex-1 p-6'>
          <div className='w-full overflow-auto h-[90vh]'>
            <div className='flex flex-col mb-10'>
              <h1 className='text-3xl font-semibold text-start mt-2 mb-10 ml-50'>Notifications</h1>
              <span className='w-[8rem] h-1 -mt-9 rounded-3xl ml-50 bg-blue-700'></span>
            </div>
            <NotificationMessage />
            <NotificationMessage />
            <NotificationMessage />
            <NotificationMessage />
            <NotificationMessage />
            <NotificationMessage />
            <NotificationMessage />
            <NotificationMessage />
            <NotificationMessage />
            <NotificationMessage />
            <NotificationMessage />
            <NotificationMessage />
            <NotificationMessage />
            <NotificationMessage />
            <NotificationMessage />
            <NotificationMessage />
            <NotificationMessage />
            <NotificationMessage />
            <NotificationMessage />
            <NotificationMessage />
            <NotificationMessage />
            <NotificationMessage />
            <NotificationMessage />
          </div>
        </div>
      </section>
    </div>
  )
}
