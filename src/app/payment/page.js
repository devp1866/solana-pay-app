// components/PaymentRequest.js

"use client";

import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction } from "@solana/web3.js";
import { Loader } from "@/components/Loader";

const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET;// Admin wallet address
const COMMISSION_RATE = 0.05; // 5% commission

export default function PaymentPage() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [signature, setSignature] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!publicKey) return alert("Connect your wallet first!");
    if (!recipient || !amount) return alert("Please enter recipient and amount!");

    try {
      setLoading(true);
      setStatus("Processing payment...");

      const recipientPubKey = new PublicKey(recipient);
      const amountLamports = Math.floor(parseFloat(amount) * 1e9);
      const commission = Math.floor(amountLamports * COMMISSION_RATE);
      const netAmount = amountLamports - commission;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubKey,
          lamports: netAmount,
        }),
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(ADMIN_WALLET),
          lamports: commission,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      setSignature(signature);
      setStatus("Payment successful!");
    } catch (error) {
      console.error("Payment error:", error);
      setStatus("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gradient-to-br from-blue-400 to-purple-600 text-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Make a Payment</h1>
      <form onSubmit={handlePayment}>
        <label className="block mb-4">
          Recipient Address:
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
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
        <button
          type="submit"
          className="w-full p-3 mt-4 bg-purple-800 text-white rounded-lg hover:bg-purple-900"
          disabled={loading}
        >
          {loading ? "Processing..." : "Send Payment"}
        </button>
      </form>

      {loading && <Loader />}

      {status && <p className="mt-4 text-lg">{status}</p>}

      {signature && (
        <div className="mt-4">
          <p>Transaction Signature:</p>
          <input
            type="password"
            value={signature}
            readOnly
            className="w-full p-2 mt-2 border rounded-lg text-black"
          />
          <button
            onClick={() => navigator.clipboard.writeText(signature)}
            className="mt-2 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Copy Signature
          </button>
        </div>
      )}
    </div>
  );
}
