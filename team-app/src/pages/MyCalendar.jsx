import { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { collection, getDocs, updateDoc } from 'firebase/firestore'
import { firestore } from '../firebaseConfig'



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

          const startDate = new Date(doc.data().EventDate + 'T' + doc.data().EventTime);
          //const durationInMinutes = doc.data().EventLength || 60; // Default duration is 60 minutes
          // TO FIX EventLength cause that too is a string
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
          <div className="event-details-modal">
            <h3>{selectedEvent.title}</h3>
            <p>Location: {selectedEvent.location}</p>
            <p>Status: {selectedEvent.isBooked ? 'Booked' : 'Not Booked'}</p>
            <a href={selectedEvent.eventPageLink}>Event Page</a>
            <button onClick={closeModal}>Close</button>
            <button>Export to Calendar </button>
          </div>

        )}

      </div>
    );
  }
  
export default MyCalendar