function EventInfo(props) {



    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <h1>Event Information</h1>

        <div key={event.id} className='border-b-2 border-black m-10'>
            <h2 className='flex justify-center font-bold'>{event.EventName}</h2>
            <p className='flex justify-center'>{event.EventCategory}</p>
            <p className='flex justify-center'>{event.EventDate}</p>
            <p className='flex justify-center'>{event.EventAttendance} / {event.EventLimit}</p>
            <p className='flex justify-center'>{event.EventLocation}</p>
        </div>

      </div>
    )
  }
  
export default EventInfo