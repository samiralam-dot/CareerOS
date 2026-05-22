import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL = "https://career-os-oh6v.vercel.app/api";
const BASE_URL1="https://career-os-d4ze.vercel.app/api";

// ================= INTERVIEW =================

export const updateInterview = async (interviewId, updatedData) => {
  try {
    const res = await axios.put(
      `${BASE_URL}/interview/update/${interviewId}`,
      updatedData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return res.data;

  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createInterview = async (
  jobId,
  students,
  date,
  time,
  meetingLink
) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/interview/create`,
      {
        jobId,
        students,
        date,
        time,
        meetingLink,
      },
      {
        withCredentials: true
      }
    );

    return res.data;

  } catch (error) {
    throw error;
  }
};

export const deleteInterview = async (interviewId) => {
  try {
    const res = await axios.delete(
      `${BASE_URL}/interview/delete/${interviewId}`,
      {
        withCredentials: true
      }
    );

    return res.data;

  } catch (error) {
    throw error;
  }
};

// ================= NOTIFICATION =================

export const createNotification = async (title, message, userId) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/notification/create`,
      {
        title,
        message,
        userId
      }
    );

    return res.data;

  } catch (error) {
    throw error;
  }
};

export const updateNotification = async (notificationId) => {
  try {
    const res = await axios.put(
      `${BASE_URL}/notification/${notificationId}`,
      {
        read: true,
      }
    );

    return res.data;

  } catch (error) {
    throw error;
  }
};

// ================= AUTH =================

export const signIn = async (email, password) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/login`,
      { email, password },
      { withCredentials: true }
    );

    const data = response.data;

    if (data.user) {
      sessionStorage.clear();
      sessionStorage.setItem("user", JSON.stringify(data.user));
      sessionStorage.setItem("role", data.user.role);
    }

    return data;

  } catch (error) {
 toast.error("Login error:", error.response?.data || error);
  }
};

export const signUp = async (userData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/signup`,
      userData,
      { withCredentials: true }
    );

    return response.data;

  } catch (error) {
     toast.error("Login error:", error.response?.data || error);
  }
};

export const signOut = async () => {
  const res = await axios.post(
    `${BASE_URL}/user/signout`,
    {},
    { withCredentials: true }
  );

  return res.data;
};

// ================= MAIL  otp and other mail also=================

export const sendOtpMail = async (email, subject, html) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/send-mail`,
      {
        email,
        subject,
        html
      }
    );

    return res.data;

  } catch (error) {
    throw error;
  }
};

// ================= PROFILE =================

export const getProfile = async () => {
  try {
    const res = await axios.get(
      `${BASE_URL}/profile`,
      { withCredentials: true }
    );

    return res.data;

  } catch (err) {
    throw err;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/profile/create`,
      profileData,
      { withCredentials: true }
    );

    return res.data.user;

  } catch (err) {
    throw err;
  }
};

// ================= JOB =================

export const createJob = async (payload) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/job/create`,
      payload,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;

  } catch (error) {
    throw error;
  }
};

export const getAlljob = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/job`);
    return res.data.jobs;

  } catch (err) {
    throw err;
  }
};

export const getjobById = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/job/${id}`);
    return res.data;

  } catch (err) {
    throw err;
  }
};

export const deletejob = async (id) => {
  try {
    const res = await axios.delete(
      `${BASE_URL}/job/${id}`,
      { withCredentials: true }
    );

    return res.data;

  } catch (err) {
    throw err;
  }
};

export const updatejob = async (id, jobData) => {
  try {
    const res = await axios.put(
      `${BASE_URL}/job/${id}`,
      jobData,
      { withCredentials: true }
    );

    return res.data;

  } catch (err) {
    throw err;
  }
};

// ================= USER =================

export const getAllUser = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/user`);
    return res.data;

  } catch (err) {
    throw err;
  }
};

export const getuserByEmail = async (email) => {
  try {
    const res = await axios.get(`${BASE_URL}/user/${email}`);
    return res.data;

  } catch (err) {
    throw err;
  }
};

export const updateUser = async (userId, updateData) => {
  try {
    const res = await axios.put(
      `${BASE_URL}/user/${userId}`,
      updateData,
      { withCredentials: true }
    );

    return res.data;

  } catch (error) {
    throw error;
  }
};

// ================= APPLICATION =================

export const createApplication = async (data) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/application/apply`,
      data,
      { withCredentials: true }
    );

    return res.data;

  } catch (err) {
    throw err;
  }
};

export const findapplication = async (data) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/application/${data}`,
      { withCredentials: true }
    );

    return res.data.application;

  } catch (err) {
    throw err;
  }
};

export const updateApplication = async (applicationId, data) => {
  try {
    const res = await axios.put(
      `${BASE_URL}/application/${applicationId}`,
      data,
      { withCredentials: true }
    );

    return res.data;

  } catch (err) {
    throw err;
  }
};

// ================= FILE UPLOAD =================

export const uploadFiles = async (files) => {
  try {
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    const res = await axios.post(
      `${BASE_URL}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    return res.data;

  } catch (error) {
    throw error;
  }
};

// ================= FILE DELETE =================

export const deleteFile = async (publicId, resourceType = null) => {
  try {
    const res = await axios.delete(
      `${BASE_URL}/deletefile`,
      {
        data: {
          publicId,
          resourceType,
        },
      }
    );

    return res.data;

  } catch (error) {
    throw error;
  }
};
