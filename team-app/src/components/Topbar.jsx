import { Link, useLocation  } from 'react-router-dom'
import icon_notifications from '../assets/icon_notifications.png'
import icon_notifications_full from '../assets/icon_notifications_filled.png'
import SignOutButton from './SignOutButton'

function Topbar(props){
    return (
        <>
            <div className="Topbar flex flex-row items-center mb-5 p-4">
                <div>
                    <h1 className='font-bold text-xl'>{props.pageName}</h1>
                </div>
                <div className='ml-auto'>
                    <Link to="/notifications">
                        { props.pageName != 'Notifications' && <img src={icon_notifications} alt="notifications" className='h-6 w-6'/>}
                        { props.pageName == 'Notifications' && <img src={icon_notifications_full} alt="notifications" className='h-6 w-6'/>}
                    </Link>
                </div>
                <div className='ml-4 flex justify-end'>
                    <SignOutButton toast={props.toast} /> 
                </div>
                
            </div>
        </>
    )
}

export default Topbar;