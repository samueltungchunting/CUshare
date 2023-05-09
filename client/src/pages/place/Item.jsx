import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Navigate, useParams } from 'react-router-dom';
import { differenceInCalendarDays, format } from 'date-fns';

const Item = () => {

    const {itemId} = useParams()

    const [itemInfo, setItemInfo] = useState([])

    const [userBorrowDate, setUserBorrowDate] = useState()
    const [userReturnDate, setUserReturnDate] = useState()
    const [userName, setUserName] = useState()
    const [userPhoneNum, setUserPhoneNum] = useState()

    const [redirectToMyReservationsPage, setRedirectToMyReservationsPage] = useState(false)

    const [loadReady, setLoadReady] = useState(false)

    let numOfReserveDays = 0
    if(userBorrowDate && userReturnDate) {
        numOfReserveDays = differenceInCalendarDays(new Date(userBorrowDate), new Date(userReturnDate))
        numOfReserveDays = Math.abs(numOfReserveDays)
        console.log(numOfReserveDays);
    }


    useEffect(() => {
        axios.get(`/item-review/${itemId}`).then(res => {
            setItemInfo(res.data)
        }).then(() => setLoadReady(true))
    }, [])

    async function handleReserveItem() {
        try {
            const { data } = await axios.post('/reserve', {
                itemId, userBorrowDate, userReturnDate,
                userName, userPhoneNum, 
            })
            // console.log(data)
            alert("Reserved!")
            setRedirectToMyReservationsPage(true)
        } catch (err) {
            alert("Failed to reserve")
        }
    }

    if(redirectToMyReservationsPage) {
        return <Navigate to={'/account/my-reservations'} />
    }

    function selectCautionIcon(cautions) {
        switch(cautions) {
            case  'damage':
                return (
                    <div className='flex gap-3 py-3 px-3 items-center bg-gray-50 rounded-md'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
                        </svg>
                        <p>Don't damage it</p>
                    </div>
                )
                break;
            case 'lose':
                return (
                    <div className='flex gap-3 py-3 px-3 items-center bg-gray-50 rounded-md'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                        <p>Don't lose it</p>
                    </div>
                )
                break;
            case 'lend':
                return (
                    <div className='flex gap-3 py-3 px-3 items-center bg-gray-50 rounded-md'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                        </svg>
                        <p>Don't lend someone else</p>
                    </div>
                )
                break;
            case 're-borrow':
                return (
                    <div className='flex gap-3 py-3 px-3 items-center bg-gray-50 rounded-md'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                        </svg>
                        <p>Allow re-borrow</p>
                    </div>
                )
                break;
            default:
                break;
        }
    }


  return (
    <div className='mt-8'>
        {itemInfo && loadReady && (
            <div className=''>
                <h1 className='text-3xl font-[500] mb-2'>{itemInfo.title}</h1>
                <div className='flex items-center gap-1 mb-4'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.25" stroke="currentColor" className="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <p className='underline text-gray-700 cursor-pointer'>{itemInfo.address}, Hong Kong</p>
                </div>
                <div className='grid grid-cols-[2fr_1fr] gap-2 rounded-3xl overflow-hidden'>
                    {itemInfo.photos?.length > 0 && <div className='flex'>
                        <img src={'http://localhost:4000/uploads/' + itemInfo.photos[0]} className='aspect-square object-cover' />
                    </div>}
                    {itemInfo.photos?.length > 0 && <div className='grid'>
                        <img src={'http://localhost:4000/uploads/' + itemInfo.photos[1]} className='aspect-square object-cover w-full h-full'/>
                        <img src={'http://localhost:4000/uploads/' + itemInfo.photos[2]} className='aspect-square object-cover relative top-2'/>
                    </div>}
                </div>

                <div className='grid grid-cols-[3fr_2fr] gap-16 mt-12'>
                    <div>
                        <div className='border-b-2 py-4 flex flex-col gap-2'>
                            <h4 className='text-2xl font-semibold mb-4'>Description</h4>
                            <h4 className={itemInfo.free? 'text-green-700 text-xl font-semibold': 'hidden'}>*Free</h4>
                            <p className='text-lg text-gray-800 mb-2'>{itemInfo.description}</p>
                            <p className='text-lg text-gray-800'>Item owner: <span className='font-[500]'>{itemInfo.owner?.name}</span></p>
                            {!itemInfo.free && itemInfo.returnDate && <p className='text-lg text-gray-800'>Available borrow date: {format(new Date(itemInfo?.borrowDate), 'dd-MM-yyyy')}</p>}
                            {/* {!itemInfo.free && <p className='text-lg text-gray-800'>Available borrow date: {itemInfo.borrowDate}</p>} */}
                            {!itemInfo.free && itemInfo.returnDate && <p className='text-lg text-gray-800'>Expected return date: {format(new Date(itemInfo.returnDate), 'dd-MM-yyyy')}</p>}
                            {/* {!itemInfo.free && itemInfo.returnDate && <p className='text-lg text-gray-800'>Available borrow date: {itemInfo.returnDate}</p>} */}
                            {!itemInfo.free && <p className='text-lg text-gray-800'>Charge($) for late return: ${itemInfo.charge} HKD</p>}
                        </div>
                        {!itemInfo.free && (
                            <div className='border-b-2 py-4 mt-2'>
                                <h4 className='text-2xl font-semibold mb-4'>Cautions</h4>
                                <div className='grid grid-cols-2 mt-2 gap-2'>
                                    {itemInfo.cautions?.length > 0 && itemInfo.cautions?.map(caution => {
                                        return <div className='text-lg'>
                                            {selectCautionIcon(caution)}
                                        </div>
                                    })}
                                </div>
                            </div>
                        )}
                        <div className='py-4 mt-2'>
                            <h4 className='text-2xl font-semibold mb-4'>Extra Info</h4>
                            <p className='text-lg text-gray-800'>{itemInfo.extraInfo? itemInfo.extraInfo: 'N/A'}</p>
                        </div>
                    </div>

                    {/* Reserve form, will not display if already reserved */}
                    {!itemInfo.isReserved && loadReady && (
                        <div>
                            <div className='shadow-xl border rounded-2xl py-6 px-6'>
                                <h3 className='font-[500] text-xl'> Borrow {numOfReserveDays} <span className='text-md text-gray-700 font-[300]'>day{numOfReserveDays>1? 's': ''}</span></h3>
                                <div className='border rounded-2xl mt-4'>
                                    <div className='grid grid-cols-2 border-b'>
                                        <div className='py-3 px-4 border-r'>
                                            <label className='font-semibold pl-[0.15rem]' for='user-borrowDate'>Your Borrow Date</label><br/>
                                            <input type='date' id='user-borrowDate' onChange={(e) => setUserBorrowDate(e.target.value)} className='cursor-pointer' required/>
                                        </div>
                                        <div className='py-4 px-4'>
                                            <label className='font-semibold pl-[0.15rem]' for='user-returnDate'>Your Return Date</label><br/>
                                            <input type='date' id='user-returnDate' value={userReturnDate} onChange={(e) => setUserReturnDate(e.target.value)} className='cursor-pointer' required/>
                                        </div>
                                    </div>
                                    {numOfReserveDays > 0 && <hr/>}
                                    {numOfReserveDays > 0 && (
                                        <div className='py-4 px-4'>
                                            <div>
                                                <p className='font-semibold pl-[0.15rem]'>Your full name:</p>
                                                <input type='text' onChange={(e) => setUserName(e.target.value)}/>
                                            </div>
                                            <div className='mt-4'>
                                                <p className='font-semibold pl-[0.15rem]'>Phone number:</p>
                                                <input type='tel' onChange={(e) => setUserPhoneNum(e.target.value)} />
                                            </div>
                                        </div>
                                    )}
                                    <hr/>
                                    <div className='py-4 px-4'>
                                        <button onClick={handleReserveItem} className='bg-primary text-white py-2 px-4 rounded-xl w-full hover:underline'>Reserve</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        )}
    </div>
  )
}

export default Item