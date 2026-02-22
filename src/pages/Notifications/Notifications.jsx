import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationRead,
  deleteNotification,
} from "../../services/notificationService";

import { Trash2, Check, Bell } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  /* ================= LOAD ================= */
  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch {
      toast.error("Failed to load notifications");
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  /* ================= MARK READ ================= */
  const markRead = async (id) => {
    try {
      await markNotificationRead(id);

      setNotifications((prev) =>
        prev.map((n) => {
          if (n._id === id) {
            // update recipients immutably
            const updatedRecipients = n.recipients.map((r) =>
              r.user.toString() === user.id ? { ...r, read: true } : r
            );
            return { ...n, recipients: updatedRecipients };
          }
          return n;
        })
      );
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };

  /* ================= DELETE ================= */
  const remove = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("Notification removed");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= REDIRECT ================= */
  const handleRedirect = async (notification) => {
    try {
      // mark read first (updates UI automatically)
      await markRead(notification._id);

      // redirect
      if (notification.link) {
        navigate(notification.link);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= ROLE FILTER ================= */
  const roleNotifications = notifications.filter((n) =>
    n.recipients.some((r) => r.role === user.role)
  );

  /* ================= UI ================= */
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Bell className="text-primary" />
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      {roleNotifications.length === 0 && (
        <div className="alert">
          <span>No notifications available</span>
        </div>
      )}

      <div className="space-y-4">
        {roleNotifications.map((n) => {
          const myRecipient = n.recipients.find(
            (r) => r.user.toString() === user.id
          );

          const unread = myRecipient ? !myRecipient.read : false;

          return (
            <div
              key={n._id}
              onClick={() => handleRedirect(n)}
              className={`
                card border transition-all duration-200 cursor-pointer
                hover:shadow-lg hover:-translate-y-0.5
                ${
                  unread
                    ? "bg-primary/10 border-primary"
                    : "bg-base-100 border-base-300"
                }
              `}
            >
              <div className="card-body p-4 flex-row justify-between items-start">
                {/* CONTENT */}
                <div className="flex-1">
                  <h3 className="font-semibold text-base-content">{n.title}</h3>

                  <p className="text-sm opacity-70 mt-1">{n.message}</p>

                  <span className="text-xs opacity-50">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* ACTION BUTTONS */}
                <div
                  className="flex gap-2 ml-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  {unread && (
                    <button
                      onClick={() => markRead(n._id)}
                      className="btn btn-success btn-xs text-white btn-circle"
                    >
                      <Check size={14} />
                    </button>
                  )}

                  <button
                    onClick={() => remove(n._id)}
                    className="btn btn-error btn-xs text-white btn-circle"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
