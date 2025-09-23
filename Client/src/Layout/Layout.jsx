import { Outlet } from "react-router";
import { Header, SideBar, SignIn } from "../index.js";

export default function Layout() {
    return (
        <div className='min-h-screen'>
            <Header />
            <div id="grid-container" className='container mx-auto w-full !min-h-screen '>
                <aside className="sticky top-0 left-0">
                    <SideBar />
                </aside>
                <main className="!text-black px-5 py-3">
                   <Outlet />
                </main>
                {/* <aside className="bg-amber-400">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi saepe vero quod inventore cum ratione provident maiores vel esse. Aut doloremque dicta omnis nam at, itaque ratione totam vitae sapiente?
                </aside> */}
            </div>
        </div>
    )
}

{/* <Outlet /> */ }
