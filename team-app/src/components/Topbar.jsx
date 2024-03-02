import { Link, useLocation  } from 'react-router-dom'
import icon_notifications from '../assets/icon_notifications.png'
import icon_notifications_full from '../assets/icon_notifications_filled.png'

function Topbar(props){
    return (
        <>
            <div className="Topbar flex flex-row items-center bg-white shadow-middle mb-5 p-4">
                <div>
                    <h1 className='font-bold'>{props.pageName}</h1>
                </div>
                <div className='ml-auto'>

                    <Link to="/notifications">
                        { props.pageName != 'Notifications' && <img src={icon_notifications} alt="notifications" className='h-6 w-6'/>}
                        { props.pageName == 'Notifications' && <img src={icon_notifications_full} alt="notifications" className='h-6 w-6'/>}
                    </Link>

                </div>
                
            </div>
        </>
    )
}

export default Topbar;