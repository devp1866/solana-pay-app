# 💸 Solana Pay – Two-Way Payment System

A seamless two-way payment system built with **Next.js**, **Solana Pay**, and **Phantom Wallet** integration. Supports direct user-to-user payments, payment requests, and admin commission tracking.

## Features

✅ **Two-Way Payments**: Users can send and request payments securely via the Solana blockchain.  
✅ **Admin Commission**: Automatically deducts a 5% commission to the admin wallet.  
✅ **Phantom Wallet Support**: Allows users to connect and transact with their Phantom wallet.  
✅ **Payment Requests**: Users can request payments from others.  
✅ **Transaction History**: View and track all payment transactions.  
✅ **Admin Dashboard**: Exclusive dashboard for the admin to monitor earnings and user transactions.

## Tech Stack

- **Next.js**: Frontend framework for React applications.
- **Solana Web3.js**: Blockchain interaction and transaction handling.
- **Tailwind CSS**: Modern styling with a dark-themed UI.
- **Phantom Wallet Adapter**: Secure Solana wallet integration.

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/devp1866/solana-pay-app.git
cd solana-pay-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Environment Variables
Create a `.env.local` file in the root directory and add your admin wallet:

```env
NEXT_PUBLIC_ADMIN_WALLET=YourAdminWalletAddress
```

### 4. Run the Development Server
```bash
npm run dev
```

Access the app at: [http://localhost:3000](http://localhost:3000)

## Usage

1. **Connect Wallet**: Users must connect their Phantom wallet.
2. **Send Payment**: Initiate Solana payments with automatic admin commission.
3. **Request Payment**: Users can request payments from others.
4. **Admin Dashboard**: Exclusive admin view for tracking all transactions and commissions.

## Contributing
Feel free to submit issues and pull requests!

## License
This project is licensed under the [MIT License](LICENSE).

