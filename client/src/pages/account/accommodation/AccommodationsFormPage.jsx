import React, { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom';
import axios from 'axios'
import Perks from '../../../share/Perks';
import { Alert, AlertTitle } from '@mui/material';

const AccommodationsFormPage = () => {

  const { placeId } = useParams()
  useEffect(() => {
    if(!placeId) return

    axios.get(`/single-accommodation/${placeId}`).then(res => {
      const { data: singlePlaceData } = res
      const { owner, title, address, 
        photos, description, perks, extraInfo, 
        checkIn, checkOut, maxGuest, price} = singlePlaceData
      setTitle(title)
      setAddress(address)
      setAddedPhotos(photos)
      setDescription(description)
      setPerks(perks)
      setExtraInfo(extraInfo)
      setCheckIn(checkIn)
      setCheckOut(checkOut)
      setMaxGuests(maxGuest)
      setPrice(price)
      setHighlight(photos[0])
    })
  }, [placeId])

  const [title,setTitle] = useState('');
  const [address,setAddress] = useState('');
  const [photoLink, setPhotoLink] = useState(""); // this line gonna delete later
  const [addedPhotos,setAddedPhotos] = useState([]);
  const [description,setDescription] = useState('');
  const [perks,setPerks] = useState([]);
  const [extraInfo,setExtraInfo] = useState('');
  const [checkIn,setCheckIn] = useState('');
  const [checkOut,setCheckOut] = useState('');
  const [maxGuests,setMaxGuests] = useState(1);
  const [price,setPrice] = useState(100);

  const [redirectToAccommodations, setRedirectToAccommodations] = useState(false)
  const [highlight, setHighlight] = useState()

    function handleSaveAccommodationsForm(e) { // handling post/put request
      e.preventDefault()

      console.log("HI");

      const AccommodationsData = {
        title, address, photoLink, addedPhotos,
        description, perks, extraInfo, checkIn,
        checkOut, maxGuests, price
      }

      if(placeId) {
        axios.put(`/single-accommodation`, {
          placeId, 
          ...AccommodationsData,
        }).then(res => {
          alert(res.data)
          setRedirectToAccommodations(true)
        })
      } else {
        axios.post('/user-accommodation', AccommodationsData).then(res => {
          alert("Added Successfully!")
          setRedirectToAccommodations(true)
        })
      }
    }

    if(redirectToAccommodations) {
      return <Navigate to={'/account/accommodations'} />
    }

    async function handleUploadByLink(e) {
      e.preventDefault() // avoid page reload

      const { data:fileName } = await axios.post('/upload-by-link', {
        link: photoLink
      })

      setPhotoLink("")

      if(fileName.includes("[ERR_")) {
        console.log("Invalid Link")
        return
      }

      // setAddedPhotos([...prev, data]) // This doesn't work, ==> WHAT is the prev??
      setAddedPhotos(prev => {
        return [...prev, fileName]
      })
    }

    function inputHeader(title) {
      return <h2 className='text-2xl mt-4'>{title}</h2>
    }

    function inputDescription(text) {
      return <p className='text-sm text-gray-500'>{text}</p>
    }

    function preInput(title, text) {
      return (
        <>
          {inputHeader(title)}
          {inputDescription(text)}
        </>
      )
    }

    function handleUploadPhoto(e) {
      const {files} = e.target
      // console.log(files);
      const data = new FormData()
      for(let i = 0; i < files.length; i++)
        data.append('photos', files[i])
      // console.log(data);
      axios.post('/upload-by-click', data, {
        headers: {'Content-type': 'multipart/form-data'}
      }).then(res => {
        const {data} = res
        console.log(data);
        setAddedPhotos(prev => {
          return [...prev, ...data]
        }) 
      })
    }


    function deleteFormPhoto(link) {
      const photoListAfterDelete = addedPhotos.filter(photo => photo!== link)
      setAddedPhotos(photoListAfterDelete)
    }

    function highlightFormPhoto(link) {
      const photoListWithoutStar = addedPhotos.filter(photo => photo !== link)
      const sortedPhotoList = [link, ...photoListWithoutStar]
      setAddedPhotos(sortedPhotoList)
      setHighlight(sortedPhotoList[0])
    }


  return (
    <div>
      <form onSubmit={handleSaveAccommodationsForm}>
        {preInput('Title', 'Title for your place. should be short and catchy as in advertisement')}
        <input required type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="title, for example: My lovely apt"/>

        {preInput('Address', 'Address to this place')}
        <input type="text" value={address} onChange={ev => setAddress(ev.target.value)}placeholder="address"/>

        {preInput('Photos','More is better')} 
        {/* <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} /> */}


        <div className='flex items-center gap-1'>
          <input type="text" value={photoLink} onChange={ev => setPhotoLink(ev.target.value)} placeholder="upload image by link" />
          <p className='bg-gray-300 py-2 px-3 text-black rounded-2xl w-1/4 text-center cursor-pointer' onClick={handleUploadByLink}>Upload</p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4'>
          <label className='border rounded-2xl flex items-center justify-center cursor-pointer h-32'>
            <input type='file' className='hidden' multiple onChange={handleUploadPhoto}/>
            Upload
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
          </label>

          {addedPhotos.length > 0 && addedPhotos.map(link => (
            <div className='h-32 flex relative'>
              <img src={'http://localhost:4000/uploads/' + link} className="rounded-2xl object-cover w-full position-center" key={link}/>
              {/* <p>l{link}</p> */}

              <div className='absolute bottom-1 right-1 text-white bg-black bg-opacity-50 hover:bg-opacity-80 hover:bg-red-400 py-2 px-3 rounded-2xl cursor-pointer' onClick={() => deleteFormPhoto(link)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </div>

              <div className={`absolute bottom-1 left-1 text-white ${link === highlight? 'bg-yellow-400 bg-opacity-80': 'bg-black bg-opacity-50'} hover:bg-opacity-80 hover:bg-yellow-400 py-2 px-3 rounded-2xl cursor-pointer`} onClick={() => highlightFormPhoto(link)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill='none' viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
              </div>
            </div>
          ))}
        </div>


        {preInput('Description','Description of the place')}
        <textarea value={description} onChange={ev => setDescription(ev.target.value)} />

        {preInput('Perks','Select all the perks of your place')}
        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <Perks perks={perks} setPerks={setPerks} />
        </div>

        {preInput('Extra info','house rules, etc')}
        <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />

        {preInput('Check in & out times','add check in and out times, remember to have some time window for cleaning the room between guests')}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Check in time</h3>
            <input type="text"
                   value={checkIn}
                   onChange={ev => setCheckIn(ev.target.value)}
                   placeholder="14:00" />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Check out time</h3>
            <input type="text"
                   value={checkOut}
                   onChange={ev => setCheckOut(ev.target.value)}
                   placeholder="12:00" />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Max number of guests</h3>
            <input type="number" value={maxGuests}
                   onChange={ev => setMaxGuests(ev.target.value)}/>
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price per night</h3>
            <input type="number" value={price}
                   onChange={ev => setPrice(ev.target.value)}/>
          </div>
        </div>
        <button className="primary w-full rounded-xl bg-primary text-white py-2 px-4 my-4">Save</button>
      </form>
    </div>
  )
}

export default AccommodationsFormPage


        // <Alert severity="success" className='absolute' onChange={() => console.log("123123123123123")}>
        //   <AlertTitle>Success!</AlertTitle>
        //   This is a success alert — <strong>check it out!</strong>
        // </Alert>