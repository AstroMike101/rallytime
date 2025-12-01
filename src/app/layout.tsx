import type { ReactNode } from "react";
import "./globals.css";
import NavBar from "./NavBar";
import "@/lib/authListener";


export const metadata = {
  title: "RallyTime",
  description: "Meet people in your city through sports and rec.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white">
        <NavBar />
        <div className="pt-2">
          {children}
        </div>
      </body>
    </html>
  );
}
