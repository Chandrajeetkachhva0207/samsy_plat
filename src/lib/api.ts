const API_BASE_URL = "http://localhost:5000/api";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("admin_token", token);
  } else {
    localStorage.removeItem("admin_token");
  }
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401) {
      setAuthToken(null);
    }
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  getMe: () => request("/auth/me"),

  // Admin Dashboard
  getAdminStats: () => request("/admin/dashboard-stats"),

  // Contact Messages
  sendContactMessage: (payload: { name: string; phone: string; email?: string | undefined; message: string }) =>
    request("/contact-messages", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getContactMessages: () => request("/contact-messages"),

  markMessageAsRead: (id: string) =>
    request(`/contact-messages/${id}/read`, { method: "PATCH" }),

  deleteContactMessage: (id: string) =>
    request(`/contact-messages/${id}`, { method: "DELETE" }),

  // Events
  getEvents: () => request("/events"),

  createEvent: (payload: FormData | any) => {
    const isFormData = payload instanceof FormData;
    return request("/events", {
      method: "POST",
      body: isFormData ? payload : JSON.stringify(payload),
    });
  },

  updateEvent: (id: string, payload: FormData | any) => {
    const isFormData = payload instanceof FormData;
    return request(`/events/${id}`, {
      method: "PUT",
      body: isFormData ? payload : JSON.stringify(payload),
    });
  },

  deleteEvent: (id: string) =>
    request(`/events/${id}`, { method: "DELETE" }),

  // Gallery
  getGallery: () => request("/gallery"),

  createGalleryItem: (payload: FormData | any) => {
    const isFormData = payload instanceof FormData;
    return request("/gallery", {
      method: "POST",
      body: isFormData ? payload : JSON.stringify(payload),
    });
  },

  deleteGalleryItem: (id: string) =>
    request(`/gallery/${id}`, { method: "DELETE" }),

  // Videos
  getVideos: () => request("/videos"),

  createVideo: (payload: any) =>
    request("/videos", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  deleteVideo: (id: string) =>
    request(`/videos/${id}`, { method: "DELETE" }),

  // Annual Reports
  getReports: () => request("/annual-reports"),

  createReport: (payload: FormData | any) => {
    const isFormData = payload instanceof FormData;
    return request("/annual-reports", {
      method: "POST",
      body: isFormData ? payload : JSON.stringify(payload),
    });
  },

  deleteReport: (id: string) =>
    request(`/annual-reports/${id}`, { method: "DELETE" }),
};
