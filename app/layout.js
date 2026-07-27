import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import Layout from "@/components/layout";
import { ActivityProvider } from "@/context/ActivityContext";
import SmoothScroll from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Personal Portfolio",
  description: "My personal portfolio website",
};

export default function RootLayout({ children }) {

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-indigo-500/10 flex flex-col">
       
        
          <ActivityProvider>
<SmoothScroll>
        <Layout>
          {children}
          </Layout>
</SmoothScroll>

          </ActivityProvider>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
      
      </body>
    </html>
  );
}
