import { useState } from 'react'
import Home from './pages/Home'
import Events from './pages/Events'
import Calendar from './pages/Calendar'
import Bookings from './pages/Bookings'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'

function App() {


  return (
    <div>
        <Navbar />
        <Routes>
          <Route path = "/" element={<Home />} />
          <Route path = "/events" element={<Events />} />
          <Route path = "/calendar" element={<Calendar />} />
          <Route path = "/bookings" element={<Bookings />} />
        </Routes>
    </div>
  )
}

export default App
