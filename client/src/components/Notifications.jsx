import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import "../styles/Notification.css";
import API from "../config";

export default function Notifications() {
  const { token, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchNotifications();

    const socket = io(API);
    socket.emit("join", user?._id);
    socket.on("notification", (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);
    });

    return () => socket.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(`${API}/api/notifications`, { headers });
      setNotifications(data.data);
    } catch (err) {}
  };

  const markRead = async (id) => {
    try {
      await axios.patch(`${API}/api/notifications/${id}/read`, {}, { headers });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {}
  };

  const markAllRead = async () => {
    try {
      await axios.patch(`${API}/api/notifications/read-all`, {}, { headers });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {}
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="notification-bell" ref={ref}>
      <div onClick={() => setOpen(!open)} style={{ fontSize: "24px", padding: "4px" }}>
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button className="mark-all-btn" onClick={markAllRead}>
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="empty-notifications">No notifications</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`notification-item ${!n.isRead ? "unread" : ""}`}
                onClick={() => markRead(n._id)}
              >
                <p>{n.message}</p>
                <span>{new Date(n.createdAt).toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
