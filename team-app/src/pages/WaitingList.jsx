import React from 'react';
import { useNavigate  } from 'react-router-dom';
import backBtn from '../assets/back_button.png';


function WaitingList() {
    
    const navigate = useNavigate();

    return(
        <div>
            <img src={backBtn} alt="Back" className="h-6 w-6 ml-10" onClick={() => navigate(-1)} />
            <h1 className='flex justify-center font-bold text-xl border-b-2 border-b-black mr-10 ml-10'>Your Waiting List</h1>
        </div>
    )
}

export default WaitingList