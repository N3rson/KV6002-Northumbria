import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { firestore } from "./firebaseConfig";
import { useEffect, useState } from "react";
import { auth } from "./firebaseConfig";
import { Link } from "react-router-dom";

/**
 * Notifications Utility
 *
 * This component is responsible for checking for new notifications and populating the notification table
 *
 * @category Page
 * @author Sayed Husain Kadhem
 */
function NotificationsUtil(props) {
  const currentUser = auth.currentUser;
  const [fetchedBookings, setFetchedBookings] = useState(false);
  const [userAccepted, setUserAccepted] = useState(Notification.permission === "granted"? true:false);

  const askPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      return true;
    } else if (Notification.permission !== "denied") {
      let permission = await Notification.requestPermission();
      if (permission === "granted") {
        setUserAccepted(true);
        return true;
      } else {
        return false;
      }
    }
  };

  askPermission();

  useEffect(() => {
    if (userAccepted) {
      fetchEvents().then((newEvents) => {
        if (!props.eventsFetched) {
          props.setEvents(newEvents);
          props.setEventsFetched(true);
          newEvents.forEach((val) => {
            checkTicketLimit(val);
          });
        }
      });

      if (!fetchedBookings) {
        fetchBookings().then((newBookings) => {
          checkBookings(newBookings);
          setFetchedBookings(true);
        });
      }

      const interval = setInterval(() => {
        NotificationInterval();
        console.log("notification interval");
      }, 36000000); //10 hours

      return () => {
        clearInterval(interval);
      };
    }
  }, [props.events, userAccepted]);

  const NotificationInterval = async () => {
    const newEvents = await fetchEvents();
    const newBookings = await fetchBookings();

    if (newEvents) checkEvents(newEvents);

    //if (newBookings) checkBookings(newBookings);
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

  const fetchBookings = async () => {
    try {
      const bookingsCollection = collection(firestore, "Bookings");
      const userBookingsQuery = query(
        bookingsCollection,
        where("userId", "==", currentUser.uid)
      );
      const bookingsSnapshot = await getDocs(userBookingsQuery);
      const bookingsData = bookingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return bookingsData;
    } catch (error) {
      console.error("Error fetching bookings: ", error);
    }
  };

  const checkEvents = (newEvents) => {
    const eventIds = props.events.map((e) => e.id);
    newEvents.forEach((val, index) => {
      if (!eventIds.includes(val.id)) {
        showNotification(val, "A new event has been added!", "events");
        checkTicketLimit(val);
        props.setEvents(newEvents);
      }
    });
  };

  const checkBookings = (newBookings) => {
    let today = new Date();
    newBookings.forEach((val, index) => {
      if (val.EventDate) {
        let eventDate = new Date(val.EventDate);
        let Difference_In_Time = eventDate.getTime() - today.getTime();
        let Difference_In_Days =
          Math.round(Difference_In_Time / (1000 * 3600 * 24)) + 1;

        if (Difference_In_Days <= 5 && Difference_In_Days >= 0)
          showNotification(
            val,
            "You have a booked event in " + Difference_In_Days + " days",
            "bookings"
          );
      }
    });
  };

  const showNotification = (val, text, type) => {
    props.toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <Link className="flex-1 w-0 " to="/notifications">
          <div className="p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{text}</p>
                <p className="mt-1 text-sm text-gray-500">{val.EventName}</p>
              </div>
            </div>
          </div>
        </Link>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => props.toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    ));
    
    
    addToHistory(val, text, type);
    sendDesktopNotification(val, text);
  };

  const checkTicketLimit = (val) => {
    let ticketsLeft;
    if (val.EventLimit && val.EventAttendance)
      ticketsLeft = parseInt(val.EventLimit) - parseInt(val.EventAttendance);

    if (ticketsLeft != undefined && ticketsLeft <= 5 && ticketsLeft > 0) {
      showNotification(
        val,
        "This event has less that 5 tickets left",
        "events"
      );
    }
  };

  const addToHistory = async (val, text, type) => {
    //Responsible for adding the notification to the database
    const notificationRef = collection(firestore, "Notifications");
    let notificationDocRef = "";
    let today = new Date();
    if (type == "events") {
      notificationDocRef = await addDoc(notificationRef, {
        notificationName: val.EventName,
        notificationEventRef: val.id,
        notificationDesc: text,
        notificationType: type,
        notificationDate: today.toISOString(),
        userId: currentUser.uid,
      });
    } else if (type == "bookings") {
      notificationDocRef = await addDoc(notificationRef, {
        notificationName: val.EventName,
        notificationBookingRef: val.id,
        notificationDesc: text,
        notificationType: type,
        notificationDate: today.toISOString(),
        userId: currentUser.uid,
      });
      console.log(notificationDocRef);
    }
  };

  const sendDesktopNotification = (val, text)=>{
    let notification = new Notification(val.EventName, {
      body: text
    })
  }
}

export default NotificationsUtil;
