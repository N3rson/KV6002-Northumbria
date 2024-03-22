import React, { useState, useEffect } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '../firebaseConfig'
import Select from '../components/Select'
import { Link } from 'react-router-dom';

/**
 * Events Page
 * 
 * This page is responsible for displaying all the events. It allows the user to filter events by category.
 * 
 * @category Page
 * @author Karol Fryc
*/



function Events(props) {
    // const [events, setEvents] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')

    useEffect(() => {
        //fetching events from the database
        const fetchEvents = async () => {
            try {
                const eventsCollection = collection(firestore, 'Events')
                const eventsSnapshot = await getDocs(eventsCollection)
                const eventsData = eventsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                props.setEvents(eventsData);
                props.setEventsFetched(true);
            } catch (error) {
                console.error('Error fetching events: ', error)
            }
        }

        //fetching categories from the database
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

    //Responsible for filtering the events by category
    const handleSelectCategory = (event) => {
        setSelectedCategory(event.target.value)
    }
    const selectedCategoryName = categories.find(category => category.id === selectedCategory)?.CategoryName;
    const filteredEvents = selectedCategoryName ?
        props.events.filter(event => event.EventCategory === selectedCategoryName) : props.events;

    //JSX to display the events list appropriately and map each event to the correct category
    return (
        <div>
            <div>
                <div className='flex justify-center mt-5'>
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
                </div>
                {filteredEvents.length === 0 ? (
                <h1 className='flex justify-center mt-20'>No Events to show</h1>
                    ) : (
                        filteredEvents.map(event => (
                            <Link key={event.id} to={'/event/' + event.id}>
                                <div className='flex justify-center'>
                                    <div key={event.id} className='backdrop-blur-sm w-96 mt-10 p-3 shadow-middle bg-white/30 rounded-lg'>
                                        <div className='flex flex-row'>
                                            <h2 className='pb-1 font-semibold text-colour1'>{event.EventName}</h2>
                                            <p className='ml-auto px-2 text-center rounded-xlg border-2 border-colour1'>{event.EventAttendance} / {event.EventLimit}</p>
                                        </div>
                                        <p className=''>{event.EventCategory}</p>
                                        <p className=''>{event.EventDate}, {event.EventTime}</p>
                                        <p className=''>{event.EventLocation}</p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
        </div>
    )
}

export default Events