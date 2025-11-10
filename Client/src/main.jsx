import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // <-- should be react-router-dom
import Notification from './Pages/Notification.jsx';
import { Home, NotFound, Setting, SignIn, UserProfile, SignUp } from './index.js';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Testing from './Components/Testing.jsx';
import { Provider } from 'react-redux';
import { store } from './Context/store.js';
import Layout from './Layout/Layout.jsx';
import CreatePost from './Pages/CreatePost.jsx';
import UpdatePage from './Pages/UpdatePage.jsx';
import UpdateEmailPhone from './Pages/UpdateEmailPhone.jsx'
import UpdatePassword from './Pages/UpdatePassword.jsx';
import DeleteAccountPage from './Pages/DeleteAccount.jsx';
import UpdatePostPage from './Pages/UpdatePost.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId="957078788537-3531ub1ftm7gc1pefm8mmoch0j2nrj1p.apps.googleusercontent.com">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Home />} />
              <Route path="/notifications" element={<Notification />} />
              <Route path="/layout" element={<Layout />} />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/settings" element={<Setting />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/update-post" element={<UpdatePostPage />} />
              <Route path="/testing" element={<Testing />} />
              <Route path='/settings/update-user-profile' element={<UpdatePage />} />
              <Route path='/settings/update-email-phone' element={<UpdateEmailPhone />} />
              <Route path='/settings/update-password' element={<UpdatePassword />} />
              <Route path='/settings/delete-account' element={<DeleteAccountPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>
);
