import { firestore } from '../firebaseConfig'
import React, { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'

function Bookings() {

  const [bookings, setBookings] = useState([])

  useEffect(() => {
    const fetchBookings = async () => {
        try {
            const bookingsCollection = collection(firestore, 'Bookings')
            const bookingsSnapshot = await getDocs(bookingsCollection)
            const bookingsData = bookingsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setBookings(bookingsData)
        } catch (error) {
            console.error('Error fetching bookings: ', error)
        }
    }
    fetchBookings()
  }, [])

    return (
        <div>
        {bookings.map(booking => (
          <div key={booking.id} className='bg-white rounded-lg border-black m-10 shadow-middle p-4'>
           <h2 className='flex justify-center font-bold'>{booking.EventName}</h2>
           <h2 className='flex justify-center'>{booking.EventDate} at {booking.EventTime}</h2>
           <h2 className='flex justify-center'>{booking.EventAddress}, {booking.EventLocation}</h2>
           </div>
          ))}
      </div>
    )
  }
  
export default Bookings