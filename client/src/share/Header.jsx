import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AccountNavbar from '../pages/account/components/AccountNavbar'
import { UserContext } from '../UserContext'
import './Header.css'

const Header = () => {

    const { user } = useContext(UserContext)

  return (
    <div className="flex justify-between items-center border-b pb-4">

        <Link to={'/'} className='logo flex items-center gap-2 hover:bg-gray-100 rounded-2xl px-3 py-2'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="#750F6D" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <span className="font-bold text-xl text-primary">CUshare</span>
        </Link>

        <AccountNavbar />

        {/* <div className='flex border border-gray-300 rounded-full shadow-md'>
            <div className='px-2 py-1'>Anywhere</div>
            <div className="border-l border-gray-300"></div>
            <div className='px-2 py-1'>Any week</div>
            <div className="border-l border-gray-300"></div>
            <div className='px-2 py-1'>Add guests</div>
        </div> */}
        <Link to={user? '/account' : '/login'} className="border items-center rounded-full bg-gray-200 py-1 px-2 ">
            <div className="flex gap-2 justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" class="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {!!user && <div className='font-[500]'>{user.name}</div>}
            </div>
        </Link>

    </div>
  )
}

export default Header