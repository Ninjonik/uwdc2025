import {Open_Sans, Poppins} from "next/font/google";
import "./globals.css";
import {UserContextProvider} from "@/components/contexts/UserContext";
import ClientWrapper from "@/app/ClientWrapper";
import {getLoggedInUser} from "@/utils/getLoggedInUser";
import {ToastContainer} from "react-toastify";

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

export default async function RootLayout({ children }) {
    const user = await getLoggedInUser();
  return (
    <html lang="en">
        <UserContextProvider>
            <ClientWrapper user={user}>
                <body className={`${poppins.className} ${openSans.variable} bg-neutral w-screen h-screen`}>
                    <ToastContainer />
                    {children}
                </body>
            </ClientWrapper>
        </UserContextProvider>
    </html>
  );
}
