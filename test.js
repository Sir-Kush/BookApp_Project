import React { useState, useEffect, useRef } from 'react';

export default function OTPGenerator() {
  // --- 1. STATE (For UI elements that change) ---
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(null); // tracking seconds: null, 5, 4, 3, 2, 1, 0
  const [isTimerActive, setIsTimerActive] = useState(false);

  // --- 2. REFS (For background data tracking) ---
  // We use a ref to store the interval ID so it persists across renders,
  // allowing us to clear it from any function without triggering a re-render.
  const intervalRef = useRef(null);

  // --- 3. HELPER FUNCTIONS ---
  const generateRandomOTP = () => {
    // Generates a random 6-digit number padded with leading zeros if necessary
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleGenerateOTP = () => {
    // Clean up any existing running timer safely first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const newOtp = generateRandomOTP();
    setOtp(newOtp);
    setTimer(5);
    setIsTimerActive(true);
  };

  // --- 4. EFFECTS (Managing the Asynchronous Countdown) ---
  useEffect(() => {
    // Only set up the interval if the countdown timer is active and above 0
    if (isTimerActive && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      // Countdown reached 0: Stop the timer and enable the button
      setIsTimerActive(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    // CLEANUP: Clears the interval when the component unmounts or before re-running
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTimerActive, timer]); // Triggers whenever active status or timer ticks down

  // --- 5. CONDITIONAL TEXT LOGIC ---
  let displayMessage = "Click 'Generate OTP' to get a code";
  if (otp) {
    displayMessage = otp;
  }

  let timerMessage = "";
  if (timer > 0) {
    timerMessage = `Expires in: ${timer} seconds`;
  } else if (timer === 0) {
    timerMessage = "OTP expired. Click the button to generate a new OTP.";
  }

  // --- 6. RENDER UI ---
  return (
    <div className="container">
      <h1 id="otp-title">OTP Generator</h1>
      
      <h2 id="otp-display">
        {displayMessage}
      </h2>
      
      <p id="otp-timer" aria-live="assertive">
        {timerMessage}
      </p>
      
      <button 
        id="generate-otp-button" 
        onClick={handleGenerateOTP}
        disabled={isTimerActive}
      >
        Generate OTP
      </button>
    </div>
  );
}