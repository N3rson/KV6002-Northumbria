import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate  } from 'react-router-dom';
import { doc, getDoc, deleteDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import rightArrow from '../assets/icon_arrow_right_white.png';
import BackBtn from '../components/BackBtn';
import TicketInfo from './TicketInfo'; 

function BookedEventInfo() {
    const [booking, setBooking] = useState(null);
    const { bookingId } = useParams();
    const [tickets, setTickets] = useState([]);
    let ticketNumber = 1
    let navigate = useNavigate();

    useEffect(() => {
        const fetchBookingsData = async () => {
            try {
                const bookingRef = doc(firestore, 'Bookings', bookingId);
                const bookingsSnapshot = await getDoc(bookingRef);
                if (bookingsSnapshot.exists()) {
                    setBooking(bookingsSnapshot.data());
                    const ticketsRef = collection(bookingRef, 'Tickets');
                    const querySnapshot = await getDocs(ticketsRef);
                    const ticketsData = [];
                    querySnapshot.forEach((doc) => {
                        ticketsData.push({ id: doc.id, ...doc.data() });
                    });
                    setTickets(ticketsData);
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
    
                const updatedEventAttendance = eventData.EventAttendance - bookingData.NumberOfTickets
                await updateDoc(eventRef, {
                    EventAttendance: updatedEventAttendance
                })
                await deleteDoc(bookingRef)

                const ticketsRef = collection(bookingRef, 'Tickets');

                const querySnapshot = await getDocs(ticketsRef);
                querySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                });


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
            <BackBtn />
            <div key={booking.id} className='ml-10 mr-10 flex flex-col'>
                <h1 className='flex justify-center font-bold text-xl border-b-2 border-b-black'>{booking.EventName}</h1>
                <p className='flex justify-center text-lg mt-10'>{booking.EventAddress}</p>
                <p className='flex justify-center text-lg'>{booking.EventLocation}</p>
                <p className='flex justify-center text-lg mt-4'>{booking.EventDate} at {booking.EventTime}</p>
            </div>
            <div className='flex flex-col items-center mt-10'>
                <p className='text-lg'>My Tickets:</p>
                {tickets.map(ticket => (
                    <Link key={ticket.id} to={'/ticket/' + ticket.id}>
                        <button className='bg-steelBlue rounded-lg text-white xs:w-72 md:w-80 m-2 h-20 flex items-center justify-between'>
                            <p className='ml-2'>{ticketNumber++}</p>
                            <span>{ticket.id}</span>
                            <img src={rightArrow} alt="Arrow Right" className="mr-2" />
                        </button>
                    </Link>
                ))}
            </div>
            <div className='flex justify-center mt-10'>
                <button className='bg-red-400 p-4 rounded-lg text-white xs:w-72 md:w-80 mb-24' onClick={handleCancelBooking}>Cancel Entire Booking</button>
            </div>
      </div>
    )
  }
  
  export default BookedEventInfo