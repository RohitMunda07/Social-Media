import React, { useEffect, useState } from 'react'
import MenuItem from '@mui/material/MenuItem';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Switch from '@mui/material/Switch';
import { ListItemIcon, ListItemText } from '@mui/material';


export default function DarkModeToggle() {
    const [darkMode, setDarkMode] = useState(
        () => localStorage.getItem("theme") === "dark"
    )

    // const [darkMode, setDarkMode] = useState(false);

    const handleThemeToggle = () => {
        setDarkMode(!darkMode);
        // OPTIONAL: Trigger actual theme switch logic here
    };

    useEffect(() => {
        const root = document.documentElement;
        if (darkMode) {
            root.classList.add("dark")
            localStorage.setItem("theme", "dark")
        }
        else {
            root.classList.remove("dark")
            root.classList.add("theme", "light")
            localStorage.setItem("theme", "light")
        }
    }, [darkMode])
    return (
        <MenuItem>
            <ListItemIcon>
                <Brightness4Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{darkMode ? "Light Mode" : "Dark Mode"}</ListItemText>
            <Switch checked={darkMode} onChange={handleThemeToggle}
                onClick={() => setDarkMode((prev) => !prev)}
            />
        </MenuItem>
    )
}
