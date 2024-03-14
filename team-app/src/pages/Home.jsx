import Flicking from "@egjs/react-flicking";
import "@egjs/react-flicking/dist/flicking.css";


function SeeAllButton() {
  return (
    <div className="ml-auto px-4 py-0.5 rounded-xlg bg-colour2 hover:bg-gradient-to-r from-colour2 to-secondary">
      <button>
        <p>See All</p>
      </button>
    </div>
  )
}

function Home() {
  return (
    <div className="p-4 text-sm">
      
      <div className="flex flex-row">
        <h2 className="font-semibold">My Weekly Events</h2>
        <SeeAllButton/>
      </div>

      <div className="my-5 shadow-middle rounded-lg bg-white">
        <div className="p-3">
          <p className="pb-2 font-semibold text-colour2">Title</p>
          <p>Category</p>
          <p>Date</p>
          <p>Spaces</p>
          <p>Location</p>
        </div>
      </div>

      <div className="flex flex-row">
        <h2 className="font-semibold">Available Weekly Events</h2>
        <SeeAllButton/>
      </div>
      <div className="my-4 rounded-lg shadow-middle bg-white">
        <div className="p-3">
          <p className="font-semibold text-colour2">Title</p>
          <p>Location</p>
        </div>
      </div>

      <div className="flex flex-row">
        <h2 className="font-semibold">Popular Events</h2>
        <SeeAllButton/>
      </div>
      <div className="my-4 rounded-lg shadow-middle bg-white">
        <div className="p-3">
          <p className="font-semibold text-colour2">Title</p>
          <p>Location</p>
        </div>
      </div>

      <div>
          <Flicking
              align="prev"
              circular={false}
              onMoveEnd={e => {
              console.log(e);
              }}>
              <div className="panel w-3/4 h-20 bg-white rounded-lg p-5 m-2 shadow-2xl">1</div>
              <div className="panel w-3/4 h-20 bg-white rounded-lg p-5 m-2 shadow-2xl">2</div>
              <div className="panel w-3/4 h-20 bg-white rounded-lg p-5 m-2 shadow-2xl">3</div>
          </Flicking>
      </div>

    </div>
  )
}
  
export default Home