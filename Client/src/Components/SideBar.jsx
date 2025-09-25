import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import PublicIcon from "@mui/icons-material/Public";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

export default function SideBar() {
    const [showCommunity, setShowCommunity] = useState(false);
    const [showRecent, setShowRecent] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    // Example data (could come from props or API later)
    const mainMenu = [
        { label: "Home", icon: <HomeIcon /> },
        { label: "Explore", icon: <PublicIcon /> },
        { label: "Trending", icon: <LocalFireDepartmentIcon /> },
        { label: "Sports", icon: <SportsSoccerIcon /> },
    ];

    const communities = ["DevTalk", "AI Hub", "React Devs", "Tailwind Nation"];
    const recents = ["@rohit", "@mukesh", "@jane", "@john"];

    return (
        <section className="relative h-full">
            {/* Mobile Menu Icon */}
            <div
                id="menuIcon"
                className="sticky top-0 z-[10000] p-2 cursor-pointer bg-white shadow-md rounded-full md:hidden"
                onClick={() => setShowMenu((prev) => !prev)}
            >
                {showMenu ? <CloseIcon /> : <MenuIcon />}
            </div>

            {/* Mobile Side Menu */}
            <div
                id="sideMenu"
                className={`fixed top-10 pt-20 left-0 h-screen w-[80vw] bg-[whitesmoke] shadow-xl z-[9999] p-6 transform transition-transform duration-300 ease-in-out 
                ${showMenu ? "translate-x-0" : "-translate-x-full"} 
                md:hidden`}>

                {/* Main Menu */}
                <ul className="space-y-3 mb-6">
                    {mainMenu.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 font-medium hover:text-blue-600">
                            {item.icon} {item.label}
                        </li>
                    ))}
                </ul>

                {/* Communities */}
                <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
                    <h2
                        className="cursor-pointer font-semibold flex items-center justify-between"
                        onClick={() => setShowCommunity((prev) => !prev)}
                    >
                        Communities {showCommunity ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                    </h2>
                    {showCommunity && (
                        <ul className="mt-3 space-y-2 max-h-40 overflow-y-auto text-sm">
                            {communities.map((name, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-gray-300 rounded-full" />
                                    {name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Recent */}
                <div className="bg-white rounded-2xl shadow-sm p-4">
                    <h2
                        className="cursor-pointer font-semibold flex items-center justify-between"
                        onClick={() => setShowRecent((prev) => !prev)}
                    >
                        Recent {showRecent ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                    </h2>
                    {showRecent && (
                        <ul className="mt-3 space-y-2 max-h-40 overflow-y-auto text-sm">
                            {recents.map((user, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <PersonIcon fontSize="small" /> {user}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Desktop Sidebar */}
            <aside
                id="sideBar"
                className="hidden md:block h-screen bg-white p-6 sticky left-0 top-18"
            >
                {/* Main Menu */}
                <ul className="space-y-3 mb-6 bg-[whitesmoke] rounded-2xl p-4">
                    {mainMenu.map((item, i) => (
                        <li key={i} className="flex items-center gap-3 leading-8 font-medium px-3 py-1 rounded-lg hover:bg-gray-300">
                            {item.icon} {item.label}
                        </li>
                    ))}
                </ul>

                {/* Communities */}
                <div className="bg-[whitesmoke] rounded-2xl p-4 mb-6">
                    <h2
                        className="cursor-pointer font-semibold flex items-center justify-between"
                        onClick={() => setShowCommunity((prev) => !prev)}
                    >
                        Communities {showCommunity ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                    </h2>
                    {showCommunity && (
                        <ul className="mt-3 space-y-2 max-h-40 overflow-y-auto text-sm">
                            {communities.map((name, i) => (
                                <li key={i} className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-gray-300">
                                    <div className="w-6 h-6 bg-gray-300 rounded-full" />
                                    {name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Recent */}
                <div className="bg-[whitesmoke] rounded-2xl p-4">
                    <h2
                        className="cursor-pointer font-semibold flex items-center justify-between"
                        onClick={() => setShowRecent((prev) => !prev)}
                    >
                        Recent {showRecent ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                    </h2>
                    {showRecent && (
                        <ul className="mt-3 space-y-2 max-h-40 overflow-y-auto text-sm">
                            {recents.map((user, i) => (
                                <li key={i} className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-gray-300">
                                    <PersonIcon fontSize="small" /> {user}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </aside>
        </section>
    );
}
