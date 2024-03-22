import { firestore } from '../firebaseConfig'
import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { auth } from '../firebaseConfig'

/**
 * BookedEventInfo Page
 * 
 * This page is responsible for displaying the user's booked event information. It allows the user to cancel the entire booking.
 * 
 * @category Page
 * @author Pawel Lasota
 * @generated fetchBookingsData assisted by chatGPT
*/

function Bookings() {

  const [bookings, setBookings] = useState([])
  const currentUser = auth.currentUser
  let navigate = useNavigate()

  useEffect(() => {
    //Responsible for fetching the logged in user's booking data from the database
    const fetchBookings = async () => {
        try {
            const bookingsCollection = collection(firestore, 'Bookings')
            const userBookingsQuery = query(bookingsCollection, where("userId", "==", currentUser.uid))
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
    //if the user is logged in then the bookings are fetched
    if (currentUser) {
      fetchBookings()
    }
  }, [currentUser])

  //Responsible for redirecting the user to the waiting list page
  const handleReserveAccess = () => {
    navigate('/waitinglist/')
  }

  //JSX to display the bookings list appropriately
    return (
      <div>
        <div className='flex justify-center'>
        <button
          className='bg-colour2 w-60 p-2 rounded-xlg text-xl hover:bg-seeAllHover'
          onClick={handleReserveAccess}>Access Waiting List</button>
        </div>
        {bookings.length === 0 && (
          <div>
            <h1 className='flex justify-center mt-20'>No confirmed Bookings to show.</h1>
            <h2 className='flex justify-center'>Please check the waiting list!</h2>
          </div>
        )}
          {bookings.map(booking => (
            <Link key={booking.id} to={'/booking/' + booking.id}>  
              <div className='flex justify-center m-6'>
                <div key={booking.id} className='backdrop-blur-sm w-96 p-3 shadow-middle bg-white/30 rounded-lg'>
                  <div className='flex flex-row'>
                    <h2 className='pb-1 font-semibold text-colour1'>{booking.EventName}</h2>
                    <p className='ml-auto px-2 text-center rounded-xlg border-2 border-colour1'>{booking.NumberOfTickets} Tickets</p>
                  </div>
                    <p className=''>{booking.EventDate}, {booking.EventTime}</p>
                    <p className=''>{booking.EventAddress}</p>
                    <p className=''>{booking.EventLocation}</p>
                </div>
              </div>
            </Link>
          ))}
      </div>
    )
  }
  
export default Bookings