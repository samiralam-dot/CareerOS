import { createContext, useState, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();


  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);


  const [signupForm, setSignupForm] = useState({
    role: "student",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",


    rollNumber: "",
    branch: "",


    companyName: "",
    designation: "",
  });

  const [signupLoading, setSignupLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef([]);

  const { userData } = location.state || {};


  const { valotp, signUp } = useContext(AuthContext) || {};


  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(paste)) return;

    setOtp(paste.split(""));
  };

  
  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      return;
    }

    try {
      setOtpLoading(true);

      if (String(otpValue) === String(valotp)) {
        const response = await signUp(userData);

        if (response?.success) {
          if (userData.role === "student") {
            navigate("/student/dashboard");
          } else {
            navigate("/recruiter/dashboard");
          }
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setOtpLoading(false);
    }
  };

  
  return (
    <AuthContext.Provider
      value={{
        // navigation
        navigate,

        // login
        loginEmail,
        setLoginEmail,
        loginPassword,
        setLoginPassword,
        loginLoading,
        setLoginLoading,

        // forgot password
        forgotEmail,
        setForgotEmail,
        forgotLoading,
        setForgotLoading,
        otpSent,
        setOtpSent,

        // signup
        signupForm,
        setSignupForm,
        signupLoading,
        setSignupLoading,
        showPassword,
        setShowPassword,
        showConfirm,
        setShowConfirm,

        // otp
        otp,
        setOtp,
        otpLoading,
        setOtpLoading,
        resendingOtp,
        setResendingOtp,
        countdown,
        setCountdown,
        inputRefs,

        handleOtpChange,
        handleOtpKeyDown,
        handleOtpPaste,
        handleVerifyOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};