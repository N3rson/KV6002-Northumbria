import { useState } from 'react'
import Home from './pages/Home'
import Events from './pages/Events'
import EventInfo from './pages/EventInfo'
import MyCalendar from './pages/MyCalendar'
import Bookings from './pages/Bookings'
import NotFound from './pages/NotFound'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Topbar from './components/Topbar'
import { Link, useLocation  } from 'react-router-dom'
import Notifications from './pages/Notifications'


function App() {
  const location = useLocation();
  const currentPath = location.pathname

  let pageNames = {
    '/':'Home',
    '/events':'Events',
    '/calendar': 'Calendar',
    '/bookings': 'My Bookings',
    '/notifications': 'Notifications'
  }

  let thisPageName = "";
  pageNames = Object.entries(pageNames)
  pageNames.map(([key, value] = page)=>{
    if(key == currentPath){
      thisPageName = value;
    }
  })

  return (
    <div className='bg-gradient-to-r from-primary to-secondary text-black p-5 text-lg min-h-screen'>
        <Topbar pageName={thisPageName}/>
        <Navbar />
        <Routes>
          <Route path = "/" element={<Home />} />
          <Route path = "/events" element={<Events />} />
          <Route path = "/event/:eventId" element={<EventInfo />} />
          <Route path = "/calendar" element={<MyCalendar />} />
          <Route path = "/bookings" element={<Bookings />} />
          <Route path = "/notifications" element={<Notifications />} />
          <Route path = "*" element={<NotFound/>} />
        </Routes>
    </div>
  )
}

export default App
