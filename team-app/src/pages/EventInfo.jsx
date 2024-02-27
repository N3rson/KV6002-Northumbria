import React, { useState, useEffect } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import { collection, doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import backBtn from '../assets/back_button.png';

function EventInfo() {

    const [event, setEvent] = useState(null);
    const { eventId } = useParams();
    let navigate = useNavigate();

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


    const handleBookClick = async () => {
      try {
          const eventRef = doc(firestore, 'Events', eventId);
          await updateDoc(eventRef, {
              EventAttendance: increment(1)
          });
          setEvent(prevEvent => ({
              ...prevEvent,
              EventAttendance: prevEvent.EventAttendance + 1
          }));
      } catch (error) {
          console.error('Error updating attendance: ', error);
      }
  };

    if (!event) {
        return <div>Loading...</div>;
    }

    const isBookButtonDisabled = event.EventAttendance >= event.EventLimit

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <img src={backBtn} alt="Back" className="h-6 w-6" onClick={() => navigate(-1)} />
        <div key={event.id} className='ml-10 mr-10 flex flex-col'>
            <h1 className='flex justify-center font-bold text-xl border-b-2 border-b-black'>{event.EventName}</h1>
            <p className='flex justify-center text-sm'>{event.EventAddress}, {event.EventLocation}</p>
            <p className='flex justify-center text-sm'>{event.EventDate} at {event.EventTime}</p>
            <p className='flex justify-center mt-10 text-sm bg-white p-6 rounded-xl'>{event.EventDescription}</p>
            <p className="h-20 w-20 bg-white rounded-full mt-10 flex items-center justify-center mr-10">{event.EventAttendance} / {event.EventLimit}</p>
        </div>
          {!isBookButtonDisabled && <button className='bg-steelBlue rounded-lg p-2 m-10 text-white' onClick={handleBookClick}>Book</button>}
          {isBookButtonDisabled && <button className='bg-gray-400 rounded-lg p-2 m-10 text-white cursor-not-allowed' disabled>Book</button>}
      </div>
    )
  }
  
export default EventInfo