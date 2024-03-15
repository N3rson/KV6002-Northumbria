import React, { useState, useEffect, useRef } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { collection, getDocs, updateDoc } from 'firebase/firestore'
import { firestore } from '../firebaseConfig'
import './MyCalendarStyle.css'
import DownloadBtn from '../assets/icon_download.png';
import CloseBtn from '../assets/icon_close.png';



const localizer = momentLocalizer(moment)

function MyCalendar() {

  const [CalendarEvents, setCalendarEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventBooked, setIsEventBooked] = useState(false);
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
            // eventPageLink: '/events/${doc.id}', 
            // to be adjusted to route to events page
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
    console.log("Checking event booking for event ID:", EventId)
    const bookingsCollection = collection(firestore, 'Bookings')
    const bookingsSnapshot = await getDocs(bookingsCollection)
    bookingsSnapshot.forEach((doc) => {
      console.log("Booking document:", doc.data())
      if (doc.data().EventId === EventId) {
        setIsEventBooked(true)
        return;
      }
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

    return (
      <div>
        <Calendar
          localizer={localizer}
          events = {CalendarEvents} 
          startAccessor="start"
          endAccessor="end"
          style={{height: 500}}
          onSelectEvent={handleEventClick} 
        />
        
        {selectedEvent && (
          <div className="blurred-background">
            <div className="event-details-modal" ref={modalRef}>
              <span className="close-button" onClick={closeModal}>
                <img src={DownloadBtn} alt="Download"/>
                <img src={CloseBtn} alt="Close" />
              </span>
              <h3 className="event-title">{selectedEvent.title}</h3>
              <p className="event-details">Location: {selectedEvent.location}</p>
              <p className="event-details">Status: {isEventBooked ? 'Booked' : 'Not Booked'}</p>
              {isEventBooked && (
                <p className="event-details">You have booked this event</p>
              )}
              <a href={`/events/${selectedEvent.id}`} className="visit-event-link">Visit Event Page</a>
            </div>
          </div>
        )}

      </div>
    );
  }
  
export default MyCalendar