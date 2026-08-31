import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { BookmarksProvider } from "@/context/BookmarksContext";
import { CurrencyProvider } from "@/context/CurrencyContext";

export default function SiteLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <CurrencyProvider>
      <BookmarksProvider>
        <Navbar />
        {children}
        <Footer />
      </BookmarksProvider>
    </CurrencyProvider>
  );
}
