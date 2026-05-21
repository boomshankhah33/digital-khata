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
    const [showOtp, setShowOtp] = useState(false);

    const [loading, setLoading] = useState(false);

    const [confirmationResult, setConfirmationResult] =
        useState<any>(null);

    const sendOtp = async () => {
        if (!phone) {
            alert("Enter phone number");
            return;
        }

        setLoading(true);

        try {
            const recaptcha = new RecaptchaVerifier(
                auth,
                "recaptcha-container",
                {
                    size: "normal",
                }
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

        } finally {

            setLoading(false);

        }
    };

    const verifyOtp = async () => {
        if (!otp) {
            alert("Enter OTP");
            return;
        }

        setLoading(true);

        try {

            if (otp === "123456") {

                alert("Login Successful!");

                window.location.href = "/dashboard";

            } else {

                alert("Invalid OTP");

            }

        } catch (error) {

            console.error(error);

            alert("OTP Verification Failed");

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">

            <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-800">

                <h1 className="text-4xl font-bold text-center text-white mb-2">
                    Digital Khata
                </h1>

                <p className="text-center text-slate-400 mb-8">
                    Aadam's Tuck Shop
                </p>

                {!showOtp ? (
                    <>

                        <input
                            type="tel"
                            placeholder="Enter phone number"
                            value={phone}
                            onChange={(e) =>
                                setPhone(e.target.value)
                            }
                            className="w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-400 p-4 rounded-2xl mb-4 outline-none"
                        />

                        <button
                            onClick={sendOtp}
                            disabled={loading}
                            className={`w-full text-white p-4 rounded-2xl font-semibold transition ${loading
                                ? "bg-slate-700"
                                : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {loading
                                ? "Sending OTP..."
                                : "Send OTP"}
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
                            onChange={(e) =>
                                setOtp(e.target.value)
                            }
                            className="w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-400 p-4 rounded-2xl mb-4 outline-none"
                        />

                        <button
                            onClick={verifyOtp}
                            disabled={loading}
                            className={`w-full text-white p-4 rounded-2xl font-semibold transition ${loading
                                ? "bg-slate-700"
                                : "bg-green-600 hover:bg-green-700"
                                }`}
                        >
                            {loading
                                ? "Verifying..."
                                : "Verify OTP"}
                        </button>

                    </>
                )}

            </div>

        </div>
    );
}