import React from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router'


function NotFound() {
    const navigate = useNavigate()
    return (
        <div className='flex self-center bg-amber-800'>
            <h1>404 Page Not Found</h1>
            <Button
                variant='contained'
                onClick={() => navigate('/sign-in')}
            >
                Sign In
            </Button>
        </div>
    )
}

export default NotFound
