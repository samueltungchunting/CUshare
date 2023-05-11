import React, { useEffect, useState } from "react";
import AccountNavbar from "../components/AccountNavbar";
import axios from "axios";
import { differenceInCalendarDays, format } from "date-fns";

const MyReservationsPage = () => {
  const [myReservationsInfo, setMyReservationsInfo] = useState([])

  useEffect(() => {
    axios.get("/user-reservations").then((res) => {
      const { data } = res
      setMyReservationsInfo(data);
      console.log(data);
    });
    console.log("got user reservations data");
  }, []);

  async function handleCancelReservation(reservationID) {
    const confirmed = window.confirm('Are you sure you want to cancel the reservation?')
    if(confirmed) {
      await axios.delete(`/user-cancelReservations/${reservationID}`)
      setMyReservationsInfo(prev => prev.filter(reservations => reservations._id !== reservationID))
    } else return
  }

  return (
    <div className="flex flex-col items-center">
      {/* <AccountNavbar /> */}
      <div className="mt-8 flex flex-col gap-2 w-full lg:w-4/5 justify-center">
        {myReservationsInfo.length > 0 && myReservationsInfo.map(userBooking => {
            return <div className="flex bg-gray-200 rounded-2xl overflow-hidden gap-4 relative" key={userBooking._id}>
                <div className='flex h-36'>
                    <img src={'http://localhost:4000/uploads/' + userBooking.item?.photos[0]} className='object-cover aspect-[4/3]'/>
                </div>
                <div className="grow pb-2">
                    <p className="font-[500] text-lg text-primary-purple py-2">{userBooking.item?.title}</p>
                    <div className="inline-flex font-[400] text-[#252525] text-lg gap-2 mb-2 items-center">
                      {/* checkin checkout numOfnight */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" className="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                      </svg>
                      <span>{Math.abs(differenceInCalendarDays(new Date(userBooking.userBorrowDate), new Date(userBooking.userReturnDate)))} days:</span>
                      <span>{format(new Date(userBooking.userBorrowDate), 'yyyy-MM-dd')}	&#8594; {format(new Date(userBooking.userReturnDate), 'yyyy-MM-dd')}</span>
                    </div>
                    <div className="text-gray-600 text-md mb-2 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" className="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <p className="">Address: <span className="underline">{userBooking.item?.address}</span></p>
                    </div>
                    <p className="text-md text-gray-600 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75" stroke="currentColor" className="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                      </svg>
                      Late return charge: ${userBooking.item.charge} HKD / day
                    </p>
                </div>
                <div className="absolute top-3 right-3 px-2 py-2 rounded-full bg-red-400 text-white cursor-pointer" onClick={() => handleCancelReservation(userBooking._id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>
        })}
      </div>
    </div>
  );
};

export default MyReservationsPage;
