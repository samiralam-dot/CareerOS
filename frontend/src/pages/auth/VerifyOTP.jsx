import { useState, useEffect, useRef,useContext } from 'react';
import { Link,useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AppContext } from '../../context/AppContex';
import { useNavigate } from 'react-router-dom';
import { USER_ROLES } from '@config/constants';

const VerifyOTP = () => {
    const [otp, setOtp] = useState(new Array(6).fill('')); 
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const inputRefs = useRef([]);
     const location = useLocation();

    const { userData } = location.state || {};
    const {valotp,signUp,signIn}=useContext(AppContext);
    
const navigate=useNavigate();
   
    const handleChange = (index, value) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(paste)) return;

        const newOtp = paste.split('');
        setOtp(newOtp);
    };


const handleVerify = async () => {
    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
        toast.error('Enter valid OTP');
        return;
    }

    try {
        setLoading(true);

        if (String(otpValue) !== String(valotp)) {
            toast.error("Invalid OTP");
            return;
        }

        const response = await signUp(userData);

        if (response.success) {

            toast.success("Account created successfully");

           
            await signIn(userData.email, userData.password);

            if (userData.role === "student") {
                navigate('/student/dashboard');
            } else {
                navigate('/recruiter/dashboard');
            }
        }

    } catch (error) {
        toast.error(error.response?.data?.message || "Signup failed");
    } finally {
        setLoading(false);
    }
};

    
    const handleResend = async () => {
        setResending(true);
        try {
          
            toast.success('OTP sent again');
            setCountdown(30);
        } catch (err) {
            toast.error('Failed to resend OTP');
        } finally {
            setResending(false);
        }
    };

   
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    return (
        <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full space-y-8">

                <div className="text-center">
                    <h2 className="text-3xl font-bold">Verify Your Email</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter the 6-digit OTP sent to your email
                    </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow border">
                    <div className="space-y-6">

                        {/* OTP Inputs */}
                        <div className="flex justify-center gap-3">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className="w-12 h-14 text-center text-xl border rounded"
                                    disabled={loading}
                                />
                            ))}
                        </div>

                        {/* Verify Button */}
                        <button
                            onClick={handleVerify}
                            disabled={loading || otp.join('').length !== 6}
                            className="w-full py-3 bg-blue-600 text-white rounded disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>

                        {/* Resend */}
                        <div className="text-center">
                            <button
                                onClick={handleResend}
                                disabled={resending || countdown > 0}
                                className="text-blue-600 text-sm"
                            >
                                {resending
                                    ? 'Sending...'
                                    : countdown > 0
                                    ? `Resend in ${countdown}s`
                                    : 'Resend OTP'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Link to="/register" className="text-sm text-gray-600">
                        ← Back to Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;