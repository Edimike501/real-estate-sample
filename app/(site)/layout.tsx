import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { CurrencyProvider } from "@/context/CurrencyContext";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CurrencyProvider>
      <Navbar />
      {children}
      <Footer />
    </CurrencyProvider>
  );
}
