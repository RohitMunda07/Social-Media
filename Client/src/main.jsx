import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route, Router } from 'react-router'
import Notification from './Pages/Notification.jsx'
import { Home, NotFound, Setting, SignIn, UserProfile } from './index.js'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Testing from './Components/Testing.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <GoogleOAuthProvider
        clientId="957078788537-3531ub1ftm7gc1pefm8mmoch0j2nrj1p.apps.googleusercontent.com"
      >
        <Routes>
          <Route path='/' element={<App />}>
            <Route path='/' index={true} element={<Home />} />
            <Route path='/notifications' element={<Notification />} />
            <Route path='/user-profile' element={<UserProfile />} />
            <Route path='/settings' element={<Setting />} />
            <Route path='/sign-in' element={<SignIn />} />
            <Route path='/testing' element={<Testing />} />
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
      </GoogleOAuthProvider>
    </StrictMode>
  </BrowserRouter>
)
