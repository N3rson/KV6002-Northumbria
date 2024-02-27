import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import backBtn from '../assets/back_button.png';

function EventInfo() {

    const [event, setEvent] = useState(null);
    const { eventId } = useParams();

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const eventRef = doc(firestore, 'Events', eventId);
                const eventSnapshot = await getDoc(eventRef);
                if (eventSnapshot.exists()) {
                    setEvent(eventSnapshot.data());
                } else {
                    console.error('Event not found');
                }
            } catch (error) {
                console.error('Error fetching event data: ', error);
            }
        };

        fetchEventData();
    }, [eventId]);

    if (!event) {
        return <div>Loading...</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <img src={backBtn} alt="Back" className="h-6 w-6" />
        <div key={event.id} className='border-b-2 border-black m-10 '>
            <h2 className='flex justify-center font-bold text-xl border-b-2 border-b-black'>{event.EventName}</h2>
            <p className='flex justify-center'>{event.EventDate} at {event.EventTime}</p>
            <p className='flex justify-center mt-10'>{event.EventDescription}</p>
        </div>

      </div>
    )
  }
  
export default EventInfo