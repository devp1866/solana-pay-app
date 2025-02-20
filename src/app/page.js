// src/app/page.js

"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { Connection } from "@solana/web3.js";

const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET; // Admin wallet address
const RPC_URL = "https://api.mainnet-beta.solana.com";
const connection = new Connection(RPC_URL);

export default function Home() {
  const { publicKey } = useWallet();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (publicKey?.toBase58() === ADMIN_WALLET) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [publicKey]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-8 bg-gradient-to-br from-blue-400 to-purple-600 text-white p-6">
      <h1 className="text-5xl font-extrabold animate-bounce">Welcome to Solana Pay</h1>

      <WalletMultiButton className="!bg-white !text-black px-6 py-3 rounded-xl hover:scale-105 transition-transform" />

      <div className="flex gap-6 mt-8">
        {/* ✅ Corrected Link for Payment */}
        <Link
          href="/payment"
          className="px-8 py-4 bg-blue-800 text-white rounded-xl hover:bg-blue-900 transition-transform transform hover:scale-105"
        >
          Go to Payment
        </Link>

        {/* ✅ Updated Link to Payment Request Page */}
        <Link
          href="/payment-request"
          className="px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-transform transform hover:scale-105"
        >
          Request Payment
        </Link>
      </div>

      {isAdmin && (
        <Link
          href="/admin"
          className="px-8 py-4 bg-yellow-500 text-black rounded-xl hover:bg-yellow-600 transition-transform transform hover:scale-105"
        >
          Admin Dashboard
        </Link>
      )}

      <p className="mt-12 text-lg animate-pulse">
        Secure, Fast, and Reliable Payments on Solana Blockchain
      </p>
    </main>
  );
}
