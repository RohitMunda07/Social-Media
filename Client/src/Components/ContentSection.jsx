import React from 'react'
import './style.css'
import { Outlet } from 'react-router'


export default function ContentSection() {
    return (
        <section className='w-full min-h-full'>
            <Outlet />
        </section>
    )
}
