function SeeAllButton() {
  return (
    <div className="ml-auto px-4 rounded-xlg bg-colour2 hover:bg-colour1">
      <button>
        <p>See All</p>
      </button>
    </div>
  )
}

function Home() {
  return (
    <div className="p-4">

      <div className="flex flex-row">
        <h2 className="font-semibold">My Weekly Events</h2>
        <SeeAllButton/>
      </div>
      <div className="my-4 rounded-lg shadow-middle bg-white">
          <p>Title</p>
          <p>Location</p>
      </div>

      <div className="flex flex-row">
        <h2 className="font-semibold">Available Weekly Events</h2>
        <SeeAllButton/>
      </div>
      <div className="my-4 rounded-lg shadow-middle bg-white">
          <p>Title</p>
          <p>Location</p>
      </div>

      <div className="flex flex-row">
        <h2 className="font-semibold">Popular Events</h2>
        <SeeAllButton/>
      </div>
      <div className="my-4 rounded-lg shadow-middle bg-white">
          <p className="flex">Title</p>
          <p className="flex">Location</p>
      </div>

    </div>
  )
}
  
export default Home