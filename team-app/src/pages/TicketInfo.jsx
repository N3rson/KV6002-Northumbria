import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import qrCode from '../assets/qr_code.png'
import BackBtn from '../components/BackBtn'
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore'
import { firestore } from '../firebaseConfig'

/**
 * TicketInfo Page
 * 
 * This Page is responsible for displaying the user's ticket information. It allows the user to download the ticket and cancel the ticket.
 * 
 * @category Page
 * @author Pawel Lasota
*/

function TicketInfo(){
    const { ticketId, bookingId } = useParams()
    let navigate = useNavigate()

    //Responsible for cancelling the ticket and updating the database
    const handleTicketCancellation = async () => {
        try {
            //Confirmation dialog to ensure the user wants to cancel the ticket
            const confirmed = window.confirm("Are you sure you want to cancel this ticket?")
            if (!confirmed) {
                console.error('Ticket cancellation was aborted.')
                return;
            }
            
            //referencing appropriate documents in the database
            const bookingRef = doc(firestore, 'Bookings', bookingId)
            const ticketRef = doc(bookingRef, 'Tickets', ticketId)

            //deleting the ticket from the database for the correct booking
            await deleteDoc(ticketRef)
            const bookingSnapshot = await getDoc(bookingRef)
            if (!bookingSnapshot.exists()) {
                console.error('Booking not found')
                return
            }

            //updating the number of tickets for the booking
            const bookingData = bookingSnapshot.data()
            const updatedNumberOfTickets = bookingData.NumberOfTickets - 1
    
            //if the number of tickets is 0, the booking is deleted, otherwise the number of tickets is updated
            if (updatedNumberOfTickets === 0) {
                await deleteDoc(bookingRef)
                navigate('/bookings')
            } else {
                await updateDoc(bookingRef, { NumberOfTickets: updatedNumberOfTickets })
            }

            //referencing the event collection to update the number of attendees
            const eventRef = doc(firestore, 'Events', bookingData.EventId)
            const eventSnapshot = await getDoc(eventRef)
            if (!eventSnapshot.exists()) {
                console.error('Event not found')
                return;
            }
            const eventData = eventSnapshot.data()
            const updatedEventAttendance = eventData.EventAttendance - 1
    
            await updateDoc(eventRef, {
                EventAttendance: updatedEventAttendance
            })

            //alerting the user that the ticket was successfully cancelled
            window.alert('Ticket successfully cancelled.')
            navigate('/bookings');
        } catch (error) {
            console.error('Error canceling ticket: ', error)
        }
    }

    //JSX to display the ticket information
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