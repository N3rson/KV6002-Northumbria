import backBtn from '../assets/back_button.png';
import { useNavigate  } from 'react-router-dom';

/**
 * BackBtn Component
 * 
 * This can be re-used as a back button on pages that need it
 * 
 * @category Component
 * @author Pawel Lasota
*/

function BackBtn(){
    let navigate = useNavigate();
    
    return(
        <img src={backBtn} alt="Back" className="h-6 w-6 ml-10" onClick={() => navigate(-1)} />
    )
}

export default BackBtn