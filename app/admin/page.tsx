"use client";

import { useEffect, useState } from "react";

import {
    collection,
    onSnapshot,
    doc,
    updateDoc,
    getDoc,
    addDoc,
} from "firebase/firestore";

import { db } from "../../firebase/config";

export default function AdminPage() {
    const [requests, setRequests] = useState<any[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "requests"),
            (snapshot) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setRequests(data);
            }
        );

        return () => unsubscribe();
    }, []);

    const approveRequest = async (request: any) => {
        const studentRef = doc(db, "students", request.phone);

        const studentSnap = await getDoc(studentRef);

        if (!studentSnap.exists()) {
            alert("Student not found");
            return;
        }

        const currentBalance = studentSnap.data().balance || 0;

        const newBalance =
            currentBalance + Number(request.amount);

        await updateDoc(studentRef, {
            balance: newBalance,
        });

        await updateDoc(doc(db, "requests", request.id), {
            status: "approved",
        });

        await addDoc(collection(db, "transactions"), {
            name: request.name,
            amount: request.amount,
            phone: request.phone,
            item: "Credit Added",
            createdAt: new Date(),
        });

        alert("Request Approved");
    };

    const rejectRequest = async (id: string) => {
        await updateDoc(doc(db, "requests", id), {
            status: "rejected",
        });

        alert("Request Rejected");
    };

    return (
        <div className="min-h-screen bg-zinc-900 p-4 text-white">
            <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-bold mb-6">
                    Admin Dashboard
                </h1>

                <div className="space-y-4">
                    {requests.map((request) => (
                        <div
                            key={request.id}
                            className="bg-zinc-800 p-5 rounded-3xl shadow"
                        >
                            <h2 className="text-xl font-semibold">
                                {request.name}
                            </h2>

                            <p className="text-3xl font-bold text-green-400 mt-2">
                                ₹{request.amount}
                            </p>

                            <p className="mt-2 text-sm text-gray-400">
                                <p
                                    className={`mt-2 text-sm font-semibold ${request.status === "approved"
                                        ? "text-green-400"
                                        : request.status === "rejected"
                                            ? "text-red-400"
                                            : "text-yellow-400"
                                        }`}
                                >
                                    Status: {request.status}
                                </p>
                            </p>

                            <div className="flex gap-3 mt-4">
                                <button
                                    disabled={request.status !== "pending"}
                                    onClick={() =>
                                        approveRequest(request)
                                    }
                                    className={`flex-1 p-3 rounded-xl font-semibold ${request.status !== "pending"
                                        ? "bg-zinc-600"
                                        : "bg-green-600"
                                        }`}
                                >
                                    Approve
                                </button>

                                <button
                                    disabled={request.status !== "pending"}
                                    onClick={() =>
                                        rejectRequest(request.id)
                                    }
                                    className={`flex-1 p-3 rounded-xl font-semibold ${request.status !== "pending"
                                            ? "bg-zinc-600"
                                            : "bg-red-600"
                                        }`}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}