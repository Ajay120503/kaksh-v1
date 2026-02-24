import { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

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
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Teacher Role Requests</h1>

      <div className="overflow-x-auto bg-base-100 shadow rounded-box">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Requested Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td>{req.user?.name}</td>
                <td>{req.user?.email}</td>

                <td>
                  <span className="badge badge-info">{req.requestedRole}</span>
                </td>

                <td>
                  <span
                    className={`badge ${
                      req.status === "approved"
                        ? "badge-success"
                        : req.status === "rejected"
                        ? "badge-error"
                        : "badge-warning"
                    }`}
                  >
                    {req.status}
                  </span>
                </td>

                <td className="space-x-2">
                  {req.status === "pending" && (
                    <>
                      <button
                        onClick={() => approve(req._id)}
                        className="btn btn-xs btn-success"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => reject(req._id)}
                        className="btn btn-xs btn-error"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {/* DELETE BUTTON */}
                  <div className="tooltip" data-tip="Delete Request">
                    <button
                      onClick={() => deleteRequest(req._id)}
                      className="btn btn-xs btn-circle btn-ghost text-error"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
