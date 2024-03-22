import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "./firebaseConfig";
import { useEffect } from "react";

function NotificationsUtil(props) {
  useEffect(() => {
    fetchEvents().then((newEvents) => {
      if (!props.eventsFetched) {
        props.setEvents(newEvents);
        props.setEventsFetched(true);
        newEvents.forEach((val) => {
          checkTicketLimit(val);
        });
      }
    });

    const interval = setInterval(() => {
      NotificationInterval();
    }, 36000000); //10 hours

    return () => {
      clearInterval(interval);
    };
  }, [props.events]);

  const NotificationInterval = async () => {
    const newEvents = await fetchEvents();

    checkEvents(newEvents);
  };

  const fetchEvents = async () => {
    try {
      const eventsCollection = collection(firestore, "Events");
      const eventsSnapshot = await getDocs(eventsCollection);
      const eventsData = eventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return eventsData;
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  };

  const checkEvents = (newEvents) => {
    const eventIds = props.events.map((e) => e.id);
    newEvents.forEach((val, index) => {
      if (!eventIds.includes(val.id)) {
        showNotification(val, "A new event has been added!");
        checkTicketLimit(val);
        props.setEvents(newEvents);
      }
    });
  };

  const showNotification = (val, text) => {
    props.toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">{text}</p>
              <p className="mt-1 text-sm text-gray-500">{val.EventName}</p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    ));
  };

  const checkTicketLimit = (val) => {
    let ticketsLeft;
    if (val.EventLimit && val.EventAttendance)
      ticketsLeft = parseInt(val.EventLimit) - parseInt(val.EventAttendance);

    if (ticketsLeft != undefined && ticketsLeft <= 5 && ticketsLeft > 0) {
      showNotification(val, "This event has less that 5 tickets left");
    }
  };
}

export default NotificationsUtil;
