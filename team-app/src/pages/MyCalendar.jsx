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

  const [currentUser, setCurrentUser] = useState(null);
  const [CalendarEvents, setCalendarEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventBooked, setIsEventBooked] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState (null);
  const modalRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);
  // above useEffect is to try and solve the User UID undefined/ user not logged in error
  
  useEffect(() => {
    const fetchEvents = async () => {
      try{
        const eventsCollection = collection(firestore, 'Events')
        const eventsSnapshot = await getDocs(eventsCollection)
        const eventsData = []

        eventsSnapshot.forEach((doc) => {
          //console.log('Event Data: ', doc.data()); issue resolved

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
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    } 
    
    
    fetchEvents()
  }, []);
  
  
  const checkEventBooking = async (EventId) => {
    const bookingsCollection = collection(firestore, 'Bookings');

    setIsEventBooked(false);
    if(!currentUser) {
      console.log('User not logged in or User UID is undefined.')
        return 
    }//Exit if no user logged in. This is were error is

    try{
      const q = query(
        bookingsCollection, 
        where('EventId', '==', EventId), 
        where('userId', '==', currentUser.uid)
        )

      const bookingsSnapshot = await getDocs(q)

      if(!bookingsSnapshot.empty){
        setIsEventBooked(true)
        setSelectedBooking(bookingsSnapshot.docs[0].data())
      }
    } catch (error) {
      console.error('Error checking event booking:',error)
    }
  };

const handleEventClick = (event) => {
  setSelectedEvent(event)
  checkEventBooking(event.id)
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

  const eventStyleGetter = (event, start, end, isSelected) => ({ 
    style: {
      backgroundColor: isEventBooked? '#7da6f0' : '#CCCCCC',
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: 'none',
      display: 'block',
    }
  });
    

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
                  <a href={'/kv6002/booking/' + selectedBooking.id} className="visit-event-link">Visit Booking Page</a>
                </div>
              ): (
                <a href={'/kv6002/event/' + selectedEvent.id} className="visit-event-link">Visit Event Page</a>
              )}
              
            </div>
          </div>
        )}

      </div>
    );
  }
  
export default MyCalendar
