import { Sidebar } from "./_components/sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-6 md:flex-row md:gap-10 md:px-10">
      <Sidebar />
      <main className="min-w-0 flex-1 py-6 md:py-12">{children}</main>
    </div>
  );
}
