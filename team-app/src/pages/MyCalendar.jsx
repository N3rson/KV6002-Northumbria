import React, { useState, useEffect, useRef } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { collection, getDocs, updateDoc, query, where } from 'firebase/firestore'
import { firestore, auth } from '../firebaseConfig'
import { Link } from 'react-router-dom';
import './MyCalendarStyle.css'
import DownloadBtn from '../assets/icon_download.png'
import CloseBtn from '../assets/icon_close.png'

/* Calendar page created by w20022537 
 Aided by:
    React Big Calendar https://github.com/jquense/react-big-calendar 
    ChatGPT
*/

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
    setIsEventBooked(false)
    if(!currentUser) {
      console.log('User not logged in or User UID is undefined.')
        return 
    }//Exit if no user logged in    

    try{
      const bookingsCollection = collection(firestore, 'Bookings');
     // get which event has been booked by user personalised user

      const q = query(
        bookingsCollection, 
        where('EventId', '==', EventId), 
        where('userId', '==', currentUser.uid)
        )

      const bookingsSnapshot = await getDocs(q)

      if(!bookingsSnapshot.empty){
        setIsEventBooked(true)
        const selectedBookingData = bookingsSnapshot.docs[0].data()

        setSelectedBooking(selectedBookingData)

        const bookingId = bookingsSnapshot.docs[0].id
        setSelectedBooking(prevState => ({...prevState, id:bookingId}))

        //console.log("Retrieved Booking ID:", bookingsSnapshot.docs[0].id);
        console.log("Retrieved Booking ID:", bookingId);
      }
    } catch (error) {
      console.error('Error checking event booking:',error)
    }
  };

  const eventStyleGetter = (event, start, end, isSelected) => ({ 
    // change Event colour to distinguish between booked an not booked events
    style: {
      backgroundColor: (selectedEvent && selectedEvent.id === event.id && isEventBooked) ? '#7da6f0' : '#CCCCCC',
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: 'none',
      display: 'block',
    }
  });
  
 
//open pop-up window
const handleEventClick = (event) => {
  setSelectedEvent(event)
  console.log("Selected Event ID:", event.id);
  checkEventBooking(event.id)
};

const closeModal = () => {
   setSelectedEvent(null)
   setIsEventBooked(false)
};

// closes the pop-up windo on click outside pop-up window
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
        <Calendar className="mx-4 my-6 shadow-middle bg-white/30 rounded-lg"
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
              {selectedEvent && isEventBooked && selectedBooking ? (
                <div>
                  <p className="event-booked">Oh, looks like you have booked this event!</p>
                  <Link to={'/booking/' + selectedBooking.id} className="visit-event-link">Visit Booking Page</Link>
                </div>
              ): (
                <Link to={'/event/' + selectedEvent.id} className="visit-event-link">Visit Events Page</Link>
              )}
              
            </div>
          </div>
        )}

      </div>
    );
  }
  
export default MyCalendar
