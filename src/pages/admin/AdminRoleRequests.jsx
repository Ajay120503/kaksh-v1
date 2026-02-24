import { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import toast from "react-hot-toast";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";

export default function AdminRoleRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const { data } = await adminService.getRoleRequests();
      setRequests(data);
    } catch {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  /* ================= ACTIONS ================= */

  const approve = async (id) => {
    try {
      await adminService.approveRoleRequest(id);
      toast.success("Role Approved");
      fetchRequests();
    } catch {
      toast.error("Approval failed");
    }
  };

  const reject = async (id) => {
    try {
      await adminService.rejectRoleRequest(id);
      toast.success("Request Rejected");
      fetchRequests();
    } catch {
      toast.error("Reject failed");
    }
  };

  const deleteRequest = async (id) => {
    try {
      await adminService.deleteRoleRequest(id);
      toast.success("Request deleted");
      fetchRequests();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-lg"></span>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-full bg-primary/10">
          <span className="text-xl">🛡️</span>
        </div>
        <h1 className="text-2xl font-bold">Teacher Role Requests</h1>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center mt-10">
          <span className="loading loading-lg"></span>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && requests.length === 0 && (
        <div className="text-center py-16 text-base-content/60">
          <p className="text-lg">No role requests available</p>
          <p className="text-sm opacity-70">
            Teacher requests will appear here
          </p>
        </div>
      )}

      {/* NOTIFICATION LIST */}
      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req._id}
            className="group flex gap-4 p-2 bg-base-100 border border-base-300 hover:shadow-lg transition-all duration-200"
          >
            {/* STATUS BAR */}
            <div
              className={`w-1 rounded-full ${
                req.status === "approved"
                  ? "bg-success"
                  : req.status === "rejected"
                  ? "bg-error"
                  : "bg-warning"
              }`}
            />

            {/* USER AVATAR */}
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-lg shrink-0">
              {req.user?.name?.charAt(0).toUpperCase()}
            </div>

            {/* CONTENT */}
            <div className="flex-1">
              <p className="font-semibold text-lg">
                {req.user?.name}
                <span className="font-normal text-base-content/70">
                  {" "}
                  requested role{" "}
                </span>
                <span className="text-primary font-medium">
                  {req.requestedRole}
                </span>
              </p>

              <p className="text-sm text-base-content/60 mt-1">
                {req.user?.email}
              </p>

              <div className="mt-3 flex items-center gap-3">
                <span
                  className={`badge badge-sm ${
                    req.status === "approved"
                      ? "badge-success"
                      : req.status === "rejected"
                      ? "badge-error"
                      : "badge-warning"
                  }`}
                >
                  {req.status}
                </span>

                <span className="text-xs text-base-content/50">
                  Role change request
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="hidden sm:flex gap-2 opacity-0 group-hover:opacity-100 transition">
              {req.status === "pending" && (
                <>
                  <button
                    onClick={() => approve(req._id)}
                    className="btn btn-xs btn-success btn-circle"
                    title="Approve"
                  >
                    <FaCheck size={16} />
                  </button>

                  <button
                    onClick={() => reject(req._id)}
                    className="btn btn-xs btn-error btn-circle"
                    title="Reject"
                  >
                    <FaTimes size={16} />
                  </button>
                </>
              )}
              <button
                onClick={() => deleteRequest(req._id)}
                className="btn btn-xs btn-circle btn-ghost text-error"
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
