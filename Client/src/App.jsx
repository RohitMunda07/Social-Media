import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Layout from './Layout/Layout'
import './App.css'
import { Outlet } from 'react-router'
import { ChatProvider } from './Context/chat.context.jsx'

function App() {
  useEffect(() => {
    window.addEventListener("storage", (event) => {
      if (event.key === "logout_event") {
        sessionStorage.clear();
        window.location.reload();
      }
    });
  }, []);


  return (
    <ChatProvider>
      <Layout />
    </ChatProvider>
  )
}

export default App
