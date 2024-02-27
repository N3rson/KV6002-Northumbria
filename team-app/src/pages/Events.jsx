import React, { useState, useEffect } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '../firebaseConfig'
import Select from '../components/Select'

function Events() {
    const [events, setEvents] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsCollection = collection(firestore, 'Events')
                const eventsSnapshot = await getDocs(eventsCollection)
                const eventsData = eventsSnapshot.docs.map(doc => doc.data())
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
                <h1 className='font-bold'>Events</h1>
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
                        <div key={event.id} className='border-b-2 border-black m-10'>
                            <h2 className='flex justify-center font-bold'>{event.EventName}</h2>
                            <p className='flex justify-center'>{event.EventCategory}</p>
                            <p className='flex justify-center'>{event.EventDate}</p>
                            <p className='flex justify-center'>{event.EventAttendance} Attending</p>
                            <p className='flex justify-center'>{event.EventLocation}</p>
                        </div>
                    ))}
                </div>
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
              Book
            </button>
        </div>
    )
}

export default Events