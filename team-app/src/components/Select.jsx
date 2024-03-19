
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
                className='bg-colour2 w-60 p-2 rounded-xlg text-xl border-2 border-colour2'>
                <option value="">{props.placeholder}</option>
                {props.options}
            </select>
        </div>
    )
}

export default Select