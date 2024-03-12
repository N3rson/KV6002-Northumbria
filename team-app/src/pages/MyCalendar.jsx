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
          const eventdata = {
            id: doc.id,
            title: doc.data().EventName,
            start: new Date(doc.data().EventDate),
            end: new Date(doc.data().EventDate),
            location: doc.data().EventAddress,
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