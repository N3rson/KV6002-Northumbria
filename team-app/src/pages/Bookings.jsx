import { firestore } from '../firebaseConfig'
import React, { useState, useEffect } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {bookings.map(booking => (
          <div key={booking.id} className='bg-white rounded-lg border-black m-10 shadow-middle'>
           <h2 className='flex justify-center font-bold'>{booking.BookingDate}</h2>
           <h2 className='flex justify-center font-bold'>{booking.BookingTime}</h2>
           <h2 className='flex justify-center font-bold'>event name</h2>
           </div>
          ))}
      </div>
    )
  }
  
export default Bookings