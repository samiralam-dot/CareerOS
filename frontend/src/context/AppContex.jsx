import { createContext, useState, useEffect } from "react";

import {
  signIn,
  signUp,
  getProfile,
  updateProfile,
  getAlljob,
  createInterview,
  getAllUser,
  getjobById,
getuserByEmail,
  createApplication,
  findapplication,
  uploadFiles,
  deleteFile,
  deletejob,
  updatejob,
  updateApplication,
  updateUser,sendOtpMail,
  createNotification,
  updateNotification,
  signOut,
  updateInterview,
  deleteInterview,
  createJob,
  
} from "./auth";


export const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const [user, setUser] = useState(
     null
  );

  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const [jobs, setJobs] = useState([]);

  const [users, setUsers] = useState(null);
  const[valotp,setotp]=useState(null)
  const [verifyotp,setverifyotp]=useState(false)

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAlljob();
  }, []);

  return (
    <AppContext.Provider
      value={{
        // states
        user,
        setUser,
        token,
        setToken,
        jobs,
        setJobs,
        users,
        setUsers,
        loading,
        setLoading,
        valotp,setotp,verifyotp,setverifyotp,
        createJob,
       
        

        // same function names
        signIn,
        signOut,
        signUp,
        getProfile,
        updateProfile,
        getAlljob,
        getAllUser,
        getjobById,
       getuserByEmail,
        createApplication,
        findapplication,
        uploadFiles,
        deleteFile,
        deletejob,
        updatejob,
        updateApplication,
        updateUser,sendOtpMail,
        createNotification,
        updateNotification,
        createInterview,
        updateInterview,
        deleteInterview,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
