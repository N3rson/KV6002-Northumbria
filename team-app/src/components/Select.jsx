function Select(props){

    return (
        <div>
            <select
                value={props.selectType}
                onChange={props.handleSelectType}
                className='bg-black text-white w-80 rounded-xlg border-2 border-black xs:w-40 md:w-80'>
                <option value="">{props.placeholder}</option>
                {props.options}
            </select>
        </div>
    )
}

export default Select