// src/app/admin/page.js

"use client";

import { useState, useEffect } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Loader } from "@/components/Loader";

const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET;
const TRANSACTIONS_PER_PAGE = 4;

export default function AdminDashboard() {
  const { connection } = useConnection();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [searchSignature, setSearchSignature] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const pubKey = new PublicKey(ADMIN_WALLET);
        const transactionList = await connection.getSignaturesForAddress(pubKey, { limit: 50 });

        let totalCommissionEarned = 0;
        const transactionDetails = await Promise.all(
          transactionList.map(async (tx) => {
            const details = await connection.getParsedTransaction(tx.signature);
            if (details) {
              const commissionAmount = details.transaction.message.instructions.reduce((sum, instr) => {
                if (instr.parsed?.info?.destination === ADMIN_WALLET) {
                  return sum + parseInt(instr.parsed.info.lamports, 10) / 1e9;
                }
                return sum;
              }, 0);

              totalCommissionEarned += commissionAmount;

              return {
                signature: tx.signature,
                date: new Date(details.blockTime * 1000).toISOString().split("T")[0],
                amount: commissionAmount,
              };
            }
          })
        );

        setTransactions(transactionDetails.filter(Boolean));
        setTotalCommission(totalCommissionEarned);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [connection]);

  const filteredTransactions = transactions
    .filter((tx) =>
      searchSignature
        ? tx.signature.includes(searchSignature)
        : true
    )
    .filter((tx) => {
      if (!startDate || !endDate) return true;
      const transactionDate = new Date(tx.date);
      return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
    });

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <p className="mb-4 text-lg">Total Commission Earned: {totalCommission.toFixed(4)} SOL</p>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Signature"
          value={searchSignature}
          onChange={(e) => setSearchSignature(e.target.value)}
          className="p-2 border rounded-lg w-full text-black"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded-lg text-black"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded-lg text-black"
        />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div>
          {filteredTransactions.slice(0, startIndex + TRANSACTIONS_PER_PAGE).map((tx) => (
            <div key={tx.signature} className="p-4 mb-4 border rounded-lg bg-gray-700">
              <p className="break-all">Signature: {tx.signature}</p>
              <p>Date: {tx.date}</p>
              <p>Commission Earned: {tx.amount.toFixed(4)} SOL</p>
            </div>
          ))}

          {startIndex + TRANSACTIONS_PER_PAGE < filteredTransactions.length && (
            <button
              onClick={() => setStartIndex(startIndex + TRANSACTIONS_PER_PAGE)}
              className="mt-4 p-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
            >
              Load More Transactions
            </button>
          )}
        </div>
      )}
    </div>
  );
}
