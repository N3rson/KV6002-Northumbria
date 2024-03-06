import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import qrCode from '../assets/qr_code.png';
import BackBtn from '../components/BackBtn';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';

function TicketInfo(){
    const { ticketId, bookingId } = useParams();
    let navigate = useNavigate();

    const handleTicketCancellation = async () => {
        try {
            const confirmed = window.confirm("Are you sure you want to cancel this ticket?");
            if (!confirmed) {
                console.error('Ticket cancellation was aborted.');
                return;
            }
    
            const bookingRef = doc(firestore, 'Bookings', bookingId);
            const ticketRef = doc(bookingRef, 'Tickets', ticketId);

            await deleteDoc(ticketRef);
            const bookingSnapshot = await getDoc(bookingRef);
            if (!bookingSnapshot.exists()) {
                console.error('Booking not found');
                return;
            }

            const bookingData = bookingSnapshot.data();
            const updatedNumberOfTickets = bookingData.NumberOfTickets - 1;
    
        if (updatedNumberOfTickets === 0) {
            await deleteDoc(bookingRef);
            navigate('/bookings');
        } else {
            await updateDoc(bookingRef, { NumberOfTickets: updatedNumberOfTickets });
        }
            const eventRef = doc(firestore, 'Events', bookingData.EventId);
            const eventSnapshot = await getDoc(eventRef);
            if (!eventSnapshot.exists()) {
                console.error('Event not found');
                return;
            }
            const eventData = eventSnapshot.data();
            const updatedEventAttendance = eventData.EventAttendance - 1;
    
            await updateDoc(eventRef, {
                EventAttendance: updatedEventAttendance
            });
    
            window.alert('Ticket successfully cancelled.');
            navigate('/bookings');
        } catch (error) {
            console.error('Error canceling ticket: ', error);
        }
    };

    return(
        <div>
            <BackBtn />
            <div className='flex flex-col items-center'>
                <h1 className='flex justify-center font-bold border-b-2 border-black w-40 '>Ticket</h1>
                <h2 className='mt-4'>{ticketId}</h2>
                <img src={qrCode} alt="Ticket QR" className="w-40 h-40 mt-20" />
                <div className='flex justify-center mt-10'>
                    <button className='bg-steelBlue p-4 rounded-lg text-white xs:w-72 md:w-80'>Download Ticket (PDF)</button>
                </div>
                <div className='flex justify-center mt-2'>
                    <button className='bg-red-400 p-4 rounded-lg text-white xs:w-72 md:w-80 mt-4' onClick={handleTicketCancellation}>Cancel Ticket</button>
                </div>
            </div>
        </div>
    )
}

export default TicketInfo