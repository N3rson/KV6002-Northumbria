import React, { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '../firebaseConfig'

function Events() {
    const [events, setEvents] = useState([])

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsCollection = collection(firestore, 'Events')
                const eventsSnapshot = await getDocs(eventsCollection)
                const eventsData = eventsSnapshot.docs.map(doc => doc.data())
                setEvents(eventsData)
            } catch (error) {
                console.error('Error fetching events: ', error)
            }
        }
        fetchEvents()
    }, [])

    return (
      <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <h1 className='font-bold'>Events</h1>
              <div>
                  {events.map(event => (
                      <div key={event.EventID} className='border-b-2 border-t-2 border-black m-10'>
                          <h2 className='flex justify-center font-bold'>{event.EventName}</h2>
                          <p className='flex justify-center'>{event.EventCategory}</p>
                          <p className='flex justify-center'>{event.EventDate}</p>
                          <p className='flex justify-center'>{event.EventAttendance} Attending</p>
                          <p className='flex justify-center'>{event.EventLocation}</p>
                      </div>
                  ))}
              </div>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                Book
              </button>
          </div>
      </div>
  )
}

export default Events