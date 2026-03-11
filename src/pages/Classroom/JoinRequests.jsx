import { useEffect, useState } from "react";
import joinRequestService from "../../services/joinRequestService";
import toast from "react-hot-toast";
import { FaUserClock, FaCheck, FaTimes, FaTrash } from "react-icons/fa";

export default function JoinRequests() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const { data } = await joinRequestService.getRequests();
      setRequests(data);
    } catch (err) {
      toast.error("Failed to load requests");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approve = async (id) => {
    await joinRequestService.approve(id);
    toast.success("Student approved");
    fetchRequests();
  };

  const reject = async (id) => {
    await joinRequestService.reject(id);
    toast("Request rejected");
    fetchRequests();
  };

  const remove = async (id) => {
    await joinRequestService.delete(id);
    toast.success("Request deleted");
    fetchRequests();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-full bg-primary/10">
          <FaUserClock className="text-2xl text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Join Requests</h2>
      </div>

      {/* EMPTY STATE */}
      {requests.length === 0 && (
        <div className="text-center py-16 text-base-content/60">
          <p className="text-lg">No pending join requests</p>
          <p className="text-sm opacity-70">
            Students requests will appear here
          </p>
        </div>
      )}

      {/* NOTIFICATION FEED */}
      <div className="space-y-4">
        {requests.map((r) => (
          <div
            key={r._id}
            className="group relative flex gap-4 p-2 bg-base-100 border border-base-300 hover:shadow-lg transition-all duration-200"
          >
            {/* STATUS SIDE BAR */}
            <div
              className={`w-1 rounded-full ${
                r.status === "pending"
                  ? "bg-warning"
                  : r.status === "approved"
                  ? "bg-success"
                  : "bg-error"
              }`}
            />
            {/* Avatar */}
            <div
              className="bg-primary text-white rounded-full w-10 h-10
               flex items-center justify-center
               text-sm font-bold shadow-md"
            >
              {(() => {
                const name = r?.student?.name || "";
                const parts = name.trim().split(" ").filter(Boolean);

                if (parts.length === 0) return "U";
                if (parts.length === 1) return parts[0][0].toUpperCase();

                return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
              })()}
            </div>

            {/* CONTENT */}
            <div className="flex-1">
              <p className="font-semibold">
                {r.student.name}
                <span className="font-normal text-base-content/70">
                  {" "}
                  requested to join
                </span>{" "}
                <span className="text-primary font-medium">
                  {r.classroom.name}
                </span>
              </p>

              <div className="mt-2 flex items-center gap-3">
                <span
                  className={`badge badge-sm ${
                    r.status === "pending"
                      ? "badge-warning"
                      : r.status === "approved"
                      ? "badge-success"
                      : "badge-error"
                  }`}
                >
                  {r.status}
                </span>

                <span className="text-xs text-base-content/50">
                  Classroom access request
                </span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="hidden sm:flex gap-2 opacity-0 group-hover:opacity-100 transition">
              {r.status === "pending" && (
                <>
                  <button
                    onClick={() => approve(r._id)}
                    className="btn btn-xs btn-success btn-circle"
                    title="Approve"
                  >
                    <FaCheck size={10} />
                  </button>

                  <button
                    onClick={() => reject(r._id)}
                    className="btn btn-xs btn-error btn-circle"
                    title="Reject"
                  >
                    <FaTimes size={16} />
                  </button>
                </>
              )}

              <button
                onClick={() => remove(r._id)}
                className="btn btn-xs btn-circle btn-ghost text-error"
                title="Delete"
              >
                <FaTrash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
