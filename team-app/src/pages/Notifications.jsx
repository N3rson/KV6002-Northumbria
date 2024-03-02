import React, { useState, useEffect } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '../firebaseConfig'

function Notifications(){
    const [notifications, setnotifications] = useState([])

    useEffect(() => {
        const fetchnotifications = async () => {
            try {
                const notificationsCollection = collection(firestore, 'Notifications')
                const notificationsSnapshot = await getDocs(notificationsCollection)
                const notificationsData = notificationsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setnotifications(notificationsData)
            } catch (error) {
                console.error('Error fetching notifications: ', error)
            }
        }

        fetchnotifications()
    }, [])

    return (
        <div>
            <div className="flex flex-col items-center gap-4 mx-5">
                    {notifications.map(notification => (
                        <div key={notification.id} className='w-full bg-white rounded-lg p-4 border-black shadow-2xl shadow-middle'>
                            <h2 className='font-bold'>{notification.title}</h2>
                            <p className='flex text-s'>{notification.message}</p>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default Notifications