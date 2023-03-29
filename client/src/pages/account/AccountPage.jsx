import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { UserContext } from '../../UserContext'
import AccommodationsPage from './accommodation/AccommodationsPage'
import BookingsPage from './booking/BookingsPage'
import AccountNavbar from './components/AccountNavbar'


const AccountPage = () => {
    const { user, ready, setUser } = useContext(UserContext)
    const [logoutRedirect, setLogoutRedirect] = useState(null)
    console.log(ready);

    async function handleLogout() {
        await axios.post('/logout')
        setLogoutRedirect('/')
        setUser(null)
    }

    if(!ready) {
        return 'loading...'
    } 

    if(ready && !user && logoutRedirect) {
        return <Navigate to={'/login'} />
    }

    if(logoutRedirect) {
        return <Navigate to={logoutRedirect} />
    }


  return (
    <div className='flex flex-col items-center'>
        <AccountNavbar />

        <div className='mt-8'>
            <button onClick={handleLogout} className='rounded-full bg-primary py-2 px-4 text-white hover:underline'>Log out</button>
        </div>
    </div>
  )
}

export default AccountPage