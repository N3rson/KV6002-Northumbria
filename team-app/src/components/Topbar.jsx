import { Link, useLocation  } from 'react-router-dom'

function Topbar(props){
    return (
        <>
            <div className="Topbar flex flex-row items-center">
                <div>
                    <h1 className='text-bold'>{props.pageName}</h1>
                </div>
                <div className='ml-auto'>
                    <Link to="/notifications"><span className="">Notifications</span></Link>
                </div>
                
            </div>
        </>
    )
}

export default Topbar;