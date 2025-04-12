import {Open_Sans, Poppins} from "next/font/google";
import "./globals.css";

const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
})

const openSans = Open_Sans({
    variable: "--font-open-sans",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"]
})

export const metadata = {
  title: "ActivePulse",
  description: "Stay Ready. Stay Active. Stay Together.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} ${openSans.variable} bg-neutral w-screen h-screen`}>
        {children}
      </body>
    </html>
  );
}
