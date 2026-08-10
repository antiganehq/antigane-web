import { Geist, Geist_Mono } from "next/font/google";
import "@/shared/styles/globals.css";
import { baseMetadata } from "@/shared/lib/metadata";
import { Header } from "@/shared/components/common/header";
import { Footer } from "@/shared/components/common/footer";
import { Reveal } from "@/shared/components/ui/reveal";
import { FinalCTA } from "@/shared/components/common/final-cta";
import { Providers } from "@/shared/components/providers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getThemeScript } from "@/shared/lib/theme-script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const description = t("description");

  return {
    ...baseMetadata,
    description,
    openGraph: {
      ...baseMetadata.openGraph,
      description,
    },
    twitter: {
      ...baseMetadata.twitter,
      description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{ __html: getThemeScript() }}
          suppressHydrationWarning
        />
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <div
              id="main-content"
              className="mx-auto flex min-h-screen w-[calc(100%-1.5rem)] max-w-[1440px] flex-col border-x border-border sm:w-[calc(100%-2.5rem)] lg:w-[calc(100%-3rem)]"
            >
              <Header />

              {children}
              <Reveal>
                <FinalCTA />
              </Reveal>
              <Footer />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
