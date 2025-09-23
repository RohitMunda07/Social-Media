import React, { useState } from 'react'
import HomeIcon from '@mui/icons-material/Home';
import PublicIcon from '@mui/icons-material/Public';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PersonIcon from '@mui/icons-material/Person';

export default function SideBar() {
    const [showCommunity, setShowCommunity] = useState(false);
    const [showRecent, setShowRecent] = useState(false);
    return (
        <section className="!sticky top-15 left-0">
            {/* Left Section (Sticky Sidebar) */}
            <div className='h-full text-start bg-white p-4'>
                <ul className='left_menu space-y-2 mt-5 bg-[whitesmoke] rounded-3xl px-2 py-3'>
                    <li><HomeIcon className="mr-2" /> Home</li>
                    <li><PublicIcon className="mr-2" /> Explore</li>
                    <li><LocalFireDepartmentIcon className="mr-2" /> Trending</li>
                    <li><SportsSoccerIcon className="mr-2" /> Sports</li>
                    <li className='text-center'>All</li>
                </ul>

                {/* Communities Section */}
                <div className='community mt-5 bg-[whitesmoke] rounded-3xl'>
                    <div className='px-5 py-5'>
                        <h2
                            className='cursor-pointer font-semibold flex items-center justify-between'
                            onClick={() => setShowCommunity((prev) => !prev)}
                        >
                            Communities {showCommunity ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                        </h2>
                    </div>


                    <ul className={`${showCommunity ? 'block' : 'hidden'} left_menu space-y-1 h-42 overflow-y-auto`}>
                        <li className='flex items-center gap-2'>
                            <img src="#" alt="pic" className='w-6 h-6 rounded-full bg-gray-300' />
                            <p className='inline'>DevTalk</p>
                        </li>
                        <li className='flex items-center gap-2'>
                            <img src="#" alt="pic" className='w-6 h-6 rounded-full bg-gray-300' />
                            <p className='inline'>AI Hub</p>
                        </li>
                        <li className='flex items-center gap-2'>
                            <img src="#" alt="pic" className='w-6 h-6 rounded-full bg-gray-300' />
                            <p className='inline'>DevTalk</p>
                        </li>
                        <li className='flex items-center gap-2'>
                            <img src="#" alt="pic" className='w-6 h-6 rounded-full bg-gray-300' />
                            <p className='inline'>AI Hub</p>
                        </li>
                        <li className='flex items-center gap-2'>
                            <img src="#" alt="pic" className='w-6 h-6 rounded-full bg-gray-300' />
                            <p className='inline'>DevTalk</p>
                        </li>
                        <li className='flex items-center gap-2'>
                            <img src="#" alt="pic" className='w-6 h-6 rounded-full bg-gray-300' />
                            <p className='inline'>AI Hub</p>
                        </li>
                    </ul>
                </div>

                {/* Recent Section */}
                <div className='recent mt-4 bg-[whitesmoke] rounded-3xl px-2 py-3 '>
                    <div className='px-3 py-2'>
                        <h2
                            className='cursor-pointer font-semibold flex items-center justify-between'
                            onClick={() => setShowRecent((prev) => !prev)}
                        >
                            Recent {showRecent ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                        </h2>
                    </div>

                    <ul className={`${showRecent ? 'block' : 'hidden'} left_menu space-y-2 h-42 overflow-y-auto`}>
                        <li className='flex items-center gap-2'>
                            <PersonIcon />
                            <p className='inline'>@rohit</p>
                        </li>
                        <li className='flex items-center gap-2'>
                            <PersonIcon />
                            <p className='inline'>@mukesh</p>
                        </li>
                        <li className='flex items-center gap-2'>
                            <PersonIcon />
                            <p className='inline'>@rohit</p>
                        </li>
                        <li className='flex items-center gap-2'>
                            <PersonIcon />
                            <p className='inline'>@mukesh</p>
                        </li>
                        <li className='flex items-center gap-2'>
                            <PersonIcon />
                            <p className='inline'>@rohit</p>
                        </li>
                        <li className='flex items-center gap-2'>
                            <PersonIcon />
                            <p className='inline'>@mukesh</p>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    )
}
