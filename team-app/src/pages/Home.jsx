import Flicking from "@egjs/react-flicking";
import "@egjs/react-flicking/dist/flicking.css";
import React, { useState, useEffect } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '../firebaseConfig'
import { Link } from 'react-router-dom';
import { auth } from '../firebaseConfig'
import SeeAllButton from '../components/SeeAllButton'

/**
 * Home Page
 * 
 * This page is responsible for displaying the user's booked events and filtered events. It allows the user to view their bookings, weekly events and popular events.
 * 
 * @category Page
 * @author Lucie Stephenson
*/

function Home() {
  const [events, setEvents] = useState([])
  const [bookings, setBookings] = useState([])
  const currentUser = auth.currentUser

  // Fetch events and bookings from the database
  useEffect(() => {
    const fetchEvents = async () => {
        try {
            const eventsCollection = collection(firestore, 'Events')
            const eventsSnapshot = await getDocs(eventsCollection)
            const eventsData = eventsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            setEvents(eventsData)
        } catch (error) {
            console.error('Error fetching events: ', error)
        }
    }

    fetchEvents()

    // Fetch the current user's booked event data
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

    // If user is logged in, fetch bookings
    if (currentUser) {
      fetchBookings()
    }

  }, [currentUser])

  const weeklyEvents = events.filter(event => event.EventCategory === 'Weekly');
  const popularEvents = events.filter(event => event.EventCategory === 'Popular');

  // Return styling and data for 'My Booked Events', 'Weekly Events' and 'Popular Events'
  return (
    <div className="m-4">
      
      {/* MY BOOKED EVENTS SECTION */}
      <div className="flex flex-row">
        <h2 className="font-semibold">My Booked Events</h2>
        <div className="ml-auto">
          <Link to={'/bookings'}>
            <SeeAllButton/>
          </Link>
        </div>
      </div>
      <div className='mb-3'>
        <Flicking
          align="prev"
          circular={false}
          onMoveEnd={e => {
          console.log(e);
          }}>

          {bookings.length === 0 ? (
              <h1 className='ml-4 my-10'>Oh, looks like you have no events booked!</h1>
              ) : (
                
                bookings.map(booking => (
                  
                  <Link key={booking.id} to={'/booking/' + booking.id}>
                    <div key={booking.id} className='backdrop-blur-sm w-80 my-4 mx-2 p-3 shadow-middle bg-white/30 rounded-lg'>
                      <div className='flex flex-row'>
                        <h2 className='pb-1 font-semibold text-colour1'>{booking.EventName}</h2>
                        <p className='ml-auto px-2 text-center rounded-xlg border-2 border-colour1'>{booking.NumberOfTickets} Tickets</p>
                      </div>
                      <p className=''>{booking.EventDate}, {booking.EventTime}</p>
                      <p className=''>{booking.EventAddress}</p>
                      <p className=''>{booking.EventLocation}</p>
                    </div>
                  </Link>
                ))
              )}
        </Flicking>
      </div>

      {/* WEEKLY EVENTS SECTION */}
      <div className="flex flex-row">
        <h2 className="font-semibold">Weekly Events</h2>
        <div className="ml-auto">
          <Link to='/events' state={{dateFilter: 'Hmq4PYJ29G5wY9lKhZgQ'}}>
            <SeeAllButton />
          </Link>
        </div>
      </div>
      <div className='mb-3'>
        <Flicking
          align="prev"
          circular={false}
          onMoveEnd={e => {
          console.log(e);
          }}>

          {weeklyEvents.length === 0 ? (
              <h1 className='ml-4 my-10'>Oh, looks like there's no events to show!</h1>
              ) : (
                
                weeklyEvents.map(event => (
                  
                  <Link key={event.id} to={'/event/' + event.id}>
                    <div key={event.id} className='backdrop-blur-sm w-80 my-4 mx-2 p-3 shadow-middle bg-white/30 rounded-lg'>
                      <div className='flex flex-row'>
                        <h2 className='pb-1 font-semibold text-colour1'>{event.EventName}</h2>
                        <p className='ml-auto px-2 text-center rounded-xlg border-2 border-colour1'>{event.EventAttendance} / {event.EventLimit}</p>
                      </div>
                      <p className=''>{event.EventCategory}</p>
                      <p className=''>{event.EventDate}, {event.EventTime}</p>
                      <p className=''>{event.EventLocation}</p>
                    </div>
                  </Link>
                ))
              )}
        </Flicking>
      </div>

      {/* POPULAR EVENTS SECTION */}
      <div className="flex flex-row">
        <h2 className="font-semibold">Popular Events</h2>
        <div className="ml-auto">
        <Link to='/events' state={{dateFilter: 'nBLKtVMoXJtvGqRwuIzT'}}>
            <SeeAllButton/>
          </Link>
        </div>
      </div>
      <div className='mb-3'>
        <Flicking
          align="prev"
          circular={false}
          onMoveEnd={e => {
          console.log(e);
          }}>

          {popularEvents.length === 0 ? (
              <h1 className='ml-4 my-10'>Oh looks like there's no events to show!</h1>
              ) : (
                
                popularEvents.map(event => (
                  
                  <Link key={event.id} to={'/event/' + event.id}>
                    <div key={event.id} className='backdrop-blur-sm w-80 my-4 mx-2 p-3 shadow-middle bg-white/30 rounded-lg'>
                      <div className='flex flex-row'>
                        <h2 className='pb-1 font-semibold text-colour1'>{event.EventName}</h2>
                        <p className='ml-auto px-2 text-center rounded-xlg border-2 border-colour1'>{event.EventAttendance} / {event.EventLimit}</p>
                      </div>
                      <p className=''>{event.EventCategory}</p>
                      <p className=''>{event.EventDate}, {event.EventTime}</p>
                      <p className=''>{event.EventLocation}</p>
                    </div>
                  </Link>
                ))
              )}
          </Flicking>
        </div>

    </div>
  )
}
  
export default Home