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
    generator: "Next.js",
    manifest: "/manifest.json",
    keywords: ["nextjs", "next14", "pwa", "next-pwa"],
    themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
    viewport:
        "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
    icons: [
        { rel: "apple-touch-icon", url: "icon-192x192.png" },
        { rel: "icon", url: "icon-192x192.png" },
    ],
};

export default async function RootLayout({ children }) {
    const user = await getLoggedInUser();
  return (
    <html lang="en">
        <UserContextProvider>
            <ClientWrapper user={user}>
                <body className={`${poppins.className} ${openSans.variable} bg-neutral w-screen h-screen overflow-hidden py-4`}>
                    <ToastContainer />
                    {children}
                </body>
            </ClientWrapper>
        </UserContextProvider>
    </html>
  );
}
