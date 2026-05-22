import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContex';

// ─── Step indicator ───────────────────────────────────────────────
const StepDot = ({ step, current, label }) => {
    const done = current > step;
    const active = current === step;
    return (
        <div className="flex flex-col items-center gap-1">
            <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                    ${done ? 'bg-success-600 text-white' : active ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'}`}
            >
                {done ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                ) : step}
            </div>
            <span className={`text-xs font-medium ${active ? 'text-primary-600' : done ? 'text-success-600' : 'text-gray-400'}`}>
                {label}
            </span>
        </div>
    );
};

const StepConnector = ({ done }) => (
    <div className={`flex-1 h-0.5 mt-4 mb-5 transition-all duration-500 ${done ? 'bg-success-400' : 'bg-gray-200'}`} />
);

// ─── OTP Input ────────────────────────────────────────────────────
const OtpInput = ({ value, onChange }) => {
    const inputsRef = useRef([]);
    const digits = value.split('');

    const handleChange = (i, e) => {
        const val = e.target.value.replace(/\D/g, '');
        if (!val) return;
        const newDigits = [...digits];
        newDigits[i] = val[val.length - 1];
        onChange(newDigits.join(''));
        if (i < 5) inputsRef.current[i + 1]?.focus();
    };

    const handleKeyDown = (i, e) => {
        if (e.key === 'Backspace') {
            const newDigits = [...digits];
            if (newDigits[i]) {
                newDigits[i] = '';
                onChange(newDigits.join(''));
            } else if (i > 0) {
                newDigits[i - 1] = '';
                onChange(newDigits.join(''));
                inputsRef.current[i - 1]?.focus();
            }
        }
        if (e.key === 'ArrowLeft' && i > 0) inputsRef.current[i - 1]?.focus();
        if (e.key === 'ArrowRight' && i < 5) inputsRef.current[i + 1]?.focus();
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted) {
            onChange(pasted.padEnd(6, '').slice(0, 6));
            inputsRef.current[Math.min(pasted.length, 5)]?.focus();
        }
        e.preventDefault();
    };

    return (
        <div className="flex gap-3 justify-center">
            {Array.from({ length: 6 }).map((_, i) => (
                <input
                    key={i}
                    ref={el => (inputsRef.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digits[i] || ''}
                    onChange={e => handleChange(i, e)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    className={`w-11 h-12 text-center text-lg font-bold border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all
                        ${digits[i] ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-gray-300 bg-white text-gray-900'}`}
                />
            ))}
        </div>
    );
};

// ─── Password strength meter ──────────────────────────────────────
const PasswordStrength = ({ password }) => {
    if (!password) return null;
    const checks = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[^A-Za-z0-9]/.test(password),
    ];
    const score = checks.filter(Boolean).length;
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', 'bg-red-400', 'bg-amber-400', 'bg-yellow-400', 'bg-green-500'];
    const textColors = ['', 'text-red-500', 'text-amber-500', 'text-yellow-600', 'text-green-600'];

    return (
        <div className="mt-2 space-y-1">
            <div className="flex gap-1">
                {[1, 2, 3, 4].map(i => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? colors[score] : 'bg-gray-200'}`}
                    />
                ))}
            </div>
            <p className={`text-xs font-medium ${textColors[score]}`}>{labels[score]} password</p>
        </div>
    );
};

// ─── Password Input with show/hide ───────────────────────────────
const PasswordInput = ({ id, label, value, onChange, placeholder }) => {
    const [show, setShow] = useState(false);
    return (
        <div>
            <label htmlFor={id} className="label">{label}</label>
            <div className="relative">
                <input
                    id={id}
                    type={show ? 'text' : 'password'}
                    className="input pr-11"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
                <button
                    type="button"
                    onClick={() => setShow(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    {show ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────
const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1);         
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
     const [otpUser, setOtpUser] = useState('');
     const [user,setuser]=useState(null)

    const [otpError, setOtpError] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

 const {sendOtpMail,updateUser,getuserByEmail}=useContext(AppContext)

   
    useEffect(() => {
        if (resendTimer > 0) {
            const t = setTimeout(() => setResendTimer(s => s - 1), 1000);
            return () => clearTimeout(t);
        }
    }, [resendTimer]);

    
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) { toast.error('Please enter your email'); return; }

        setLoading(true);
        try {
              
      
          const response=await getuserByEmail(email)
          if(response.success===true){
            setuser(response.user)
          }
          else{
            toast.error('User not found');
            setLoading(false);
            return;
          }


        const result=  await sendOtpMail(email);
   


          if(result.success===true){
          setOtp(String(result.otp)); }

            await new Promise(r => setTimeout(r, 1000)); 
            toast.success('OTP sent to your email!');
            setStep(2);
            setResendTimer(60);
        } catch (err) {
            console.log(err.message)
            toast.error(err.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };


   const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otpUser.length < 6) { setOtpError('Please enter the full 6-digit code'); return; }
    setOtpError('');

    setLoading(true);
    try {
     
        await new Promise(r => setTimeout(r, 1000));
        if (otpUser === otp) {
            toast.success('OTP verified!');
            setStep(3);
        } else {
            setOtpError('Invalid OTP. Please try again.'); // persistent error
            toast.error('Invalid OTP');
        }
    } catch (err) {
        setOtpError(err.message || 'Invalid OTP. Please try again.');
    } finally {
        setLoading(false);
    }
};
    



   const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
        const result = await sendOtpMail(email);
        if (result.success === true) {
            setOtp(String(result.otp));   // ✅ actual OTP save
        }
        await new Promise(r => setTimeout(r, 800));
        toast.success('New OTP sent!');
        setResendTimer(60);
        setOtpUser('');    // ✅ sirf user input boxes clear karo
        setOtpError('');
    } catch (err) {
        toast.error('Failed to resend OTP');
    } finally {
        setLoading(false);
    }
};

    // ── Step 3: Set New Password ──
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!newPassword) { toast.error('Please enter a new password'); return; }
        if (newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return; }
        if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }

        setLoading(true);
        try {
            const id=user._id;
            
           const result =await updateUser(id, { password: newPassword });
           


            await new Promise(r => setTimeout(r, 1000));
            setStep(4);
        } catch (err) {
            toast.error(err.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    // ── Success Screen ──
    if (step === 4) {
        return (
            <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full text-center">
                    <div className="card p-8 animate-in">
                        <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset!</h2>
                        <p className="text-gray-600 mb-6">
                            Your password has been successfully updated. You can now sign in with your new password.
                        </p>
                        <Link to="/login" className="btn-primary btn-md">
                            Sign In Now
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-display font-bold text-gray-900">
                        {step === 1 && 'Forgot Password?'}
                        {step === 2 && 'Check Your Email'}
                        {step === 3 && 'Create New Password'}
                    </h2>
                    <p className="mt-2 text-gray-600">
                        {step === 1 && "Enter your email and we'll send you a 6-digit OTP"}
                        {step === 2 && `We've sent a code to ${email}`}
                        {step === 3 && 'Choose a strong password for your account'}
                    </p>
                </div>

                {/* Step indicators */}
                <div className="flex items-start mb-8">
                    <StepDot step={1} current={step} label="Email" />
                    <StepConnector done={step > 1} />
                    <StepDot step={2} current={step} label="Verify" />
                    <StepConnector done={step > 2} />
                    <StepDot step={3} current={step} label="Password" />
                </div>

                <div className="card p-6 animate-in">

                    {/* ── STEP 1: Email ── */}
                    {step === 1 && (
                        <form onSubmit={handleSendOtp} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="label">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="input"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>

                            <button type="submit" disabled={loading} className="w-full btn-primary btn-lg">
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Sending OTP...
                                    </span>
                                ) : 'Send OTP'}
                            </button>

                            <div className="text-center space-y-2 pt-1">
                                <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                                    Back to Sign In
                                </Link>
                            </div>
                        </form>
                    )}

                    {/* ── STEP 2: OTP ── */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div>
                                <label className="label text-center block mb-3">Enter 6-digit OTP</label>
                                <OtpInput value={otpUser} onChange={setOtpUser} />
                                {otpError && (
                                    <p className="text-sm text-red-500 text-center mt-2 flex items-center justify-center gap-1">
                                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {otpError}
                                    </p>
                                )}
                            </div>

                            <button type="submit" disabled={loading || otpUser.length < 6} className="w-full btn-primary btn-lg">
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Verifying...
                                    </span>
                                ) : 'Verify OTP'}
                            </button>

                            <div className="text-center space-y-2">
                                <p className="text-sm text-gray-500">
                                    Didn't receive the code?{' '}
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={resendTimer > 0 || loading}
                                        className={`font-medium transition-colors ${resendTimer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-primary-600 hover:text-primary-500'}`}
                                    >
                                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                                    </button>
                                </p>
                                <button
                                    type="button"
                                    onClick={() => { setStep(1); setOtpUser(''); setOtpError(''); }}
                                    className="text-sm text-gray-500 hover:text-primary-600 transition-colors flex items-center gap-1 mx-auto"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Change email
                                </button>
                            </div>
                        </form>
                    )}

                    {/* ── STEP 3: New Password ── */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            <div>
                                <PasswordInput
                                    id="newPassword"
                                    label="New Password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="Min. 8 characters"
                                />
                                <PasswordStrength password={newPassword} />
                            </div>

                            <div>
                                <PasswordInput
                                    id="confirmPassword"
                                    label="Confirm Password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter your password"
                                />
                                {confirmPassword && newPassword !== confirmPassword && (
                                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Passwords do not match
                                    </p>
                                )}
                                {confirmPassword && newPassword === confirmPassword && (
                                    <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Passwords match
                                    </p>
                                )}
                            </div>

                            {/* Password rules */}
                            <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
                                {[
                                    { check: newPassword.length >= 8, text: 'At least 8 characters' },
                                    { check: /[A-Z]/.test(newPassword), text: 'One uppercase letter' },
                                    { check: /[0-9]/.test(newPassword), text: 'One number' },
                                    { check: /[^A-Za-z0-9]/.test(newPassword), text: 'One special character' },
                                ].map(({ check, text }) => (
                                    <div key={text} className="flex items-center gap-2 text-sm">
                                        <svg className={`w-4 h-4 shrink-0 ${check ? 'text-green-500' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className={check ? 'text-green-700' : 'text-gray-500'}>{text}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={loading || newPassword !== confirmPassword || newPassword.length < 8}
                                className="w-full btn-primary btn-lg"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Saving...
                                    </span>
                                ) : 'Reset Password'}
                            </button>
                        </form>
                    )}

                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link
                        to="/"
                        className="text-sm text-gray-500 hover:text-primary-600 transition-colors inline-flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default ForgotPasswordPage;
