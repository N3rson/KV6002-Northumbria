import { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { collection, getDocs, updateDoc } from 'firebase/firestore'
import { firestore } from '../firebaseConfig'



const localizer = momentLocalizer(moment)

function MyCalendar() {

  const [CalendarEvents, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  useEffect(() => {
    const fetchEvents = async () => {
      const eventsCollection = collection(firestore, 'Events');
      const eventsSnapshot = await getDocs(eventsCollection);

      const eventsData = [];
      eventsSnapshot.forEach((doc) => {
        const eventdata = {
          id: doc.id,
          title: doc.data().EventName,
          starts: new Date (doc.data().start.EventDate.toMillis()),
          end: new Date(doc.data().end.EventDate.toMillis()),
          location: doc.data().EventAddress,
          // eventPageLink: '/events/${doc.id}', 
          // to be adjusted to route to events page
        };

        eventsData.push(eventdata);
      });

      setEvents(eventsData);
    };
    
    fetchEvents();
  }, []);
  
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