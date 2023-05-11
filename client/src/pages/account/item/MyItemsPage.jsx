import React, { useEffect, useState, useReducer } from 'react'
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

  async function handleDeleteMyItem(itemID, itemTitle) {
    const confirmed = window.confirm(`Are you sure you want to delete ${itemTitle}`)
    if(confirmed) {
      const deleteItems = await axios.delete(`/user-deleteItems/${itemID}`)
      setItemsList(prev => prev.filter(item => item._id !== itemID))
    } else return
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
            return <div className='myItem_shadow flex gap-4 rounded-2xl p-4 w-[80%] items-center relative' key={item._id}> {/* min-w-[400px] min-h-[140px] lg:w-[70%] md:w-[90%] */}
              <div className='absolute top-4 right-4 flex gap-4'>
                {/* Edit Item Button */}
                <Link to={'/account/my-items/' + item._id} className='rounded-xl flex items-center bg-gray-300 hover:bg-yellow-200 px-3 py-2'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </Link>
                {/* Delete Item Button */}
                <div className='rounded-xl flex items-center bg-gray-300 hover:bg-red-200 hover:text-[#333] cursor-pointer px-3 py-2' onClick={() => handleDeleteMyItem(item._id, item.title)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </div>
              </div>

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
            </div>
          })}
        </div>
    </div>
  )
}

export default MyItemsPage