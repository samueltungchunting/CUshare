import React, { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom';
import axios from 'axios'
import Cautions from '../../../share/Cautions';
import { Alert, AlertTitle } from '@mui/material';

const MyItemFormPage = () => {

  const { itemId } = useParams()
  useEffect(() => {
    if(!itemId) return

    axios.get(`/single-item/${itemId}`).then(res => {
      const { data: singleItemData } = res
      const { owner, title, address, 
        photos, description, cautions, extraInfo, 
        borrowDate, returnDate, free, charge} = singleItemData
      setTitle(title)
      setAddress(address)
      setAddedPhotos(photos)
      setDescription(description)
      setCautions(cautions)
      setExtraInfo(extraInfo)
      setFree(free)
      setBorrowDate(borrowDate.slice(0, 10))
      setReturnDate(returnDate.slice(0, 10))
      setCharge(charge)

      setHighlight(photos[0])
    })
  }, [itemId])

  // const currentDate = new Date().toISOString().slice(1, 10)

  const [title,setTitle] = useState('');
  const [address,setAddress] = useState('');
  const [photoLink, setPhotoLink] = useState(""); // this line gonna delete later
  const [addedPhotos,setAddedPhotos] = useState([]);
  const [description,setDescription] = useState('');
  const [cautions,setCautions] = useState([]);
  const [extraInfo,setExtraInfo] = useState('');
  const [free, setFree] = useState(false);
  const [borrowDate,setBorrowDate] = useState(new Date().toISOString().slice(0, 10));
  const [returnDate,setReturnDate] = useState(new Date().toISOString().slice(0, 10));
  const [charge,setCharge] = useState(100);

  const [redirectToListingItems, setRedirectToListingItems] = useState(false)
  const [highlight, setHighlight] = useState()

    function handleSaveItemsForm(e) { // handling post/put request
        e.preventDefault()

        const itemData = {
          title, address, addedPhotos,
          description, cautions, extraInfo, 
          borrowDate, returnDate, charge, free
        }

        if(itemId) {
          axios.put(`/single-item`, {
            itemId, 
            ...itemData,
          }).then(res => {
            alert(res.data)
            setRedirectToListingItems(true)
          })
        } else {
          axios.post('/user-item', itemData).then(res => {
            alert("Added Successfully!")
            setRedirectToListingItems(true)
          })
        }
    }

    if(redirectToListingItems) {
      return <Navigate to={'/account/my-items'} />
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
      <form onSubmit={handleSaveItemsForm}>
        {preInput('Title*', 'Title for your item. should be short and catchy')}
        <input required type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="title, for example: Mahjong Table"/>

        {preInput('Address', 'Address (inside CUHK is perfered) to wait for each other')}
        <input type="text" value={address} onChange={ev => setAddress(ev.target.value)}placeholder="address, for example: UC Canteen"/>

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


        {preInput('Description','Description of the item')}
        <textarea value={description} onChange={ev => setDescription(ev.target.value)} />

        {preInput('*Free*', 'giving out this item for free?')}
        <div className='grid grid-cols-4'>
          <label className='border p-4 flex rounded-2xl gap-2 items-center cursor-pointer'>
            <input type='checkbox' checked={free} name='free' onChange={(ev) => setFree(ev.target.checked)}/>
            <span>Yes, free</span>
          </label>
        </div>

        {preInput('Extra info','rules for borrowing, etc')}
        <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />

        <div className={free? 'hidden': 'mt-4'}>
          {preInput('Cautions','Select all the cautions of your item')}
          <div className="grid mt-2 gap-2 grid-cols-2 lg:grid-cols-4">
            <Cautions cautions={cautions} setCautions={setCautions} />
          </div>
        </div>

        <div className={free? 'hidden': 'mt-8'}>
          {preInput('Borrow & Return date','add the available borrow date and the return day')}
          <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="mt-2 -mb-1">Borrow date (click the icon)</h3>
              <input type="date"
                    className='w-full border my-1 py-2 px-3 rounded-2xl'
                    value={borrowDate}
                    onChange={ev => setBorrowDate(ev.target.value)}/>
            </div>
            <div>
              <h3 className="mt-2 -mb-1">Return date (click the icon)</h3>
              <input type="date"
                    className='w-full border my-1 py-2 px-3 rounded-2xl'
                    value={returnDate}
                    onChange={ev => setReturnDate(ev.target.value)}/>
            </div>
            {/* <div>
              <h3 className="mt-2 -mb-1">Max number of guests</h3>
              <input type="number" value={maxGuests}
                    onChange={ev => setMaxGuests(ev.target.value)}/>
            </div> */}
            <div>
              <h3 className="mt-2 -mb-1">Fine charge for late return ($)/day</h3>
              <input type="number" 
                    value={charge}
                    onChange={ev => setCharge(ev.target.value)}
                    placeholder='eg. $150'/>
            </div>
          </div>
        </div>

        <button className="primary w-full rounded-xl bg-primary text-white py-2 px-4 my-4">Save</button>
      </form>
    </div>
  )
}

export default MyItemFormPage