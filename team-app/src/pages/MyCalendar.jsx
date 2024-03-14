import { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { collection, getDocs, updateDoc } from 'firebase/firestore'
import { firestore } from '../firebaseConfig'
import './MyCalendarStyle.css'
import DownloadBtn from '../assets/icon_download.png';
import CloseBtn from '../assets/icon_close.png';
import React, { useState, useEffect, useRef } from 'react';



const localizer = momentLocalizer(moment)

function MyCalendar() {

  const [CalendarEvents, setCalendarEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
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

          // Split EventDate into month, day, and year components
          const [month, day, year] = eventDateString.split('/');

          // Split EventTime into hour and minute components
          const [hour, minute] = eventTimeString.split(':');

          // Create a new Date object using year, month (subtract 1 as months are zero-indexed), day, hour, and minute
          const startDate = new Date(year, month - 1, day, hour, minute);
          
          //no longer need console.log issue has been resolved
          //console.log('startDate:'), startDate;

          // Calculate event duration from EventLength
          const eventLengthMatch = doc.data().EventLength.match(/(\d+)hrs (\d+)min/);
          const hours = eventLengthMatch ? parseInt(eventLengthMatch[1], 10) : 0;
          const minutes = eventLengthMatch ? parseInt(eventLengthMatch[2], 10) : 0;
          
          // Calculate end time by adding the parsed duration to the start time
          const endDate = new Date(startDate.getTime() + hours * 60 * 60 * 1000 + minutes * 60 * 1000);

          // Combine address and city to create the location
          const location = `${doc.data().EventAddress}, ${doc.data().EventLocation}`;


          const eventdata = {
            title: doc.data().EventName,
            start: startDate,
            end: endDate,
            location: doc.data().EventAddress,
            // eventPageLink: '/events/${doc.id}', 
            // to be adjusted to route to events page

          }
          eventsData.push(eventdata)
        })
        setCalendarEvents(eventsData)
    }
    
    
    fetchEvents()
  }, [])
  
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  }

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setSelectedEvent(null); // Close the modal
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
    <div className="event-details-modal">
      <span className="close-button" onClick={closeModal}>
        <img src={DownloadBtn} alt="Download"/>
        <img src={CloseBtn} alt="Close" />
      </span>
      <h3 className="event-title">{selectedEvent.title}</h3>
      <p className="event-details">Location: {selectedEvent.location}</p>
      <p className="event-details">Status: {selectedEvent.isBooked ? 'Booked' : 'Not Booked'}</p>
      <a href={`/events/${selectedEvent.id}`} className="visit-event-link">Visit Event Page</a>
    </div>
  </div>
)}

      </div>
    );
  }
  
export default MyCalendar