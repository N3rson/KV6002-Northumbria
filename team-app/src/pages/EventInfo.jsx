import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, updateDoc, increment, addDoc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import backBtn from '../assets/back_button.png';
import downloadIcon from '../assets/icon_download.png';
import shareIcon from '../assets/icon_share.png';
import { auth } from '../firebaseConfig';

function EventInfo() {
    const [event, setEvent] = useState(null);
    const [selectedBookings, setSelectedBookings] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const { eventId } = useParams();
    let navigate = useNavigate();
    const currentUser = auth.currentUser

    useEffect(() => {
        const fetchEventData = async () => {
            const eventRef = doc(firestore, 'Events', eventId)
            const eventSnapshot = await getDoc(eventRef)
            if (eventSnapshot.exists()) {
                setEvent(eventSnapshot.data())
            } else {
                console.error('Event not found')
            }
        }

        fetchEventData()
    }, [eventId])

    const handleBookClick = async (bookingsToAdd) => {
        if (event.EventLimit - event.EventAttendance < bookingsToAdd) {
            setErrorMessage('Not enough spaces for ' + bookingsToAdd + ' tickets.')
            return
        }
    
        const confirmBooking = window.confirm('Are you sure you want to book ' + bookingsToAdd + ' ticket/s?')
        if (!confirmBooking) {
            return
        }
    
        setErrorMessage('')
    
        try {
            const eventRef = doc(firestore, 'Events', eventId)
            await updateDoc(eventRef, {
                EventAttendance: increment(bookingsToAdd)
            })
            setEvent(prevEvent => ({
                ...prevEvent,
                EventAttendance: prevEvent.EventAttendance + bookingsToAdd
            }))
    
            const bookingsRef = collection(firestore, 'Bookings')
            const bookingDocRef = await addDoc(bookingsRef, {
                EventId: eventRef.id,
                EventName: event.EventName,
                EventAddress: event.EventAddress,
                EventDate: event.EventDate,
                EventTime: event.EventTime,
                EventLocation: event.EventLocation,
                NumberOfTickets: bookingsToAdd,
                userId: currentUser.uid 
            })
    
            const ticketsRef = collection(bookingDocRef, 'Tickets')
    
            for (let i = 0; i < bookingsToAdd; i++) {
                await addDoc(ticketsRef, {})
            }
    
            alert('Booking successful!')
    
        } catch (error) {
            console.error('Error updating attendance: ', error)
            setErrorMessage('An error occurred while booking. Please try again.')
        }
    };

    if (!event) {
        return <div>Loading...</div>
    }

    const isBookButtonDisabled = event.EventAttendance >= event.EventLimit

    return (
        <div>
            <img src={backBtn} alt="Back" className="h-6 w-6 ml-10" onClick={() => navigate(-1)} />
            <div key={event.id} className='ml-10 mr-10 flex flex-col'>
                <h1 className='flex justify-center font-bold text-xl border-b-2 border-b-black'>{event.EventName}</h1>
                <p className='flex justify-center text-sm mt-10'>{event.EventAddress}</p>
                <p className='flex justify-center text-sm'>{event.EventLocation}</p>
                <p className='flex justify-center text-sm mt-1'>{event.EventDate} at {event.EventTime}</p>
                <p className='flex justify-center text-sm mt-1'>{event.EventLength} Duration</p>
                <p className='flex justify-center mt-10 text-sm bg-white p-6 rounded-lg'>{event.EventDescription}</p>
                <div className="flex justify-center mt-10">
                    <p className="h-20 w-20 bg-white rounded-lg flex items-center justify-center mr-5">
                        {event.EventAttendance} / {event.EventLimit}
                    </p>
                    <div className="flex items-center justify-center flex-col">
                        <button className="bg-steelBlue text-white rounded-lg flex items-center justify-center mb-2 p-2 w-36">
                            <p className='mr-2 text-xs'>Download PDF</p>
                            <img src={downloadIcon} alt="Download" className="h-6 w-6" />
                        </button>
                        <button className="bg-steelBlue text-white rounded-lg flex items-center justify-center mb-2 p-2 w-36">
                            <p className='mr-6 text-xs'>Share Event</p>
                            <img src={shareIcon} alt="Download" className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
            <div className='flex justify-center mt-5 flex-col items-center'>
                {!isBookButtonDisabled && (
                    <>
                        <div className="flex items-center mb-2">
                            <label htmlFor="ticketCount" className="mr-2 text-sm">Number of Tickets:</label>
                            <select
                                id="ticketCount"
                                value={selectedBookings}
                                onChange={(e) => setSelectedBookings(Number(e.target.value))}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-20 p-2.5">
                                {[1,2,3,4,5].map(number => (
                                    <option key={number} value={number}>{number}</option>
                                ))}
                            </select>
                        </div>
                        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                        <p className='text-sm mt-10 mb-2'>You can only book 3 days before the event</p>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg xs:w-60 md:w-80 mb-5" onClick={() => handleBookClick(selectedBookings)}>Book</button>
                        <p className='text-sm mb-2'>Join the wait!</p>
                        <button className="bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg xs:w-60 md:w-80 mb-20">Join</button>
                    </>
                )}
                {isBookButtonDisabled && <button className='bg-gray-400 text-white font-bold py-2 px-4 rounded-lg w-full' disabled>Book</button>}
            </div>
        </div>
      )
  }
  
export default EventInfo