import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, deleteDoc, doc, addDoc, query, where, updateDoc, getDoc, increment  } from 'firebase/firestore'
import { firestore, auth } from '../firebaseConfig'
import backBtn from '../assets/back_button.png'
import removeBtn from '../assets/icon_remove.png'
import confirmBtn from '../assets/icon_confirm.png'

function WaitingList() {
    const [waitingList, setWaitingList] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchWaitingList = async () => {
            const currentUser = auth.currentUser
            if (currentUser) {
                const currentUserId = currentUser.uid
                const waitingListRef = collection(firestore, 'WaitingList')
                const userWaitingListQuery = query(waitingListRef, where("userId", "==", currentUserId))
                const querySnapshot = await getDocs(userWaitingListQuery)
                const waitingListData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                setWaitingList(waitingListData)
            }
        }
    
        fetchWaitingList()
    }, [])

    const handleRemoveItem = async (id) => {
        const ticketsRef = collection(firestore, 'WaitingList', id, 'Tickets')
        const ticketsQuerySnapshot = await getDocs(ticketsRef);
        ticketsQuerySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });

        await deleteDoc(doc(firestore, 'WaitingList', id))
        setWaitingList(waitingList.filter(item => item.id !== id))
    }

    const handleConfirmBooking = async (id) => {
        const currentUser = auth.currentUser;
        const currentUserId = currentUser.uid;
    
        const waitingListItem = waitingList.find(item => item.id === id);
        const eventRef = doc(firestore, 'Events', waitingListItem.EventId);
        const eventSnapshot = await getDoc(eventRef);
        const eventData = eventSnapshot.data();
    
        if (eventData.EventAttendance + waitingListItem.NumberOfTickets > eventData.EventLimit) {
            alert("Not enough spaces for the amount of tickets. Cannot confirm booking.");
            return;
        }
    
        const bookingsRef = collection(firestore, 'Bookings');
        const bookingDocRef = await addDoc(bookingsRef, {
            EventId: waitingListItem.EventId,
            EventName: waitingListItem.EventName,
            EventAddress: waitingListItem.EventAddress,
            EventDate: waitingListItem.EventDate,
            EventTime: waitingListItem.EventTime,
            EventLocation: waitingListItem.EventLocation,
            NumberOfTickets: waitingListItem.NumberOfTickets,
            userId: currentUserId
        });
    
        const ticketsRef = collection(bookingDocRef, 'Tickets');
        for (let i = 0; i < waitingListItem.NumberOfTickets; i++) {
            await addDoc(ticketsRef, {});
        }
    
        await updateDoc(eventRef, {
            EventAttendance: increment(waitingListItem.NumberOfTickets)
        });
    
        await deleteDoc(doc(firestore, 'WaitingList', id));
        setWaitingList(waitingList.filter(item => item.id !== id));
    }

    return (
        <div>
            <img src={backBtn} alt="Back" className="h-6 w-6 ml-10" onClick={() => navigate(-1)} />
            <h1 className='flex justify-center font-bold text-xl border-b-2 border-b-black mr-10 ml-10'>Your Waiting List</h1>
            <h2 className='text-sm m-10'>This is where you are reserving spots in case someone frees some!</h2>
            <ul className='ml-10 mr-10 mt-10'>
                {waitingList.length > 0 ? (
                    waitingList.map((item, index) => (
                        <li key={index} className="py-2 bg-white p-4 rounded-lg shadow-middle flex items-center justify-between mt-5">
                            <div>
                            <button onClick={() => handleRemoveItem(item.id)}>
                                <img src={removeBtn} alt='Remove' className='h-7 w-7'></img>
                            </button >
                                <button onClick={() => handleConfirmBooking(item.id)}>
                                    <img src={confirmBtn} alt='Confirm' className='h-7 w-7 ml-4'></img>
                                </button>
                                <p className="text-lg">{item.EventName}</p>
                                <p className="text-sm">{item.EventDate} at {item.EventTime}</p>
                                <p className='text-sm'>{item.EventAddress}</p>
                                <p className="text-sm">{item.EventLocation}</p>
                                <p className='text-sm'>Joined with tickets: {item.NumberOfTickets}</p>
                            </div>
                        </li>
                    ))
                ) : (
                    <p className="text-center">Nothing to show here</p>
                )}
            </ul>
        </div>
    )
}

export default WaitingList