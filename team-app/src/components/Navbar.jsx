import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import homepage_icon from '../assets/icon_homepage.png';
import calendar_icon from '../assets/icon_calendar.png';
import booking_icon from '../assets/icon_booking.png';
import event_icon from '../assets/icon_event.png';

/**
 * Navbar Component
 * 
 * This is used for the bottom navigation bar that is present on all pages.
 * 
 * @category Component
 * @author Team
*/

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const linkClass = "text-white";
  const activeClass = "scale-150";

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white rounded-t-xlg shadow-middle z-50">
      <div className="flex justify-around p-4">

        <Link to="/" className={currentPath === '/' ? activeClass : linkClass}>
          <img src={homepage_icon} alt="Home" className="h-6 w-6" />
        </Link>
        <Link to="/events" className={currentPath === '/events' ? activeClass : linkClass}>
          <img src={event_icon} alt="Events" className="h-6 w-6" />
        </Link>
        <Link to="/calendar" className={currentPath === '/calendar' ? activeClass : linkClass}>
          <img src={calendar_icon} alt="Calendar" className="h-6 w-6" />
        </Link>
        <Link to="/bookings" className={currentPath === '/bookings' ? activeClass : linkClass}>
          <img src={booking_icon} alt="Bookings" className="h-6 w-6" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
