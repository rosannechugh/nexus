import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";

/**
 * Shell used for public pages (landing, login, register): navbar + footer,
 * no sidebar.
 */
export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-void">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
