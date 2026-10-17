import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "@/shared/styles/globals.css";
import { Providers } from "@/shared/components/providers";
import { getThemeScript } from "@/shared/lib/theme-script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // No lang attribute: locale lives under [locale] and the root cannot
    // read it. A wrong static label is worse than none for assistive tech.
    <html
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{ __html: getThemeScript() }}
          suppressHydrationWarning
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
