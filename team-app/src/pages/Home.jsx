import Flicking from "@egjs/react-flicking";
import "@egjs/react-flicking/dist/flicking.css";
import React, { useState, useEffect } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '../firebaseConfig'
import { Link } from 'react-router-dom';

function SeeAllButton() {
  return (
    <div className="ml-auto px-4 py-0.5 rounded-xlg bg-colour2 border-2 border-colour2 hover:bg-buttonHover border-2 border-colour2">
      <button>
        <p>See All</p>
      </button>
    </div>
  )
}

function Home() {
  const [events, setEvents] = useState([])

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
  }, [])

  return (
    <div className="p-4">
      
      <div className="flex flex-row">
        <h2 className="font-semibold">My Weekly Events</h2>
        <SeeAllButton/>
      </div>
      <div className='mb-3'>
        <Flicking
          align="prev"
          circular={false}
          onMoveEnd={e => {
          console.log(e);
          }}>

          {events.length === 0 ? (
              <h1 className='flex justify-center mt-20'>No Events to show</h1>
              ) : (
                
                events.map(event => (
                  
                  <Link key={event.id} to={'/event/' + event.id}>
                    <div key={event.id} className='backdrop-blur-sm w-96 my-4 ml-2 p-3 shadow-middle bg-white/30 rounded-lg'>
                      <div className='flex flex-row'>
                        <h2 className='pb-1 font-semibold text-colour1'>{event.EventName}</h2>
                        <p className='ml-auto px-2 text-center rounded-xlg border-2 border-colour1'>{event.EventAttendance} / {event.EventLimit}</p>
                      </div>
                      <p className=''>{event.EventCategory}</p>
                      <p className=''>{event.EventDate}</p>
                      <p className=''>{event.EventLocation}</p>
                    </div>
                  </Link>
                ))
              )}
        </Flicking>
      </div>

      <div className="flex flex-row">
        <h2 className="font-semibold">Available Weekly Events</h2>
        <SeeAllButton/>
      </div>
      <div className='mb-3'>
        <Flicking
          align="prev"
          circular={false}
          onMoveEnd={e => {
          console.log(e);
          }}>

          {events.length === 0 ? (
              <h1 className='flex justify-center mt-20'>No Events to show</h1>
              ) : (
                
                events.map(event => (
                  
                  <Link key={event.id} to={'/event/' + event.id}>
                    <div key={event.id} className='backdrop-blur-sm w-96 my-4 ml-2 p-3 shadow-middle bg-white/30 rounded-lg'>
                      <div className='flex flex-row'>
                        <h2 className='pb-1 font-semibold text-colour1'>{event.EventName}</h2>
                        <p className='ml-auto px-2 text-center rounded-xlg border-2 border-colour1'>{event.EventAttendance} / {event.EventLimit}</p>
                      </div>
                      <p className=''>{event.EventCategory}</p>
                      <p className=''>{event.EventDate}</p>
                      <p className=''>{event.EventLocation}</p>
                    </div>
                  </Link>
                ))
              )}
        </Flicking>
      </div>

      <div className="flex flex-row">
        <h2 className="font-semibold">Popular Events</h2>
        <SeeAllButton/>
      </div>
      <div className='mb-3'>
        <Flicking
          align="prev"
          circular={false}
          onMoveEnd={e => {
          console.log(e);
          }}>

          {events.length === 0 ? (
              <h1 className='flex justify-center mt-20'>No Events to show</h1>
              ) : (
                
                events.map(event => (
                  
                  <Link key={event.id} to={'/event/' + event.id}>
                    <div key={event.id} className='backdrop-blur-sm w-96 my-4 ml-2 p-3 shadow-middle bg-white/30 rounded-lg'>
                      <div className='flex flex-row'>
                        <h2 className='pb-1 font-semibold text-colour1'>{event.EventName}</h2>
                        <p className='ml-auto px-2 text-center rounded-xlg border-2 border-colour1'>{event.EventAttendance} / {event.EventLimit}</p>
                      </div>
                      <p className=''>{event.EventCategory}</p>
                      <p className=''>{event.EventDate}</p>
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