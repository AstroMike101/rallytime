import type { ReactNode } from "react";
import "./globals.css";
import NavBar from "./NavBar";
import Footer from "./Footer";
import "@/lib/authListener";

export const metadata = {
  title: "RallyTime",
  description: "Meet people in your city through sports and rec.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white flex flex-col min-h-screen">
        <NavBar />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}