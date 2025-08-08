import React, { useState } from 'react'


export default function Setting() {
    const [selected, setSelect] = useState('Account')
    const listItems = [
        { value: "Account" },
        { value: "Profile" },
        { value: "Privacy" },
        { value: "Prefrence" },
        { value: "Notification" }
    ]

    return (
        <div className='h-[90vh] w-full overflow-hidden'>
            <section className='flex h-full'>
                <div className='flex-1 p-6'>
                    <div className='w-full overflow-auto h-[90vh]'>
                        <div className='flex flex-col mb-10'>
                            <h1 className='text-5xl font-semibold text-start mt-2 mb-10 ml-50'>Settings</h1>
                            <span className='w-[8rem] h-1 -mt-9 rounded-3xl ml-50 bg-blue-700'></span>
                        </div>
                        <ul className='setting flex w-full justify-center gap-8'>
                            {listItems.map((item) => (
                                <li
                                    key={item.value}
                                    onClick={() => setSelect(item.value)}
                                    className={`${selected === item.value ? 'underline' : ''} text-lg mb-10`}
                                >{item.value}</li>
                            ))}
                        </ul>
                        <div className=' w-full flex items-center justify-center'>
                            <ul className='bg-blue-400 w-3xl text-start p-8 space-y-5 text-xs'>
                                <li>Email</li>
                                <li>Phone Number</li>
                                <li>Password</li>
                                <li>Gender</li>
                                <li>Change Location</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
