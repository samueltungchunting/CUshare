import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AccountNavbar from '../components/AccountNavbar';
import axios from 'axios';
import './MyitemsPage.css'
import { format } from "date-fns";

const MyItemsPage = () => {

  const [itemsList, setItemsList] = useState([])

  useEffect(() => {
    axios.get('/user-items').then((res) => {
      const { data: userItmesData } = res
      setItemsList(userItmesData)
    })
  }, [])

  function displayBorrowReturnDate(free, borrowDate, returnDate) {
    if(free) {
      return <p className='text-green-700 text-xl mt-2 font-semibold'>Free</p>
    }
    return (
      <p className='flex items-center gap-1 text-gray-700 text-md mt-2'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" className="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className=''>{format(new Date(borrowDate), 'yyyy-MM-dd')} &#8594; {format(new Date(returnDate), 'yyyy-MM-dd')}</span>
      </p>
    )
  }

  return (
    <div className='flex flex-col items-center'>
        {/* <AccountNavbar /> */}

        <Link to={'/account/my-items/new'} className="inline-flex gap-2 bg-primary text-white py-2 px-4 rounded-full mt-8">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add new
        </Link>

        <div className='flex flex-col items-center w-full gap-2 mt-8 bg-gray-100 py-8'>
          {itemsList.length > 0 && itemsList.map((item) => {
            return <Link to={'/account/my-items/' + item._id} className='myItem_shadow flex gap-4 rounded-2xl p-4 w-[80%] items-center' key={item._id}> {/* min-w-[400px] min-h-[140px] lg:w-[70%] md:w-[90%] */}
              <div className='flex h-32 w-32 bg-gray-100 shrink-0'>
                {item.photos.length > 0 && <img src={'http://localhost:4000/uploads/' + item.photos[0]} className='object-cover object-center aspect-square'/>} {/* 'http://localhost:4000/uploads/' + item.photos[0]}*/}
              </div>
              <div className='shrink'>
                <p className='text-xl font-bold'>{item.title}</p>
                <p className='text-md mt-2 text-gray-700 flex items-center gap-1'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" className="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {item.address}
                </p>
                {displayBorrowReturnDate(item.free, item.borrowDate, item.returnDate)}
              </div>
            </Link>
          })}
        </div>
    </div>
  )
}

export default MyItemsPage