export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-6 md:px-10">
      <p className="kicker pt-6 text-muted-foreground">Antigane CMS</p>
      {children}
    </div>
  );
}
