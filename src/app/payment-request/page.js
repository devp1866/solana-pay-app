// components/PaymentRequest.js

"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction, clusterApiUrl } from "@solana/web3.js";

const RPC_URL = clusterApiUrl("mainnet-beta");
const connection = new Connection(RPC_URL);

export default function PaymentRequest() {
  const { publicKey, sendTransaction } = useWallet();

  const [requester, setRequester] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!publicKey) {
      alert("Connect your wallet first!");
      return;
    }

    if (!requester || !amount) {
      alert("Please enter recipient and amount!");
      return;
    }

    try {
      const recipient = new PublicKey(requester);

      // Create a small transfer to act as a "payment request"
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipient,
          lamports: 5000, // Small amount of SOL (0.000005 SOL) as request marker
        })
      );

      // Add a note (Optional: Can be viewed with Solana explorers)
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipient,
          lamports: 1, // Minimal transfer for memo
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "processed");

      console.log("✅ Payment Request Sent! Signature:", signature);
      setStatusMessage("✅ Payment request sent successfully!");

      // Clear the form
      setRequester("");
      setAmount("");
      setNote("");
    } catch (error) {
      console.error("❌ Error submitting payment request:", error);
      setStatusMessage("❌ Failed to send request. Try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gradient-to-br from-blue-400 to-purple-600 text-white rounded-2xl shadow-lg mt-12">
      <h2 className="text-2xl font-bold mb-6">Request Payment</h2>

      <form onSubmit={handleSubmit}>
        <label className="block mb-4">
          Request From (Address):
          <input
            type="text"
            value={requester}
            onChange={(e) => setRequester(e.target.value)}
            className="w-full p-2 mt-2 border rounded-lg text-black"
            required
          />
        </label>

        <label className="block mb-4">
          Amount (SOL):
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 mt-2 border rounded-lg text-black"
            required
          />
        </label>

        <label className="block mb-4">
          Note (Optional):
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2 mt-2 border rounded-lg text-black"
          />
        </label>

        <button
          type="submit"
          className="w-full p-3 mt-4 bg-purple-800 text-white rounded-lg hover:bg-purple-900"
        >
          Submit Request
        </button>
      </form>

      {statusMessage && (
        <p className="mt-6 text-center text-lg">{statusMessage}</p>
      )}
    </div>
  );
}
