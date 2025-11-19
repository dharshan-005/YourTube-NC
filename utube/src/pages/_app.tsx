import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "../lib/AuthContext";
import { useState } from "react";
export default function App({ Component, pageProps }: AppProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  return (
    <UserProvider>
      <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
        <title>Your-Tube Clone</title>
        {/* <Header /> */}
        <Header
          onMenuClick={() => {
            if (window.innerWidth < 768) {
              setSidebarOpen((prev) => !prev);
            } else {
              setCollapsed((prev) => !prev);
            }
          }}
        />
        <Toaster />
        <div className="flex flex-col md:flex-row">
          <Sidebar
            className="w-full md:w-64"
            collapsed={collapsed}
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
          />
          <main className="grow w-full">
            <Component {...pageProps} />
          </main>
        </div>
      </div>
    </UserProvider>
  );
}
