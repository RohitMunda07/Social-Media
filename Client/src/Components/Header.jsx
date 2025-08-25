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
import { toggleAuthStatus } from '../Context/auth.slice.js';
import SearchBar from './SearchBar.jsx';

import './style.css';

export default function Header() {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const authStatus = useSelector((state) => state.auth.authStatus);
    const dispatch = useDispatch();

    const backToLogin = () => {
        dispatch(toggleAuthStatus())
        navigate('/sign-in')
    }

    const handleThemeToggle = () => {
        setDarkMode(!darkMode);
        // OPTIONAL: Trigger actual theme switch logic here
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleNavigateToProfile = () => {
        navigate('/user-profile')
    }

    const handleNavigateToSetting = () => {
        navigate('/settings')
    }

    useEffect(() => {
        console.log("back to login page authStatus:", authStatus);
    }, [authStatus])


    return (
        <div className='!w-[100vw] bg-[whitesmoke] px-20 py-4 fixed top-0 z-50 flex items-center justify-between '>
            {/* logo */}
            <div
                onClick={() => navigate('/')}
            >
                <img src="./logo.svg" alt="logo" className=' cursor-pointer w-[11.5rem] h-auto rounded-4xl' />
            </div>

            {/* search Bar */}
            <SearchBar />

            {/* right section */}
            {authStatus ?
                (<div className='flex items-center gap-5'>
                    {/* create */}
                    <div className='nav_right !px-2'>
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
                        <img src="./man.png" alt="pic" className='w-8 h-8 rounded-full bg-gray-300' />
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
                        <MenuItem onClick={handleMenuClose}>
                            <AccountCircleIcon fontSize="small" className='mr-2' />
                            <ListItemText onClick={handleNavigateToProfile}>Profile</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <MenuItem>
                                <ListItemIcon>
                                    <Brightness4Icon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Dark Mode</ListItemText>
                                <Switch checked={darkMode} onChange={handleThemeToggle} />
                            </MenuItem>
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <SettingsIcon fontSize="small" className='mr-2' />
                            <ListItemText onClick={handleNavigateToSetting}>Settings</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <LogoutIcon
                                onClick={() => backToLogin}
                                fontSize="small"
                                className='mr-2'
                            />
                            Logout
                            {console.log(authStatus)}
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
    );
}
