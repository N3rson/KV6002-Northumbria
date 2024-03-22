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
            <div className="flex flex-col items-center gap-6 mx-6">
                    {notifications.map(notification => (
                        <div key={notification.id} className='backdrop-blur-sm w-full p-3 shadow-middle bg-white/30 rounded-lg'>
                            <h2 className='pb-1 font-semibold text-colour1'>{notification.title}</h2>
                            <p className='flex text-s'>{notification.message}</p>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default Notifications