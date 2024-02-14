import { Link, useLocation  } from 'react-router-dom'
import React from 'react'
import { slide as Slide } from 'react-burger-menu'
import hamburger from '../assets/hamburger_menu.jpg'
import { useState } from 'react'



function Menu() {
    const [isOpen, setIsOpen] = useState(false);

    const location = useLocation()
    const currentPath = location.pathname

    const linkClass = "text-white"
    const activeClass = "text-white"

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div>
            <img src={hamburger} onClick={toggleMenu} width={50} height={50} alt="Menu"></img>
            <Slide isOpen={isOpen} className='bg-black'>
                <nav>
                    <ul>
                        <li className={currentPath === '/' ? activeClass : linkClass}>
                            <Link to="/Login">Login</Link>
                        </li>
                        <li className={currentPath === '/' ? activeClass : linkClass}>
                            <Link to="/">Events</Link>
                        </li>
                        <li className={currentPath === '/' ? activeClass : linkClass}>
                            <Link to="/Calendar">Calendar</Link>
                        </li>
                    </ul>
                </nav>
            </Slide>
        </div>
    )
}

export default Menu