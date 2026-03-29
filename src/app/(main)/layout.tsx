import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import BottomNav from '@/components/common/BottomNav';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-aq-surface">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <BottomNav />
    </div>
  );
}
