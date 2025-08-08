import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route, Router } from 'react-router'
import Notification from './Pages/Notification.jsx'
import { Home, Setting, UserProfile } from './index.js'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='/' index={true} element={<Home />} />
          <Route path='/notifications' element={<Notification />} />
          <Route path='/user-profile' element={<UserProfile />} />
          <Route path='/settings' element={<Setting />} />
        </Route>
      </Routes>
    </StrictMode>
  </BrowserRouter>

)
