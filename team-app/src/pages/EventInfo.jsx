import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, updateDoc, increment, addDoc, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import backBtn from '../assets/back_button.png';
import downloadIcon from '../assets/icon_download.png';
import shareIcon from '../assets/icon_share.png';
import { auth } from '../firebaseConfig'

/**
 * EventInfo Page
 * 
 * This page is responsible for displaying the event information. It allows the user to book tickets for the event.
 * 
 * @category Page
 * @author Karol Fryc, Pawel Lasota
*/

function EventInfo() {
    const [event, setEvent] = useState(null);
    const [selectedBookings, setSelectedBookings] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const { eventId } = useParams();
    const [isAlreadyBooked, setIsAlreadyBooked] = useState(false);
    const [isAlreadyInWaitingList, setIsAlreadyInWaitingList] = useState(false);
    const navigate = useNavigate();
    const currentUser = auth.currentUser;

    useEffect(() => {
        //Responsible for fetching the event data from the database
        const fetchEventData = async () => {
            const eventRef = doc(firestore, 'Events', eventId);
            const eventSnapshot = await getDoc(eventRef);
            if (eventSnapshot.exists()) {
                setEvent(eventSnapshot.data());
            }
            else {
                 console.error('Event not found');
            }
        }

        fetchEventData();
    }, [eventId]);

    useEffect(() => {
        const checkBookingStatus = async () => {
            //Responsible for checking if the user is already booked for the event
            if (currentUser) {
                const bookingsRef = collection(firestore, 'Bookings')
                const userBookingQuery = query(bookingsRef, where('userId', '==', currentUser.uid), where('EventId', '==', eventId))
                const bookingSnapshot = await getDocs(userBookingQuery)
                setIsAlreadyBooked(!bookingSnapshot.empty)
                //Responsible for checking if the user is already in the waiting list for the event
                const waitingListRef = collection(firestore, 'WaitingList')
                const userWaitingListQuery = query(waitingListRef, where('userId', '==', currentUser.uid), where('EventId', '==', eventId))
                const waitingListSnapshot = await getDocs(userWaitingListQuery)
                setIsAlreadyInWaitingList(!waitingListSnapshot.empty)
            }
        }

        checkBookingStatus()
    }, [eventId, currentUser])

    
    //if there is no event at the beginning then the loading message is displayed
    if (!event) {
        return <div>Loading...</div>
    }

    //Responsible for booking the tickets for the event and updating the database
    const handleBookClick = async (bookingsToAdd) => {
        //Responsible for checking if the user is already booked for the event
        if (isAlreadyInWaitingList) {
            alert("You are already in the waiting list for this event.");
            return;
        }
        //Responsible for checking if the user is already booked for the event
        if (event.EventLimit - event.EventAttendance < bookingsToAdd) {
            setErrorMessage('Not enough spaces for ' + bookingsToAdd + ' tickets.');
            return;
        }
        //Confirmation dialog to ensure the user wants to book the tickets
        const confirmBooking = window.confirm('Are you sure you want to book ' + bookingsToAdd + ' ticket/s?');
        if (!confirmBooking) {
            return;
        }
    
        const eventRef = doc(firestore, 'Events', eventId);
        await updateDoc(eventRef, {
            EventAttendance: increment(bookingsToAdd)
        });

        setEvent(prevEvent => ({
            ...prevEvent,
            EventAttendance: prevEvent.EventAttendance + bookingsToAdd
        }));
    
        //Responsible for adding the booking to the database
        const bookingsRef = collection(firestore, 'Bookings')
        const bookingsDocRef = await addDoc(bookingsRef, {
            EventId: eventRef.id,
            EventName: event.EventName,
            EventAddress: event.EventAddress,
            EventDate: event.EventDate,
            EventTime: event.EventTime,
            EventLocation: event.EventLocation,
            NumberOfTickets: bookingsToAdd,
            userId: currentUser.uid
        })
    
        setSelectedBookings(bookingsToAdd);
        
        //Responsible for adding the tickets to the booking
        const ticketsRef = collection(bookingsDocRef, 'Tickets')
        for (let i = 0; i < bookingsToAdd; i++) {
            await addDoc(ticketsRef, {})
        }

    }

    //Responsible for adding the user to the waiting list for the event and updating the database
    const handleWaitlistClick = async (bookingsToAdd) => {

        const eventRef = doc(firestore, 'Events', eventId);
        const waitingListRef = collection(firestore, 'WaitingList');
        const waitingListDocRef = await addDoc(waitingListRef, {
            EventId: eventRef.id,
            EventName: event.EventName,
            EventAddress: event.EventAddress,
            EventDate: event.EventDate,
            EventTime: event.EventTime,
            EventLocation: event.EventLocation,
            NumberOfTickets: selectedBookings,
            userId: currentUser.uid
        });
    

        //Responsible for adding the tickets to the waiting list
        const ticketsRef = collection(waitingListDocRef, 'Tickets');
        for (let i = 0; i < bookingsToAdd; i++) {
            await addDoc(ticketsRef, {});
        }
    
        alert("Added to waiting list. You will be required to confirm before attending the event.");
    }

    //constant to disable book button if attendance limit is reached
    const isBookButtonDisabled = event.EventAttendance >= event.EventLimit

    //JSX to display the event information
    return (
        <div>
            <img src={backBtn} alt="Back" className="h-6 w-6 ml-10" onClick={() => navigate(-1)} />
            <div key={event.id} className='ml-10 mr-10 flex flex-col'>
                <h1 className='flex justify-center font-bold text-xl border-b-2 border-b-black'>{event.EventName}</h1>
                <p className='flex mt-5 justify-center font-semibold text-lg'>Location:</p>
                <p className='flex justify-center text-lg'>{event.EventAddress}</p>
                <p className='flex justify-center text-lg'>{event.EventLocation}</p>
                <p className='flex mt-3 justify-center font-semibold text-lg'>Date and Time:</p>
                <p className='flex justify-center text-lg mt-1'>{event.EventDate} at {event.EventTime}</p>
                <p className='flex mt-3 justify-center font-semibold text-lg'>Duration:</p>
                <p className='flex justify-center text-lg'>{event.EventLength}</p>
                <p className='flex justify-center mt-5 text-sm shadow-middle bg-white p-6 rounded-lg'>{event.EventDescription}</p>
                <div className="flex justify-center mt-10">
                    <p className="h-20 w-20 shadow-middle bg-white rounded-lg flex items-center justify-center mr-5">
                        {event.EventAttendance} / {event.EventLimit}
                    </p>
                    <div className="flex items-center justify-center flex-col">
                        <button className="bg-colour2 rounded-xlg flex items-center justify-center mb-2 p-2 w-36 hover:bg-seeAllHover">
                            <p className='mr-2 text-xs'>Download PDF</p>
                            <img src={downloadIcon} alt="Download" className="h-6 w-6" />
                        </button>
                        <button className="bg-colour2 rounded-xlg flex items-center justify-center mb-2 p-2 w-36 hover:bg-seeAllHover">
                            <p className='mr-6 text-xs'>Share Event</p>
                            <img src={shareIcon} alt="Download" className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
            <div className='flex justify-center mt-5 flex-col items-center'>
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
                        {/*Checking if the button is not disabled and if the event is not booked then enable the button*/}
                        {!isBookButtonDisabled && !isAlreadyBooked && (
                            <>
                                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                                <button className="bg-colour1 hover:bg-bookHover text-white font-bold mt-5 py-2 px-4 rounded-xlg xs:w-60 md:w-80 mb-5" onClick={() => handleBookClick(selectedBookings)}>Book</button>
                            </>
                        )}
                        {/*Checking if the event is already booked and disabling the button*/}
                        {isAlreadyBooked && (
                            <>
                                <button className='bg-gray-400 text-white font-bold mt-5 py-2 px-4 rounded-xlg w-60' disabled>You have a ticket!</button>
                            </>
                        )}
                        {/*Checking if the booking is full and disabling the button if it is*/}
                        {isBookButtonDisabled && !isAlreadyBooked && (
                            <>
                                <button className='bg-gray-400 text-white font-bold mt-5 py-2 px-4 rounded-xlg w-60' disabled>Booking Full</button>
                                <p className='text-sm mb-2 mt-4'>Wait for a spot to be reserved!</p>
                                {/*Enabling the waiting list button if the booking is full*/}
                                {!isAlreadyInWaitingList && (
                                    <button className="bg-colour1 hover:bg-bookHover text-white font-bold py-2 px-4 rounded-xlg xs:w-60 md:w-80 mb-20" onClick={() => handleWaitlistClick(selectedBookings)}>Join</button>
                                )}
                                {/*Disabling the waiting list button if the user is already in the waiting list*/}
                                {isAlreadyInWaitingList && (
                                    <button className="bg-gray-400 text-white font-bold py-2 px-4 rounded-xlg xs:w-60 md:w-80 mb-20" disabled>Joined</button>
                                )}
                            </>
                        )}
            </div>
        </div>
      )
  }
  
export default EventInfo