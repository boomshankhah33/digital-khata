"use client";

import { useState, useEffect } from "react";

import {
    collection,
    addDoc,
    doc,
    onSnapshot,
} from "firebase/firestore";

import { db } from "../../firebase/config";

export default function Dashboard() {

    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const [balance, setBalance] = useState(0);

    const [creditLimit, setCreditLimit] = useState(0);

    const [transactions, setTransactions] = useState<any[]>([]);

    useEffect(() => {

        const studentRef = doc(
            db,
            "students",
            "9307626082"
        );

        const unsubscribe = onSnapshot(
            studentRef,
            (docSnap) => {

                if (docSnap.exists()) {

                    setBalance(
                        docSnap.data().balance || 0
                    );

                    setCreditLimit(
                        docSnap.data().creditLimit || 0
                    );
                }
            }
        );

        return () => unsubscribe();

    }, []);

    useEffect(() => {

        const unsubscribe = onSnapshot(
            collection(db, "transactions"),
            (snapshot) => {

                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setTransactions(data.reverse());

            }
        );

        return () => unsubscribe();

    }, []);

    const sendRequest = async () => {

        if (!amount) return;

        if (loading) return;

        if (Number(amount) + balance > creditLimit) {
            alert("Credit Limit Exceeded");
            return;
        }

        setLoading(true);

        try {

            await addDoc(collection(db, "requests"), {
                name: "Neel",
                amount: Number(amount),
                status: "pending",
                phone: "9307626082",
                createdAt: new Date(),
            });

            alert("Request Sent");

            setAmount("");

        } catch (error) {

            console.error(error);

            alert("Failed To Send Request");

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="min-h-screen bg-zinc-900 p-4">

            <div className="max-w-md mx-auto">

                <h1 className="text-3xl font-bold mb-6 text-white">
                    Student Dashboard
                </h1>

                <div className="bg-zinc-800 p-6 rounded-3xl shadow mb-4">

                    <p className="text-gray-300">
                        Current Balance
                    </p>

                    <h2 className="text-5xl font-bold text-red-500 mt-2">
                        ₹{balance}
                    </h2>

                </div>

                <div className="bg-zinc-800 p-6 rounded-3xl shadow mb-4">

                    <p className="text-gray-300">
                        Credit Limit
                    </p>

                    <h2 className="text-3xl font-bold text-yellow-400 mt-2">
                        ₹{creditLimit}
                    </h2>

                </div>

                <div className="bg-zinc-800 p-6 rounded-3xl shadow mb-4">

                    <p className="text-gray-300 mb-4">
                        Add Credit Request
                    </p>

                    <input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) =>
                            setAmount(e.target.value)
                        }
                        className="w-full border border-zinc-600 bg-zinc-700 text-white placeholder:text-gray-400 p-4 rounded-2xl mb-4"
                    />

                    <button
                        disabled={loading}
                        onClick={sendRequest}
                        className={`w-full text-white p-4 rounded-2xl font-bold text-lg ${loading
                                ? "bg-zinc-600"
                                : "bg-green-600"
                            }`}
                    >
                        {loading
                            ? "Sending..."
                            : "Request Credit"}
                    </button>

                </div>

                <div className="bg-zinc-800 p-6 rounded-3xl shadow">

                    <h3 className="text-xl font-bold mb-4 text-white">
                        Recent Transactions
                    </h3>

                    <div className="space-y-4">

                        {transactions.map((txn) => (

                            <div
                                key={txn.id}
                                className="flex justify-between text-white"
                            >

                                <span>
                                    {txn.item || "Tuck Shop Purchase"}
                                </span>

                                <span>
                                    ₹{txn.amount}
                                </span>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
}