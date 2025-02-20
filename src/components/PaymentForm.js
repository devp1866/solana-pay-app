"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction } from "@solana/web3.js";

export default function PaymentForm() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [transactions, setTransactions] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!publicKey) {
      alert("Connect your wallet first!");
      return;
    }

    if (!recipient || isNaN(amount) || amount <= 0) {
      alert("Enter a valid recipient and amount.");
      return;
    }

    try {
      setStatus("Pending...");
      const recipientPubKey = new PublicKey(recipient);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubKey,
          lamports: Math.floor(parseFloat(amount) * 1e9),
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "processed");

      setStatus("Transaction Successful!");
      setTransactions([...transactions, { recipient, amount, signature }]);
    } catch (error) {
      console.error("Transaction failed", error);
      setStatus("Transaction Failed!");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Make a Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Recipient Address:</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Recipient's Wallet Address"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Amount (SOL):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Amount in SOL"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Send Payment
        </button>
      </form>

      {status && <p className="mt-4 text-lg font-semibold">{status}</p>}

      {transactions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Transaction History</h3>
          <ul className="space-y-2">
            {transactions.map((tx, index) => (
              <li key={index} className="p-2 border rounded-lg">
                Sent {tx.amount} SOL to {tx.recipient} <br />
                <a
                  href={`https://explorer.solana.com/tx/${tx.signature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View on Explorer
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
