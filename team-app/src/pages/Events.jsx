import React, { useState, useEffect } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '../firebaseConfig'
import Select from '../components/Select'
import { Link } from 'react-router-dom';

function Events() {
    const [events, setEvents] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsCollection = collection(firestore, 'Events')
                const eventsSnapshot = await getDocs(eventsCollection)
                const eventsData = eventsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setEvents(eventsData)
            } catch (error) {
                console.error('Error fetching events: ', error)
            }
        }

        const fetchCategories = async () => {
            try {
                const categoriesCollection = collection(firestore, 'Categories')
                const categoriesSnapshot = await getDocs(categoriesCollection)
                const categoriesData = categoriesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setCategories(categoriesData)
            } catch (error) {
                console.error('Error fetching categories: ', error)
            }
        }

        fetchEvents()
        fetchCategories()
    }, [])

    const handleSelectCategory = (event) => {
        setSelectedCategory(event.target.value)
    }

    const selectedCategoryName = categories.find(category => category.id === selectedCategory)?.CategoryName;

    const filteredEvents = selectedCategoryName ?
        events.filter(event => event.EventCategory === selectedCategoryName) : events;

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                    <Select
                        options={categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.CategoryName}
                            </option>
                        ))}
                        placeholder="All Events"
                        selectType={selectedCategory}
                        handleSelectType={handleSelectCategory}
                    />
                    {filteredEvents.map(event => (
                    <Link key={event.id} to={'/event/' + event.id}>
                        <div key={event.id} className='bg-white rounded-lg p-4 border-black m-10 shadow-2xl shadow-middle'>
                            <h2 className='flex justify-center font-bold'>{event.EventName}</h2>
                            <p className='flex justify-center'>{event.EventCategory}</p>
                            <p className='flex justify-center'>{event.EventDate}</p>
                            <p className='flex justify-center'>{event.EventAttendance} / {event.EventLimit}</p>
                            <p className='flex justify-center'>{event.EventLocation}</p>
                        </div>
                    </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Events