import React, { useState, useEffect } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import backBtn from '../assets/back_button.png';
import qrCode from '../assets/qr_code.png';

function BookedEventInfo() {
    const [booking, setBooking] = useState(null);
    const { bookingId } = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        const fetchBookingsData = async () => {
            try {
                const bookingRef = doc(firestore, 'Bookings', bookingId);
                const bookingsSnapshot = await getDoc(bookingRef);
                if (bookingsSnapshot.exists()) {
                    setBooking(bookingsSnapshot.data());
                } else {
                    console.error('Event not found');
                }
            } catch (error) {
                console.error('Error fetching event data: ', error);
            }
        };
        fetchBookingsData();
    }, [bookingId]);

    if (!booking) {
        return <div>Loading...</div>
    }

    const handleCancelBooking = async () => {
        try {
            const confirmed = window.confirm("Are you sure you want to cancel this booking?")
            if(confirmed){
                const bookingRef = doc(firestore, 'Bookings', bookingId)
                const bookingSnapshot = await getDoc(bookingRef)
                const bookingData = bookingSnapshot.data()
        
                const eventRef = doc(firestore, 'Events', bookingData.EventId)
                const eventSnapshot = await getDoc(eventRef)
                const eventData = eventSnapshot.data()
    
                const updatedEventAttendance = eventData.EventAttendance - 1
                await updateDoc(eventRef, {
                    EventAttendance: updatedEventAttendance
                })
                await deleteDoc(bookingRef)
                navigate('/bookings')
            }else{
                window.alert('Booking was not cancelled')
            }
            
        } catch (error) {
            console.error('Error canceling booking: ', error)
        }
    }

    return (
      <div>
        <img src={backBtn} alt="Back" className="h-6 w-6 ml-10" onClick={() => navigate(-1)} />
            <div key={booking.id} className='ml-10 mr-10 flex flex-col'>
                <h1 className='flex justify-center font-bold text-xl border-b-2 border-b-black'>{booking.EventName}</h1>
                <p className='flex justify-center text-sm mt-10'>{booking.EventAddress}, {booking.EventLocation}</p>
                <p className='flex justify-center text-sm mt-1'>{booking.EventDate} at {booking.EventTime}</p>
            </div>
            <div className='flex flex-col items-center'>
                <p className='mt-10 text-lg'>My Ticket</p>
                <img src={qrCode} alt="QR Code" className="h-60 w-60 mt-4" />
            </div>
            <div className='flex justify-center mt-10'>
                <button className='bg-steelBlue p-4 rounded-lg text-white xs:w-60 md:w-80'>Download Ticket (PDF)</button>
            </div>
            <div className='flex justify-center mt-10'>
                <button className='bg-red-400 p-4 rounded-lg text-white xs:w-60 md:w-80' onClick={handleCancelBooking}>Cancel Booking</button>
            </div>
      </div>
    )
  }
  
  export default BookedEventInfo