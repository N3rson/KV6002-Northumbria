function Select(props){

    return (
        <div>
            <select
                value={props.selectType}
                onChange={props.handleSelectType}
                className='bg-steelBlue text-white flex justify-center w-full'>
                <option value="">{props.placeholder}</option>
                {props.options}
            </select>
        </div>
    )
}

export default Select