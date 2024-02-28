import React, { useState, useEffect } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import { collection, doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import backBtn from '../assets/back_button.png';
import downloadIcon from '../assets/icon_download.png';
import shareIcon from '../assets/icon_share.png';


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
                <div className="flex justify-center mt-10">
                    <p className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center mr-5">
                        {event.EventAttendance} / {event.EventLimit}
                    </p>
                    <div className="flex items-center justify-center flex-col">
                        <button className="bg-blue-500 text-white rounded-full flex items-center justify-center mb-2 p-2 w-36">
                            <p className='mr-2 text-xs'>Download PDF</p>
                            <img src={downloadIcon} alt="Download" className="h-6 w-6" />
                        </button>
                        <button className="bg-blue-500 text-white rounded-full flex items-center justify-center mb-2 p-2 w-36">
                            <p className='mr-6 text-xs'>Share Event</p>
                            <img src={shareIcon} alt="Download" className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
            <div>
                {!isBookButtonDisabled && <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" onClick={handleBookClick}>Book</button>}
                {isBookButtonDisabled && <button className='bg-gray-400 text-white font-bold py-2 px-4 rounded w-full' disabled>Book</button>}
            </div>
        </div>
      )
  }
  
export default EventInfo