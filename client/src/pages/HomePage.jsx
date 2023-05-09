import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

const HomePage = () => {

  useEffect(() => {
    axios.get('/api/home_allItems').then(res => {
      setAllListingItemsInfo(res.data)
    })
  }, [])

  const [allListingItemsInfo, setAllListingItemsInfo] = useState([])

  function displayBorrowReturnDate(free, borrowDate, returnDate) {
    if(free) {
      return <p className='text-green-700 text-md font-semibold'>Free</p>
    }
    return (
      <p className='flex items-center gap-1 text-gray-500 text-sm mt-1'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" className="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className=''>{format(new Date(borrowDate), 'yyyy-MM-dd')} &#8594; {format(new Date(returnDate), 'yyyy-MM-dd')}</span>
      </p>
    )
  }

  return (
    <div className='mt-12'>
      {/* {allListingItemsInfo[0].title} */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
        {allListingItemsInfo.length > 0  && allListingItemsInfo.map(item => (
            <Link to={`/item/${item._id}`} className='mt-4' key={item._id}>
              {/* Preview image */}
              <div className='flex relative flex-col bg-gray-100 overflow-hidden rounded-2xl'>
                {item.isReserved && (
                  <>
                    <div className="absolute w-full h-full bg-gray-700 bg-opacity-70 text-white">{""}</div>
                    <span className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] text-white text-xl font-semibold'>Reserved</span>
                  </>
                )}
                <img src={'http://localhost:4000/uploads/' + item.photos[0]} className='aspect-square object-cover'/>
              </div>
              <div className='mt-2'>
                <h4 className='font-[500] truncate'>{item.title}</h4>
                <p className='font-[300] text-sm text-gray-500 flex items-center gap-1'>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" className="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </span>
                  {item.address}
                </p>
                {displayBorrowReturnDate(item.free, item.borrowDate, item.returnDate)}
              </div>
            </Link>
        ))}
      </div>
    </div>
  )
}

export default HomePage