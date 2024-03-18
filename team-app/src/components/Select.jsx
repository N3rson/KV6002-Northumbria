
/**
 * Select Component
 * 
 * This can be re-used to create a select dropdown with options and appropriate styling automatically
 * 
 * @category Component
 * @author Pawel Lasota
*/

function Select(props){

    return (
        <div>
            <select
                value={props.selectType}
                onChange={props.handleSelectType}
                className='bg-black w-60 rounded-xlg shadow-middle border-2 border-gray-200 text-xl text-white p-2'>
                <option value="">{props.placeholder}</option>
                {props.options}
            </select>
        </div>
    )
}

export default Select