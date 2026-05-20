"use client";

import { useState } from "react";
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from "firebase/auth";

import { auth } from "../../firebase/config";

export default function LoginPage() {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [confirmationResult, setConfirmationResult] =
        useState<any>(null);

    const [showOtp, setShowOtp] = useState(false);

    const sendOtp = async () => {
        try {
            const recaptcha = new RecaptchaVerifier(
                auth,
                "recaptcha-container",
                {}
            );

            const result = await signInWithPhoneNumber(
                auth,
                `+91${phone}`,
                recaptcha
            );

            setConfirmationResult(result);

            setShowOtp(true);

            alert("Demo OTP is 123456");
        } catch (error) {
            console.error(error);
            alert("Failed to send OTP");
        }
    };

    const verifyOtp = async () => {
        try {
            if (otp === "123456") {
                alert("Login Successful!");
                window.location.href = "/dashboard";
            } else {
                alert("Invalid OTP");
            }

            alert("Login Successful!");
        } catch (error) {
            console.error(error);
            alert("Invalid OTP");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-2">
                    Digital Khata
                </h1>

                <p className="text-center text-gray-500 mb-8">
                    Aadam's Tuck Shop
                </p>

                {!showOtp ? (
                    <>
                        <input
                            type="tel"
                            placeholder="Enter phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full border p-4 rounded-2xl mb-4"
                        />

                        <button
                            onClick={sendOtp}
                            className="w-full bg-green-600 text-white p-4 rounded-2xl font-semibold"
                        >
                            Send OTP
                        </button>

                        <div
                            id="recaptcha-container"
                            className="mt-4"
                        />
                    </>
                ) : (
                    <>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full border p-4 rounded-2xl mb-4"
                        />

                        <button
                            onClick={verifyOtp}
                            className="w-full bg-blue-600 text-white p-4 rounded-2xl font-semibold"
                        >
                            Verify OTP
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}