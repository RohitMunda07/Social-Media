import React from 'react'
import { Outlet } from 'react-router'
import { ContentSection, Header, Home, SideBar } from '../index.js'

export default function Layout() {
    return (
        <div>
            <Header />
            <div className='h-[90vh] flex w-full min-h-full'>
                <SideBar />
                <ContentSection />
            </div>
        </div>
    )
}
