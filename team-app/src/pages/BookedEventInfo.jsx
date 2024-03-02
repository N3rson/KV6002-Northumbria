import React, { useState, useEffect } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import { collection, doc, getDoc, updateDoc, increment, addDoc } from 'firebase/firestore';
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

    return (
      <div>
        <img src={backBtn} alt="Back" className="h-6 w-6 ml-10" onClick={() => navigate(-1)} />
            <div key={booking.id} className='ml-10 mr-10 flex flex-col'>
                <h1 className='flex justify-center font-bold text-xl border-b-2 border-b-black'>{booking.EventName}</h1>
                <p className='flex justify-center text-sm'>{booking.EventAddress},</p>
                <p className='flex justify-center text-sm'>{booking.EventLocation}</p>
                <p className='flex justify-center text-sm mt-1'>{booking.EventDate} at {booking.EventTime}</p>
            </div>
            <div className='flex justify-center'>
                <img src={qrCode} alt="QR Code" className="h-60 w-60 mt-10" />
            </div>
      </div>
    )
  }
  
  export default BookedEventInfo