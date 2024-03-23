import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { auth } from "../firebaseConfig";
import { Link } from "react-router-dom";

/**
 * Notifications Page
 *
 * This page shows a history of notifications
 *
 * @category Page
 * @author Sayed Husain Kadhem
 */
function Notifications() {
  const [notifications, setnotifications] = useState([]);
  const currentUser = auth.currentUser;

  function minutesAgo(dateString) {
    const pastDate = new Date(dateString);
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate - pastDate;
    const differenceInMinutes = Math.floor(differenceInMilliseconds / 60000);
    return differenceInMinutes;
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationsCollection = collection(firestore, "Notifications");
        const userNotificationsQuery = query(
          notificationsCollection,
          where("userId", "==", currentUser.uid)
        );
        const notificationsSnapshot = await getDocs(userNotificationsQuery);
        const notificationsData = notificationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setnotifications(notificationsData);
      } catch (error) {
        console.error("Error fetching notifications: ", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div>
      <div className="flex flex-col items-center gap-6 mx-6">
        {notifications.map((notification) => {
          let link = "";

          let minutes = minutesAgo(notification.notificationDate);

          if (minutes == 0) {
            minutes = "just now";
          } else if (minutes >= 60) {
            minutes = Math.round(minutes / 60.0).toString() + ' hours ago';
          } else {
            minutes = minutes + " minutes ago";
          }

          if (notification.notificationType == "events")
            link = "/event/" + notification.notificationEventRef;
          else if (notification.notificationType == "bookings")
            link = "/booking/" + notification.notificationBookingRef;
          return (
            <Link className="w-full" key={notification.id} to={link}>
              <div className="w-full backdrop-blur-sm  p-3 shadow-middle bg-white/30 rounded-lg">
                <div className="flex flex-row items-center">
                  <h2 className="pb-1 font-semibold text-colour1">
                    {notification.notificationName}
                  </h2>
                  <div className="ml-auto">
                    <p className="text-xs">{minutes}</p>
                  </div>
                </div>

                <p className="flex text-s">{notification.notificationDesc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {notifications.length == 0 && (
        <div className="text-center">
          <p>You have no recent notifications</p>
        </div>
      )}
    </div>
  );
}

export default Notifications;
