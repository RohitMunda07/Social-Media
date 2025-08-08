import React from 'react'

export default function NotificationMessage() {
    return (
        <div className='mb-3 text-start w-full flex justify-center'>
            <div className='w-xl bg-blue-50 hover:bg-blue-100 cursor-pointer p-3 rounded-xl'>
                <div className='flex gap-5'>
                    <img src="./man.png" alt="" className='w-8 h-8' />
                    <h2>this is the title</h2>
                </div>

                <p className='ml-13 h-[4.8rem] overflow-hidden'>this is NotificationMessage basically the body Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique expedita repellendus minima sint ea aut quaerat commodi magni inventore. Veniam dolorem praesentium sint natus, cum dolor neque placeat voluptate harum aliquid. Deleniti eum tempora nesciunt provident eligendi molestias suscipit facilis! Eveniet sunt minima quo labore iure accusamus culpa ullam distinctio.</p>
            </div>
        </div>
    )
}
