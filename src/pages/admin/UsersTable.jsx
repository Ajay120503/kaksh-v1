import adminService from "../../services/adminService";
import toast from "react-hot-toast";
import { MdDelete, MdBlock } from "react-icons/md";
import { useState } from "react";

export default function UsersTable({ users = [], setUsers, currentUserId }) {
  const [loadingId, setLoadingId] = useState(null);

  const changeRole = async (id, role) => {
    try {
      setLoadingId(id);
      await adminService.changeRole(id, role);
      toast.success("Role updated");

      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
    } catch {
      toast.error("Role update failed");
    } finally {
      setLoadingId(null);
    }
  };

  const toggleBlock = async (id) => {
    try {
      setLoadingId(id);
      await adminService.toggleBlock(id);
      toast.success("User updated");

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isBlocked: !u.isBlocked } : u))
      );
    } catch {
      toast.error("Action failed");
    } finally {
      setLoadingId(null);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete user permanently?")) return;

    try {
      setLoadingId(id);
      await adminService.deleteUser(id);
      toast.success("User deleted");

      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="overflow-x-auto bg-base-100 shadow-xl border border-base-300 max-h-90">
      <table className="table table-zebra">
        <thead className="bg-base-200 sticky top-0 z-10">
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-6 text-base-content/60">
                No users found
              </td>
            </tr>
          ) : (
            users.map((u) => {
              const isSelf = u._id === currentUserId;

              return (
                <tr key={u._id} className="hover">
                  {/* EMAIL */}
                  <td className="font-medium">{u.email}</td>

                  {/* ROLE */}
                  <td>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs font-medium text-gray-500">
                        Student
                      </span>

                      <input
                        type="checkbox"
                        className="toggle toggle-sm toggle-primary"
                        checked={u.role === "teacher"}
                        disabled={isSelf || loadingId === u._id}
                        onChange={(e) =>
                          changeRole(
                            u._id,
                            e.target.checked ? "teacher" : "student"
                          )
                        }
                      />

                      <span className="text-xs font-medium text-gray-500">
                        Teacher
                      </span>
                    </label>
                  </td>

                  {/* STATUS */}
                  <td>
                    {u.isBlocked ? (
                      <span className="badge badge-error badge-outline">
                        Blocked
                      </span>
                    ) : (
                      <span className="badge badge-success badge-outline">
                        Active
                      </span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="flex justify-end gap-2">
                    <button
                      className="btn btn-warning btn-sm btn-circle tooltip tooltip-bottom"
                      data-tip={u.isBlocked ? "Unblock user" : "Block user"}
                      disabled={isSelf || loadingId === u._id}
                      onClick={() => toggleBlock(u._id)}
                    >
                      <MdBlock size={18} />
                    </button>

                    <button
                      className="btn btn-error btn-sm btn-circle tooltip tooltip-bottom"
                      data-tip="Delete user"
                      disabled={isSelf || loadingId === u._id}
                      onClick={() => deleteUser(u._id)}
                    >
                      <MdDelete size={18} />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
