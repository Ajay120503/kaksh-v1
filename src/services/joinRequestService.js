import api from "./api";

export default {
  getRequests: () => api.get("/join-requests"),
  approve: (id) => api.patch(`/join-requests/approve/${id}`),
  reject: (id) => api.patch(`/join-requests/reject/${id}`),
  delete: (id) => api.delete(`/join-requests/${id}`),
};