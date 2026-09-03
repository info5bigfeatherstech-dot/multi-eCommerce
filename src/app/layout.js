import { Albert_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const albertSans = Albert_Sans({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-albert-sans",
  display: "swap",
});

export const metadata = {
  title: "ApexMart Wholesale — Top Section E-Commerce",
  description: "Direct factory pricing, GST inclusive invoicing, and zero minimum order quantity.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={albertSans.variable}>
      <body className="font-albert bg-slate-50 min-h-screen antialiased text-slate-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
