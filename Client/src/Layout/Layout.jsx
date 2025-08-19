import { Outlet } from "react-router";
import { Header, SideBar, SignIn } from "../index.js";

export default function Layout() {
    return (
        <div className='min-h-screen'>
            <Header />
            <div className='flex w-full items-center'>
                <SideBar />
                <main className='flex-1'>
                    <Outlet /> {/* Move Outlet here instead of ContentSection */}
                </main>
            </div>
        </div>
    )
}