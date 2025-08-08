import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
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

import './style.css';
import { useNavigate } from 'react-router';

export default function Header() {
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

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
    

    return (
        <div className='bg-[whitesmoke] px-20 py-4 flex items-center justify-between !w-full'>
            {/* logo */}
            <div
                onClick={() => navigate('/')}
            >
                <img src="./logo.png" alt="logo" className=' cursor-pointer w-15 h-15 rounded-4xl' />
            </div>

            {/* search Bar */}
            <div className='space-x-8'>
                <input
                    type="text"
                    className='border-2 border-black w-xl px-10 py-3 rounded-2xl'
                    placeholder='Search'
                />
                <Button variant="contained" startIcon={<SearchIcon />}>
                    Search
                </Button>
            </div>

            {/* right section */}
            <div className='flex items-center gap-5'>
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
                        <LogoutIcon fontSize="small" className='mr-2' />
                        Logout
                    </MenuItem>
                </Menu>
            </div>
        </div>
    );
}
