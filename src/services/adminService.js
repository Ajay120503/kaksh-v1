import api from "./api";

const adminService = {
  // USERS
  getUsers: () => api.get("/admin/users"),
  changeRole: (id, role) =>
    api.patch(`/admin/users/${id}/role`, { role }),
  toggleBlock: (id) =>
    api.patch(`/admin/users/${id}/block`),
  deleteUser: (id) =>
    api.delete(`/admin/users/${id}`),

  // CLASSROOMS (future)
  getClassrooms: () => api.get("/admin/classrooms"),
  deleteClassroom: (id) =>
    api.delete(`/admin/classrooms/${id}`)
};

export default adminService;
