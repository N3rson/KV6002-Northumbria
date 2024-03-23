import React, { useState, useEffect } from 'react';
import { auth } from './firebaseConfig';
import Home from './pages/Home';
import Events from './pages/Events';
import EventInfo from './pages/EventInfo';
import MyCalendar from './pages/MyCalendar';
import Bookings from './pages/Bookings';
import TicketInfo from './pages/TicketInfo';
import NotFound from './pages/NotFound';
import BookedEventInfo from './pages/BookedEventInfo';
import LoginPage from './pages/LoginPage';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Topbar from './components/Topbar';
import { useLocation } from 'react-router-dom';
import Notifications from './pages/Notifications';
import WaitingList from './pages/WaitingList';
import NotificationsUtil from './NotificationsUtil';
import { Toaster, toast } from 'react-hot-toast';
import AppStyling from './components/AppStyling';

function App() {
  const [events, setEvents] = useState([]);
  const [eventsFetched, setEventsFetched] = useState(false)
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);

      } else {
        setCurrentUser(null);
        navigate('/login');
      }
    });

    return () => {unsubscribe();};
  }, [navigate, events]);

  let pageNames = {
    '/': 'Home',
    '/events': 'Events',
    '/calendar': 'Calendar',
    '/bookings': 'Confirmed Bookings',
    '/notifications': 'Notifications'
  };

  let thisPageName = "";
  Object.entries(pageNames).forEach(([key, value]) => {
    if (key === currentPath) {
      thisPageName = value;
    }
  });

  if (!currentUser) {
    return <LoginPage toast={toast}/>;
  }

  return (
    <div className="overflow-x-hidden relative text-black text-lg min-h-screen"> 
      <Toaster/>
      <AppStyling />
      <NotificationsUtil events={events} setEvents={setEvents} eventsFetched={eventsFetched} setEventsFetched={setEventsFetched} toast={toast}/>
      <Topbar pageName={thisPageName} toast={toast}/>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events events={events} setEvents={setEvents} setEventsFetched={setEventsFetched}/>} />
        <Route path="/event/:eventId" element={<EventInfo />} />
        <Route path="/booking/:bookingId" element={<BookedEventInfo />} />
        <Route path="/booking/:bookingId/ticket/:ticketId/" element={<TicketInfo />} />
        <Route path="/calendar" element={<MyCalendar />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/waitinglist" element={<WaitingList />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
