import { firestore } from '../firebaseConfig'
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { Link } from 'react-router-dom';
import { auth } from '../firebaseConfig';

function Bookings() {

  const [bookings, setBookings] = useState([])
  const currentUser = auth.currentUser;
  let navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
        try {
            const bookingsCollection = collection(firestore, 'Bookings')
            const userBookingsQuery = query(bookingsCollection, where("userId", "==", currentUser.uid));
            const bookingsSnapshot = await getDocs(userBookingsQuery)
            const bookingsData = bookingsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            
            setBookings(bookingsData)
        } catch (error) {
            console.error('Error fetching bookings: ', error)
        }
    }
    if (currentUser) {
      fetchBookings();
  }
}, [currentUser]);

  if (bookings.length === 0) {
    return <h1 className='flex justify-center mt-20'>No Bookings to show</h1>
  }

  const handleReserveAccess = () => {
    navigate('/waitinglist/');
};

    return (
        <div>
          <div className='flex justify-center'>
            <button className='bg-black w-60 rounded-xlg shadow-middle border-2 border-gray-200 text-xl text-white p-2' onClick={handleReserveAccess}>Access Waiting List</button>
          </div>
          {bookings.map(booking => (
            <Link key={booking.id} to={'/booking/' + booking.id}>
              <div key={booking.id} className='bg-white rounded-lg border-black m-10 shadow-middle p-4'>
              <h2 className='flex justify-center font-bold'>{booking.EventName}</h2>
              <h2 className='flex justify-center'>{booking.EventDate} at {booking.EventTime}</h2>
              <h2 className='flex justify-center'>{booking.EventAddress}</h2>
              <h2 className='flex justify-center'>{booking.EventLocation}</h2>
              <h2 className='flex justify-center'>Number of Tickets: {booking.NumberOfTickets}</h2>
              </div>
            </Link>
          ))}
      </div>
    )
  }
  
export default Bookings