import React, { useState, useEffect, useRef } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { collection, getDocs, updateDoc, query, where } from 'firebase/firestore'
import { firestore, auth } from '../firebaseConfig'
import './MyCalendarStyle.css'
import DownloadBtn from '../assets/icon_download.png'
import CloseBtn from '../assets/icon_close.png'



const localizer = momentLocalizer(moment)

function MyCalendar() {

  const currentUser = auth.currentUser;
  const [CalendarEvents, setCalendarEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventBooked, setIsEventBooked] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState (null);
  const modalRef = useRef(null);
  
  useEffect(() => {
    const fetchEvents = async () => {
        const eventsCollection = collection(firestore, 'Events')
        const eventsSnapshot = await getDocs(eventsCollection)
        const eventsData = []

        eventsSnapshot.forEach((doc) => {
          console.log('Event Data: ', doc.data());

          // Parse EventDate and EventTime to create start date
          const eventDateString = doc.data().EventDate;
          const eventTimeString = doc.data().EventTime;

          const [month, day, year] = eventDateString.split('/');
          const [hour, minute] = eventTimeString.split(':');

          const startDate = new Date(year, month - 1, day, hour, minute);
          
          //no longer need console.log issue has been resolved with above code
          //console.log('startDate:'), startDate;

          // Calculate event duration from EventLength
          const eventLengthMatch = doc.data().EventLength.match(/(\d+)hrs (\d+)min/);
          const hours = eventLengthMatch ? parseInt(eventLengthMatch[1], 10) : 0;
          const minutes = eventLengthMatch ? parseInt(eventLengthMatch[2], 10) : 0;
          
          // Calculate end time by adding the parsed duration to the start time
          const endDate = new Date(startDate.getTime() + hours * 60 * 60 * 1000 + minutes * 60 * 1000);

          // Combine address and city to create the location
          const location = `${doc.data().EventAddress}, ${doc.data().EventLocation}`;


          const eventData = {
            id: doc.id,
            title: doc.data().EventName,
            start: startDate,
            end: endDate,
            location: location,
          }
          eventsData.push(eventData)
        })
        setCalendarEvents(eventsData)
    }
    
    
    fetchEvents()
  }, [])
  
  const handleEventClick = (event) => {
    setSelectedEvent(event)
    checkEventBooking(event.id)
  };

  const checkEventBooking = async (EventId) => {
    setIsEventBooked(false);
    if(!currentUser) return //Exit if no user logged in
    console.log("Checking event booking for event ID:", EventId)
    const bookingsCollection = collection(firestore, 'Bookings')
    const q = query(bookingsCollection, where('EventId', '==', eventID), where('userId', '==', currentUser.UserUID))
    const bookingsSnapshot = await getDocs(q)

    bookingsSnapshot.forEach((doc) => {
      console.log("Booking document:", doc.data())
      
        setSelectedBooking(doc.data())
        setIsEventBooked(true)
      
    })
  };

  const closeModal = () => {
    setSelectedEvent(null)
    setIsEventBooked(false)
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal()
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    };
  }, []);

  const eventStyleGetter = (event, start, end, isSelected) => {
    var backgroundColor = '#CCCCCC'
    if (isEventBooked) {
      backgroundColor = '#7da6f0'
    }
    else {
      backgroundColor = '#CCCCCC'
    }
    
    const style = {
      backgroundColor: backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: 'none',
      display: 'block',
    };
    return {
      style: style
    };
  };
    

    return (
      <div>
        <Calendar className="mx-3 shadow-middle bg-white/30 rounded-lg"
          localizer={localizer}
          events = {CalendarEvents} 
          startAccessor="start"
          endAccessor="end"
          style={{height: 500}}
          onSelectEvent={handleEventClick}
          eventPropGetter={eventStyleGetter} 
        />
        
        {selectedEvent && (
          <div className="blurred-background">
            <div className="event-details-modal" ref={modalRef}>
              <span className="close-button" onClick={closeModal}>
                <img src={DownloadBtn} alt="Download"/>
                <img src={CloseBtn} alt="Close" />
              </span>
              <h3 className="event-title">{selectedEvent.title}</h3>
              <p className="event-details">{selectedEvent.location}</p>
              {isEventBooked && selectedBooking ? (
                <div>
                  <p className="event-booked">Oh, looks like you have booked this event!</p>
                  <a href={`/kv6002/booking/${selectedBooking.id}`} className="visit-event-link">Visit Booking Page</a>
                </div>
              ): (
                <a href={`/kv6002/event/${selectedEvent.id}`} className="visit-event-link">Visit Event Page</a>
              )}
              
            </div>
          </div>
        )}

      </div>
    );
  }
  
export default MyCalendar
