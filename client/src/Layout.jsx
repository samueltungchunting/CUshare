import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './share/Header'

const Layout = () => {
  return (
    <div className='py-4 px-8 lg:px-20 md:px-14 sm:px-10 flex flex-col min-h-screen max-w-[1280px] mx-auto'>
        <Header />
        <Outlet />
    </div>
  )
}

export default Layout