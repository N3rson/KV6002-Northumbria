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
            <ul className='border-b-2 border-t-2 border-black m-10 flex justify-center'>
                {events.map(event => (
                    <li key={event.EventID}>
                        <h2 className='ml-8 font-bold'>{event.EventName}</h2>
                        <p className='ml-16'>{event.EventCategory}</p>
                        <p className='ml-12'>{event.EventDate}</p>
                        <p className='ml-12'>{event.EventAttendance} Attending</p>
                        <p>{event.EventLocation}</p>
                    </li>
                ))}
              </ul>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                Book
              </button>
            </div>
        </div>
      </div>
    )
}

export default Events