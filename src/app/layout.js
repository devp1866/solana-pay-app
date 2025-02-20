import WalletProviderWrapper from "@/components/WalletProviderWrapper";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";


export const metadata = {
  title: "Solana Pay App",
  description: "A Solana-based payment system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WalletProviderWrapper>{children}</WalletProviderWrapper>
      </body>
    </html>
  );
}
