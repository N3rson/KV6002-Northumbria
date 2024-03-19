import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate  } from 'react-router-dom'
import { doc, getDoc, deleteDoc, updateDoc, collection, getDocs } from 'firebase/firestore'
import { firestore } from '../firebaseConfig'
import rightArrow from '../assets/icon_arrow_right_white.png'
import BackBtn from '../components/BackBtn'

/**
 * BookedEventInfo Page
 * 
 * This page is responsible for displaying the user's booked event information. It allows the user to cancel the entire booking.
 * 
 * @category Page
 * @author Pawel Lasota, Karol Fryc
 * @generated fetchBookingsData assisted by chatGPT
*/

function BookedEventInfo() {
    const [booking, setBooking] = useState(null)
    const { bookingId } = useParams()
    const [tickets, setTickets] = useState([])
    let ticketNumber = 1
    let navigate = useNavigate()

    useEffect(() => {
        //Responsible for fetching the user's booking data from the database
        const fetchBookingsData = async () => {
            try {
                //referencing the booking document in the database
                const bookingRef = doc(firestore, 'Bookings', bookingId)
                const bookingsSnapshot = await getDoc(bookingRef)
                if (bookingsSnapshot.exists()) {
                    setBooking(bookingsSnapshot.data());
                    const ticketsRef = collection(bookingRef, 'Tickets')
                    const querySnapshot = await getDocs(ticketsRef)
                    const ticketsData = []
                    //loop to fetch the tickets subcollection for the booking
                    querySnapshot.forEach((doc) => {
                        ticketsData.push({ id: doc.id, ...doc.data() })
                    })
                    setTickets(ticketsData)
                } else {
                    console.error('Event not found')
                }
            } catch (error) {
                console.error('Error fetching event data: ', error)
            }
        } 
        fetchBookingsData()
    }, [bookingId])

    //if there is no booking at the beginning then the loading message is displayed
    if (!booking) {
        return <div>Loading...</div>
    }

    //Responsible for cancelling the entire booking and updating the database
    const handleCancelBooking = async () => {
        try {
            //Confirmation dialog to ensure the user wants to cancel the booking
            const confirmed = window.confirm("Are you sure you want to cancel this booking?")
            if(confirmed){
                //referencing the booking and event documents in the database
                const bookingRef = doc(firestore, 'Bookings', bookingId)
                const bookingSnapshot = await getDoc(bookingRef)
                const bookingData = bookingSnapshot.data()
        
                //updating the attendance upon booking cancellation
                const eventRef = doc(firestore, 'Events', bookingData.EventId)
                const eventSnapshot = await getDoc(eventRef)
                const eventData = eventSnapshot.data()
    
                const updatedEventAttendance = eventData.EventAttendance - bookingData.NumberOfTickets
                await updateDoc(eventRef, {
                    EventAttendance: updatedEventAttendance
                })
                await deleteDoc(bookingRef)

                //loop to remove the tickets subcollection alongside the booking
                const ticketsRef = collection(bookingRef, 'Tickets')
                const querySnapshot = await getDocs(ticketsRef)
                querySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref)
                });

                //return the user back to bookings
                navigate('/bookings')
            }else{
                window.alert('Booking was not cancelled')
            } 
        } catch (error) {
            console.error('Error canceling booking: ', error)
        }
    }

    //JSX to display the booked event information
    return (
      <div>
            <BackBtn />
            <div key={booking.id} className='ml-10 mr-10 flex flex-col'>
                <h1 className='flex justify-center font-bold text-xl border-b-2 border-b-black'>{booking.EventName}</h1>
                <p className='flex mt-5 justify-center font-semibold text-lg'>Location:</p>
                <p className='flex justify-center text-lg'>{booking.EventAddress}</p>
                <p className='flex justify-center text-lg'>{booking.EventLocation}</p>
                <p className='flex mt-3 justify-center font-semibold text-lg'>Date and Time:</p>
                <p className='flex justify-center text-lg'>{booking.EventDate} at {booking.EventTime}</p>
            </div>
            <div className='flex flex-col items-center mt-5'>
                <p className='mb-5 font-semibold text-lg'>My Tickets:</p>
                {tickets.map(ticket => (
                    <Link key={ticket.id} to={'/booking/' + bookingId + '/ticket/' + ticket.id}>
                        <button className='bg-colour1 rounded-lg text-white xs:w-72 md:w-80 m-2 h-20 flex items-center justify-between hover:bg-bookHover'>
                            <p className='ml-2'>{ticketNumber++}</p>
                            <span>{ticket.id}</span>
                            <img src={rightArrow} alt="Arrow Right" className="mr-2" />
                        </button>
                    </Link>
                ))}
            </div>
            <div className='flex justify-center mt-10'>
                <button className='bg-red-400 p-4 rounded-xlg text-white xs:w-72 md:w-80 mb-24 hover:bg-red-500' onClick={handleCancelBooking}>Cancel Entire Booking</button>
            </div>
      </div>
    )
  }
  
  export default BookedEventInfo