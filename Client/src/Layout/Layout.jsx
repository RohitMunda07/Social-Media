import React from 'react'
import { Outlet } from 'react-router'
import { Header, Home, SideBar } from '../index.js'

export default function Layout() {
    return (
        <div>
            <Header />
            <div className='flex'>
                <SideBar />
                <Home />
                <Outlet />
            </div>
        </div>
    )
}
