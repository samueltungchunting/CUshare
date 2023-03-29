import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AccountNavbar from '../components/AccountNavbar';
import AccommodationsFormPage from './AccommodationsFormPage';
import axios from 'axios';
import './AccommodationsPage.css'

const AccommodationsPage = () => {

  const [accommodationList, setAccommodationList] = useState([])

  useEffect(() => {
    axios.get('/user-accommodations').then((res) => {
      const { data: userAccommodations } = res
      setAccommodationList(userAccommodations)
    })
  }, [])

  return (
    <div className='flex flex-col items-center'>
        <AccountNavbar />

        <Link to={'/account/accommodations/new'} className="inline-flex gap-2 bg-primary text-white py-2 px-4 rounded-full mt-8">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add new
        </Link>

        <div className='flex flex-col items-center w-full gap-2 mt-8 bg-gray-100 pt-8'>
          {accommodationList.length > 0 && accommodationList.map((place) => {
            return <Link to={'/account/accommodations/' + place._id} className='PlaceItem_shadow flex gap-4 rounded-2xl p-4 w-[80%] items-center' key={place._id}> {/* min-w-[400px] min-h-[140px] lg:w-[70%] md:w-[90%] */}
              <div className='flex h-32 w-32 bg-gray-100 shrink-0'>
                {place.photos.length > 0 && <img src={'http://localhost:4000/uploads/' + place.photos[0]} className='object-cover object-center'/>} {/* 'http://localhost:4000/uploads/' + place.photos[0]}*/}
              </div>
              <div className='shrink'>
                <p className='text-xl font-bold'>{place.title}</p>
                <p className='text-md mt-2'>{place.address}</p>
                <p className='text-sm mt-2'>{place.description}</p>
              </div>
            </Link>
          })}
        </div>
    </div>
  )
}

export default AccommodationsPage