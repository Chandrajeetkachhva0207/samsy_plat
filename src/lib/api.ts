const API_BASE_URL =
  import.meta.env["VITE_API_URL"] ||
  "http://localhost:5000/api";

/**
 * Backend server origin.
 *
 * Example:
 * API_BASE_URL = http://localhost:5000/api
 *
 * API_ORIGIN = http://localhost:5000
 */
export const API_ORIGIN = API_BASE_URL.replace(
  /\/api\/?$/,
  ""
);

/**
 * Convert a gallery image path into a browser-accessible URL.
 *
 * Example:
 * /uploads/images/photo.jpg
 *
 * becomes:
 * http://localhost:5000/uploads/images/photo.jpg
 */
export function getGalleryImageUrl(
  image?: string | null
): string {
  // IMPORTANT:
  // Do not show another/default image when the database
  // does not contain an image.
  if (!image) {
    return "";
  }

  // Already a complete URL
  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  // Uploaded images are served by the backend
  if (image.startsWith("/uploads/")) {
    return `${API_ORIGIN}${image}`;
  }

  // Frontend public/static image
  if (image.startsWith("/")) {
    return image;
  }

  // Relative path
  return `${API_ORIGIN}/${image}`;
}

/* =====================================================
   AUTH TOKEN
===================================================== */

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

/* =====================================================
   REQUEST HELPER
===================================================== */

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  /*
    Do NOT set Content-Type manually for FormData.
    Browser automatically sets:
    multipart/form-data; boundary=...
  */
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  const data = await res
    .json()
    .catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401) {
      setAuthToken(null);
    }

    throw new Error(
      data.message ||
        `Request failed with status ${res.status}`
    );
  }

  return data;
}

/* =====================================================
   API
===================================================== */

export const api = {
  /* ===================================================
     AUTH
  =================================================== */

  /**
   * Register normal user or student
   */
  register: (credentials: {
    name: string;
    email: string;
    mobile?: string;
    password: string;
    role?: string;
  }) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  /**
   * Login user, student or admin (by email or mobile)
   */
  login: (credentials: {
    email?: string;
    identifier?: string;
    password: string;
  }) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  /**
   * Request forgot password OTP
   */
  forgotPassword: (identifier: string) =>
    request<{
      success: boolean;
      message: string;
      demoOtp?: string;
    }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ identifier }),
    }),

  /**
   * Reset password using OTP
   */
  resetPasswordWithOtp: (payload: {
    identifier: string;
    otp: string;
    newPassword: string;
  }) =>
    request<{
      success: boolean;
      message: string;
    }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /**
   * Get currently logged-in user/admin
   */
  getMe: () =>
    request("/auth/me"),

  /* ===================================================
     ADMIN DASHBOARD
  =================================================== */

  getAdminStats: () =>
    request("/admin/dashboard-stats"),

  /* ===================================================
     CONTACT MESSAGES
  =================================================== */

  sendContactMessage: (
    payload: {
      name: string;
      phone?: string | undefined;
      mobile?: string | undefined;
      email?: string | undefined;
      subject?: string | undefined;
      message: string;
    }
  ) =>
    request("/contact-messages", {
      method: "POST",
      body: JSON.stringify({
        name: payload.name,
        mobile:
          payload.mobile ||
          payload.phone,
        email: payload.email,
        subject:
          payload.subject ||
          "General Inquiry",
        message: payload.message,
      }),
    }),

  getContactMessages: () =>
    request("/contact-messages"),

  markMessageAsRead: (id: string) =>
    request(
      `/contact-messages/${id}/read`,
      {
        method: "PATCH",
      }
    ),

  deleteContactMessage: (id: string) =>
    request(
      `/contact-messages/${id}`,
      {
        method: "DELETE",
      }
    ),

  /* ===================================================
     EVENTS
  =================================================== */

  getEvents: () =>
    request("/events"),

  createEvent: (
    payload: FormData | any
  ) => {
    const isFormData =
      payload instanceof FormData;

    return request("/events", {
      method: "POST",
      body: isFormData
        ? payload
        : JSON.stringify(payload),
    });
  },

  updateEvent: (
    id: string,
    payload: FormData | any
  ) => {
    const isFormData =
      payload instanceof FormData;

    return request(`/events/${id}`, {
      method: "PUT",
      body: isFormData
        ? payload
        : JSON.stringify(payload),
    });
  },

  deleteEvent: (id: string) =>
    request(`/events/${id}`, {
      method: "DELETE",
    }),

  /* ===================================================
     GALLERY
  =================================================== */

  getGallery: () =>
    request("/gallery"),

  createGalleryItem: (
    payload: FormData | any
  ) => {
    const isFormData =
      payload instanceof FormData;

    return request("/gallery", {
      method: "POST",
      body: isFormData
        ? payload
        : JSON.stringify(payload),
    });
  },

  deleteGalleryItem: (id: string) =>
    request(`/gallery/${id}`, {
      method: "DELETE",
    }),

  /* ===================================================
     VIDEOS
  =================================================== */

  getVideos: () =>
    request("/videos"),

  createVideo: (
  payload: FormData | any
) => {
  const isFormData =
    payload instanceof FormData;

  return request("/videos", {
    method: "POST",
    body: isFormData
      ? payload
      : JSON.stringify(payload),
  });
},

  deleteVideo: (id: string) =>
    request(`/videos/${id}`, {
      method: "DELETE",
    }),

  /* ===================================================
     ANNUAL REPORTS
  =================================================== */

  getReports: () =>
    request("/annual-reports"),

  createReport: (
    payload: FormData | any
  ) => {
    const isFormData =
      payload instanceof FormData;

    return request("/annual-reports", {
      method: "POST",
      body: isFormData
        ? payload
        : JSON.stringify(payload),
    });
  },

  deleteReport: (id: string) =>
    request(`/annual-reports/${id}`, {
      method: "DELETE",
    }),

  /* ===================================================
     PAYMENT & DONATIONS (RAZORPAY)
  =================================================== */

  getPaymentKey: () =>
    request<{
      success: boolean;
      key: string;
      isTestMode: boolean;
      paymentPageUrl?: string;
    }>("/payment/key"),

  createDonationOrder: (payload: {
    amount: number;
    donorName: string;
    email: string;
    phone: string;
    panNumber?: string;
    profession?: string;
    donationType?: string;
    address?: string;
    notes?: string;
  }) =>
    request<{
      success: boolean;
      orderId: string;
      amount: number;
      currency: string;
      key: string;
      donationId: string;
    }>("/payment/create-order", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  verifyDonationPayment: (payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) =>
    request<{
      success: boolean;
      message: string;
      receiptNumber: string;
      amount: number;
      donorName: string;
      paymentId: string;
      date: string;
    }>("/payment/verify-payment", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getDonationsList: () =>
    request("/payment/donations"),

  recordDonationReceipt: (payload: {
    donorName: string;
    amount: number;
    profession?: string;
    paymentMode?: string;
    paymentId?: string;
    receiptNumber?: string;
    phone?: string;
    email?: string;
    notes?: string;
  }) =>
    request<{
      success: boolean;
      message: string;
      data: any;
    }>("/payment/record-receipt", {
      method: "POST",
      body: JSON.stringify(payload),
    }),


  /* ===================================================
     SUPPORT DETAILS
  =================================================== */

  getSupportDetails: () =>
    request("/support"),

  updateSupportDetails: (payload: any) =>
    request("/support", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  /* ===================================================
     STUDENT PORTAL
  =================================================== */

  getStudentProfile: () =>
    request<{
      success: boolean;
      profile: any;
      fees: any;
    }>("/students/profile"),

  updateStudentProfile: (payload: {
    personal?: any;
    academic?: any;
    submitForVerification?: boolean;
  }) =>
    request<{
      success: boolean;
      message: string;
      profile: any;
    }>("/students/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  uploadStudentDocument: (formData: FormData) =>
    request<{
      success: boolean;
      message: string;
      fileUrl: string;
      docType: string;
      profile: any;
    }>("/students/upload-document", {
      method: "POST",
      body: formData,
    }),

  getStudentFees: () =>
    request<{
      success: boolean;
      fees: any;
      studentInfo: any;
    }>("/students/fees"),

  /* ===================================================
     ADMIN STUDENT MANAGEMENT & FEES
  =================================================== */

  adminGetStudents: (query?: { search?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (query?.search) params.append("search", query.search);
    if (query?.status) params.append("status", query.status);
    const qs = params.toString() ? `?${params.toString()}` : "";
    return request<{
      success: boolean;
      students: any[];
      stats: {
        total: number;
        pending: number;
        verified: number;
        incomplete: number;
      };
    }>(`/admin/students${qs}`);
  },

  adminGetStudent: (id: string) =>
    request<{
      success: boolean;
      student: any;
      fees: any;
    }>(`/admin/students/${id}`),

  adminVerifyStudent: (
    id: string,
    payload: {
      status?: string;
      studentId?: string;
      adminNotes?: string;
    }
  ) =>
    request<{
      success: boolean;
      message: string;
      student: any;
    }>(`/admin/students/${id}/verify`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  adminUpdateStudentProfile: (id: string, payload: any) =>
    request<{
      success: boolean;
      message: string;
      student: any;
    }>(`/admin/students/${id}/profile`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  adminSetStudentFees: (
    id: string,
    payload: {
      totalFees?: number;
      academicYear?: string;
      nextDueDate?: string;
      feeScheduleNotes?: string;
    }
  ) =>
    request<{
      success: boolean;
      message: string;
      fees: any;
    }>(`/admin/students/${id}/fees`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  adminRecordFeePayment: (
    id: string,
    payload: {
      amount: number;
      paymentMode?: string;
      transactionRef?: string;
      paymentDate?: string;
      receivedBy?: string;
      notes?: string;
    }
  ) =>
    request<{
      success: boolean;
      message: string;
      payment: any;
      fees: any;
    }>(`/admin/students/${id}/payments`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};