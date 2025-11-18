import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AddIcon from '@mui/icons-material/Add';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Switch from '@mui/material/Switch';
import { ListItemIcon, ListItemText } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAuthStatus, setAuthStatus } from '../Context/auth.slice.js';
import SearchBar from './SearchBar.jsx';

import './style.css';
import DarkModeToggle from './DarkModeToggle.jsx';
import { post, get } from '../APIs/api.js';

export default function Header() {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const authStatus = useSelector((state) => state.auth.authStatus);
    const dispatch = useDispatch();
    const [headerAvatar, setHeaderAvatar] = useState(null)

    const backToLogin = async () => {
        handleMenuClose()
        dispatch(setAuthStatus(false))
        localStorage.clear();
        try {
            await post("users/logout")
            dispatch(setAuthStatus(false))
            sessionStorage.clear();
            console.log("auth status:", authStatus);
            console.log("Logout response:", res.data);
            navigate('/sign-in')

        } catch (error) {
            console.log("Something went wrong");
        }
    }

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    
    const handleNavigateToProfile = () => {
        navigate('/user-profile')
        handleMenuClose()
    }

    const handleNavigateToSetting = () => {
        navigate('/settings')
        handleMenuClose()

    }

    useEffect(() => {
        console.log("back to login page authStatus:", authStatus);
    }, [authStatus])

    useEffect(() => {
        const avatar = JSON.parse(localStorage.getItem("localUserDetails"))?.avatar || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/diverse-user-avatars-jNaliJbW5b5ccprrlYjj99XE0SOY9L.png"
        setHeaderAvatar(avatar)
    }, [])


    return (
        <div className='w-full bg-[whitesmoke] sticky top-0 z-50 dark:bg-primary-dark dark:text-white'>
            <div className='container mx-auto flex items-center justify-between'>
                {/* logo */}
                <div
                    onClick={() => navigate('/')}
                >
                    <img id='logo' src="./logo.svg" alt="logo" className=' cursor-pointer w-[8rem] rounded-4xl' />
                </div>

                {/* search Bar */}
                <SearchBar />

                {/* right section */}
                {authStatus ?
                    (<div className='flex items-center leading-0 mr-2 gap-x-1.5'>
                        {/* create */}
                        <div className='nav_right !px-2'
                            onClick={() => navigate('/create-post')}
                        >
                            <AddIcon /> Create
                        </div>

                        {/* notification */}
                        <div className='nav_right'
                            onClick={() => navigate('/notifications')}
                        >
                            <NotificationsNoneIcon />
                        </div>

                        {/* user profile with dropdown */}
                        <div className='nav_right cursor-pointer' onClick={handleMenuOpen}>
                            <img id='userProfile-img' src={headerAvatar} alt="pic" className='w-8 h-8 rounded-full bg-gray-300' />
                        </div>

                        {/* Dropdown Menu */}
                        <Menu
                            anchorEl={anchorEl} // Position the menu relative to this element
                            open={Boolean(anchorEl)} // Open only when anchorEl is not null
                            onClose={handleMenuClose} // Close when clicking away or on item
                            disableScrollLock={true}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <MenuItem onClick={handleNavigateToProfile} disableGutters disableRipple>
                                <span>
                                    <AccountCircleIcon fontSize="small" className='mr-2' />
                                    Profile
                                </span>
                            </MenuItem>

                            <MenuItem onClick={handleMenuClose} disableRipple disableGutters>
                                <DarkModeToggle />
                            </MenuItem>

                            <MenuItem onClick={handleNavigateToSetting} disableRipple disableGutters>
                                <span>
                                    <SettingsIcon fontSize="small" className='mr-2' />
                                    Settings
                                </span>
                            </MenuItem>

                            <MenuItem onClick={backToLogin} disableRipple disableGutters>
                                <span>
                                    <LogoutIcon fontSize="small" className='mr-2' />
                                    Logout
                                    {/* {console.log(authStatus)} */}
                                </span>
                            </MenuItem>
                        </Menu>
                    </div>) : (
                        <Button
                            onClick={() => navigate('/sign-in')}
                            variant="contained"
                            startIcon={<LoginIcon />}>
                            Login
                        </Button>
                    )
                }
            </div>

        </div>
    );
}
