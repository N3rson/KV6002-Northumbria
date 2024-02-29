import { useState } from 'react'
import Home from './pages/Home'
import Events from './pages/Events'
import EventInfo from './pages/EventInfo'
import MyCalendar from './pages/MyCalendar'
import Bookings from './pages/Bookings'
import NotFound from './pages/NotFound'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'


function App() {


  return (
    <div className='bg-blue-200 text-black p-5 text-lg min-h-screen'>
        <Navbar />
        <Routes>
          <Route path = "/" element={<Home />} />
          <Route path = "/events" element={<Events />} />
          <Route path = "/event/:eventId" element={<EventInfo />} />
          <Route path = "/calendar" element={<MyCalendar />} />
          <Route path = "/bookings" element={<Bookings />} />
          <Route path = "*" element={<NotFound/>} />
        </Routes>
    </div>
  )
}

export default App
