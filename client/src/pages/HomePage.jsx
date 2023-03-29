import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {

  useEffect(() => {
    axios.get('/all-accommodations').then(res => {
      setAllAccommodationsInfo(res.data)
    })
  }, [])

  const [allAccommodationsInfo, setAllAccommodationsInfo] = useState([])

  return (
    <div className='mt-12'>
      {/* {allAccommodationsInfo[0].title} */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
        {allAccommodationsInfo.length > 0  && allAccommodationsInfo.map(place => (
          <Link to={`/place/${place._id}`} className='mt-4' key={place._id}>
            {/* Preview image */}
            <div className='flex flex-col bg-gray-100'>
              <img src={'http://localhost:4000/uploads/' + place.photos[0]} className='aspect-square object-cover rounded-2xl'/>
            </div>
            <div className='mt-2'>
              <h4 className='font-[500] truncate'>{place.title}</h4>
              <p className='font-[300] text-sm text-gray-500 flex items-center gap-1'>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </span>
                {place.address}
              </p>
              <p><span className='font-[500]'>${place.price} HKD</span> <span className='font-[300]'>night</span></p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default HomePage