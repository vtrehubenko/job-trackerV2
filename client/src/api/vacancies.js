import { http } from "./http.js";

export const jobsApi = {
  list() {
    return http("/jobs");
  },
  create(payload) {
    return http("/jobs", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  update(id, patch) {
    return http(`/jobs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  },
  remove(id) {
    return http(`/jobs/${id}`, { method: "DELETE" });
  },
};
