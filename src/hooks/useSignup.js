// useSignup.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const useSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    otp: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);


  const router = useRouter();

  useEffect(() => {
    let timer;
    if (otpSent) {
      const expirationTime = Date.now() + 120000; // 2 minutes in milliseconds
      timer = setInterval(() => {
        const currentTime = Date.now();
        const timeDifference = expirationTime - currentTime;
        if (timeDifference <= 0) {
          clearInterval(timer);
          setOtpSent(false);
          setShowOtpInput(false);
          setError({ message: 'OTP expired. Please resend OTP.' });
        } else {
          const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
          setRemainingTime({ minutes, seconds });
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [otpSent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleResendOTP = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_NEXUS_URL;
      await axios.post(`${apiUrl}/api/users/resend-otp`, { email: formData.email });

      setOtpSent(true);
      setSuccessMessage('OTP resent successfully!');
      setShowOtpInput(true);
      setRemainingTime(null); 
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword, otp } = formData;

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return setError({ message: 'Password and confirm password do not match' });
    }

    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_NEXUS_URL;
      const response = await axios.post(`${apiUrl}/api/users/signup`, { ...formData, otp }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if the response contains a valid structure
      if (response.data) {
        setSuccessMessage('User registered successfully!');
        // If registration is successful, show OTP input
        setOtpSent(true);
        setShowOtpInput(true);
      } else {
        // Handle the case where the response structure is not as expected
        console.error('Unexpected response format:', response);
        setError({ message: 'Unexpected response format' });
      }
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_NEXUS_URL;

      // Prepare the data to be sent in the request
      const verificationData = {
        email: formData.email,
        otp: formData.otp,
      };

      // Send a request to verify the OTP
      const otpVerificationResponse = await axios.post(
        `${apiUrl}/api/users/verify-otp`,
        verificationData, // Send the data
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Check if OTP verification is successful
      if (otpVerificationResponse.status === 200) {
        setSuccessMessage('OTP verified successfully!');
        setShowOtpInput(false); // Hide OTP input after successful verification
        setShowVerificationPopup(true);

        // Store the token in the browser's cookies after OTP verification
        const { token } = otpVerificationResponse.data;
        const tokenExpirationDays = 7;
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + tokenExpirationDays);
        document.cookie = `token=${token}; expires=${expirationDate.toUTCString()}`;
      } else {
        // Handle OTP verification failure (e.g., show an error message)
        console.error('OTP verification failed');
        setError({ message: 'OTP verification failed' });
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      setError(error);
    }
  };

  const closeVerificationPopup = () => {
    setShowVerificationPopup(false);
    router.replace('/');
  };

  return {
    formData,
    successMessage,
    error,
    otpSent,
    showOtpInput,
    showVerificationPopup,
    remainingTime,
    loading,
    handleChange,
    handleSubmit,
    handleVerifyOTP,
    handleResendOTP,
    closeVerificationPopup,
  };
};

export default useSignup;
