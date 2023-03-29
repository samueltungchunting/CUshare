import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../UserContext'

const Header = () => {

    const { user } = useContext(UserContext)

  return (
    <div className="flex justify-between items-center border-b pb-4">

        <Link to={'/'} className='logo flex items-center gap-1 hover:bg-gray-100 rounded-2xl px-3 py-2'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.75" stroke="#F5385D" class="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
            </svg>
            <span className="font-bold text-xl text-primary">eyb0ss Booking</span>
        </Link>

        {/* <div className='flex border border-gray-300 rounded-full shadow-md'>
            <div className='px-2 py-1'>Anywhere</div>
            <div className="border-l border-gray-300"></div>
            <div className='px-2 py-1'>Any week</div>
            <div className="border-l border-gray-300"></div>
            <div className='px-2 py-1'>Add guests</div>
        </div> */}
        <Link to={user? '/account/bookings' : '/login'} className="border rounded-full bg-gray-200 py-1 px-2">
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